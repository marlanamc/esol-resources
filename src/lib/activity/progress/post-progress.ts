import { acquireUserActivityScopeLock } from "@/lib/database/locks";
import { REVIEW_ACTIVITY_ID } from '@/lib/parts-of-speech-review/content';
import { readReviewProgress, scoreReviewAttempt, preserveReviewProgress } from '@/lib/parts-of-speech-review/progression';
import { savePartsOfSpeechReview } from './parts-of-speech-review';
import { WORD_SORT_ACTIVITIES } from '@/lib/word-sort/types';
import { saveWordSortAttempt, InvalidWordSortAttempt } from './word-sort';
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import type { ActivityProgressStatus } from "@/lib/activityProgress";
import { resolveActivityGameUi } from "@/lib/gamification/gamification";
import { logger } from "@/lib/shared/logger";
import { ApiErrors, apiError } from "@/lib/api/response";
import { timedQuery } from "@/lib/shared/perf-log";
import { applyProgressCategoryUpdates } from "@/lib/activity/progress/category-updates";
import { awardProgressActivityPoints } from "@/lib/activity/progress/award-points";
import {
    getProgressIdempotencyKey,
    isVocabProgressType,
    parseExistingCategoryData,
    readIdempotencyKey,
} from "@/lib/activity/progress/shared";
import {
    resolveFinalProgressState,
    shouldAwardProgressPoints,
} from "@/lib/activity/progress/state";
import { syncGlobalVocabularyProgress } from "@/lib/activity/progress/sync-global-vocab";

