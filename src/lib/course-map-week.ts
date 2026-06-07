import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { getVisibleMap, type VisibleMapMode } from "@/lib/course-map";
import {
    isMapActivityActionable,
    isMapActivityCompleted,
    type CourseMapProgressState,
} from "@/lib/course-map-progress";
import {
    enrichCourseMapUnitsWithGrammarIds,
    loadCourseMapProgressState,
} from "@/lib/course-map-progress.server";
import { findFirstIncompleteRequired, resolveNextMapActivityLaunch } from "@/lib/course-map-navigation";
import {
    formatNextUpActivityTitle,
    getCourseMapEstimatedMinutesForActivity,
} from "@/lib/course-map-hero";
import { buildActivityHref } from "@/lib/learner/navigation";
import { isLearnerVisibleActivity } from "@/lib/learner-visibility";
import { getEffectiveLearnerMode } from "@/lib/learner-preview";
import type { TimelineItem, TimelineStatus } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";

function buildItemHref(activity: CourseMapActivity): string {
    if (activity.href) return activity.href;
    if (activity.activityId) return buildActivityHref(activity.activityId);
    return "/dashboard/map";
}

function toTimelineItem(activity: CourseMapActivity, status: TimelineStatus): TimelineItem {
    return {
        activityId: activity.id,
        title: activity.title,
        type: activity.activityType,
        estMinutes: getCourseMapEstimatedMinutesForActivity(activity),
        status,
        href: buildItemHref(activity),
    };
}

interface CurrentWeekSnapshot {
    weekNumber: number;
    weekTitle: string;
    weekGoal?: string;
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    progress: { done: number; total: number };
    items: TimelineItem[];
    mode: VisibleMapMode;
    units: CourseMapUnit[];
    guidedProgress: CourseMapProgressState;
}

async function buildCurrentWeekSnapshot(
    user: { id: string; role?: string | null },
    mode?: VisibleMapMode
): Promise<CurrentWeekSnapshot | null> {
    const learnerMode = mode ?? (await getEffectiveLearnerMode(user.id, user));
    const { units: rawUnits } = await getVisibleMap(user, { mode: learnerMode });
    if (rawUnits.length === 0) return null;

    const units = await enrichCourseMapUnitsWithGrammarIds(rawUnits);
    const guidedProgress = await loadCourseMapProgressState(user.id, units);

    const currentMatch = findFirstIncompleteRequired(units, guidedProgress);

    const targetUnitNumber = currentMatch?.unitNumber ?? units[units.length - 1]?.unitNumber ?? 1;
    const targetWeekNumber =
        currentMatch?.weekNumber ??
        units[units.length - 1]?.levels[units[units.length - 1].levels.length - 1]?.levelNumber ??
        1;

    const currentUnit = units.find((u) => u.unitNumber === targetUnitNumber);
    const currentLevel = currentUnit?.levels.find((l) => l.levelNumber === targetWeekNumber);

    if (!currentUnit || !currentLevel) return null;

    let foundCurrent = false;
    const actionable = currentLevel.requiredActivities.filter((a) => a.status !== "planned");

    const items: TimelineItem[] = actionable.map((activity) => {
        if (!isMapActivityActionable(activity)) {
            return toTimelineItem(activity, "locked");
        }
        if (isMapActivityCompleted(activity, guidedProgress)) {
            return toTimelineItem(activity, "done");
        }
        if (!foundCurrent) {
            foundCurrent = true;
            return toTimelineItem(activity, "current");
        }
        return toTimelineItem(activity, "todo");
    });

    const done = items.filter((i) => i.status === "done").length;
    const total = items.filter((i) => i.status !== "locked").length;

    return {
        weekNumber: currentLevel.levelNumber,
        weekTitle: currentLevel.levelTitle,
        weekGoal: currentLevel.levelGoal,
        unitNumber: currentUnit.unitNumber,
        unitTitle: currentUnit.unitTitle,
        unitMonth: currentUnit.month,
        progress: { done, total },
        items,
        mode: learnerMode,
        units,
        guidedProgress,
    };
}

