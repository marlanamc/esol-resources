import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification";
import { buildCalendarWeekActivity, getCalendarWeekStart } from "@/lib/gamification/calendar-week";
import { logger } from "@/lib/logger";
import { getLearnerState } from "@/lib/learner-mode";
import { canUseTeacherTools } from "@/lib/roles";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { persistLearnerPreview } from "@/lib/learner-preview";
import { AdminViewSwitcher } from "@/components/dashboard/AdminViewSwitcher";
import { ArrowRight, BookOpen } from "lucide-react";
import {
    filterIndependentVisibleActivities,
    getIndependentRecommendationActivityIds,
    getIndependentRecommendationActivityTitles,
    getIndependentNewActivityCards,
    INDEPENDENT_NEW_RELEASE_WINDOW_MS,
} from "@/lib/independent-learning";
import {
    getIndependentProgressStats,
} from "@/lib/independent-progress";
import { DashboardResumeHero, ExploreCategoriesCarousel, MomentumCard, NewThisWeekSection } from "@/components/dashboard";

export default async function IndependentDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const isAdminPreview = canUseTeacherTools(session.user)
        ? await isAdminInStudentMode(session.user)
        : false;

    if (canUseTeacherTools(session.user) && !isAdminPreview) {
        redirect("/dashboard");
    }

    const userId = session.user.id;

    void trackLogin(userId).catch((err) => {
        logger.warn("Failed to track login for independent dashboard streak", { userId, error: String(err) });
    });

    const calendarWeekStart = getCalendarWeekStart();

    // Fetch learner state and user stats
    const [learnerState, userStats, recentLedgerEntries] = await Promise.all([
        withPrismaReadRetry(() => getLearnerState(prisma, userId)),
        withPrismaReadRetry(() =>
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    currentStreak: true,
                    longestStreak: true,
                    points: true,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.pointsLedger.findMany({
                where: { userId, createdAt: { gte: calendarWeekStart } },
                select: { createdAt: true },
            })
        ),
    ]);

    const initialSevenDayActivity = buildCalendarWeekActivity(recentLedgerEntries);

    const learnerMode = learnerState.mode;

    if (!isAdminPreview && learnerMode !== "independent") {
        redirect("/dashboard");
    }

    await persistLearnerPreview(userId, "independent");

    const sequenceActivityIds = getIndependentRecommendationActivityIds();
    const sequenceActivityTitles = getIndependentRecommendationActivityTitles();

    const recentReleaseCutoff = new Date();
    recentReleaseCutoff.setTime(recentReleaseCutoff.getTime() - INDEPENDENT_NEW_RELEASE_WINDOW_MS);

    const [sequenceActivitiesRaw, recentActivitiesRaw] = await Promise.all([
        timedQuery(
        {
            route: "/dashboard/independent",
            queryLabel: "activity.findMany.independentSequence",
            userRole: session.user.role,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.activity.findMany({
                    where: {
                        OR: [
                            { id: { in: sequenceActivityIds } },
                            { title: { in: sequenceActivityTitles } },
                        ],
                        deletedAt: null,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        isReleased: true,
                                        content: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                })
        ),
        (result) => result.length
        ),
        timedQuery(
            {
                route: "/dashboard/independent",
                queryLabel: "activity.findMany.independentRecentReleases",
                userRole: session.user.role,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.activity.findMany({
                        where: {
                            deletedAt: null,
                            OR: [
                                { updatedAt: { gte: recentReleaseCutoff } },
                                { createdAt: { gte: recentReleaseCutoff } },
                            ],
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            type: true,
                            category: true,
                            isReleased: true,
                            content: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })
                ),
            (result) => result.length
        ),
    ]);
    const sequenceActivities = filterIndependentVisibleActivities(sequenceActivitiesRaw);
    const recentActivities = filterIndependentVisibleActivities(recentActivitiesRaw);

    const [progressRows, submissions, independentLeaderboard] = await Promise.all([
        sequenceActivityIds.length === 0
            ? []
            : timedQuery(
                {
                    route: "/dashboard/independent",
                    queryLabel: "activityProgress.findMany.independentDashboard",
                    userRole: session.user.role,
                },
                () =>
                    withPrismaReadRetry(() =>
                        prisma.activityProgress.findMany({
                            where: {
                                userId,
                                activityId: { in: sequenceActivityIds },
                            },
                            select: {
                                activityId: true,
                                progress: true,
                                status: true,
                                categoryData: true,
                                updatedAt: true,
                            },
                            orderBy: { updatedAt: "desc" },
                        })
                    ),
                (result) => result.length
            ),
        sequenceActivityIds.length === 0
            ? []
            : timedQuery(
                {
                    route: "/dashboard/independent",
                    queryLabel: "submission.findMany.independentDashboard",
                    userRole: session.user.role,
                },
                () =>
                    withPrismaReadRetry(() =>
                        prisma.submission.findMany({
                            where: {
                                userId,
                                activityId: { in: sequenceActivityIds },
                                status: { in: ["submitted", "graded"] },
                            },
                            select: {
                                activityId: true,
                                score: true,
                                completedAt: true,
                            },
                        })
                    ),
                (result) => result.length
                ),
        getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true }),
    ]);

    // Deduplicate progress rows by activityId - keep the best record (highest progress or completed)
    // Multiple rows can exist per activity (e.g. global vs assignment-scoped for vocab)
    const progressRowsDeduped = (() => {
        const byActivity = new Map<string, (typeof progressRows)[number]>();
        for (const row of progressRows) {
            const existing = byActivity.get(row.activityId);
            const rowScore = row.status === "completed" ? 100 : row.progress;
            const existingScore = existing
                ? (existing.status === "completed" ? 100 : existing.progress)
                : -1;
            if (!existing || rowScore > existingScore) {
                byActivity.set(row.activityId, row);
            }
        }
        return Array.from(byActivity.values());
    })();

    // Calculate progress stats for roadmap
    const progressStats = getIndependentProgressStats({
        activities: sequenceActivities.map(a => ({
            id: a.id,
            title: a.title,
            type: a.type,
            category: a.category,
        })),
        progressRows: progressRowsDeduped.map(p => ({
            activityId: p.activityId,
            progress: p.progress,
            status: p.status,
            updatedAt: p.updatedAt,
        })),
        submissions: submissions.map(s => ({
            activityId: s.activityId,
            score: s.score,
            completedAt: s.completedAt,
        })),
    });

    const newThisWeekItems = getIndependentNewActivityCards({
        activities: recentActivities,
        progressRows: progressRowsDeduped,
        submissions,
        limit: 6,
    });

    const studentEntry = independentLeaderboard.find((entry) => entry.id === userId);
    const studentLeaderboardRank = studentEntry && studentEntry.rank <= 3 ? studentEntry.rank : null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;
    const currentStage = progressStats.stageProgress.find((stage) => stage.stage === progressStats.currentStage);
    const currentStageLabel = currentStage?.label ?? "Current Unit";

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-2 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1800px]">
                <AdminViewSwitcher user={{ id: userId, role: session.user.role }} currentView="independent" />
                <div className="dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-6 p-0 md:grid-cols-12 md:p-6 lg:p-8 md:items-start">
                    <div className="md:col-span-8 lg:col-span-9 min-w-0 space-y-6 sm:space-y-8">
                        <div className="hidden lg:block">
                            <div className="pt-2 pb-1">
                                <h1
                                    className="font-display font-bold text-text leading-tight tracking-tight flex items-baseline gap-x-2.5 gap-y-1 flex-wrap"
                                    style={{ textWrap: "balance" } as React.CSSProperties}
                                >
                                    <span className="text-xl text-text-muted font-medium">Welcome back,</span>
                                    <span className="text-[2rem] text-primary relative inline-block leading-none">
                                        {session.user?.name?.trim() || "there"}
                                        <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-[#88A392]/40 -z-10 rounded-sm -rotate-1" />
                                    </span>
                                    {studentLeaderboardMedal ? (
                                        <span className="inline-flex text-2xl leading-none" aria-label={`Rank ${studentLeaderboardRank}`}>
                                            {studentLeaderboardMedal}
                                        </span>
                                    ) : null}
                                </h1>
                                <p className="mt-1 text-sm font-medium text-text-muted/90">
                                    You&apos;re making great progress.
                                </p>
                            </div>
                        </div>

                        <DashboardResumeHero user={{ id: userId, role: session.user.role }} />

                        {/* Momentum — mobile only (< md) */}
                        <div className="md:hidden">
                            <MomentumCard
                                initialStreak={userStats?.currentStreak ?? 0}
                                initialLongestStreak={userStats?.longestStreak ?? 0}
                                initialSevenDayActivity={initialSevenDayActivity}
                                initialTotalPoints={userStats?.points ?? 0}
                            />
                        </div>

                        <NewThisWeekSection
                            items={newThisWeekItems}
                            subtitle={null}
                        />

                        <ExploreCategoriesCarousel />

                    </div>

                    {/* Sidebar */}
                    <aside className="hidden md:block md:col-span-4 lg:col-span-3">
                        <div className="sticky top-4 space-y-4">
                            <MomentumCard
                                variant="sidebar"
                                initialStreak={userStats?.currentStreak ?? 0}
                                initialLongestStreak={userStats?.longestStreak ?? 0}
                                initialSevenDayActivity={initialSevenDayActivity}
                                initialTotalPoints={userStats?.points ?? 0}
                            />

                            <section className="dashboard-panel rounded-2xl p-5" aria-label="Continue your journey">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <BookOpen size={19} aria-hidden />
                                    </span>
                                    <h2 className="font-display text-lg font-bold text-text">
                                        Continue Your Journey
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-text-muted">
                                            Current Unit
                                        </p>
                                        <p className="mt-1 text-xl font-bold leading-tight text-text">
                                            {currentStageLabel}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--dashboard-border)" }}>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                                                Level
                                            </p>
                                            <p className="mt-1 text-lg font-extrabold text-text">
                                                {progressStats.currentStage} of {progressStats.stageProgress.length}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--dashboard-border)" }}>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                                                Progress
                                            </p>
                                            <p className="mt-1 text-lg font-extrabold text-text">
                                                {progressStats.percentComplete}%
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="h-2 overflow-hidden rounded-full"
                                        style={{ background: "var(--checklist-track-bg)" }}
                                    >
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${progressStats.percentComplete}%` }}
                                        />
                                    </div>

                                    <p className="text-xs font-semibold text-text-muted">
                                        {progressStats.completedActivities} of {progressStats.totalActivities} activities
                                    </p>

                                    <Link
                                        href="/dashboard/map"
                                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-[color:var(--text-on-accent)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2"
                                    >
                                        Continue Journey
                                        <ArrowRight size={17} aria-hidden />
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
