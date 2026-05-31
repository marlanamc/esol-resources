import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification";
import { logger } from "@/lib/logger";
import { resolveLearnerMode } from "@/lib/learner-mode";
import { getDailyVocabHabitForUser } from "@/lib/daily-habits";
import {
    getCurrentIndependentRecommendation,
    filterIndependentVisibleActivities,
    getIndependentRecommendationActivityIds,
    getIndependentRecommendationActivityTitles,
} from "@/lib/independent-learning";
import {
    getIndependentProgressStats,
    getWeeklyGoalProgress,
    analyzeWeakAreas,
} from "@/lib/independent-progress";
import { TodaysAssignments } from "@/components/dashboard";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { TrophyIcon, SparklesIcon, UsersIcon } from "@/components/icons/Icons";
import {
    LearningPathRoadmap,
    StreakDisplay,
    RecommendedReviewCard,
} from "@/components/dashboard/independent";
import { ExploreCategoriesCarousel, MomentumCard } from "@/components/dashboard";
import { IndependentDashboardClient } from "./IndependentDashboardClient";

export default async function IndependentDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === "teacher") {
        redirect("/dashboard");
    }

    const userId = session.user.id;

    void trackLogin(userId).catch((err) => {
        logger.warn("Failed to track login for independent dashboard streak", { userId, error: String(err) });
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch user preferences including new goal settings, enrollment count, and user stats
    const [preferencesResult, enrollmentCount, userStats, recentLedgerEntries] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.userPreferences.findUnique({
                where: { userId },
                select: {
                    learnerMode: true,
                    weeklyActivityGoal: true,
                    weeklyGoalStartDay: true,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.classEnrollment.count({
                where: { studentId: userId },
            })
        ),
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
                where: { userId, createdAt: { gte: sevenDaysAgo }, points: { gt: 0 } },
                select: { createdAt: true },
            })
        ),
    ]);

    const now = new Date();
    const activeDates = new Set(
        recentLedgerEntries.map((e: { createdAt: Date }) => {
            const d = new Date(e.createdAt);
            return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
        })
    );
    const initialSevenDayActivity: boolean[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return activeDates.has(`${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`);
    });

    // Use defaults if preferences don't exist
    const preferences = preferencesResult ?? {
        learnerMode: "independent",
        weeklyActivityGoal: 3,
        weeklyGoalStartDay: 1,
    };

    const learnerMode = resolveLearnerMode({
        storedMode: preferences.learnerMode,
        enrollmentCount,
    });

    if (learnerMode !== "independent") {
        redirect("/dashboard");
    }

    const sequenceActivityIds = getIndependentRecommendationActivityIds();
    const sequenceActivityTitles = getIndependentRecommendationActivityTitles();

    const sequenceActivitiesRaw = await timedQuery(
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
    );
    const sequenceActivities = filterIndependentVisibleActivities(sequenceActivitiesRaw);

    const [progressRows, submissions, independentLeaderboard, dailyVocabHabit] = await Promise.all([
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
        getDailyVocabHabitForUser(prisma, userId).catch((error) => {
            logger.warn("Failed to load daily vocab habit for independent dashboard", {
                userId,
                error: String(error),
            });
            return null;
        }),
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

    // Calculate weekly goal progress
    const weeklyGoalProgress = getWeeklyGoalProgress({
        weeklyGoal: preferences.weeklyActivityGoal ?? 3,
        startDay: preferences.weeklyGoalStartDay ?? 1,
        submissions: submissions.map(s => ({ completedAt: s.completedAt })),
        progressRows: progressRowsDeduped.map(p => ({ status: p.status, updatedAt: p.updatedAt })),
    });

    // Analyze weak areas for review suggestions
    const weakAreas = analyzeWeakAreas({
        activities: sequenceActivities.map(a => ({
            id: a.id,
            title: a.title,
            type: a.type,
            category: a.category,
        })),
        submissions: submissions.map(s => ({
            activityId: s.activityId,
            score: s.score,
            completedAt: s.completedAt,
        })),
        limit: 2,
    });

    const recommendedAssignments = getCurrentIndependentRecommendation({
        activities: sequenceActivities,
        progressRows: progressRowsDeduped,
        submissions,
    }).filter((assignment) => assignment.activityId !== "vocab-daily-review");

    const studentEntry = independentLeaderboard.find((entry) => entry.id === userId);
    const studentLeaderboardRank = studentEntry && studentEntry.rank <= 3 ? studentEntry.rank : null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-2 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1800px]">
                <div className="dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-6 overflow-x-hidden p-0 md:grid-cols-12 md:p-6 lg:p-8 md:items-start">
                    <div className="md:col-span-8 lg:col-span-9 min-w-0 space-y-6 sm:space-y-8">
                        {/* Desktop Welcome Header */}
                        <div className="hidden lg:flex items-center gap-6">
                            <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0 tracking-tight" style={{ textWrap: "balance" }}>
                                Welcome, <span className="font-display tracking-tight text-primary/90 relative inline-block">
                                    {session.user?.name}
                                    <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#88A392]/45 -z-10 rounded-sm transform -rotate-1"></span>
                                </span>
                                {studentLeaderboardMedal && (
                                    <span className="ml-1.5 inline-block text-3xl leading-none" aria-label={`Rank ${studentLeaderboardRank}`}>
                                        {studentLeaderboardMedal}
                                    </span>
                                )}
                                !
                            </h1>
                        </div>

                        {/* Momentum Card — mobile only (desktop shows in sidebar) */}
                        <div className="md:hidden">
                            <MomentumCard
                                initialStreak={userStats?.currentStreak ?? 0}
                                initialLongestStreak={userStats?.longestStreak ?? 0}
                                initialSevenDayActivity={initialSevenDayActivity}
                                initialTotalPoints={userStats?.points ?? 0}
                            />
                        </div>

                        {/* Recommended Activities */}
                        <section>
                            <TodaysAssignments
                                initialAssignments={recommendedAssignments}
                                pinnedHabit={dailyVocabHabit}
                                title="Recommended Activities"
                                subtitle={null}
                                ctaLabel="Start"
                                variant="checklist"
                                mobileTasksLinkHref="/dashboard/activities"
                                mobileTasksLinkLabel="All Activities"
                                hideProgressBar
                            />
                        </section>

                        <ExploreCategoriesCarousel />

                        {/* Review Suggestions (subtle, below recommendations) */}
                        {weakAreas.length > 0 && (
                            <RecommendedReviewCard recommendations={weakAreas} />
                        )}

                        {/* Explore Section (Desktop) */}
                        <section className="hidden md:block">
                            <div className="dashboard-panel dashboard-panel-hover paper-texture p-6 group relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/12 via-accent/18 to-secondary/12 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="min-w-0 pr-2">
                                        <p className="text-xs font-bold text-text-muted tracking-widest uppercase flex items-center gap-2">
                                            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary/60 to-secondary/40"></span>
                                            Explore
                                        </p>
                                        <h2 className="text-2xl font-bold font-display text-text mt-2">All Activities</h2>
                                        <p className="text-sm text-text/70 mt-2 max-w-2xl leading-relaxed">
                                            Keep building your skills at your own pace. Browse by category and follow the recommended path when you want a clear next step.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {[
                                                { label: "Grammar", href: "/dashboard/activities?category=grammar", tone: getLearnerCategoryTone("grammar") },
                                                { label: "Vocabulary", href: "/dashboard/activities?category=vocabulary", tone: getLearnerCategoryTone("vocabulary") },
                                                { label: "Quizzes", href: "/dashboard/activities?category=quizzes", tone: getLearnerCategoryTone("quizzes") },
                                                { label: "Games", href: "/dashboard/activities?category=games", tone: getLearnerCategoryTone("games") },
                                                { label: "Pronunciation", href: "/dashboard/activities?category=pronunciation", tone: getLearnerCategoryTone("pronunciation") },
                                            ].map((chip) => (
                                                <Link
                                                    key={chip.label}
                                                    href={chip.href}
                                                    className="dashboard-soft-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border active:scale-95 transition-all duration-200"
                                                    style={{
                                                        color: chip.tone.chipText,
                                                        backgroundColor: chip.tone.chipBg,
                                                        borderColor: chip.tone.border,
                                                        "--dashboard-button-shadow-override": "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.05), 0 6px 14px rgba(40,31,23,0.05)",
                                                        "--dashboard-button-shadow-hover-override": "inset 0 1px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(0,0,0,0.06), 0 10px 18px rgba(40,31,23,0.08)",
                                                    } as React.CSSProperties}
                                                >
                                                    {chip.label}
                                                    <span className="text-[10px] opacity-60">→</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard/activities"
                                        className="btn-polish dashboard-soft-button shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-b from-primary to-[color-mix(in_srgb,var(--primary-color)_88%,#000)] text-[color:var(--text-on-accent)] border border-primary/80 font-semibold text-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                                        style={{
                                            "--dashboard-button-shadow-override": "0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(176,87,64,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                                            "--dashboard-button-shadow-hover-override": "0 2px 4px rgba(0,0,0,0.12), 0 8px 18px rgba(176,87,64,0.32), inset 0 1px 0 rgba(255,255,255,0.24)",
                                        } as React.CSSProperties}
                                    >
                                        Browse
                                        <span className="arrow-animate">→</span>
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <aside className="hidden md:block md:col-span-4 lg:col-span-3">
                        <div className="dashboard-panel paper-texture sticky top-4 space-y-5 p-5">
                            {/* Momentum Card — streak, 7-day dots, XP level */}
                            <MomentumCard
                                initialStreak={userStats?.currentStreak ?? 0}
                                initialLongestStreak={userStats?.longestStreak ?? 0}
                                initialSevenDayActivity={initialSevenDayActivity}
                                initialTotalPoints={userStats?.points ?? 0}
                            />

                            {/* Weekly Goal Tracker */}
                            <IndependentDashboardClient
                                initialGoal={preferences.weeklyActivityGoal ?? 3}
                                weeklyGoalProgress={weeklyGoalProgress}
                            />

                            {/* Learning Path Roadmap */}
                            <LearningPathRoadmap
                                stages={progressStats.stageProgress}
                                totalProgress={{
                                    completed: progressStats.completedActivities,
                                    total: progressStats.totalActivities,
                                    percent: progressStats.percentComplete,
                                }}
                            />

                            {/* Self-paced Leaderboard Link */}
                            <section className="rounded-2xl border p-4" style={{ borderColor: "var(--dashboard-divider)", backgroundColor: "var(--dashboard-surface-start)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <TrophyIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text">Self-paced Leaderboard</h3>
                                        <p className="text-xs text-text-muted">Points and streaks still count here.</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/leaderboard"
                                    className="dashboard-soft-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-[var(--dashboard-surface-start)] px-4 py-2.5 text-sm font-semibold text-primary"
                                >
                                    <TrophyIcon className="h-4 w-4" />
                                    Open Leaderboard
                                </Link>
                            </section>

                            {/* New Releases Info */}
                            <section className="rounded-2xl border p-4" style={{ borderColor: "var(--dashboard-divider)", backgroundColor: "var(--dashboard-surface-start)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <SparklesIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text">New releases</h3>
                                        <p className="text-xs text-text-muted">New activities stay optional and do not replace your next recommendation.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border p-4" style={{ borderColor: "var(--dashboard-divider)", backgroundColor: "var(--dashboard-surface-start)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                        <UsersIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text">Invite Friends</h3>
                                        <p className="text-xs text-text-muted">Share your invite link so others can join you.</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/invite"
                                    className="dashboard-soft-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-[var(--dashboard-surface-start)] px-4 py-2.5 text-sm font-semibold text-secondary"
                                >
                                    <UsersIcon className="h-4 w-4" />
                                    Open Invite Link
                                </Link>
                            </section>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
