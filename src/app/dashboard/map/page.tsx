import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import Link from "next/link";
import { ClassCoursePath } from "@/components/dashboard/ClassCoursePath";
import { isLearnerVisibleActivity } from "@/lib/learner-visibility";
import { getVisibleMap, getCourseMapActivityIds } from "@/lib/course-map";
import {
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-progress";
import {
    enrichCourseMapUnitsWithGrammarIds,
    loadCourseMapProgressState,
} from "@/lib/course-map-progress.server";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { canUseTeacherTools } from "@/lib/roles";
import { CourseMapJumpToWeek } from "@/components/dashboard/CourseMapJumpToWeek";
import { CourseMapMobileWayfinding } from "@/components/dashboard/CourseMapMobileWayfinding";
import { CourseMapUnitNav } from "@/components/dashboard/CourseMapUnitNav";
import {
    buildMapWeekProgress,
    findFirstIncompleteRequired,
    parseMapWeekParam,
    resolveCurrentMapWeek,
    resolveNextMapActivityLaunch,
} from "@/lib/course-map-navigation";
import {
    formatNextUpActivityTitle,
    getCourseMapActivityIconEmoji,
} from "@/lib/course-map-hero";
import { getEffectiveLearnerMode } from "@/lib/learner-preview";

export const metadata = {
    title: "Course Map | Class Companion",
    description: "Your guided learning path through the course.",
};

function formatActivityTypeLabel(
    activityType: string,
    assignmentType?: string,
    category?: string | null,
): string {
    const c = (category || "").toLowerCase();
    const t = (assignmentType || activityType || "").toLowerCase();
    if (c === "vocabulary" || t === "vocabulary") return "Vocab";
    if (t === "guide") return "Grammar";
    if (t === "game") return "Game";
    if (t === "quiz") return "Quiz";
    if (t === "speaking") return "Speaking";
    if (t === "writing") return "Writing";
    if (t === "pronunciation") return "Pronunciation";
    if (t === "review") return "Review";
    if (t === "assessment") return "Check-in";
    if (t === "catch-up") return "Catch up";
    return "Activity";
}

export default async function MapPage({
    searchParams,
}: {
    searchParams: Promise<{ week?: string; focus?: string }>;
}) {
    const params = await searchParams;
    const initialWeek = parseMapWeekParam(params.week);
    const focusNextActivity = params.focus === "next";
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    const adminStudentMode = await isAdminInStudentMode(session.user);
    if (
        session.user.role !== "student" &&
        !adminStudentMode &&
        !canUseTeacherTools(session.user)
    ) {
        redirect("/dashboard");
    }

    const userId = session.user.id;

    const effectiveLearnerMode = await getEffectiveLearnerMode(userId, session.user);
    const showUnitMonths = effectiveLearnerMode === "classroom";

    const [{ units: rawCourseMapUnits }, enrollments] = await Promise.all([
        getVisibleMap(
            { id: userId, role: session.user.role },
            { mode: effectiveLearnerMode }
        ),
        withPrismaReadRetry(() =>
            prisma.classEnrollment.findMany({
                where: { studentId: userId, status: "active" },
                include: {
                    class: {
                        include: {
                            assignments: {
                                select: {
                                    id: true,
                                    title: true,
                                    activityId: true,
                                    classId: true,
                                    isFeatured: true,
                                    sequenceNumber: true,
                                    unitLabel: true,
                                    activity: {
                                        select: {
                                            id: true,
                                            title: true,
                                            type: true,
                                            category: true,
                                            isReleased: true,
                                            content: true,
                                        },
                                    },
                                },
                                orderBy: [{ sequenceNumber: "asc" }, { createdAt: "asc" }],
                            },
                        },
                    },
                },
            })
        ),
    ]);

    const courseMapUnits = await enrichCourseMapUnitsWithGrammarIds(rawCourseMapUnits);

    const allAssignments = enrollments.flatMap((e) =>
        e.class.assignments.filter((a) => isLearnerVisibleActivity(a.activity))
    );

    const guidedActivityIds = getCourseMapActivityIds(courseMapUnits);
    const pathActivityIds = [...new Set([
        ...guidedActivityIds,
        ...allAssignments
            .filter((a) => a.sequenceNumber != null)
            .map((a) => a.activityId),
    ])];

    const guidedProgress = await loadCourseMapProgressState(userId, courseMapUnits);

    const progressRows = pathActivityIds.length === 0
        ? []
        : await withPrismaReadRetry(() =>
            prisma.activityProgress.findMany({
                where: { userId, activityId: { in: pathActivityIds } },
                select: { activityId: true, status: true },
            })
        );

    const progressMap = new Map(progressRows.map((r) => [r.activityId, r.status]));
    const assignmentByActivityId = new Map<string, typeof allAssignments[number]>();
    for (const assignment of allAssignments) {
        if (!assignmentByActivityId.has(assignment.activityId)) {
            assignmentByActivityId.set(assignment.activityId, assignment);
        }
    }

    const coursePathAssignments = allAssignments.map((a) => {
        const status = progressMap.get(a.activityId);
        return {
            id: a.id,
            activityId: a.activityId,
            title: a.title,
            sequenceNumber: a.sequenceNumber,
            unitLabel: a.unitLabel,
            isCompleted: status === "completed",
            isInProgress: status === "in_progress",
            activity: {
                title: a.activity.title,
                type: a.activity.type,
                category: a.activity.category ?? null,
            },
        };
    });

    const guidedAssignments = Object.fromEntries(
        guidedActivityIds
            .map((activityId) => {
                const assignment = assignmentByActivityId.get(activityId);
                if (!assignment) return null;
                return [
                    activityId,
                    {
                        assignmentId: assignment.id,
                        title: assignment.title,
                        activityTitle: assignment.activity.title,
                        type: assignment.activity.type,
                        category: assignment.activity.category ?? null,
                    },
                ] as const;
            })
            .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    );

    // Compute overall progress stats
    const allLevels = courseMapUnits.flatMap((u) => u.levels);
    const allRequiredActivities = allLevels.flatMap((l) => l.requiredActivities);
    const totalLevels = allLevels.length;
    const completedLevels = allLevels.filter((level) => {
        const actionableRequired = level.requiredActivities.filter(isMapActivityActionable);
        if (actionableRequired.length === 0) return false;
        return actionableRequired.every((activity) =>
            isMapActivityCompleted(activity, guidedProgress)
        );
    }).length;
    const totalRequired = allRequiredActivities.filter(isMapActivityActionable).length;
    const completedRequired = allRequiredActivities.filter((activity) =>
        isMapActivityActionable(activity) &&
        isMapActivityCompleted(activity, guidedProgress)
    ).length;
    const overallPct = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

    const hasPath = courseMapUnits.length > 0 || coursePathAssignments.some((a) => a.sequenceNumber != null);
    const currentWeekMeta = hasPath ? resolveCurrentMapWeek(courseMapUnits, guidedProgress) : null;
    const unitProgress = courseMapUnits.map((unit) => {
        const unitRequired = unit.levels.flatMap((level) => level.requiredActivities);
        const actionableRequired = unitRequired.filter(isMapActivityActionable);
        const done = actionableRequired.filter((activity) =>
            isMapActivityCompleted(activity, guidedProgress)
        ).length;
        const total = actionableRequired.length;
        return {
            unitNumber: unit.unitNumber,
            done,
            total,
            isDone: total > 0 && done === total,
        };
    });
    const weekProgress = buildMapWeekProgress(courseMapUnits, guidedProgress);

    const nextLaunch = hasPath
        ? resolveNextMapActivityLaunch(courseMapUnits, guidedProgress, guidedAssignments)
        : null;
    const nextIncomplete = hasPath ? findFirstIncompleteRequired(courseMapUnits, guidedProgress) : null;
    const currentActivity = nextLaunch && nextIncomplete
        ? (() => {
              const activity = nextIncomplete.activity;
              const assignment = activity.activityId ? guidedAssignments[activity.activityId] : undefined;
              return {
                  title: formatNextUpActivityTitle(activity.title),
                  href: nextLaunch.href,
                  iconEmoji: getCourseMapActivityIconEmoji(
                      activity.activityType,
                      assignment?.type,
                      assignment?.category ?? null
                  ),
                  typeLabel: formatActivityTypeLabel(activity.activityType, assignment?.type, assignment?.category),
              };
          })()
        : null;

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto scroll-smooth pt-2 pb-28 px-4 max-w-lg lg:max-w-5xl xl:max-w-6xl lg:pt-4">

                {/* Desktop two-column layout */}
                <div className="hidden lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] lg:gap-8 lg:items-start lg:pt-2">

                    {/* Sticky left sidebar — full unit list; stays pinned while scrolling the path */}
                    <aside className="sticky top-[5.5rem] z-10 w-full self-start space-y-5">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-text leading-tight">Course Map</h1>
                            <p className="text-sm text-text-muted mt-1">
                                {showUnitMonths ? "Your next lesson and weekly path" : "Your next lesson and course path"}
                            </p>
                        </div>

                        {totalLevels > 0 && (
                            <div className="dashboard-panel rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0 w-16 h-16" title={`${completedRequired} of ${totalRequired} activities done`}>
                                        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90" aria-hidden>
                                            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
                                            <circle
                                                cx="28" cy="28" r="22" fill="none"
                                                stroke={overallPct >= 100 ? "#e8933a" : "var(--primary, #b05740)"}
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 22}`}
                                                strokeDashoffset={`${2 * Math.PI * 22 * (1 - overallPct / 100)}`}
                                                style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text">
                                            {overallPct}%
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-bold text-text leading-tight">
                                            {completedLevels > 0 ? "🏆 " : ""}{completedLevels}{" "}
                                            <span className="font-normal text-text-muted text-sm">/ {totalLevels} Levels</span>
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5">{overallPct}% Complete</p>
                                    </div>
                                </div>
                                <div className="relative h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
                                        style={{
                                            width: `${overallPct}%`,
                                            background: overallPct >= 100
                                                ? "linear-gradient(90deg, #b8442a 0%, #e8933a 70%, #f5c842 100%)"
                                                : "linear-gradient(90deg, var(--primary, #b05740) 0%, #c98b3a 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {hasPath && currentWeekMeta ? (
                            <CourseMapJumpToWeek
                                currentWeek={currentWeekMeta}
                                variant="sidebar"
                                showUnitMonths={showUnitMonths}
                            />
                        ) : null}

                        {courseMapUnits.length > 0 ? (
                            <CourseMapUnitNav
                                units={courseMapUnits}
                                unitProgress={unitProgress}
                                weekProgress={weekProgress}
                                currentWeekNumber={currentWeekMeta?.weekNumber ?? null}
                                variant="sidebar"
                                showUnitMonths={showUnitMonths}
                            />
                        ) : null}

                        <Link
                            href="/dashboard/activities"
                            className="flex items-center justify-between w-full rounded-2xl border px-4 py-3 text-sm font-semibold text-text hover:bg-surface-subtle transition-colors"
                            style={{ borderColor: "var(--border-subtle)" }}
                        >
                            <span>Practice Library</span>
                            <span className="text-text-muted">→</span>
                        </Link>
                    </aside>

                    {/* Right column */}
                    <div className="min-w-0">
                        {hasPath ? (
                            <ClassCoursePath
                                assignments={coursePathAssignments}
                                guidedUnits={courseMapUnits}
                                guidedAssignments={guidedAssignments}
                                guidedProgress={guidedProgress}
                                desktopLayout
                                initialWeek={initialWeek}
                                focusNextActivity={focusNextActivity}
                                showUnitMonths={showUnitMonths}
                            />
                        ) : (
                            <div className="dashboard-panel rounded-2xl p-8 text-center">
                                <p className="text-3xl mb-3">🗺️</p>
                                <p className="text-sm font-semibold text-text mb-1">No path set up yet</p>
                                <p className="text-xs text-text-muted">
                                    {showUnitMonths
                                        ? "Your teacher will add your course path here soon."
                                        : "Course content will appear here when it is published."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile layout — hero-first */}
                <div className="lg:hidden">
                    {hasPath ? (
                        <ClassCoursePath
                            assignments={coursePathAssignments}
                            guidedUnits={courseMapUnits}
                            guidedAssignments={guidedAssignments}
                            guidedProgress={guidedProgress}
                            initialWeek={initialWeek}
                            focusNextActivity={focusNextActivity}
                            showUnitMonths={showUnitMonths}
                            mobileWayfinding={
                                courseMapUnits.length > 0 ? (
                                    <CourseMapMobileWayfinding
                                        units={courseMapUnits}
                                        weekProgress={weekProgress}
                                        currentWeek={currentWeekMeta}
                                        overallPct={overallPct}
                                        completedLevels={completedLevels}
                                        totalLevels={totalLevels}
                                        showUnitMonths={showUnitMonths}
                                        currentActivity={currentActivity}
                                    />
                                ) : null
                            }
                        />
                    ) : (
                        <div className="dashboard-panel rounded-2xl p-6 text-center">
                            <p className="text-2xl mb-3">🗺️</p>
                            <p className="text-sm font-semibold text-text mb-1">No path set up yet</p>
                            <p className="text-xs text-text-muted">
                                {showUnitMonths
                                    ? "Your teacher will add your course path here soon."
                                    : "Course content will appear here when it is published."}
                            </p>
                        </div>
                    )}
                    <div className="mt-6">
                        <Link
                            href="/dashboard/activities"
                            className="flex items-center justify-between w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold text-text hover:bg-surface-subtle transition-colors"
                            style={{ borderColor: "var(--border-subtle)" }}
                        >
                            <span>Practice Library</span>
                            <span className="text-text-muted">→</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
