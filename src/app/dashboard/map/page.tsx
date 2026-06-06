import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import Link from "next/link";
import { ClassCoursePath } from "@/components/dashboard/ClassCoursePath";
import { isLearnerVisibleActivity } from "@/lib/learner-visibility";
import { getVisibleMap, getCourseMapActivityIds } from "@/lib/course-map";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { canUseTeacherTools } from "@/lib/roles";

export const metadata = {
    title: "Course Map | Class Companion",
    description: "Your guided week-by-week learning path for the school year.",
};

export default async function MapPage() {
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

    const [{ units: courseMapUnits }, enrollments] = await Promise.all([
        getVisibleMap({ id: userId, role: session.user.role }),
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

    const guidedProgress = Object.fromEntries(
        guidedActivityIds.map((activityId) => [activityId, progressMap.get(activityId) ?? null])
    );

    // Compute overall progress stats
    const allLevels = courseMapUnits.flatMap((u) => u.levels);
    const allRequiredActivities = allLevels.flatMap((l) => l.requiredActivities);
    const totalLevels = allLevels.length;
    const completedLevels = allLevels.filter((level) => {
        if (level.requiredActivities.length === 0) return false;
        return level.requiredActivities.every(
            (a) => a.activityId && progressMap.get(a.activityId) === "completed"
        );
    }).length;
    const totalRequired = allRequiredActivities.length;
    const completedRequired = allRequiredActivities.filter(
        (a) => a.activityId && progressMap.get(a.activityId) === "completed"
    ).length;
    const overallPct = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

    const hasPath = courseMapUnits.length > 0 || coursePathAssignments.some((a) => a.sequenceNumber != null);

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-4 pb-28 px-4 max-w-lg lg:max-w-5xl xl:max-w-6xl">

                {/* Back link — mobile only */}
                <div className="mb-3 lg:hidden">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Dashboard
                    </Link>
                </div>

                {/* Mobile header */}
                <div className="mb-5 lg:hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-display font-bold text-text">Course Map</h1>
                            <p className="text-sm text-text-muted mt-0.5">Your guided path for the school year</p>
                        </div>
                        {totalLevels > 0 && (
                            <div className="shrink-0 flex flex-col items-end gap-0.5" title={`${completedRequired} of ${totalRequired} required activities completed`}>
                                <span
                                    className="rounded-full px-3 py-1 text-xs font-bold border"
                                    style={{
                                        background: completedLevels > 0 ? "color-mix(in srgb, var(--tone-grammar-chip-bg) 80%, transparent)" : "var(--surface-subtle)",
                                        color: completedLevels > 0 ? "var(--tone-grammar-accent, #b05740)" : "var(--text-muted)",
                                        borderColor: completedLevels > 0 ? "color-mix(in srgb, var(--tone-grammar-accent, #b05740) 25%, transparent)" : "var(--border-subtle)",
                                    }}
                                >
                                    {completedLevels > 0 ? "🏆 " : ""}{completedLevels} / {totalLevels} levels
                                </span>
                                {overallPct > 0 && <span className="text-[10px] text-text-muted font-medium">{overallPct}% activities done</span>}
                            </div>
                        )}
                    </div>
                    {totalRequired > 0 && overallPct > 0 && (
                        <div className="mt-3 relative h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
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
                    )}
                </div>

                {/* Desktop two-column layout */}
                <div className="hidden lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] lg:gap-8 lg:items-start lg:pt-2">

                    {/* Sticky left sidebar */}
                    <aside className="sticky top-6 space-y-5">
                        <div>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors rounded-lg mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Dashboard
                            </Link>
                            <h1 className="text-3xl font-display font-bold text-text leading-tight">Course Map</h1>
                            <p className="text-sm text-text-muted mt-1">Your guided path for the school year</p>
                        </div>

                        {/* Progress ring + stats */}
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
                                            <span className="font-normal text-text-muted text-sm">/ {totalLevels} levels</span>
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5">{completedRequired} of {totalRequired} activities done</p>
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

                        {/* Unit index */}
                        {courseMapUnits.length > 0 && (
                            <div className="dashboard-panel rounded-2xl p-4 space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted mb-2 px-1">Units</p>
                                {courseMapUnits.map((unit) => {
                                    const unitRequired = unit.levels.flatMap((l) => l.requiredActivities);
                                    const unitDone = unitRequired.filter((a) => a.activityId && guidedProgress[a.activityId] === "completed").length;
                                    const isUnitDone = unitDone === unitRequired.length && unitRequired.length > 0;
                                    return (
                                        <a
                                            key={unit.unitNumber}
                                            href={`#unit-${unit.unitNumber}`}
                                            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs text-text-muted hover:text-text hover:bg-surface-subtle transition-colors group"
                                        >
                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                                                    isUnitDone
                                                        ? "border-[var(--primary,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)] text-[var(--primary,#b05740)]"
                                                        : "border-[var(--border-subtle,#ddd6ca)] text-text-muted"
                                                }`}
                                            >
                                                {isUnitDone ? "✓" : unit.unitNumber}
                                            </span>
                                            <span className="flex-1 leading-tight font-medium group-hover:text-text truncate">
                                                {unit.unitTitle}
                                            </span>
                                            <span className="text-[10px] tabular-nums shrink-0">{unitDone}/{unitRequired.length}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {/* Practice library link */}
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
                            />
                        ) : (
                            <div className="dashboard-panel rounded-2xl p-8 text-center">
                                <p className="text-3xl mb-3">🗺️</p>
                                <p className="text-sm font-semibold text-text mb-1">No path set up yet</p>
                                <p className="text-xs text-text-muted">Your teacher will add your course path here soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden">
                    {hasPath ? (
                        <ClassCoursePath
                            assignments={coursePathAssignments}
                            guidedUnits={courseMapUnits}
                            guidedAssignments={guidedAssignments}
                            guidedProgress={guidedProgress}
                        />
                    ) : (
                        <div className="dashboard-panel rounded-2xl p-6 text-center">
                            <p className="text-2xl mb-3">🗺️</p>
                            <p className="text-sm font-semibold text-text mb-1">No path set up yet</p>
                            <p className="text-xs text-text-muted">Your teacher will add your course path here soon.</p>
                        </div>
                    )}
                    <div className="mt-6">
                        <Link
                            href="/dashboard/activities"
                            className="flex items-center justify-between w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold text-text hover:bg-surface-subtle transition-colors"
                            style={{ borderColor: "var(--border-subtle)" }}
                        >
                            <span>Practice Library / Extra Practice</span>
                            <span className="text-text-muted">→</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
