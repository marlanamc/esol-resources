import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { StatCard, Badge, BottomNav } from "@/components/ui";
import {
    HomeIcon,
    BookOpenIcon,
    TrophyIcon,
    UserIcon,
    ClipboardIcon,
    CheckCircleIcon,
    BarChartIcon,
    UsersIcon
} from "@/components/icons/Icons";
import {
    DashboardHeader,
    StatsOverview,
    AssignmentCard,
    ActivityBrowseGrid,
    MiniCalendar,
    CreateCalendarEventForm,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ActivityCategories,
    TeacherActivityCategories
} from "@/components/dashboard";

interface DashboardPageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role || "student";
    const userId = (session.user as any)?.id;

    if (userRole === "teacher") {
        const showStats = searchParams?.view === "stats";
        // Teacher Dashboard
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                enrollments: {
                    include: {
                        student: true,
                    },
                },
                assignments: {
                    include: {
                        activity: true,
                    },
                },
                calendarEvents: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const classNameById = new Map(classes.map((cls) => [cls.id, cls.name]));
        const today = new Date();
        const allAssignments = classes.flatMap(c => c.assignments);
        const featuredAssignments = allAssignments.filter(a => a.isFeatured);

        const allActivities = await prisma.activity.findMany({
            orderBy: { createdAt: "desc" },
        });

        const defaultClassId = classes[0]?.id || null;
        const activityAssignmentMap = defaultClassId
            ? classes[0].assignments.reduce((acc, assignment) => {
                if (!acc[assignment.activityId]) {
                    acc[assignment.activityId] = assignment.id;
                }
                return acc;
            }, {} as Record<string, string>)
            : {};

        // Get all featured assignments to show which activities are featured
        const featuredAssignmentIds = new Set(
            allAssignments
                .filter(a => a.isFeatured)
                .map(a => a.activityId)
        );
        const calendarEvents: CalendarEvent[] = [
            ...allAssignments
                .filter(a => a.dueDate)
                .map(a => ({
                    date: a.dueDate as Date,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...classes.flatMap((cls) =>
                cls.calendarEvents.map((ev) => ({
                    id: ev.id,
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return (
            <div className="min-h-screen bg-bg">
                {/* Header */}
                {/* Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50 transition-all">
                    <div className="container mx-auto max-w-[1800px] py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="animate-fade-in-up">
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                                ESOL 3 Class Companion
                            </h1>
                            <p className="text-sm font-medium text-text-muted mt-1 ml-1">
                                Teacher Dashboard
                            </p>
                        </div>
                        <div className="flex items-center gap-4 animate-fade-in-up delay-100">
                            <span className="hidden sm:inline text-sm font-medium text-text-muted">
                                Welcome, <span className="text-text font-bold">{session.user?.name}</span>
                            </span>
                            {!showStats ? (
                                <Link
                                    href="/dashboard?view=stats"
                                    className="text-xs font-semibold text-primary underline decoration-primary/50 underline-offset-4"
                                >
                                    View stats (private)
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className="text-xs font-semibold text-primary underline decoration-primary/50 underline-offset-4"
                                >
                                    Hide stats
                                </Link>
                            )}
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto max-w-[1800px] pt-8 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 space-y-10">
                    {/* Stats Overview (hidden by default to mirror student view) */}
                    {showStats && (
                        <section className="animate-fade-in-up delay-200">
                            <h2 className="text-2xl font-bold mb-6 font-display text-text flex items-center gap-2">
                                Overview
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    label="Total Classes"
                                    value={classes.length}
                                    icon={<UsersIcon className="w-full h-full" />}
                                    color="primary"
                                    className="delay-100"
                                />
                                <StatCard
                                    label="Total Students"
                                    value={classes.reduce((sum, c) => sum + c.enrollments.length, 0)}
                                    icon={<UserIcon className="w-full h-full" />}
                                    color="secondary"
                                    className="delay-200"
                                />
                                <StatCard
                                    label="Assignments"
                                    value={allAssignments.length}
                                    icon={<ClipboardIcon className="w-full h-full" />}
                                    color="warning"
                                    className="delay-300"
                                />
                                <StatCard
                                    label="Activities"
                                    value={allActivities.length}
                                    icon={<BookOpenIcon className="w-full h-full" />}
                                    color="accent"
                                    className="delay-400"
                                />
                            </div>
                        </section>
                    )}

                    {/* Activities & Calendar Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Activity Library */}
                        <section className="lg:col-span-2 animate-fade-in-up delay-400">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold font-display text-text flex items-center gap-2">
                                    Activity Library
                                </h2>
                                <div className="flex gap-2">
                                    <Link
                                        href="/dashboard/activities/new"
                                        className="px-5 py-2.5 text-white text-sm font-semibold transition-all hover:brightness-110 hover:shadow-md bg-gradient-to-r from-primary to-primary-light shadow-sm rounded-xl active:scale-95"
                                    >
                                        + Create
                                    </Link>
                                    <Link
                                        href="/dashboard/activities"
                                        className="px-5 py-2.5 text-sm font-semibold border transition-all text-text border-border/40 bg-white rounded-xl hover:bg-bg-light hover:shadow-sm"
                                    >
                                        View All →
                                    </Link>
                                </div>
                            </div>

                        {/* Featured Assignments */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold font-display text-text">Featured Assignments</h3>
                                {featuredAssignments.length > 0 && (
                                    <span className="text-xs text-text-muted">
                                        Showing {featuredAssignments.length}
                                    </span>
                                )}
                            </div>
                            {featuredAssignments.length === 0 ? (
                                <div className="border border-border/40 rounded-xl p-5 bg-white/60 text-text-muted text-sm">
                                    No featured assignments yet. Use "Assign" on an activity to feature it.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {featuredAssignments.map((assignment) => (
                                        <div
                                            key={assignment.id}
                                            className="border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 rounded-xl p-4 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold text-accent uppercase tracking-wide">Featured</p>
                                                    <h4 className="text-lg font-semibold text-text">
                                                        {assignment.title || assignment.activity.title}
                                                    </h4>
                                                    <p className="text-sm text-text-muted line-clamp-2">
                                                        {assignment.activity.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-text-muted">
                                                        <span className="px-2 py-0.5 rounded-full bg-white/70 border border-border/50">
                                                            {assignment.activity.type}
                                                        </span>
                                                        {assignment.dueDate && (
                                                            <span>
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                        <span>
                                                            Class: {classNameById.get(assignment.classId) || "Class"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                                    className="px-3 py-1.5 text-xs font-semibold transition-all rounded-lg shadow-sm bg-primary text-white hover:brightness-110 hover:shadow-md"
                                                >
                                                    Open
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                            {allActivities.length === 0 ? (
                                <div className="border-2 border-dashed h-48 flex items-center justify-center border-border/40 rounded-2xl bg-white/50">
                                    <p className="text-text-muted font-medium">No activities created yet</p>
                                </div>
                            ) : (
                                <TeacherActivityCategories
                                    activities={allActivities}
                                    featuredActivityIds={featuredAssignmentIds}
                                    defaultClassId={defaultClassId}
                                    activityAssignmentMap={activityAssignmentMap}
                                />
                            )}
                        </section>

                        {/* Calendar */}
                        <aside className="animate-fade-in-up delay-300">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList events={calendarEvents} />

                                <CreateCalendarEventForm classes={classes.map(c => ({ id: c.id, name: c.name }))} />
                            </div>
                        </aside>
                    </div>
                </main>

                {/* Mobile Bottom Nav - Teacher */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/activities', label: 'Activities', icon: <BookOpenIcon /> },
                        { href: '/dashboard/classes', label: 'Classes', icon: <UsersIcon /> },
                        { href: '/dashboard/profile', label: 'Profile', icon: <UserIcon /> },
                    ]}
                />
            </div>
        );
    } else {
        // Student Dashboard
        const enrollments = await prisma.classEnrollment.findMany({
            where: { studentId: userId },
            include: {
                class: {
                    include: {
                        assignments: {
                            include: {
                                activity: true,
                            },
                            orderBy: { createdAt: "desc" },
                        },
                        calendarEvents: true,
                    },
                },
            },
        });

        const allAssignments = enrollments.flatMap((enrollment) =>
            enrollment.class.assignments.map((assignment) => ({
                ...assignment,
                className: enrollment.class.name,
            }))
        );

        const assignmentIds = allAssignments.map((a) => a.id);

        const submissions = assignmentIds.length
            ? await prisma.submission.findMany({
                where: {
                    userId,
                    assignmentId: {
                        in: assignmentIds,
                    },
                },
            })
            : [];

        const submissionMap = new Map(
            submissions.map((s) => [`${s.userId}-${s.activityId}-${s.assignmentId}`, s])
        );

        const totalAssignments = allAssignments.length;
        const completedAssignments = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const pendingAssignments = totalAssignments - completedAssignments;

        const gradedSubmissions = submissions.filter((s) => s.status === "graded" && s.score !== null);
        const averageScore = gradedSubmissions.length > 0
            ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length)
            : null;

        const classIds = enrollments.map(e => e.classId);
        const featuredAssignments = classIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                isFeatured: true,
                activity: { id: { not: "" } }
            },
            include: {
                activity: true,
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        completedAt: true,
                        score: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const calendarEvents: CalendarEvent[] = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment) =>
                enrollment.class.calendarEvents.map((ev) => ({
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const upcomingAssignments = allAssignments
            .filter((a) => {
                const submission = submissionMap.get(`${userId}-${a.activityId}-${a.id}`);
                return !submission || submission.status === "pending";
            })
            .sort((a, b) => {
                const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                return aDate - bDate;
            })
            .slice(0, 5);

        const allActivities = await prisma.activity.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Get student's completed activities
        const completedActivities = await prisma.submission.findMany({
            where: {
                userId,
                status: { in: ["submitted", "graded"] },
                completedAt: { not: null }
            },
            select: {
                activityId: true
            }
        });

        const completedActivityIds = new Set(completedActivities.map(s => s.activityId));

        return (
            <div className="min-h-screen bg-bg">
                {/* Header */}
                <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/80 border-white/40 shadow-sm transition-all">
                    <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="hidden sm:block">
                            <p className="font-bold text-primary tracking-widest uppercase text-xs">ESOL 3 Class Companion</p>
                        </div>
                        <div className="block sm:hidden">
                            {/* Mobile Logo Placeholder */}
                            <span className="font-display font-bold text-xl text-primary">CC</span>
                        </div>
                        <div className="flex items-center gap-4 animate-fade-in-up delay-100">
                            <span className="hidden sm:inline text-sm font-medium text-text-muted">
                                {session.user?.name}
                            </span>
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto pt-8 pb-24 md:pb-12 px-4 sm:px-6 lg:px-10 max-w-[1800px]">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content Area - Left Side */}
                        <div className="lg:col-span-3 space-y-8">
                            {/* Welcome Header */}
                            <div className="animate-fade-in-up">
                                <h1 className="text-3xl font-display font-bold text-text mb-2">
                                    Welcome, {session.user?.name}!
                                </h1>
                            </div>

                            {/* Today's Assignments */}
                            <section className="animate-fade-in-up delay-100">
                                <TodaysAssignments initialAssignments={featuredAssignments} />
                            </section>

                            {/* All Activities - Organized by Category */}
                            <section className="animate-fade-in-up delay-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold font-display text-text flex items-center gap-3">
                                        <span className="w-2 h-8 rounded-full bg-secondary/80"></span>
                                        All Activities
                                    </h2>
                                </div>
                                <ActivityCategories activities={allActivities} completedActivityIds={completedActivityIds} />
                            </section>
                        </div>

                        {/* Calendar & Stats Sidebar - Right Side */}
                        <aside className="animate-fade-in-up delay-100">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList events={calendarEvents} />

                            </div>
                        </aside>
                    </div>
                </main>

                {/* Mobile Bottom Nav - Student */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/activities', label: 'Activities', icon: <BookOpenIcon /> },
                        { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: <TrophyIcon /> },
                        { href: '/dashboard/profile', label: 'Profile', icon: <UserIcon /> },
                    ]}
                />
            </div>
        );
    }
}
