import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";
import {
    getMapActivityProgressId,
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-progress";
import { buildActivityHref, withReturnTo } from "@/lib/learner-navigation";

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

export { isMapActivityActionable, isMapActivityCompleted, getMapActivityProgressId };

export function findFirstIncompleteRequired(
    units: CourseMapUnit[],
    progress: Record<string, string | null>
): { activity: CourseMapActivity; weekNumber: number; unitNumber: number; unitMonth: string } | null {
    for (const unit of units) {
        for (const level of unit.levels) {
            const firstIncomplete = level.requiredActivities.find(
                (activity) =>
                    isMapActivityActionable(activity) && !isMapActivityCompleted(activity, progress)
            );
            if (firstIncomplete) {
                return {
                    activity: firstIncomplete,
                    weekNumber: level.levelNumber,
                    unitNumber: unit.unitNumber,
                    unitMonth: unit.month,
                };
            }
        }
    }
    return null;
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
            const actionableRequired = level.requiredActivities.filter(isMapActivityActionable);
            const done = actionableRequired.filter((activity) =>
                isMapActivityCompleted(activity, progress)
            ).length;
            const total = actionableRequired.length;
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
        .replace("Welcome Back: Simple & Continuous Review + V3 Preview", "Simple & Continuous Review")
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
    const match = findFirstIncompleteRequired(units, progress);
    if (!match) return null;
    return {
        title: shortMapActivityTitle(match.activity.title),
        weekNumber: match.weekNumber,
    };
}

export interface NextMapActivityLaunch {
    href: string;
    title: string;
    weekNumber: number;
    activityId?: string;
}

export function resolveNextMapActivityLaunch(
    units: CourseMapUnit[],
    progress: Record<string, string | null>,
    assignmentByActivityId?: Record<string, { assignmentId: string }>
): NextMapActivityLaunch | null {
    const match = findFirstIncompleteRequired(units, progress);
    if (!match) return null;

    const { activity, weekNumber } = match;
    const returnTo = buildMapReturnHref(weekNumber, true);

    let href: string | null = null;
    if (activity.href) {
        href = withReturnTo(activity.href, returnTo);
    } else if (activity.activityId) {
        const assignmentId = assignmentByActivityId?.[activity.activityId]?.assignmentId;
        href = withReturnTo(buildActivityHref(activity.activityId, assignmentId), returnTo);
    }

    if (!href) return null;

    return {
        href,
        title: shortMapActivityTitle(activity.title),
        weekNumber,
        ...(activity.activityId ? { activityId: activity.activityId } : {}),
    };
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
    const match = findFirstIncompleteRequired(units, progress);

    if (match) {
        for (const unit of units) {
            for (const level of unit.levels) {
                if (level.levelNumber === match.weekNumber) {
                    return {
                        weekNumber: level.levelNumber,
                        unitNumber: unit.unitNumber,
                        unitMonth: unit.month,
                        unitTitle: unit.unitTitle,
                    };
                }
            }
        }
    }

    for (const unit of units) {
        for (const level of unit.levels) {
            const hasIncomplete = level.requiredActivities.some(
                (activity) =>
                    isMapActivityActionable(activity) && !isMapActivityCompleted(activity, progress)
            );
            if (hasIncomplete) {
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
