import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";

const GRAMMAR_READER_PREFIX = "/grammar-reader/";

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
    progress: Record<string, string | null>
): boolean {
    const progressId = getMapActivityProgressId(activity);
    return Boolean(progressId && progress[progressId] === "completed");
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

function enrichActivity(
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

export async function enrichCourseMapUnitsWithGrammarIds(
    units: CourseMapUnit[]
): Promise<CourseMapUnit[]> {
    const slugs = collectGrammarReaderSlugs(units);
    const slugToActivityId = new Map<string, string>();

    await Promise.all(
        slugs.map(async (slug) => {
            const activityId = await resolveCanonicalGrammarActivityId({ slug });
            if (activityId) slugToActivityId.set(slug, activityId);
        })
    );

    return units.map((unit) => ({
        ...unit,
        levels: unit.levels.map((level) => ({
            ...level,
            requiredActivities: level.requiredActivities.map((activity) =>
                enrichActivity(activity, slugToActivityId)
            ),
            extraPractice: level.extraPractice?.map((activity) =>
                enrichActivity(activity, slugToActivityId)
            ),
        })),
    }));
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
