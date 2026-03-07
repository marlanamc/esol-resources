import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivitySubmitBodySchema, parseApiBody } from "@/lib/api-schemas";
import { calculateQuizPoints, getActivityPoints } from "@/lib/gamification";
import { claimSubmissionPointsOnce } from "@/lib/submission-points-award";
import { applyAwardChain } from "@/lib/gamification-award-chain";
import { acquireUserActivityScopeLock } from "@/lib/db-locks";
import { normalizeAssignmentId } from "@/lib/assignment-scope";

export { normalizeAssignmentId };

export function readIdempotencyKey(request: Request): string | null {
    const key = request.headers.get("x-idempotency-key");
    if (!key) return null;
    const trimmed = key.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function extractCategoryDataObject(value: unknown): Record<string, unknown> {
    if (typeof value === "string" && value.trim().length > 0) {
        try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed as Record<string, unknown>;
            }
        } catch {
            return {};
        }
    }
    return {};
}

export function hasDuplicateSubmissionIdempotencyKey(
    categoryData: unknown,
    idempotencyKey: string | null
): boolean {
    if (!idempotencyKey) return false;
    const existingMeta = extractCategoryDataObject(categoryData);
    return (
        typeof existingMeta.pwaLastSubmissionIdempotencyKey === "string" &&
        existingMeta.pwaLastSubmissionIdempotencyKey === idempotencyKey
    );
}

export async function parseSubmitJsonBody(request: Request): Promise<{
    ok: true;
    body: { activityId?: string; content?: unknown; score?: number; assignmentId?: string | null };
} | {
    ok: false;
    status: number;
    error: string;
}> {
    try {
        const body = await request.json();
        return { ok: true, body };
    } catch {
        return { ok: false, status: 400, error: "Invalid JSON in request body" };
    }
}

type SubmissionRecord = {
    id: string;
    score: number | null;
};

type SubmissionWritePayload = {
    content: string;
    score: number | null;
    status: "submitted";
    completedAt: Date;
};

type SubmissionDelegate = {
    upsert(args: {
        where: {
            userId_activityId_assignmentId: {
                userId: string;
                activityId: string;
                assignmentId: string;
            };
        };
        create: {
            userId: string;
            activityId: string;
            assignmentId: string;
            pointsAwarded: 0;
            content: string;
            score: number | null;
            status: "submitted";
            completedAt: Date;
        };
        update: SubmissionWritePayload;
    }): Promise<SubmissionRecord>;
    findFirst(args: {
        where: { userId: string; activityId: string; assignmentId: null };
        orderBy: { updatedAt: "desc" };
    }): Promise<{ id: string } | null>;
    update(args: {
        where: { id: string };
        data: SubmissionWritePayload;
    }): Promise<SubmissionRecord>;
    create(args: {
        data: {
            userId: string;
            activityId: string;
            assignmentId: null;
            content: string;
            score: number | null;
            pointsAwarded: 0;
            status: "submitted";
            completedAt: Date;
        };
    }): Promise<SubmissionRecord>;
};

