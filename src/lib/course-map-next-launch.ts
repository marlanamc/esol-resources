import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { isLearnerVisibleActivity } from "@/lib/learner-visibility";
import {
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-progress";
import {
    enrichCourseMapUnitsWithGrammarIds,
    loadCourseMapProgressState,
} from "@/lib/course-map-progress.server";
import { getVisibleMap } from "@/lib/course-map";
import {
    findFirstIncompleteRequired,
    resolveNextMapActivityLaunch,
} from "@/lib/course-map-navigation";
import {
    formatNextUpActivityTitle,
    getCourseMapActivityIconEmoji,
    getCourseMapEstimatedMinutesForActivity,
} from "@/lib/course-map-hero";

export interface CourseMapNextLaunchHero {
    href: string;
    displayTitle: string;
    currentLabel: "Start here" | "Next up";
    unitNumber: number;
    estimatedMinutes: number;
    icon: string;
    weekNumber: number;
    activityId?: string;
}

export interface CourseMapNextLaunchResult {
    launch: ReturnType<typeof resolveNextMapActivityLaunch>;
    hero: CourseMapNextLaunchHero | null;
    mapReturnHref: string;
}

export async function getCourseMapNextLaunchForUser(user: {
    id: string;
    role?: string | null;
}): Promise<CourseMapNextLaunchResult | null> {
    const { units: rawUnits } = await getVisibleMap(user);
    if (rawUnits.length === 0) return null;

    const units = await enrichCourseMapUnitsWithGrammarIds(rawUnits);
    const guidedProgress = await loadCourseMapProgressState(user.id, units);

    const enrollments = await withPrismaReadRetry(() =>
        prisma.classEnrollment.findMany({
            where: { studentId: user.id, status: "active" },
            include: {
                class: {
                    include: {
                        assignments: {
                            select: {
                                id: true,
                                activityId: true,
                                activity: {
                                    select: {
                                        type: true,
                                        category: true,
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

    const assignmentByActivityId: Record<
        string,
        { assignmentId: string; type?: string; category?: string | null }
    > = {};
    for (const enrollment of enrollments) {
        for (const assignment of enrollment.class.assignments) {
            if (!isLearnerVisibleActivity(assignment.activity)) continue;
            if (!assignmentByActivityId[assignment.activityId]) {
                assignmentByActivityId[assignment.activityId] = {
                    assignmentId: assignment.id,
                    type: assignment.activity.type,
                    category: assignment.activity.category,
                };
            }
        }
    }

    const launch = resolveNextMapActivityLaunch(units, guidedProgress, assignmentByActivityId);
    const mapReturnHref =
        launch != null
            ? `/dashboard/map?week=${launch.weekNumber}&focus=next#week-${launch.weekNumber}`
            : "/dashboard/map";

    const requiredActivities = units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
    const completedRequired = requiredActivities.filter(
        (activity) =>
            isMapActivityActionable(activity) && isMapActivityCompleted(activity, guidedProgress)
    ).length;
    const currentLabel = completedRequired > 0 ? "Next up" : "Start here";

    const nextMatch = findFirstIncompleteRequired(units, guidedProgress);
    const hero: CourseMapNextLaunchHero | null =
        launch && nextMatch
            ? {
                  href: launch.href,
                  displayTitle: formatNextUpActivityTitle(nextMatch.activity.title),
                  currentLabel,
                  unitNumber: nextMatch.unitNumber,
                  estimatedMinutes: getCourseMapEstimatedMinutesForActivity(nextMatch.activity),
                  icon: getCourseMapActivityIconEmoji(
                      nextMatch.activity.activityType,
                      nextMatch.activity.activityId
                          ? assignmentByActivityId[nextMatch.activity.activityId]?.type
                          : undefined,
                      nextMatch.activity.activityId
                          ? assignmentByActivityId[nextMatch.activity.activityId]?.category
                          : undefined
                  ),
                  weekNumber: launch.weekNumber,
                  ...(launch.activityId ? { activityId: launch.activityId } : {}),
              }
            : null;

    return { launch, hero, mapReturnHref };
}
