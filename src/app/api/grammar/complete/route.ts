import { getGrammarGuide } from "@/lib/grammar-guide-registry";
import { markGrammarQuizComplete } from "@/lib/grammar-completion-progress";
import { acquireUserActivityScopeLock } from "@/lib/database/locks";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { POINTS } from "@/lib/gamification/gamification";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";
import { applyAwardChain } from "@/lib/gamification/award-chain";
import { normalizeAssignmentId } from "@/lib/assignment-scope";
import { ApiErrors, apiError } from "@/lib/api/response";
import { logger } from "@/lib/shared/logger";

interface GrammarExerciseCategoryData {
    exercises: Record<string, {
        completed: boolean;
        completedAt: string;
        pointsAwarded: number;
    }>;
    totalExercisePoints: number;
}

interface QuizResponseData {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    skillTag?: string;
    difficulty?: string;
    topic?: string;
}

async function saveMiniQuizSubmission(tx: Prisma.TransactionClient, params: {
    userId: string;
    activityId: string;
    score: number;
    total: number;
    slug: string;
    assignmentId?: string | null;
}) {
    const { userId, activityId, score, total, slug, assignmentId = null } = params;
    const payload = JSON.stringify({ type: "mini-quiz", score, total, slug });
    const now = new Date();

    const existing = await tx.submission.findFirst({
        where: {
            userId,
            activityId,
            assignmentId,
        },
        select: { id: true },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    if (existing) {
        await tx.submission.update({
            where: { id: existing.id },
            data: {
                score,
                content: payload,
                status: "submitted",
                completedAt: now,
            },
        });
        return;
    }

    await tx.submission.create({
        data: {
            userId,
            activityId,
            assignmentId,
            score,
            content: payload,
            status: "submitted",
            completedAt: now,
        },
    });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const { slug, score, total, activityId, responses, assignmentId } = await request.json();
    if (!slug || typeof slug !== "string") {
        return apiError("slug is required", 400);
    }

    const assignmentKey = normalizeAssignmentId(assignmentId);
    const userId = session.user.id;
    // Resolve to one canonical grammar guide ID so mini-quiz scores and question-level
    // diagnostics are always saved under the same activity the gradebook displays.
    const canonicalActivityId =
        (await resolveCanonicalGrammarActivityId({ activityId, slug })) ||
        activityId ||
        slug;
    const reason = `grammar:${slug}`;

    if ((score !== undefined || total !== undefined) &&
        (!Number.isInteger(score) || !Number.isInteger(total) || total <= 0 || score < 0 || score > total)) {
        return apiError("Invalid quiz score", 400);
    }
    const submittedQuiz = score !== undefined && total !== undefined;
    if (submittedQuiz) {
        const guide = getGrammarGuide(slug);
        const guideContent = guide ? await guide.loadContent() : null;
        if (guideContent && (!guideContent.miniQuiz?.length || total !== guideContent.miniQuiz.length)) {
            return apiError("Please submit the complete mini-quiz.", 400);
        }
    }
    // 1. Record the quiz score if provided
    if (score !== undefined && total !== undefined) {
        const activityExists = await prisma.activity.findUnique({
            where: { id: canonicalActivityId },
            select: { id: true },
        });
        if (!activityExists) {
            return apiError(`Unknown grammar activity id: ${canonicalActivityId}`, 400);
        }

        const percentage = Math.round((score / total) * 100);

        // Persist mini-quiz submission
        await prisma.$transaction(async tx => {
            await acquireUserActivityScopeLock(tx, { userId, activityId: canonicalActivityId, assignmentId: assignmentKey });
            await saveMiniQuizSubmission(tx, {
                userId,
                activityId: canonicalActivityId,
                score: percentage,
                total,
                slug,
                assignmentId: assignmentKey,
            });

            // 1b. Store individual question responses for diagnostic reporting
            if (responses && Array.isArray(responses)) {
                const quizResponses = responses.map((r: QuizResponseData) => ({
                    userId,
                    activityId: canonicalActivityId,
                    assignmentId: assignmentKey,
                    questionId: r.questionId,
                    userAnswer: r.userAnswer,
                    isCorrect: r.isCorrect,
                    skillTag: r.skillTag || null,
                    difficulty: r.difficulty || null,
                    topic: r.topic || null,
                }));

                await tx.quizResponse.createMany({
                    data: quizResponses,
                });
            }
            await markGrammarQuizComplete(tx, { userId, activityId: canonicalActivityId, assignmentId: assignmentKey });
        }, { timeout: 10000 });
    }

    // 2. Check if already awarded completion points. Awards are written under the
    // display reason ("<title>|Grammar Guide"); older rows used `grammar:<slug>`.
    // Check both, or every mini-quiz retake re-awards the completion points.
    const grammarActivity = await prisma.activity.findUnique({
        where: { id: canonicalActivityId },
        select: { title: true },
    });
    const displayReason = grammarActivity?.title
        ? `${grammarActivity.title}|Grammar Guide`
        : reason;
    const existingCompletion = await prisma.pointsLedger.findFirst({
        where: {
            userId,
            reason: { in: [reason, displayReason] },
        },
    });

    if (existingCompletion) {
        return NextResponse.json({ ok: true, awarded: false, scoreRecorded: score !== undefined });
    }

    // 3. Check exercise completion from ActivityProgress
    const progressActivityId = canonicalActivityId || `grammar:${slug}`;
    const activityProgress = await prisma.activityProgress.findFirst({
        where: {
            userId,
            activityId: progressActivityId,
            assignmentId: null,
        },
        select: {
            categoryData: true,
        },
    });

    let exercisesCompleted = 0;
    if (activityProgress?.categoryData) {
        try {
            const categoryData = JSON.parse(activityProgress.categoryData) as GrammarExerciseCategoryData;
            exercisesCompleted = Object.values(categoryData.exercises || {}).filter(e => e.completed).length;
        } catch (err) {
            logger.error('[GrammarComplete] Failed to parse categoryData', { userId, activityId: progressActivityId, err });
        }
    }

    // A submitted quiz earns completion points even with no prior practice or correct answers.
    if (exercisesCompleted === 0 && !submittedQuiz) {
        return NextResponse.json({
            ok: true,
            awarded: false,
            points: 0,
            scoreRecorded: score !== undefined,
            message: "Complete at least one exercise to earn points",
        });
    }

    // Completion recognizes effort; optional exercises keep their separate rewards.
    const basePoints = POINTS.GRAMMAR_GUIDE_BASE;

    const completionAward = await applyAwardChain({
        userId,
        points: basePoints,
        reason: displayReason,
        dedupeKey: true,
        dedupeWindowMs: 100 * 365.25 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({
        ok: true,
        awarded: !completionAward?.deduped,
        points: completionAward?.deduped ? 0 : basePoints,
        exercisesCompleted,
        scoreRecorded: score !== undefined,
    });
}
