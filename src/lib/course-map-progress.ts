import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";
import { parseCategoryData } from "@/lib/categoryData";
import {
    isVocabCategoryData,
    mergeVocabProgressRecords,
} from "@/lib/vocab/progress-merge";

const GRAMMAR_READER_PREFIX = "/grammar-reader/";

export type CourseMapProgressEntry = {
    status: string | null;
    categoryData: Record<string, unknown> | null;
};

/** Per activityId progress used by the course map (status + optional vocab mode data). */
export type CourseMapProgressState = Record<string, CourseMapProgressEntry>;

type CourseMapProgressRow = {
    activityId: string;
    status: string;
    categoryData: string | null;
    updatedAt?: Date;
};

function resolveProgressEntry(
    progress: CourseMapProgressState | Record<string, string | null>,
    activityId: string
): CourseMapProgressEntry | null {
    const value = progress[activityId];
    if (value === undefined) return null;
    if (typeof value === "string" || value === null) {
        return { status: value, categoryData: null };
    }
    return value;
}

export function buildCourseMapProgressState(rows: CourseMapProgressRow[]): CourseMapProgressState {
    const grouped = new Map<string, CourseMapProgressRow[]>();

    for (const row of rows) {
        const list = grouped.get(row.activityId) ?? [];
        list.push(row);
        grouped.set(row.activityId, list);
    }

    const state: CourseMapProgressState = {};

    for (const [activityId, activityRows] of grouped.entries()) {
        let merged: CourseMapProgressRow | null = null;

        for (const row of activityRows) {
            if (!merged) {
                merged = row;
                continue;
            }

            const vocabMerged = mergeVocabProgressRecords(
                {
                    progress: merged.status === "completed" ? 100 : 0,
                    status: merged.status,
                    categoryData: merged.categoryData,
                    updatedAt: merged.updatedAt ?? new Date(0),
                },
                {
                    progress: row.status === "completed" ? 100 : 0,
                    status: row.status,
                    categoryData: row.categoryData,
                    updatedAt: row.updatedAt ?? new Date(0),
                }
            );

            if (vocabMerged) {
                merged = {
                    activityId,
                    status: vocabMerged.status,
                    categoryData: vocabMerged.categoryData,
                    updatedAt: vocabMerged.updatedAt,
                };
                continue;
            }

            const mergedData = parseCategoryData(merged.categoryData);
            const rowData = parseCategoryData(row.categoryData);
            if (isVocabCategoryData(mergedData) || isVocabCategoryData(rowData)) {
                merged = row.updatedAt && merged.updatedAt && row.updatedAt > merged.updatedAt ? row : merged;
            } else if (row.status === "completed" || merged.status !== "completed") {
                merged = row.status === "completed" ? row : merged;
            }
        }

        state[activityId] = {
            status: merged?.status ?? null,
            categoryData: parseCategoryData(merged?.categoryData ?? null),
        };
    }

    return state;
}

export function parseGrammarReaderSlug(href?: string): string | null {
    if (!href?.startsWith(GRAMMAR_READER_PREFIX)) return null;
    const slug = href.slice(GRAMMAR_READER_PREFIX.length).split("?")[0]?.split("#")[0];
    return slug || null;
}

export function getMapActivityProgressId(activity: CourseMapActivity): string | null {
    return activity.activityId ?? null;
}

export function isMapActivityActionable(activity: CourseMapActivity): boolean {
    return (
        activity.status !== "planned" &&
        activity.status !== "locked" &&
        Boolean(activity.activityId || activity.href)
    );
}

export function isMapActivityCompleted(
    activity: CourseMapActivity,
    progress: CourseMapProgressState | Record<string, string | null>
): boolean {
    const progressId = getMapActivityProgressId(activity);
    if (!progressId) return false;

    const entry = resolveProgressEntry(progress, progressId);
    if (!entry) return false;

    if (activity.vocabUi && entry.categoryData) {
        const modeData = entry.categoryData[activity.vocabUi] as { completed?: boolean } | undefined;
        if (modeData?.completed) return true;
    }

    return entry.status === "completed";
}

export function getActionableRequiredActivities(units: CourseMapUnit[]): CourseMapActivity[] {
    return units.flatMap((unit) =>
        unit.levels.flatMap((level) =>
            level.requiredActivities.filter(isMapActivityActionable)
        )
    );
}

export function collectGrammarReaderSlugs(units: CourseMapUnit[]): string[] {
    const slugs = new Set<string>();
    for (const unit of units) {
        for (const level of unit.levels) {
            for (const activity of [
                ...level.requiredActivities,
                ...(level.extraPractice ?? []),
            ]) {
                if (activity.activityId) continue;
                const slug = parseGrammarReaderSlug(activity.href);
                if (slug) slugs.add(slug);
            }
        }
    }
    return [...slugs];
}

export function enrichActivity(
    activity: CourseMapActivity,
    slugToActivityId: Map<string, string>
): CourseMapActivity {
    if (activity.activityId) return activity;

    const slug = parseGrammarReaderSlug(activity.href);
    if (slug) {
        const resolvedId = slugToActivityId.get(slug);
        if (resolvedId) {
            return { ...activity, activityId: resolvedId };
        }
    }

    if (!activity.href && !activity.activityId) {
        return { ...activity, status: "planned" };
    }

    return activity;
}

export function getCourseMapProgressActivityIds(units: CourseMapUnit[]): string[] {
    return Array.from(
        new Set(
            units
                .flatMap((unit) => unit.levels)
                .flatMap((level) => [
                    ...level.requiredActivities,
                    ...(level.extraPractice ?? []),
                ])
                .map(getMapActivityProgressId)
                .filter((id): id is string => Boolean(id))
        )
    );
}

/** Test helper: enrich units with a pre-built slug → activityId map (no DB). */
export function enrichCourseMapUnitsWithGrammarIdMap(
    units: CourseMapUnit[],
    slugToActivityId: Record<string, string>
): CourseMapUnit[] {
    const map = new Map(Object.entries(slugToActivityId));
    return units.map((unit) => ({
        ...unit,
        levels: unit.levels.map((level) => ({
            ...level,
            requiredActivities: level.requiredActivities.map((activity) =>
                enrichActivity(activity, map)
            ),
            extraPractice: level.extraPractice?.map((activity) =>
                enrichActivity(activity, map)
            ),
        })),
    }));
}
