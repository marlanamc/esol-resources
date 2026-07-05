import { calculateNumbersGameCompletionPercentage, isNumbersGameCategoryName } from "@/data/numbersGameCategories";
import {
    asBoolean,
    asNumber,
    asObject,
    isVocabProgressType,
    sanitizeGuideCompletedSectionIds,
    VOCAB_PROGRESS_TYPES,
} from "@/lib/activity/progress/shared";

export interface CategoryUpdateInput {
    currentData: Record<string, unknown>;
    category?: string;
    rawProgress: number;
    sanitizedAccuracy?: number;
    vocabType?: string;
    guideState?: unknown;
    categoryData?: unknown;
}

export interface CategoryUpdateResult {
    currentData: Record<string, unknown>;
    updatedCategoryData?: string;
    aggregatedProgress?: number;
}

export function applyProgressCategoryUpdates(
    input: CategoryUpdateInput
): CategoryUpdateResult {
    const {
        currentData: initialData,
        category,
        rawProgress,
        sanitizedAccuracy,
        vocabType,
        guideState,
        categoryData,
    } = input;

    const currentData = { ...initialData };
    let aggregatedProgress: number | undefined;

    if (category) {
        const isTimeSignalsCategory = category.toLowerCase() === "time-signals";
        const previousCategoryData = asObject(currentData[category]) ?? {};
        const wasCategoryCompleted = asBoolean(previousCategoryData.completed);
        const categoryCompleted = isTimeSignalsCategory
            ? wasCategoryCompleted ||
              (typeof sanitizedAccuracy === "number" && sanitizedAccuracy >= 70)
            : rawProgress >= 100;
        currentData[category] = {
            completed: categoryCompleted,
            ...(sanitizedAccuracy !== undefined ? { accuracy: sanitizedAccuracy } : {}),
            completedAt: categoryCompleted
                ? wasCategoryCompleted
                    ? (previousCategoryData as { completedAt?: string })?.completedAt
                    : new Date().toISOString()
                : (currentData[category] as { completedAt?: string })?.completedAt,
            attempts: (asNumber(previousCategoryData.attempts) || 0) + 1,
        };

        if (isNumbersGameCategoryName(category)) {
            aggregatedProgress = calculateNumbersGameCompletionPercentage(
                currentData as Record<string, { completed?: boolean; accuracy?: number }>
            );
        }
    }

    if (vocabType && isVocabProgressType(vocabType)) {
        currentData[vocabType] = {
            completed: rawProgress >= 100,
            progress: rawProgress,
            completedAt:
                rawProgress >= 100
                    ? new Date().toISOString()
                    : (currentData[vocabType] as { completedAt?: string })?.completedAt,
        };

        let completedCount = 0;
        for (const vType of VOCAB_PROGRESS_TYPES) {
            const typeData = currentData[vType] as { completed?: boolean } | undefined;
            if (typeData?.completed) {
                completedCount++;
            }
        }
        aggregatedProgress = (completedCount / VOCAB_PROGRESS_TYPES.length) * 100;
    }

    if (
        guideState != null &&
        typeof guideState === "object" &&
        typeof (guideState as { lastSectionIndex?: number }).lastSectionIndex === "number"
    ) {
        const parsedGuideState = guideState as {
            lastSectionIndex: number;
            completedSectionIds?: unknown;
        };
        const lastSectionIndex = Math.max(0, Math.round(parsedGuideState.lastSectionIndex));
        const completedSectionIds = sanitizeGuideCompletedSectionIds(
            parsedGuideState.completedSectionIds
        );
        const existingGuide = asObject(currentData._guide) ?? {};

        currentData._guide = {
            ...existingGuide,
            lastSectionIndex,
            ...(completedSectionIds ? { completedSectionIds } : {}),
        };
    }

    let updatedCategoryData: string | undefined;
    if (categoryData !== undefined) {
        updatedCategoryData =
            typeof categoryData === "string" ? categoryData : JSON.stringify(categoryData);
    } else if (category || "_guide" in currentData || vocabType) {
        updatedCategoryData = JSON.stringify(currentData);
    }

    return {
        currentData,
        updatedCategoryData,
        aggregatedProgress,
    };
}
