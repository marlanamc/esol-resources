import type { ActivityProgressStatus } from "@/lib/activityProgress";

export function resolveFinalProgressState(params: {
    rawProgress: number;
    statusInput?: ActivityProgressStatus;
    aggregatedProgress?: number;
    isPronunciationPracticeActivity: boolean;
    existingStatus?: string | null;
}): { progressValue: number; finalStatus: ActivityProgressStatus } {
    const {
        rawProgress,
        statusInput,
        aggregatedProgress,
        isPronunciationPracticeActivity,
        existingStatus,
    } = params;

    // Reopening a finished activity (e.g. to review it) shouldn't un-complete
    // it just because the viewer reports a lower progress tick on load.
    if (existingStatus === "completed") {
        return { progressValue: 100, finalStatus: "completed" };
    }

    let progressValue = rawProgress;
    let statusValue: ActivityProgressStatus | undefined = statusInput;

    if (aggregatedProgress !== undefined) {
        progressValue = aggregatedProgress;
        statusValue = aggregatedProgress >= 100 ? "completed" : "in_progress";
    }

    if (isPronunciationPracticeActivity) {
        progressValue = 0;
        statusValue = "in_progress";
    }

    const finalStatus: ActivityProgressStatus =
        statusValue ?? (progressValue >= 100 ? "completed" : "in_progress");
    return { progressValue, finalStatus };
}

export function shouldAwardProgressPoints(params: {
    rawProgress: number;
    progressValue: number;
    category?: string;
    vocabType?: string;
    sanitizedAccuracy?: number;
    updatedCategoryData?: string;
    existingProgress?: number;
    existingCategoryData: Record<string, unknown>;
}): boolean {
    const {
        rawProgress,
        progressValue,
        category,
        vocabType,
        sanitizedAccuracy,
        updatedCategoryData,
        existingProgress,
        existingCategoryData,
    } = params;

    const isAccuracyCategoryUpdate = !!category && sanitizedAccuracy !== undefined;
    const isRoundCategoryUpdate = !!category && /^round-\d+$/.test(category);
    const isVocabularyTypeUpdate =
        !!vocabType &&
        ["word-list", "flashcards", "matching", "fill-blank"].includes(vocabType);
    const wasVocabTypeCompleted =
        isVocabularyTypeUpdate &&
        !!(existingCategoryData[vocabType!] as { completed?: boolean } | undefined)?.completed;
    const wasRoundCompleted =
        isRoundCategoryUpdate &&
        !!(existingCategoryData[category!] as { completed?: boolean } | undefined)?.completed;

    return isVocabularyTypeUpdate
        ? rawProgress >= 100 && !wasVocabTypeCompleted
        : isAccuracyCategoryUpdate
          ? rawProgress >= 100 &&
            !!updatedCategoryData &&
            !(existingCategoryData[category!] as { completed?: boolean } | undefined)?.completed
          : isRoundCategoryUpdate
            ? !!updatedCategoryData && !wasRoundCompleted
            : (existingProgress ?? 0) < 100 && progressValue >= 100;
}
