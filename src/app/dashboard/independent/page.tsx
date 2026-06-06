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
import { IndependentDashboardClient } from "@/app/dashboard/independent/IndependentDashboardClient";
import { IndependentLeaderboardCard } from "@/components/dashboard/independent/IndependentLeaderboardCard";
import { buildIndependentLeaderboardUserWhere } from "@/lib/gamification/leaderboard-filter";
import {
    filterIndependentVisibleActivities,
    getIndependentRecommendationActivityIds,
    getIndependentRecommendationActivityTitles,
    getIndependentNewActivityCards,
    INDEPENDENT_NEW_RELEASE_WINDOW_MS,
} from "@/lib/independent-learning";
import { getWeeklyGoalProgress } from "@/lib/independent-progress";
import { DashboardResumeHero, ExploreCategoriesCarousel, AllActivitiesCategoriesPanel, MomentumCard, NewThisWeekSection, DashboardWelcomeHeader } from "@/components/dashboard";

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

    const [progressRows, submissions, independentLeaderboard, userPreferences, weeklySubmissions, independentLearnerCount] = await Promise.all([
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
        withPrismaReadRetry(() =>
            prisma.userPreferences.findUnique({
                where: { userId },
                select: {
                    weeklyActivityGoal: true,
                    weeklyGoalStartDay: true,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.submission.findMany({
                where: {
                    userId,
                    status: { in: ["submitted", "graded"] },
                    completedAt: { not: null },
                },
                select: { completedAt: true },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: buildIndependentLeaderboardUserWhere(),
            })
        ),
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
        progressRows: [],
    });

    const studentEntry = independentLeaderboard.find((entry) => entry.id === userId);
    const studentLeaderboardRank = studentEntry?.rank ?? null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-2 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1800px]">
                <AdminViewSwitcher user={{ id: userId, role: session.user.role }} currentView="independent" />
                <div className="dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-6 p-0 md:grid-cols-12 md:p-6 lg:p-8 md:items-start">
                    <div className="md:col-span-8 lg:col-span-9 min-w-0 space-y-6 sm:space-y-8">
                        <div className="hidden lg:block">
                            <DashboardWelcomeHeader
                                userName={session.user?.name?.trim() || "there"}
                                mode="independent"
                                nameEmoji={studentLeaderboardMedal ? (
                                    <span aria-label={`Rank ${studentLeaderboardRank}`}>{studentLeaderboardMedal}</span>
                                ) : undefined}
                                streak={userStats?.currentStreak ?? 0}
                                weeklyCompleted={weeklyGoalProgress.completed}
                                weeklyGoal={weeklyGoalProgress.goal}
                                leaderboardRank={studentLeaderboardRank}
                            />
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

                        <AllActivitiesCategoriesPanel />
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

                            <IndependentDashboardClient
                                initialGoal={weeklyGoal}
                                weeklyGoalProgress={weeklyGoalProgress}
                            />

                            {studentLeaderboardRank ? (
                                <IndependentLeaderboardCard
                                    rank={studentLeaderboardRank}
                                    learnerCount={independentLearnerCount}
                                />
                            ) : null}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
