import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BottomNav } from "@/components/ui";
import { StatCard } from "@/components/ui/StatCard";
import { StreakCalendar } from "@/components/ui/StreakCalendar";
import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import { Trophy, Flame, BookOpen, Target, Calendar, Award, ChevronRight } from "lucide-react";
import { HomeIcon, BookOpenIcon as BookIcon, TrophyIcon, UserIcon, CalendarIcon, UsersIcon } from "@/components/icons/Icons";

// Force dynamic rendering to show real-time activity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role || "student";
    const userId = (session.user as any)?.id;

    // Get user data with stats
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            achievements: {
                include: {
                    achievement: true,
                },
                orderBy: {
                    earnedAt: 'desc',
                },
            },
            classes: {
                include: {
                    class: true,
                },
            },
            _count: {
                select: {
                    submissions: true,
                    classes: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    // Calculate rank among all students
    const allStudents = await prisma.user.findMany({
        where: {
            role: 'student',
            username: { not: 'marlie' }, // Exclude test account
        },
        orderBy: { weeklyPoints: 'desc' },
        select: { id: true, weeklyPoints: true },
    });

    const rank = allStudents.findIndex(s => s.id === userId) + 1;
    const rankChange = user.lastWeekRank && rank > 0 ? user.lastWeekRank - rank : null;

    // Get activity progress for category stats
    const activityProgress = await prisma.activityProgress.findMany({
        where: { userId },
        include: {
            activity: true,
        },
    });

    // Get points ledger for activity timeline
    const recentPointsLedger = await prisma.pointsLedger.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 15,
    });

    // Get activity dates for streak calendar (dates with any activity)
    // Use both PointsLedger (for completed activities) and ActivityProgress updates (for any activity)
    const pointsLedgerDates = await prisma.pointsLedger.findMany({
        where: { userId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 365,
    });

    const activityProgressDates = await prisma.activityProgress.findMany({
        where: { userId },
        select: { updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 365,
    });

    // Combine both date sources
    const activityDates = [
        ...pointsLedgerDates.map(p => p.createdAt),
        ...activityProgressDates.map(p => p.updatedAt),
    ];

    // Calculate category progress
    const completedActivities = activityProgress.filter(ap => ap.status === 'completed').length;
    const inProgressActivities = activityProgress.filter(ap => ap.status === 'in_progress').length;

    const vocabActivities = activityProgress.filter(ap => {
        const category = ap.activity.category?.toLowerCase() || '';
        return category.includes('vocab') ||
               category.includes('vocabulary') ||
               category.includes('unit') || // "Unit 1: Flash Cards" etc.
               category.includes('flash cards');
    });

    const grammarActivities = activityProgress.filter(ap =>
        ap.activity.category?.toLowerCase().includes('grammar')
    );

    const numbersActivities = activityProgress.filter(ap =>
        ap.activity.category?.toLowerCase().includes('numbers')
    );

    const otherActivities = activityProgress.filter(ap => {
        const category = ap.activity.category?.toLowerCase() || '';
        return !category.includes('vocab') &&
               !category.includes('vocabulary') &&
               !category.includes('unit') &&
               !category.includes('flash cards') &&
               !category.includes('grammar') &&
               !category.includes('numbers');
    });

    const calcCategoryProgress = (activities: typeof activityProgress) => {
        if (activities.length === 0) return { completed: 0, total: 0, percentage: 0 };
        const completed = activities.filter(a => a.status === 'completed').length;
        return {
            completed,
            total: activities.length,
            percentage: Math.round((completed / activities.length) * 100),
        };
    };

    const vocabProgress = calcCategoryProgress(vocabActivities);
    const grammarProgress = calcCategoryProgress(grammarActivities);
    const numbersProgress = calcCategoryProgress(numbersActivities);
    const otherProgress = calcCategoryProgress(otherActivities);

    // Format timeline activities (exclude login entries with 0 points)
    const timelineActivities = recentPointsLedger
        .filter(entry => entry.points > 0)
        .map(entry => ({
            id: entry.id,
            activityName: entry.reason || 'Activity completed',
            points: entry.points,
            completedAt: entry.createdAt,
            reason: entry.source !== 'award' && entry.source ? entry.source : undefined,
        }));

    // Student view
    if (userRole === 'student') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-sm text-text-muted hover:text-primary mb-4 transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-text mb-2">
                                    {user.name || 'My Profile'}
                                </h1>
                                <p className="text-text-muted">
                                    Track your progress and achievements
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            label="Total Points"
                            value={user.points}
                            icon={<Trophy />}
                            color="primary"
                        />
                        <StatCard
                            label="Current Streak"
                            value={user.currentStreak}
                            icon={<Flame />}
                            color="warning"
                        />
                        <StatCard
                            label="Activities Done"
                            value={completedActivities}
                            icon={<BookOpen />}
                            color="accent"
                        />
                    </div>

                    {/* Activity Calendar and Progress by Category - Side by side on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Streak Calendar */}
                        <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text">Activity Calendar</h2>
                                    <p className="text-sm text-text-muted">Your recent activity</p>
                                </div>
                            </div>
                            <StreakCalendar
                                activityDates={activityDates}
                                className="w-full"
                            />
                        </div>

                        {/* Progress by Category */}
                        <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text">Progress by Category</h2>
                                    <p className="text-sm text-text-muted">Track your completion across different topics</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Vocabulary */}
                                {vocabProgress.total > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-text">📚 Vocabulary</span>
                                            <span className="text-sm text-text-muted">
                                                {vocabProgress.completed} / {vocabProgress.total} completed
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-primary to-primary-dark h-full rounded-full transition-all duration-500"
                                                style={{ width: `${vocabProgress.percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">{vocabProgress.percentage}% complete</p>
                                    </div>
                                )}

                                {/* Grammar */}
                                {grammarProgress.total > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-text">✏️ Grammar</span>
                                            <span className="text-sm text-text-muted">
                                                {grammarProgress.completed} / {grammarProgress.total} completed
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-success to-success-dark h-full rounded-full transition-all duration-500"
                                                style={{ width: `${grammarProgress.percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">{grammarProgress.percentage}% complete</p>
                                    </div>
                                )}

                                {/* Numbers */}
                                {numbersProgress.total > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-text">🔢 Numbers</span>
                                            <span className="text-sm text-text-muted">
                                                {numbersProgress.completed} / {numbersProgress.total} completed
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-warning to-warning-dark h-full rounded-full transition-all duration-500"
                                                style={{ width: `${numbersProgress.percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">{numbersProgress.percentage}% complete</p>
                                    </div>
                                )}

                                {/* Other */}
                                {otherProgress.total > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-text">🎯 Other Activities</span>
                                            <span className="text-sm text-text-muted">
                                                {otherProgress.completed} / {otherProgress.total} completed
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-accent to-accent-dark h-full rounded-full transition-all duration-500"
                                                style={{ width: `${otherProgress.percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">{otherProgress.percentage}% complete</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Achievements and Recent Activity - Side by side on desktop */}
                    <div className={`grid grid-cols-1 gap-6 mb-8 ${user.achievements.length > 0 ? 'lg:grid-cols-2' : ''}`}>
                        {/* Real Achievements */}
                        {user.achievements.length > 0 && (
                            <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-warning" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Achievements</h2>
                                        <p className="text-sm text-text-muted">Achievements you've earned</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {user.achievements.map((userAchievement) => (
                                        <div
                                            key={userAchievement.id}
                                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-warning/5 to-warning/10 border border-warning/20 rounded-lg"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0 text-lg">
                                                {userAchievement.achievement.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-text">{userAchievement.achievement.name}</p>
                                                <p className="text-xs text-text-muted mt-0.5">{userAchievement.achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Timeline */}
                        <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Recent Activity</h2>
                                        <p className="text-sm text-text-muted">Your latest completions and points earned</p>
                                    </div>
                                </div>
                            </div>
                            <ActivityTimeline activities={timelineActivities} limit={10} />
                        </div>
                    </div>
                </div>

                <BottomNav
                    items={[
                        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                        { href: "/dashboard/activities", label: "Activities", icon: <BookIcon /> },
                        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                        { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                    ]}
                />
            </div>
        );
    }

    // Teacher view - simplified profile
    const teacherClasses = user.classes.length;
    const teacherStats = await prisma.activity.count({
        where: { createdBy: userId },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm text-text-muted hover:text-primary mb-4 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold text-text mb-2">
                            {user.name || 'Teacher Profile'}
                        </h1>
                        <p className="text-text-muted">Your teaching overview</p>
                    </div>
                </div>

                {/* Teacher Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Your Classes"
                        value={teacherClasses}
                        icon={<BookOpen />}
                        color="primary"
                    />
                    <StatCard
                        label="Activities Created"
                        value={teacherStats}
                        icon={<Trophy />}
                        color="success"
                    />
                    <StatCard
                        label="Total Students"
                        value={user._count.classes}
                        icon={<Target />}
                        color="accent"
                    />
                </div>

                {/* Quick Links */}
                <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-text mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/classes"
                            className="flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View All Classes</span>
                            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/stats"
                            className="flex items-center justify-between p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View Analytics</span>
                            <ChevronRight className="w-5 h-5 text-success group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/activities/new"
                            className="flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Create Activity</span>
                            <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/passwords"
                            className="flex items-center justify-between p-4 bg-warning/5 hover:bg-warning/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Reset Passwords</span>
                            <ChevronRight className="w-5 h-5 text-warning group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                ]}
            />
        </div>
    );
}
