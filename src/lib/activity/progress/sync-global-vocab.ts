import { prisma } from "@/lib/database/prisma";
import { logger } from "@/lib/shared/logger";
import { VOCAB_PROGRESS_TYPES } from "@/lib/activity/progress/shared";

export async function syncGlobalVocabularyProgress(params: {
    userId: string;
    activityId: string;
    updatedCategoryData: string;
    progressData: {
        progress: number;
        status: string;
        categoryData?: string;
    };
}): Promise<void> {
    const { userId, activityId, updatedCategoryData, progressData } = params;

    try {
        const globalRecord = await prisma.activityProgress.findFirst({
            where: {
                userId,
                activityId,
                assignmentId: null,
            },
        });

        if (globalRecord) {
            const existingGlobalData = globalRecord.categoryData
                ? typeof globalRecord.categoryData === "string"
                    ? JSON.parse(globalRecord.categoryData)
                    : globalRecord.categoryData
                : {};
            const newData =
                typeof updatedCategoryData === "string"
                    ? JSON.parse(updatedCategoryData)
                    : updatedCategoryData;

            const mergedData: Record<string, unknown> = { ...existingGlobalData, ...newData };
            for (const vType of VOCAB_PROGRESS_TYPES) {
                const existingTypeData = (existingGlobalData[vType] ?? {}) as {
                    completed?: boolean;
                    completedAt?: string;
                };
                const newTypeData = (newData[vType] ?? {}) as {
                    completed?: boolean;
                    completedAt?: string;
                };
                const wasCompleted = Boolean(existingTypeData.completed);
                const completed = wasCompleted || Boolean(newTypeData.completed);
                mergedData[vType] = {
                    ...existingTypeData,
                    ...newTypeData,
                    completed,
                    completedAt: completed
                        ? wasCompleted
                            ? existingTypeData.completedAt
                            : newTypeData.completedAt
                        : newTypeData.completedAt ?? existingTypeData.completedAt,
                };
            }
            const completedCount = VOCAB_PROGRESS_TYPES.filter(
                (vType) => (mergedData[vType] as { completed?: boolean } | undefined)?.completed
            ).length;
            const globalProgress = (completedCount / VOCAB_PROGRESS_TYPES.length) * 100;
            // Once the global record is complete, a reopened mode that hasn't been
            // replayed to 100% yet must not downgrade it back to in_progress.
            const globalStatus =
                globalProgress >= 100 || globalRecord.status === "completed"
                    ? "completed"
                    : "in_progress";

            await prisma.activityProgress.update({
                where: { id: globalRecord.id },
                data: {
                    categoryData: JSON.stringify(mergedData),
                    progress: globalProgress,
                    status: globalStatus,
                },
            });
        } else {
            await prisma.activityProgress.create({
                data: {
                    userId,
                    activityId,
                    assignmentId: null,
                    ...progressData,
                },
            });
        }
    } catch (error) {
        logger.error("Failed to sync global vocabulary progress", error);
    }
}