export async function saveActivitySubmission(params: {
    submission: SubmissionDelegate;
    userId: string;
    activityId: string;
    assignmentId: string | null;
    content: unknown;
    score: number | null;
    pointsAwarded?: number;
}): Promise<SubmissionRecord> {
    const { submission, userId, activityId, assignmentId, content, score, pointsAwarded } = params;
    void pointsAwarded;
    const submissionPayload: SubmissionWritePayload = {
        content: JSON.stringify(content ?? null),
        score: typeof score === "number" ? score : null,
        status: "submitted" as const,
        completedAt: new Date(),
    };

    // Prisma can't upsert with nullable fields in composite unique where input.
    // For non-assignment practice submissions, fall back to find/update-or-create.
    if (assignmentId) {
        return submission.upsert({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId,
                    assignmentId,
                },
            },
            create: {
                userId,
                activityId,
                assignmentId,
                pointsAwarded: 0,
                ...submissionPayload,
            },
            update: submissionPayload,
        });
    }

    const existingSubmission = await submission.findFirst({
        where: { userId, activityId, assignmentId: null },
        orderBy: { updatedAt: "desc" },
    });

    if (existingSubmission) {
        return submission.update({
            where: { id: existingSubmission.id },
            data: submissionPayload,
        });
    }

    return submission.create({
        data: {
            userId,
            activityId,
            assignmentId: null,
            pointsAwarded: 0,
            ...submissionPayload,
        },
    });
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const idempotencyKey = readIdempotencyKey(request);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // SECURITY: Never trust points from client - calculate server-side only
        const parsedBody = await parseSubmitJsonBody(request);
        if (!parsedBody.ok) {
            return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
        }
        const validated = parseApiBody(ActivitySubmitBodySchema, parsedBody.body);
        if (!validated.ok) return validated.response;
        const { activityId, content, score, assignmentId } = validated.data;

        const userId = session.user.id;

        // Fetch activity to calculate points server-side
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
            select: { title: true, type: true, id: true, content: true, ui: true }
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        // Calculate points SERVER-SIDE based on activity type and score
        // NEVER trust points from client request
        const calculatedPoints = activity.type.toLowerCase() === 'quiz'
            ? calculateQuizPoints(score ?? null)
            : getActivityPoints(activity.type, activity);

        const assignmentKey = normalizeAssignmentId(assignmentId);

        const submissionResult = await prisma.$transaction(async (tx) => {
            await acquireUserActivityScopeLock(tx, {
                userId,
                activityId,
                assignmentId: assignmentKey,
            });

            const progressWhere = {
                userId,
                activityId,
                assignmentId: assignmentKey,
            };
            const existingProgress = await tx.activityProgress.findFirst({
                where: progressWhere,
                select: {
                    id: true,
                    categoryData: true,
                },
            });

            if (hasDuplicateSubmissionIdempotencyKey(existingProgress?.categoryData, idempotencyKey)) {
                const existingSubmission = await tx.submission.findFirst({
                    where: {
                        userId,
                        activityId,
                        assignmentId: assignmentKey,
                    },
                    select: { id: true, score: true },
                });

                return {
                    duplicateFromIdempotency: true,
                    duplicateFromClaim: false,
                    submissionId: existingSubmission?.id ?? null,
                    score: existingSubmission?.score ?? null,
                };
            }

            const submission = await saveActivitySubmission({
                submission: tx.submission,
                userId,
                activityId,
                assignmentId: assignmentKey,
                content,
                score: typeof score === "number" ? score : null,
            });

            // Update activity progress to completed.
            const nextCategoryData = extractCategoryDataObject(existingProgress?.categoryData);
            if (idempotencyKey) {
                nextCategoryData.pwaLastSubmissionIdempotencyKey = idempotencyKey;
                nextCategoryData.pwaLastSubmissionSyncedAt = new Date().toISOString();
            }

            if (existingProgress) {
                await tx.activityProgress.update({
                    where: { id: existingProgress.id },
                    data: {
                        progress: 100,
                        status: "completed",
                        categoryData: JSON.stringify(nextCategoryData),
                    },
                });
            } else {
                await tx.activityProgress.create({
                    data: {
                        userId,
                        activityId,
                        assignmentId: assignmentKey,
                        progress: 100,
                        status: "completed",
                        categoryData: JSON.stringify(nextCategoryData),
                    },
                });
            }

            let duplicateFromClaim = false;

            // Award points exactly once per submission by atomically claiming pointsAwarded.
            if (calculatedPoints > 0) {
                const claimResult = await claimSubmissionPointsOnce({
                    submission: tx.submission,
                    submissionId: submission.id,
                    userId,
                    pointsAwarded: calculatedPoints,
                });
                duplicateFromClaim = !claimResult.claimed;
            }

            return {
                duplicateFromIdempotency: false,
                duplicateFromClaim,
                submissionId: submission.id,
                score: submission.score,
            };
        });

        if (submissionResult.duplicateFromIdempotency) {
            return NextResponse.json({
                ok: true,
                duplicate: true,
                submissionId: submissionResult.submissionId,
                score: submissionResult.score,
                points: 0,
            });
        }

        const duplicate = submissionResult.duplicateFromClaim;
        if (!duplicate && calculatedPoints > 0) {
            const activityTypeLabel = activity.type.toLowerCase() === "quiz" ? "Quiz" : "";
            const reason = activityTypeLabel
                ? `${activity.title || activityId}|${activityTypeLabel}`
                : `Completed: ${activity.title || activityId}`;
            try {
                await applyAwardChain({
                    userId,
                    points: calculatedPoints,
                    reason,
                });
            } catch (awardError) {
                await prisma.submission.updateMany({
                    where: {
                        id: submissionResult.submissionId ?? "",
                        userId,
                        pointsAwarded: calculatedPoints,
                    },
                    data: {
                        pointsAwarded: 0,
                    },
                });
                throw awardError;
            }
        }

        return NextResponse.json({
            ok: true,
            duplicate,
            submissionId: submissionResult.submissionId,
            score: submissionResult.score,
            points: duplicate ? 0 : calculatedPoints
        });
    } catch (error) {
        console.error("[api/activity/submit] Error:", error);
        const message = error instanceof Error ? error.message : "Failed to submit activity";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