async function loadAssignmentByActivityId(userId: string): Promise<
    Record<string, { assignmentId: string }>
> {
    const enrollments = await withPrismaReadRetry(() =>
        prisma.classEnrollment.findMany({
            where: { studentId: userId, status: "active" },
            include: {
                class: {
                    include: {
                        assignments: {
                            select: {
                                id: true,
                                activityId: true,
                                activity: {
                                    select: {
                                        isReleased: true,
                                        content: true,
                                        deletedAt: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    );

    const assignmentByActivityId: Record<string, { assignmentId: string }> = {};
    for (const enrollment of enrollments) {
        for (const assignment of enrollment.class.assignments) {
            if (!isLearnerVisibleActivity(assignment.activity)) continue;
            if (!assignmentByActivityId[assignment.activityId]) {
                assignmentByActivityId[assignment.activityId] = { assignmentId: assignment.id };
            }
        }
    }
    return assignmentByActivityId;
}

export interface ThisWeekPanelData {
    weekNumber: number;
    weekTitle: string;
    weekGoal?: string;
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    progress: { done: number; total: number };
    items: TimelineItem[];
}

export async function getThisWeekPanelData(user: {
    id: string;
    role?: string | null;
}): Promise<ThisWeekPanelData | null> {
    const snapshot = await buildCurrentWeekSnapshot(user);
    if (!snapshot) return null;

    const { mode: _mode, units: _units, guidedProgress: _guidedProgress, ...data } = snapshot;
    return data;
}

export interface DashboardResumeData {
    weekNumber: number;
    weekTitle: string;
    weekGoal?: string;
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    showUnitMonths: boolean;
    progress: { done: number; total: number };
    currentItem: TimelineItem;
    continueHref: string;
    continueLabel: "Start here" | "Continue" | "Review map";
    mapHref: string;
    weekItems: TimelineItem[];
}

export async function getDashboardResumeData(user: {
    id: string;
    role?: string | null;
}): Promise<DashboardResumeData | null> {
    const snapshot = await buildCurrentWeekSnapshot(user);
    if (!snapshot) return null;

    const learnerMode = snapshot.mode;
    const assignmentByActivityId = await loadAssignmentByActivityId(user.id);
    const launch = resolveNextMapActivityLaunch(
        snapshot.units,
        snapshot.guidedProgress,
        assignmentByActivityId
    );

    const currentItem =
        snapshot.items.find((item) => item.status === "current") ??
        snapshot.items.find((item) => item.status === "todo") ??
        snapshot.items[snapshot.items.length - 1];

    if (!currentItem) return null;

    const continueHref = launch?.href ?? currentItem.href;
    const mapHref =
        launch != null
            ? `/dashboard/map?week=${launch.weekNumber}&focus=next#week-${launch.weekNumber}`
            : `/dashboard/map?week=${snapshot.weekNumber}#week-${snapshot.weekNumber}`;

    const continueLabel =
        snapshot.progress.done === 0
            ? "Start here"
            : snapshot.progress.done >= snapshot.progress.total
              ? "Review map"
              : "Continue";

    return {
        weekNumber: snapshot.weekNumber,
        weekTitle: snapshot.weekTitle,
        weekGoal: snapshot.weekGoal,
        unitNumber: snapshot.unitNumber,
        unitTitle: snapshot.unitTitle,
        unitMonth: snapshot.unitMonth,
        showUnitMonths: learnerMode === "classroom",
        progress: snapshot.progress,
        currentItem: {
            ...currentItem,
            title: formatNextUpActivityTitle(currentItem.title),
        },
        continueHref,
        continueLabel,
        mapHref,
        weekItems: snapshot.items
            .filter((item) => item.status !== "locked")
            .map((item) => ({
                ...item,
                title: formatNextUpActivityTitle(item.title),
            })),
    };
}
