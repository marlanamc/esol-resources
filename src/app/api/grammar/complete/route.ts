import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements, POINTS } from "@/lib/gamification";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";

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

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, score, total, activityId, responses } = await request.json();
    if (!slug || typeof slug !== "string") {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const userId = session.user.id;
    // Resolve to one canonical grammar guide ID so mini-quiz scores and question-level
    // diagnostics are always saved under the same activity the gradebook displays.
    const canonicalActivityId =
        (await resolveCanonicalGrammarActivityId({ activityId, slug })) ||
        activityId ||
        slug;
    const reason = `grammar:${slug}`;

    // 1. Record the quiz score if provided
    if (score !== undefined && total !== undefined) {
        const percentage = Math.round((score / total) * 100);

        // Upsert guarantees one submission row per user+activity (assignmentId=null)
        // and updates it with the latest mini-quiz percentage.
        await prisma.submission.upsert({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId: canonicalActivityId,
                    assignmentId: null as any
                }
            },
            update: {
                score: percentage,
                content: JSON.stringify({ type: 'mini-quiz', score, total, slug }),
                status: 'submitted',
                completedAt: new Date()
            },
            create: {
                userId,
                activityId: canonicalActivityId,
                assignmentId: null,
                score: percentage,
                content: JSON.stringify({ type: 'mini-quiz', score, total, slug }),
                status: 'submitted',
                completedAt: new Date()
            }
        });

        // 1b. Store individual question responses for diagnostic reporting
        if (responses && Array.isArray(responses)) {
            const quizResponses = responses.map((r: QuizResponseData) => ({
                userId,
                activityId: canonicalActivityId,
                assignmentId: null,
                questionId: r.questionId,
                userAnswer: r.userAnswer,
                isCorrect: r.isCorrect,
                skillTag: r.skillTag || null,
                difficulty: r.difficulty || null,
                topic: r.topic || null,
            }));

            await prisma.quizResponse.createMany({
                data: quizResponses,
            });
        }
    }

    // 2. Check if already awarded completion points
    const existingCompletion = await prisma.pointsLedger.findFirst({
        where: {
            userId,
            reason,
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
        } catch {
            // Ignore parsing errors
        }
    }

    // 4. Require at least 1 exercise to get any completion points
    if (exercisesCompleted === 0) {
        return NextResponse.json({
            ok: true,
            awarded: false,
            points: 0,
            scoreRecorded: score !== undefined,
            message: "Complete at least one exercise to earn points",
        });
    }

    // 5. Calculate completion points: base + perfect bonus (if all exercises done)
    // Note: We use base points only here since exercises already awarded their own points.
    // The "perfect bonus" is if they completed ALL exercises in the guide.
    // We don't have total exercise count here, so we just award base completion.
    const basePoints = POINTS.GRAMMAR_GUIDE_BASE;

    await awardPoints(userId, basePoints, reason);

    // Update streak and check for achievements
    await updateStreak(userId, basePoints);
    await checkAndAwardAchievements(userId);

    return NextResponse.json({
        ok: true,
        awarded: true,
        points: basePoints,
        exercisesCompleted,
        scoreRecorded: score !== undefined,
    });
}
