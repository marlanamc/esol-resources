import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BottomNav } from "@/components/ui";
import { StatCard } from "@/components/ui/StatCard";
import { StreakCalendar } from "@/components/ui/StreakCalendar";
import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import ClickableAvatarDisplay from "@/components/ui/ClickableAvatarDisplay";
import { Trophy, Flame, BookOpen, Target, Calendar, Award, ChevronRight } from "lucide-react";
import { HomeIcon, BookOpenIcon as BookIcon, TrophyIcon, UsersIcon, UserIcon } from "@/components/icons/Icons";

// Force dynamic rendering to show real-time activity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

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

    // Run all independent database queries in parallel to eliminate async waterfall
    const [activityProgress, recentPointsLedger, pointsLedgerDates, activityProgressDates] = await Promise.all([
        // Get activity progress for category stats
        prisma.activityProgress.findMany({
            where: { userId },
            include: {
                activity: true,
            },
        }),
        // Get points ledger for activity timeline
        prisma.pointsLedger.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 15,
        }),
        // Get activity dates for streak calendar - PointsLedger (for completed activities)
        prisma.pointsLedger.findMany({
            where: { userId },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 365,
        }),
        // Get activity dates for streak calendar - ActivityProgress updates (for any activity)
        prisma.activityProgress.findMany({
            where: { userId },
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 365,
        }),
    ]);

    // Combine both date sources
    const activityDates = [
        ...pointsLedgerDates.map(p => p.createdAt),
        ...activityProgressDates.map(p => p.updatedAt),
    ];

    // Calculate category progress

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
        const totalActivities = vocabProgress.total + grammarProgress.total + numbersProgress.total + otherProgress.total;
        const totalCompleted = vocabProgress.completed + grammarProgress.completed + numbersProgress.completed + otherProgress.completed;
        
        // Encouraging message based on activity
        let welcomeMessage = "Let's learn something new today!";
        if (user.currentStreak > 3) welcomeMessage = "You're on fire! Keep it up! 🔥";
        else if (totalCompleted > 0) welcomeMessage = "Great progress so far!";
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24">
                {/* Decorative background elements */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* Header */}
                    <div className="mb-10 animate-fade-in">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary mb-6 transition-colors group"
                        >
                            <span className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center mr-2 shadow-sm group-hover:scale-110 transition-transform">
                                ←
                            </span>
                            Back to Dashboard
                        </Link>
                        
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 glass-card p-8 rounded-2xl relative overflow-hidden">
                            {/* Accent decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
                            
                            <div className="flex-shrink-0 relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary via-accent to-secondary rounded-full opacity-70 blur group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-white p-1 rounded-full">
                                    <ClickableAvatarDisplay size="xl" />
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl md:text-5xl font-bold font-display text-text mb-2 tracking-tight">
                                    Hi, {user.name?.split(' ')[0] || 'Student'}! 👋
                                </h1>
                                <p className="text-xl text-text-muted font-medium max-w-2xl">
                                    {welcomeMessage}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 stagger-children">
                        <StatCard
                            label="Total Points"
                            value={user.points.toLocaleString()}
                            icon={<Trophy className="w-6 h-6" />}
                            color="primary"
                            className="delay-100"
                        />
                        <StatCard
                            label="Current Streak"
                            value={`${user.currentStreak} Days`}
                            icon={<Flame className="w-6 h-6" />}
                            color="warning"
                            className="delay-200"
                        />
                        <StatCard
                            label="Activities Explored"
                            value={totalCompleted}
                            icon={<BookOpen className="w-6 h-6" />}
                            color="success"
                            className="delay-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        {/* Calendar */}
                        <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm animate-fade-in-up delay-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text">Consistency</h2>
                                    <p className="text-sm text-text-muted">Each dot is a day you learned!</p>
                                </div>
                            </div>
                            <StreakCalendar
                                activityDates={activityDates}
                                className="w-full"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm animate-fade-in-up delay-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Recent Wins</h2>
                                        <p className="text-sm text-text-muted">Latest activities</p>
                                    </div>
                                </div>
                            </div>
                            <ActivityTimeline activities={timelineActivities} limit={8} />
                            {timelineActivities.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-text-muted text-sm italic">No recent activity. Do a lesson to see it here!</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Achievements - Show only if exists */}
                        {user.achievements.length > 0 && (
                            <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-8 shadow-sm animate-fade-in-up delay-400">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20 text-white">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold font-display text-text">Trophy Case</h2>
                                        <p className="text-text-muted">Badges you've earned</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.achievements.map((userAchievement) => (
                                        <div
                                            key={userAchievement.id}
                                            className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-100/50 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                                                {userAchievement.achievement.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-text-dark">{userAchievement.achievement.name}</p>
                                                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{userAchievement.achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
