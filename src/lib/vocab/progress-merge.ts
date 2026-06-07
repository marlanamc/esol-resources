import { parseCategoryData } from "@/lib/categoryData";

export const VOCAB_PROGRESS_TYPES = ["word-list", "flashcards", "matching", "fill-blank"] as const;

export type VocabProgressRecord = {
    progress: number;
    status: string;
    categoryData: string | null;
    updatedAt: Date;
};

function asObject(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return null;
}

function asBoolean(value: unknown): boolean {
    return value === true;
}

function asNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function isVocabCategoryData(data: Record<string, unknown> | null): boolean {
    if (!data) return false;
    return VOCAB_PROGRESS_TYPES.some((type) => Object.prototype.hasOwnProperty.call(data, type));
}

export function mergeVocabProgressRecords(
    assignmentRecord: VocabProgressRecord,
    globalRecord: VocabProgressRecord
): VocabProgressRecord | null {
    const assignmentData = parseCategoryData(assignmentRecord.categoryData);
    const globalData = parseCategoryData(globalRecord.categoryData);

    if (!isVocabCategoryData(assignmentData) && !isVocabCategoryData(globalData)) {
        return null;
    }

    const mergedData: Record<string, unknown> = {
        ...(globalData ?? {}),
        ...(assignmentData ?? {}),
    };

    let completedCount = 0;

    for (const vocabType of VOCAB_PROGRESS_TYPES) {
        const assignmentTypeData = asObject(assignmentData?.[vocabType]);
        const globalTypeData = asObject(globalData?.[vocabType]);

        if (!assignmentTypeData && !globalTypeData) {
            continue;
        }

        const assignmentCompleted = asBoolean(assignmentTypeData?.completed);
        const globalCompleted = asBoolean(globalTypeData?.completed);
        const assignmentProgress = asNumber(assignmentTypeData?.progress) ?? (assignmentCompleted ? 100 : 0);
        const globalProgress = asNumber(globalTypeData?.progress) ?? (globalCompleted ? 100 : 0);
        const mergedProgress = Math.max(assignmentProgress, globalProgress);
        const mergedCompleted = assignmentCompleted || globalCompleted || mergedProgress >= 100;

        if (mergedCompleted) {
            completedCount += 1;
        }

        const assignmentCompletedAt =
            typeof assignmentTypeData?.completedAt === "string" ? assignmentTypeData.completedAt : undefined;
        const globalCompletedAt =
            typeof globalTypeData?.completedAt === "string" ? globalTypeData.completedAt : undefined;

        mergedData[vocabType] = {
            ...(globalTypeData ?? {}),
            ...(assignmentTypeData ?? {}),
            completed: mergedCompleted,
            progress: mergedProgress,
            ...(assignmentCompletedAt || globalCompletedAt
                ? { completedAt: assignmentCompletedAt ?? globalCompletedAt }
                : {}),
        };
    }

    const progress = Math.round((completedCount / VOCAB_PROGRESS_TYPES.length) * 100);
    const status = progress >= 100 ? "completed" : "in_progress";

    return {
        progress,
        status,
        categoryData: JSON.stringify(mergedData),
        updatedAt:
            assignmentRecord.updatedAt.getTime() >= globalRecord.updatedAt.getTime()
                ? assignmentRecord.updatedAt
                : globalRecord.updatedAt,
    };
}

export function chooseBestProgressRecord(records: VocabProgressRecord[]): VocabProgressRecord | null {
    if (records.length === 0) return null;

    let best = records[0]!;
    for (let index = 1; index < records.length; index += 1) {
        const current = records[index]!;
        if (current.progress > best.progress) {
            best = current;
            continue;
        }

        if (current.progress === best.progress && current.updatedAt.getTime() > best.updatedAt.getTime()) {
            best = current;
        }
    }

    return best;
}