export async function POST(request: NextRequest) {
    const idempotencyKey = readIdempotencyKey(request);
    const session = await getServerSession(authOptions);
    const startedAt = Date.now();

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const body = await request.json();
    const {
        activityId,
        progress = 100,
        status: statusInput,
        accuracy,
        category,
        assignmentId,
        guideState,
        vocabType,
        categoryData,
        groupId,
        roundMode,
        roundAccuracy,
        roundExercisesCompleted,
    } = body;

    if (!activityId || typeof activityId !== "string") {
        return apiError("activityId is required", 400);
    }

    const rawProgress =
        typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    const sanitizedAccuracy =
        accuracy !== undefined && accuracy !== null
            ? Math.max(0, Math.min(100, Math.round(Number(accuracy))))
            : undefined;

    if (category !== undefined && typeof category !== "string") {
        return apiError("Invalid category format", 400);
    }

    const statusValue =
        typeof statusInput === "string" ? (statusInput as ActivityProgressStatus) : undefined;

    const userId = session.user.id;
    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
    const progressWhere = {
        userId,
        activityId,
        assignmentId: assignmentKey,
    };

    const activity = await timedQuery(
        {
            route: "/api/activity/progress",
            queryLabel: "activity.findUnique.progress",
            userRole: session.user?.role,
        },
        () =>
            prisma.activity.findUnique({
                where: { id: activityId },
                select: { type: true, title: true, content: true, ui: true, category: true },
            }),
        (result) => (result ? 1 : 0)
    );

    if (body.reviewAttempt !== undefined) {
        if (activityId !== REVIEW_ACTIVITY_ID || !activity) return apiError("Invalid review activity", 400);
        try { scoreReviewAttempt(body.reviewAttempt); }
        catch { return apiError("A complete, valid review attempt is required", 400); }
        try { return await savePartsOfSpeechReview(userId, activityId, body.reviewAttempt); }
        catch (error) {
            logger.error("Parts of Speech review save failed", { userId, activityId, error });
            return apiError("Progress could not be saved. Please retry.", 500);
        }
    }

    // Existing Word Sort IDs also route here before their updated content is synced.
    const wordSort = WORD_SORT_ACTIVITIES[activityId];
    if (wordSort && activity) {
        if (!body.wordSortAttempt) return apiError("A completed Word Sort attempt is required", 400);
        try {
            return await saveWordSortAttempt(userId, activityId, activity.title, wordSort.target, body.wordSortAttempt);
        } catch (error) {
            if (error instanceof InvalidWordSortAttempt) return apiError(error.message, 400);
            logger.error("Word Sort progress save failed", { userId, activityId, error });
            return apiError("Progress could not be saved. Please retry.", 500);
        }
    }

    try {
        return await prisma.$transaction(async (tx) => {
            // Match the specialized review writer's lock before reading its namespace.
            if (activityId === REVIEW_ACTIVITY_ID) {
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`pos-review:${userId}:${activityId}`}))`;
            }
            // Serialize all scopes for this activity, including assignment -> global sync.
            await acquireUserActivityScopeLock(tx, { userId, activityId, assignmentId: null });
            if (assignmentKey) {
                await acquireUserActivityScopeLock(tx, { userId, activityId, assignmentId: assignmentKey });
            }
            const existing = await tx.activityProgress.findFirst({ where: progressWhere });
            const activityGameUi = activity ? resolveActivityGameUi(activity) : "unknown";
            if (activityId === "word-rescue" || activityGameUi === "word-rescue") {
                return apiError("Word Lab practice must be saved through its per-word endpoint.", 400);
            }
            const isPronunciationPracticeActivity =
                activity?.type === "game" &&
                (activity.category === "pronunciation" ||
                    activityGameUi === "ed-pronunciation" ||
                    activityGameUi === "minimal-pairs" ||
                    activityGameUi === "pronunciation-listening");

            const currentData = parseExistingCategoryData(existing?.categoryData);
            const duplicateProgressIdempotencyKey = getProgressIdempotencyKey(currentData);

            if (idempotencyKey && existing && duplicateProgressIdempotencyKey === idempotencyKey) {
                const payload = {
                    ok: true,
                    progress: existing.progress,
                    status: existing.status,
                    pointsAwarded: 0,
                };
                logger.info("api.activity.progress.response", {
                    route: "/api/activity/progress",
                    userRole: session.user?.role,
                    durationMs: Date.now() - startedAt,
                    payloadBytes: JSON.stringify(payload).length,
                    duplicate: true,
                    pointsAwarded: 0,
                });
                return NextResponse.json(payload);
            }

            const categoryUpdate = applyProgressCategoryUpdates({
                currentData,
                category: typeof category === "string" ? category : undefined,
                rawProgress,
                sanitizedAccuracy,
                vocabType: typeof vocabType === "string" ? vocabType : undefined,
                guideState,
                categoryData,
            });

            let updatedCategoryData = categoryUpdate.updatedCategoryData;

            const { progressValue, finalStatus } = resolveFinalProgressState({
                rawProgress,
                statusInput: statusValue,
                aggregatedProgress: categoryUpdate.aggregatedProgress,
                isPronunciationPracticeActivity,
                existingStatus: existing?.status,
            });

            const progressData: {
                progress: number;
                status: ActivityProgressStatus;
                categoryData?: string;
            } = {
                progress: progressValue,
                status: finalStatus,
            };

            if (idempotencyKey) {
                categoryUpdate.currentData.pwaLastProgressIdempotencyKey = idempotencyKey;
                categoryUpdate.currentData.pwaLastProgressSyncedAt = new Date().toISOString();
                updatedCategoryData = JSON.stringify({
                    ...parseExistingCategoryData(updatedCategoryData ?? JSON.stringify(categoryUpdate.currentData)),
                    pwaLastProgressIdempotencyKey: idempotencyKey,
                    pwaLastProgressSyncedAt: categoryUpdate.currentData.pwaLastProgressSyncedAt,
                });
            }

            if (updatedCategoryData) {
                progressData.categoryData = updatedCategoryData;
            }

            // Library writes share the review lock and preserve the server-owned review
            // namespace, even when an older tab submits stale category data or a reset.
            const record = activityId === REVIEW_ACTIVITY_ID
                ? await (async () => {
                    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`pos-review:${userId}:${activityId}`}))`;
                    const latest = await tx.activityProgress.findFirst({ where: progressWhere, orderBy: { updatedAt: 'desc' } });
                    const saved = parseExistingCategoryData(latest?.categoryData);
                    const incoming = preserveReviewProgress(saved, updatedCategoryData ? parseExistingCategoryData(updatedCategoryData) : saved);
                    const reviewCompleted = !!readReviewProgress(saved._partsOfSpeechReview).lessons['nouns-verbs'];
                    const data = { ...progressData, categoryData: JSON.stringify(incoming), ...(reviewCompleted ? { progress: 100, status: 'completed' } : {}) };
                    return latest
                        ? tx.activityProgress.update({ where: { id: latest.id }, data })
                        : tx.activityProgress.create({ data: { userId, activityId, assignmentId: assignmentKey, ...data } });
                })()
                : guideState
                ? await (async () => {
                    await acquireUserActivityScopeLock(tx, { userId, activityId, assignmentId: assignmentKey });
                    const latest = await tx.activityProgress.findFirst({ where: progressWhere, orderBy: { updatedAt: 'desc' } });
                    const saved = parseExistingCategoryData(latest?.categoryData);
                    // Navigation only owns _guide. Never overwrite saved exercise credit or
                    // undo completion when an older navigation request arrives after the quiz.
                    const data = { ...progressData, categoryData: JSON.stringify({ ...saved, _guide: categoryUpdate.currentData._guide }),
                        ...(latest?.status === 'completed' ? { progress: 100, status: 'completed' as const } : {}) };
                    return latest
                        ? tx.activityProgress.update({ where: { id: latest.id }, data })
                        : tx.activityProgress.create({ data: { userId, activityId, assignmentId: assignmentKey, ...data } });
                })()
                : existing
                ? await tx.activityProgress.update({
                      where: { id: existing.id },
                      data: progressData,
                  })
                : await tx.activityProgress.create({
                      data: {
                          userId,
                          activityId,
                          assignmentId: assignmentKey,
                          ...progressData,
                      },
                  });

            if (
                typeof vocabType === "string" &&
                isVocabProgressType(vocabType) &&
                assignmentKey &&
                updatedCategoryData
            ) {
                await syncGlobalVocabularyProgress({
                    userId,
                    activityId,
                    updatedCategoryData,
                    progressData,
                    transaction: tx,
                });
            }

            const isVocabularyTypeUpdate =
                typeof vocabType === "string" && isVocabProgressType(vocabType);
            const existingCategoryData = parseExistingCategoryData(existing?.categoryData);
            const isGroupRoundUpdate =
                activityGameUi === "gerund-infinitive" ||
                activityGameUi === "irregular-verbs" ||
                activityGameUi === "parts-of-speech";
            const validRoundModes = activityGameUi === "parts-of-speech"
                ? ["round1", "round2", "round3", "round4", "round5", "review", "final"]
                : ["round1", "round2", "review", "final"];
            const hasRoundParams =
                typeof groupId === "string" &&
                groupId.length > 0 &&
                validRoundModes.includes(roundMode) &&
                typeof roundAccuracy === "number" &&
                Number.isFinite(roundAccuracy) &&
                typeof roundExercisesCompleted === "number" &&
                Number.isFinite(roundExercisesCompleted) &&
                roundExercisesCompleted > 0;
            if (isGroupRoundUpdate && groupId !== undefined && !hasRoundParams) {
                throw new Error("A completed practice round is required");
            }
            const shouldAwardGroupRoundPoints = isGroupRoundUpdate && hasRoundParams;
            const isTimelineRoundCompletion =
                activityGameUi === "timeline-tenses" && sanitizedAccuracy !== undefined;


            const shouldAwardProgress = shouldAwardProgressPoints({
                rawProgress,
                progressValue,
                category: typeof category === "string" ? category : undefined,
                vocabType: typeof vocabType === "string" ? vocabType : undefined,
                sanitizedAccuracy,
                updatedCategoryData,
                existingProgress: existing?.progress,
                existingCategoryData,
            });

            const shouldAwardPoints =
                shouldAwardGroupRoundPoints ||
                (isTimelineRoundCompletion && rawProgress >= 100) ||
                shouldAwardProgress;

            let pointsAwarded = 0;
            if (shouldAwardPoints) {
                pointsAwarded = await awardProgressActivityPoints({
                    userId,
                    activityId,
                    activity,
                    activityGameUi,
                    transaction: tx,
                    idempotencyKey,
                    shouldAwardGroupRoundPoints,
                    groupId,
                    roundMode,
                    roundAccuracy,
                    roundExercisesCompleted,
                    isVocabularyTypeUpdate,
                    vocabType: typeof vocabType === "string" ? vocabType : undefined,
                    category: typeof category === "string" ? category : undefined,
                    sanitizedAccuracy,
                });
            }

            const payload = {
                ok: true,
                progress: record.progress,
                status: record.status,
                pointsAwarded,
            };
            logger.info("api.activity.progress.response", {
                route: "/api/activity/progress",
                userRole: session.user?.role,
                durationMs: Date.now() - startedAt,
                payloadBytes: JSON.stringify(payload).length,
                pointsAwarded,
                duplicate: false,
            });
            return NextResponse.json(payload);
        }, { timeout: 10000 });
    } catch (error) {
        logger.error("Progress and credit could not be saved", { userId, activityId, error });
        return apiError("Progress could not be saved. Please retry.", 500);
    }
}
