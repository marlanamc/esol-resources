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

    const existing = await prisma.activityProgress.findFirst({
        where: progressWhere,
    });

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

    const activityGameUi = activity ? resolveActivityGameUi(activity) : "unknown";
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
        if (!updatedCategoryData) {
            updatedCategoryData = JSON.stringify(categoryUpdate.currentData);
        }
    }

    if (updatedCategoryData) {
        progressData.categoryData = updatedCategoryData;
    }

    const record = existing
        ? await prisma.activityProgress.update({
              where: { id: existing.id },
              data: progressData,
          })
        : await prisma.activityProgress.create({
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
        });
    }

    const isVocabularyTypeUpdate =
        typeof vocabType === "string" && isVocabProgressType(vocabType);
    const existingCategoryData = parseExistingCategoryData(existing?.categoryData);
    const isGroupRoundUpdate =
        activityGameUi === "gerund-infinitive" ||
        activityGameUi === "irregular-verbs" ||
        activityGameUi === "parts-of-speech";
    const validRoundModes = ["round1", "round2", "review", "final"];
    const hasRoundParams =
        typeof groupId === "string" &&
        groupId.length > 0 &&
        validRoundModes.includes(roundMode) &&
        typeof roundAccuracy === "number" &&
        Number.isFinite(roundAccuracy) &&
        typeof roundExercisesCompleted === "number" &&
        Number.isFinite(roundExercisesCompleted) &&
        roundExercisesCompleted >= 0;
    const shouldAwardGroupRoundPoints = isGroupRoundUpdate && hasRoundParams;
    const isTimelineRoundCompletion =
        activityGameUi === "timeline-tenses" && sanitizedAccuracy !== undefined;
    const isTimeSignalsRound =
        isTimelineRoundCompletion &&
        typeof category === "string" &&
        category.toLowerCase() === "time-signals";
    const isPassingTimeSignalsQuiz = isTimeSignalsRound && sanitizedAccuracy >= 70;

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

    const canAwardTimeSignals = !isTimeSignalsRound || isPassingTimeSignalsQuiz;
    const shouldAwardPoints =
        shouldAwardGroupRoundPoints ||
        (isTimelineRoundCompletion && canAwardTimeSignals) ||
        (shouldAwardProgress && canAwardTimeSignals);

    let pointsAwarded = 0;
    if (shouldAwardPoints) {
        pointsAwarded = await awardProgressActivityPoints({
            userId,
            activityId,
            activity,
            activityGameUi,
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
}
