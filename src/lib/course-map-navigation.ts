import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";

/** Offset for sticky headers when scrolling to map anchors. */
export const COURSE_MAP_SCROLL_OFFSET_PX = 88;

export const COURSE_MAP_OPEN_WEEK_EVENT = "course-map:open-week";

export type CourseMapOpenWeekDetail = { week: number; focusActivity?: boolean };

export function parseMapWeekParam(value: string | undefined | null): number | null {
    if (!value) return null;
    const week = Number.parseInt(value, 10);
    if (!Number.isFinite(week) || week < 1 || week > 36) return null;
    return week;
}

export function parseMapWeekFromHash(hash: string): number | null {
    const match = hash.match(/^#week-(\d+)$/);
    if (!match) return null;
    return parseMapWeekParam(match[1]);
}

export function parseMapUnitFromHash(hash: string): number | null {
    const match = hash.match(/^#unit-(\d+)$/);
    if (!match) return null;
    const unit = Number.parseInt(match[1], 10);
    if (!Number.isFinite(unit) || unit < 1) return null;
    return unit;
}

export function scrollToMapTarget(targetId: string, behavior: ScrollBehavior = "smooth"): void {
    if (typeof document === "undefined") return;
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - COURSE_MAP_SCROLL_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, top), behavior });
}

export function dispatchOpenMapWeek(week: number, focusActivity = false): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent<CourseMapOpenWeekDetail>(COURSE_MAP_OPEN_WEEK_EVENT, {
            detail: { week, focusActivity },
        })
    );
}

export function buildMapReturnHref(weekNumber: number, focusActivity = false): string {
    const params = new URLSearchParams();
    params.set("week", String(weekNumber));
    if (focusActivity) params.set("focus", "next");
    return `/dashboard/map?${params.toString()}#week-${weekNumber}`;
}

export function syncMapUrl(weekNumber: number | null, focusActivity = false): void {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (weekNumber != null) {
        url.searchParams.set("week", String(weekNumber));
        url.hash = `week-${weekNumber}`;
        if (focusActivity) url.searchParams.set("focus", "next");
        else url.searchParams.delete("focus");
    } else {
        url.searchParams.delete("week");
        url.searchParams.delete("focus");
        url.hash = "";
    }
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
        window.history.replaceState(null, "", next);
    }
}

function isActionable(activity: CourseMapActivity): boolean {
    return (
        activity.status !== "planned" &&
        activity.status !== "locked" &&
        Boolean(activity.activityId || activity.href)
    );
}

function isActivityCompleted(
    activity: CourseMapActivity,
    progress: Record<string, string | null>
): boolean {
    return Boolean(activity.activityId && progress[activity.activityId] === "completed");
}

export interface CurrentMapWeekMeta {
    weekNumber: number;
    unitNumber: number;
    unitMonth: string;
    unitTitle: string;
}

export interface WeekProgressEntry {
    weekNumber: number;
    unitNumber: number;
    title: string;
    done: number;
    total: number;
    isDone: boolean;
}

export function buildMapWeekProgress(
    units: CourseMapUnit[],
    progress: Record<string, string | null>
): WeekProgressEntry[] {
    return units.flatMap((unit) =>
        unit.levels.map((level) => {
            const required = level.requiredActivities;
            const done = required.filter(
                (activity) => activity.activityId && progress[activity.activityId] === "completed"
            ).length;
            const total = required.length;
            return {
                weekNumber: level.levelNumber,
                unitNumber: unit.unitNumber,
                title: level.levelTitle,
                done,
                total,
                isDone: total > 0 && done === total,
            };
        })
    );
}

function shortMapActivityTitle(title: string): string {
    return title
        .replace("Full Parts of Speech Practice Library", "Parts of Speech Practice")
        .replace(/\s+\+\s+V3 Preview$/i, "")
        .trim();
}

export interface NextMapActivityMeta {
    title: string;
    weekNumber: number;
}

export function resolveNextMapActivity(
    units: CourseMapUnit[],
    progress: Record<string, string | null>
): NextMapActivityMeta | null {
    const requiredActivities = units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
    const firstIncomplete = requiredActivities.find(
        (activity) => isActionable(activity) && !isActivityCompleted(activity, progress)
    );
    if (!firstIncomplete) return null;

    for (const unit of units) {
        for (const level of unit.levels) {
            if (level.requiredActivities.some((activity) => activity.id === firstIncomplete.id)) {
                return {
                    title: shortMapActivityTitle(firstIncomplete.title),
                    weekNumber: level.levelNumber,
                };
            }
        }
    }

    return null;
}

export function focusMapWeekHeading(weekNumber: number): void {
    if (typeof document === "undefined") return;
    window.requestAnimationFrame(() => {
        const heading = document.getElementById(`week-${weekNumber}-heading`);
        heading?.focus({ preventScroll: true });
    });
}

export function resolveCurrentMapWeek(
    units: CourseMapUnit[],
    progress: Record<string, string | null>
): CurrentMapWeekMeta | null {
    const requiredActivities = units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
    const firstIncomplete = requiredActivities.find(
        (activity) => isActionable(activity) && !isActivityCompleted(activity, progress)
    );

    for (const unit of units) {
        for (const level of unit.levels) {
            const hasCurrent = firstIncomplete
                ? level.requiredActivities.some((activity) => activity.id === firstIncomplete.id)
                : level.requiredActivities.some(
                      (activity) => isActionable(activity) && !isActivityCompleted(activity, progress)
                  );
            if (hasCurrent) {
                return {
                    weekNumber: level.levelNumber,
                    unitNumber: unit.unitNumber,
                    unitMonth: unit.month,
                    unitTitle: unit.unitTitle,
                };
            }
        }
    }

    const firstUnit = units[0];
    const firstLevel = firstUnit?.levels[0];
    if (!firstUnit || !firstLevel) return null;

    return {
        weekNumber: firstLevel.levelNumber,
        unitNumber: firstUnit.unitNumber,
        unitMonth: firstUnit.month,
        unitTitle: firstUnit.unitTitle,
    };
}
