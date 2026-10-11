import { SectionUnavailable } from "@/components/dashboard/SectionUnavailable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification/gamification";
import { buildCalendarWeekActivity, getCalendarWeekStart } from "@/lib/gamification/calendar-week";
import { logger } from "@/lib/shared/logger";
import { getLearnerState } from "@/lib/learner-mode";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { persistLearnerPreview } from "@/lib/learner-preview";
import { AdminViewSwitcher } from "@/components/dashboard/AdminViewSwitcher";
import { IndependentDashboardClient } from "@/app/dashboard/independent/IndependentDashboardClient";
import { IndependentLeaderboardCard } from "@/components/dashboard/independent/IndependentLeaderboardCard";
import { IndependentWelcomeCard } from "@/components/dashboard/independent/IndependentWelcomeCard";
import { buildIndependentLeaderboardUserWhere } from "@/lib/gamification/leaderboard-filter";
import {
    filterIndependentVisibleActivities,
    getIndependentNewActivityCards,
} from "@/lib/independent-learning";
import { getWeeklyGoalProgress } from "@/lib/independent-progress";
import { DashboardResumeHero, ExploreCategoriesCarousel, AllActivitiesCategoriesPanel, MomentumCard, NewThisWeekSection, DashboardWelcomeHeader, PinnedDailyHabitRow, ThisWeekPanel } from "@/components/dashboard";
import { getDailyVocabHabitForUser } from "@/lib/daily-habits";

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
    const unavailable = new Set<string>();
    const unavailableSection = <T,>(title: string, fallback: T) => (error: unknown): T => {
        logger.error(`Independent dashboard: ${title} unavailable`, error);
        unavailable.add(title);
        return fallback;
    };

    // after() keeps the function alive until the login transaction commits (see dashboard/page.tsx).
    after(() =>
        trackLogin(userId).catch((err) => {
            logger.warn("Failed to track login for independent dashboard streak", { userId, error: String(err) });
        })
    );

    const calendarWeekStart = getCalendarWeekStart();

    // Fetch learner state and user stats
    const [learnerState, userStats, recentLedgerEntries] = await Promise.all([
        withPrismaReadRetry(() => getLearnerState(prisma, userId)).catch(unavailableSection("Your dashboard", null)),
        withPrismaReadRetry(() =>
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    currentStreak: true,
                    longestStreak: true,
                    points: true,
                    weeklyPoints: true,
                },
            })
        ).catch(unavailableSection("Points", null)),
        withPrismaReadRetry(() =>
            prisma.pointsLedger.findMany({
                where: { userId, createdAt: { gte: calendarWeekStart } },
                select: { createdAt: true, points: true },
            })
        ).catch(unavailableSection("Points", [])),
    ]);

    const initialSevenDayActivity = buildCalendarWeekActivity(recentLedgerEntries);

    if (!learnerState) return <main id="main-content" className="p-4"><SectionUnavailable title="Your dashboard" /></main>;
    const learnerMode = learnerState.mode;

    if (!isAdminPreview && learnerMode !== "independent") {
        redirect("/dashboard");
    }

    await persistLearnerPreview(userId, "independent").catch(unavailableSection("View preference", undefined));

    const recentActivitiesRaw = await timedQuery(
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
                        isFeaturedForIndependent: true,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        isReleased: true,
                        isFeaturedForIndependent: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                })
            ),
        (result) => result.length
    ).catch(unavailableSection("Featured activities", []));
    const recentActivities = filterIndependentVisibleActivities(recentActivitiesRaw);
    const recentActivityIds = recentActivities.map((activity) => activity.id);

    const [progressRows, submissions, independentLeaderboard, userPreferences, weeklySubmissions, weeklyProgressRows, independentLearnerCount] = await Promise.all([
        recentActivityIds.length === 0
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
                                activityId: { in: recentActivityIds },
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
            ).catch(unavailableSection("Activity progress", [])),
        recentActivityIds.length === 0
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
                                activityId: { in: recentActivityIds },
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
                ).catch(unavailableSection("Activity progress", [])),
        getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true }).catch(unavailableSection("Leaderboard", [])),
        withPrismaReadRetry(() =>
            prisma.userPreferences.findUnique({
                where: { userId },
                select: {
                    weeklyActivityGoal: true,
                    weeklyGoalStartDay: true,
                },
            })
        ).catch(unavailableSection("Weekly goal", null)),
        withPrismaReadRetry(() =>
            prisma.submission.findMany({
                where: {
                    userId,
                    status: { in: ["submitted", "graded"] },
                    completedAt: { not: null },
                },
                select: { activityId: true, completedAt: true },
            })
        ).catch(unavailableSection("Weekly goal", [])),
        withPrismaReadRetry(() =>
            prisma.activityProgress.findMany({
                where: {
                    userId,
                    status: "completed",
                    updatedAt: { gte: calendarWeekStart },
                },
                select: { activityId: true, status: true, updatedAt: true },
            })
        ).catch(unavailableSection("Weekly goal", [])),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: buildIndependentLeaderboardUserWhere(),
            })
        ).catch(unavailableSection("Leaderboard", 0)),
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

    const newThisWeekItems = getIndependentNewActivityCards({
        activities: recentActivities,
        progressRows: progressRowsDeduped,
        submissions,
        limit: 6,
    });

    const weeklyGoal = userPreferences?.weeklyActivityGoal ?? 3;
    const weeklyGoalStartDay = userPreferences?.weeklyGoalStartDay ?? 1;
    const weeklyGoalProgress = getWeeklyGoalProgress({
        weeklyGoal,
        startDay: weeklyGoalStartDay,
        submissions: weeklySubmissions,
        progressRows: weeklyProgressRows,
    });

    const studentEntry = independentLeaderboard.find((entry) => entry.id === userId);
    const studentLeaderboardRank = studentEntry?.rank ?? null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;
    const dailyVocabHabit = await getDailyVocabHabitForUser(prisma, userId).catch(unavailableSection("Daily vocabulary", null));

    return (
        <div className="min-h-dvh bg-bg">
            <main id="main-content" className="container mx-auto pt-3 md:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px] lg:pt-4">
                <AdminViewSwitcher user={{ id: userId, role: session.user.role }} currentView="independent" />

                {[...unavailable].map(title => <SectionUnavailable key={title} title={title} />)}
                {/* ── MOBILE + TABLET layout (< lg) ── */}
                <div className="lg:hidden dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-0 p-0 md:p-6">
                    <div className="min-w-0 space-y-5">
                        <IndependentWelcomeCard />
                        <ThisWeekPanel
                            user={{ id: userId, role: session.user.role }}
                            fallback={<DashboardResumeHero user={{ id: userId, role: session.user.role }} />}
                        />
                        {dailyVocabHabit ? (
                            <section aria-label="Daily vocab review">
                                <PinnedDailyHabitRow habit={dailyVocabHabit} compact ctaVariant="vocabulary" />
                            </section>
                        ) : null}
                    </div>
                </div>

                {/* ── DESKTOP layout (lg+) ── */}
                <div className="hidden lg:block">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_348px] gap-5 items-start">

                        {/* ── Left / Main column ── */}
                        <div className="min-w-0 space-y-3">
                            <DashboardWelcomeHeader
                                userName={session.user?.name?.trim() || "there"}
                                mode="independent"
                                nameEmoji={studentLeaderboardMedal ? (
                                    <span aria-label={`Rank ${studentLeaderboardRank}`}>{studentLeaderboardMedal}</span>
                                ) : undefined}
                            />

                            <IndependentWelcomeCard />

                            <DashboardResumeHero user={{ id: userId, role: session.user.role }} />

                            {dailyVocabHabit ? (
                                <section aria-label="Daily vocab review">
                                    <PinnedDailyHabitRow habit={dailyVocabHabit} compact ctaVariant="vocabulary" />
                                </section>
                            ) : null}

                            <NewThisWeekSection items={newThisWeekItems} subtitle={null} />

                            <ExploreCategoriesCarousel />

                            <AllActivitiesCategoriesPanel />
                        </div>

                        {/* ── Right sidebar ── */}
                        <aside className="space-y-3 sticky top-4">
                            <MomentumCard
                                variant="sidebar"
                                initialStreak={userStats?.currentStreak ?? 0}
                                initialLongestStreak={userStats?.longestStreak ?? 0}
                                initialSevenDayActivity={initialSevenDayActivity}
                                initialTotalPoints={unavailable.has("Points") ? undefined : userStats?.points}
                                initialWeeklyPoints={unavailable.has("Points") ? undefined : Math.max(0, recentLedgerEntries.reduce((sum, entry) => sum + entry.points, 0))}
                            />

                            {!unavailable.has("Weekly goal") && <IndependentDashboardClient
                                initialGoal={weeklyGoal}
                                weeklyGoalProgress={weeklyGoalProgress}
                            />}

                            {studentLeaderboardRank ? (
                                <IndependentLeaderboardCard
                                    rank={studentLeaderboardRank}
                                    learnerCount={independentLearnerCount}
                                />
                            ) : null}
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
