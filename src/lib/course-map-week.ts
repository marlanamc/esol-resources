import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
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
import {
    buildMapActivityHref,
    findFirstIncompleteRequired,
    resolveWeekActivityLaunch,
} from "@/lib/course-map-navigation";
import {
    resolveCurrentWeek,
    visibleWeekNumbers,
} from "@/lib/course-map-current-week";
import {
    formatNextUpActivityTitle,
    getCourseMapEstimatedMinutesForActivity,
} from "@/lib/course-map-hero";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import { getEffectiveLearnerMode } from "@/lib/learner-preview";
import type { TimelineItem, TimelineStatus } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity, CourseMapUnit } from "@/lib/course-map";

function buildItemHref(activity: CourseMapActivity): string {
    return buildMapActivityHref(activity) ?? "/dashboard/map";
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
    options?: { mode?: VisibleMapMode; now?: Date }
): Promise<CurrentWeekSnapshot | null> {
    const learnerMode = options?.mode ?? (await getEffectiveLearnerMode(user.id, user));
    const { units: rawUnits } = await getVisibleMap(user, { mode: learnerMode });
    if (rawUnits.length === 0) return null;

    const units = await enrichCourseMapUnitsWithGrammarIds(rawUnits);
    const guidedProgress = await loadCourseMapProgressState(user.id, units);

    // Classroom learners follow the school calendar; independent learners keep
    // their progress-based week. resolveCurrentWeek owns that choice.
    const progressMatch = findFirstIncompleteRequired(units, guidedProgress);
    const resolved = resolveCurrentWeek({
        mode: learnerMode,
        visibleWeeks: visibleWeekNumbers(units),
        progressWeek: progressMatch?.weekNumber ?? null,
        ...(options?.now ? { now: options.now } : {}),
    });
    if (!resolved) return null;

    const targetWeekNumber = resolved.weekNumber;
    const currentUnit = units.find((u) =>
        u.levels.some((l) => l.levelNumber === targetWeekNumber)
    );
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
    continueLabel: "Start here" | "Continue" | "Review this week";
    mapHref: string;
    weekItems: TimelineItem[];
}

export async function getDashboardResumeData(
    user: { id: string; role?: string | null },
    options?: { now?: Date }
): Promise<DashboardResumeData | null> {
    const snapshot = await buildCurrentWeekSnapshot(user, options);
    if (!snapshot) return null;

    const learnerMode = snapshot.mode;
    const assignmentByActivityId = await loadAssignmentByActivityId(user.id);
    // Scoped to the week the calendar put us on, so the button never jumps the
    // learner into a different week than the one the card is titled with.
    const launch = resolveWeekActivityLaunch(
        snapshot.units,
        snapshot.guidedProgress,
        snapshot.weekNumber,
        assignmentByActivityId
    );

    const currentItem =
        snapshot.items.find((item) => item.status === "current") ??
        snapshot.items.find((item) => item.status === "todo") ??
        snapshot.items[snapshot.items.length - 1];

    if (!currentItem) return null;

    const continueHref = launch?.href ?? currentItem.href;
    const mapHref = `/dashboard/map?week=${snapshot.weekNumber}&focus=next#week-${snapshot.weekNumber}`;

    const weekComplete =
        snapshot.progress.total > 0 && snapshot.progress.done >= snapshot.progress.total;
    const continueLabel = weekComplete
        ? "Review this week"
        : snapshot.progress.done === 0
          ? "Start here"
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
            ...(launch?.isReview ? { status: "done" as const } : {}),
            title: formatNextUpActivityTitle(launch?.title ?? currentItem.title),
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
