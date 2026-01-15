import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BottomNav } from "@/components/ui";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import {
    HomeIcon,
    BookOpenIcon,
    TrophyIcon,
    UsersIcon,
    ClipboardIcon,
    BarChartIcon,
    CalendarIcon,
    StarIcon,
    FlameIcon,
    MapIcon
} from "@/components/icons/Icons";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ClearFeaturedButton
} from "@/components/dashboard";

type TeacherAssignment = {
    id: string;
    title: string | null;
    activityId: string;
    classId: string;
    activity: {
        id: string;
        title: string;
        description: string | null;
        type: string;
        category?: string | null;
    };
    isFeatured: boolean;
    dueDate: Date | null;
};

type StudentSummary = {
    id: string;
    username: string;
    name: string | null;
    mustChangePassword: boolean;
};

type TeacherClass = {
    id: string;
    name: string;
    description: string | null;
    enrollments: { id: string; student: StudentSummary }[];
    assignments: TeacherAssignment[];
    calendarEvents: {
        id: string;
        title: string;
        date: Date;
        endDate: Date | null;
        type: string;
    }[];
};

type StudentEnrollment = {
    classId: string;
    class: {
        name: string;
        assignments: {
            id: string;
            title: string | null;
            activityId: string;
            classId: string;
            activity: {
                id: string;
                title: string;
                description: string | null;
                type: string;
            };
            isFeatured: boolean;
            dueDate: Date | null;
        }[];
        calendarEvents: {
            id: string;
            title: string;
            date: Date;
            endDate: Date | null;
            type: string;
        }[];
    };
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    if (userRole === "teacher") {
        // Teacher Dashboard
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                enrollments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                mustChangePassword: true,
                            },
                        },
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
        }) as TeacherClass[];

        const allAssignments = classes.flatMap((c: TeacherClass) => c.assignments);
        const featuredAssignments = allAssignments.filter((a: TeacherAssignment) => a.isFeatured);

        const featuredAssignmentsForDisplay = featuredAssignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            activityId: assignment.activityId,
            activity: {
                title: assignment.activity.title,
                description: assignment.activity.description,
                // fall back to type if category missing to keep badge styling
                category: assignment.activity.category || assignment.activity.type || null,
            },
            submissions: [],
        }));
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
                <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/80 border-white/40 shadow-sm transition-all">
                    <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex-1">
                            <p className="font-bold text-primary tracking-widest uppercase text-[11px] sm:text-xs leading-tight">
                                ESOL CLASS<br className="sm:hidden" /> COMPANION
                            </p>
                        </div>
                        <div className="flex items-center gap-3 animate-fade-in-up delay-100">
                            <Link
                                href="/dashboard/leaderboard"
                                className="hidden md:inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border shadow-md transition-colors text-white hover:bg-[#7a9384] hover:border-[#6d8577] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 min-w-[132px] justify-center"
                                style={{
                                    backgroundColor: '#88A392',
                                    borderColor: '#7a9384',
                                }}
                            >
                                <TrophyIcon className="w-4 h-4" />
                                Leaderboard
                            </Link>
                            <UserProfileDropdown userName={session.user?.name || ""} />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto pt-8 pb-24 md:pb-12 px-4 sm:px-6 lg:px-10 max-w-[1800px]">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content Area - Left Side */}
                        <div className="lg:col-span-3 space-y-8">
                            {/* Welcome Header */}
                            <div className="animate-fade-in-up">
                                <h1 className="text-5xl sm:text-4xl font-display font-bold text-text mb-2 leading-tight">
                                    Welcome, {session.user?.name === "Teacher User" ? "Teacher" : session.user?.name}!
                                </h1>
                            </div>

                            {/* Mobile Quick Actions - Only visible on mobile */}
                            <section className="md:hidden animate-fade-in-up delay-50">
                                <h2 className="text-lg font-bold font-display text-text mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/dashboard/classes"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <UsersIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Classes</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/activities/new"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-secondary/20 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all"
                                    >
                                        <BookOpenIcon className="w-6 h-6 text-secondary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Create Activity</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/stats"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-accent/20 rounded-xl shadow-sm hover:shadow-md hover:border-accent/40 transition-all"
                                    >
                                        <BarChartIcon className="w-6 h-6 text-accent mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Student Stats</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/calendar/new"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Add Event</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/teaching-schedule"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Teaching Schedule</span>
                                    </Link>
                                </div>
                            </section>

                            {/* Featured Assignments (styled like student view) */}
                            <section className="animate-fade-in-up delay-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-2xl font-bold font-display text-text">Weekly Checklist</h2>
                                    <ClearFeaturedButton />
                                </div>
                                <TodaysAssignments
                                    title=""
                                    ctaLabel="Open"
                                    initialAssignments={featuredAssignmentsForDisplay}
                                    variant="checklist"
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section className="animate-fade-in-up delay-200">
                                <div className="bg-white border border-border/40 shadow-lg rounded-2xl p-6 bg-gradient-to-b from-white to-bg-light/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-secondary tracking-widest uppercase">Explore</p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-1">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl">
                                                Browse all activities organized by category. Feature assignments for your classes and create new content.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/activities"
                                            className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white hover:brightness-110 transition font-semibold text-sm"
                                        >
                                            Browse →
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar & Important Pages Sidebar (hidden on mobile) */}
                        <aside className="animate-fade-in-up delay-100 hidden md:block">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList
                                    events={calendarEvents.filter(event => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                                        eventEndDate.setHours(0, 0, 0, 0);
                                        return eventEndDate >= today;
                                    })}
                                    allowDelete={true}
                                />

                                <div className="pt-4 mt-4 border-t border-border/40 space-y-2">
                                    <h3 className="text-sm font-semibold text-text">Important Pages</h3>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/dashboard/leaderboard"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <TrophyIcon className="w-4 h-4" />
                                            <span>Leaderboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/calendar/new"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <UsersIcon className="w-4 h-4" />
                                            <span>Add Event to Calendar</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/teaching-schedule"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>Teaching Schedule</span>
                                        </Link>
                                        <Link
                                            href="/grammar-map"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <MapIcon className="w-4 h-4" />
                                            <span>Grammar Map</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/activities/new"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <BookOpenIcon className="w-4 h-4" />
                                            <span>Create Activity</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/passwords"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <ClipboardIcon className="w-4 h-4" />
                                            <span>Reset Student Passwords</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/stats"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <BarChartIcon className="w-4 h-4" />
                                            <span>Student Stats</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div className="max-w-[1800px] mx-auto mt-12 pb-8 px-4 sm:px-6 lg:px-10 flex justify-center md:justify-end">
                        <LogoutButton />
                    </div>
                </main>

                {/* Mobile Bottom Nav - Teacher */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/classes', label: 'Classes', icon: <UsersIcon /> },
                        { href: '/grammar-map', label: 'Map', icon: <MapIcon /> },
                        { href: '/dashboard/stats', label: 'Stats', icon: <BarChartIcon /> },
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
        }) as StudentEnrollment[];

        // Filter out unreleased speaking activities from assignments
        const filterReleasedActivities = (assignment: any) => {
            if (assignment.activity.type !== "speaking") {
                return true; // Show all non-speaking activities
            }
            // For speaking activities, check if released
            try {
                const content = JSON.parse(assignment.activity.content);
                return content.released === true;
            } catch {
                return false; // Hide if content is malformed
            }
        };

        const allAssignments = enrollments.flatMap((enrollment: StudentEnrollment) =>
            enrollment.class.assignments
                .filter(filterReleasedActivities)
                .map((assignment) => ({
                    ...assignment,
                    className: enrollment.class.name,
                }))
        );

        const classIds = enrollments.map(e => e.classId);
        const featuredAssignmentsRawUnfiltered = classIds.length === 0 ? [] : await prisma.assignment.findMany({
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

        // Filter out unreleased speaking activities from featured assignments
        const featuredAssignmentsRaw = featuredAssignmentsRawUnfiltered.filter(filterReleasedActivities);

        const featuredActivityIds = Array.from(new Set(featuredAssignmentsRaw.map((a) => a.activityId)));
        const featuredProgressRows =
            featuredActivityIds.length === 0
                ? []
                : await prisma.activityProgress.findMany({
                      where: { userId, activityId: { in: featuredActivityIds } },
                      select: { activityId: true, progress: true, status: true },
                  });
        const featuredProgressMap = new Map<string, { progress: number; status: string }>(
            (featuredProgressRows as Array<{ activityId: string; progress: number; status: string }>).map((p) => [
                p.activityId,
                { progress: p.progress, status: p.status },
            ])
        );

        const featuredAssignments = featuredAssignmentsRaw.map((a) => {
            const p = featuredProgressMap.get(a.activityId);
            return {
                ...a,
                progress: p?.progress ?? 0,
                progressStatus: p?.status ?? "in_progress",
            };
        });

        const calendarEvents: CalendarEvent[] = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment: StudentEnrollment) =>
                enrollment.class.calendarEvents.map((ev: { id: string; date: Date; endDate: Date | null; type: string; title: string }) => ({
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Get user's streak data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                currentStreak: true,
                longestStreak: true,
                points: true,
            }
        });

        // Calculate actual weekly points from PointsLedger (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyPointsData = await prisma.pointsLedger.aggregate({
            where: {
                userId,
                createdAt: { gte: oneWeekAgo },
            },
            _sum: {
                points: true,
            },
        });
        
        const actualWeeklyPoints = weeklyPointsData._sum.points || 0;

        return (
            <div className="min-h-screen bg-bg">
                {/* Header */}
                <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/80 border-white/40 shadow-sm transition-all">
                    <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex-1">
                            <p className="font-bold text-primary tracking-widest uppercase text-[11px] sm:text-xs leading-tight">
                                ESOL CLASS<br className="sm:hidden" /> COMPANION
                            </p>
                        </div>
                        <div className="flex items-center gap-3 animate-fade-in-up delay-100">
                            <Link
                                href="/dashboard/leaderboard"
                                className="hidden md:inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border shadow-md transition-colors text-white hover:bg-[#7a9384] hover:border-[#6d8577] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 min-w-[132px] justify-center"
                                style={{
                                    backgroundColor: '#88A392',
                                    borderColor: '#7a9384',
                                }}
                            >
                                <TrophyIcon className="w-4 h-4" />
                                Leaderboard
                            </Link>
                            <UserProfileDropdown userName={session.user?.name || ""} />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto pt-8 pb-24 md:pb-12 px-4 sm:px-6 lg:px-10 max-w-[1800px]">
                    {/* Welcome Header */}
                    <div className="animate-fade-in-up mb-8">
                        {/* Desktop: Welcome + Stats horizontal */}
                        <div className="hidden lg:flex items-center gap-4">
                            <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0">
                                Welcome, {session.user?.name}!
                            </h1>

                            <div className="flex gap-3">
                                {/* Weekly Points */}
                                {actualWeeklyPoints > 0 && (
                                    <div className="bg-white border-2 border-primary/20 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
                                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                            <StarIcon className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wide text-text-muted">This Week</div>
                                            <div className="text-lg font-bold text-text">{actualWeeklyPoints} <span className="text-sm font-semibold text-text-muted">points</span></div>
                                        </div>
                                    </div>
                                )}

                                {/* Total Points */}
                                {currentUser && currentUser.points > 0 && (
                                    <div className="bg-white border-2 border-secondary/20 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
                                        <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                                            <TrophyIcon className="text-secondary" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wide text-text-muted">Total</div>
                                            <div className="text-lg font-bold text-text">{currentUser.points} <span className="text-sm font-semibold text-text-muted">points</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile: Welcome stacked */}
                        <div className="lg:hidden">
                            <h1 className="text-4xl font-display font-bold text-text mb-4 leading-tight">
                                Welcome, {session.user?.name}!
                            </h1>

                            <div className="flex flex-wrap gap-3">
                                {currentUser && currentUser.currentStreak > 0 && (
                                    <div className="bg-white border-2 border-orange-500/20 px-3 py-2 rounded-lg shadow-sm flex items-center gap-2.5">
                                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                            <FlameIcon className="text-orange-500" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Streak</div>
                                            <div className="text-base font-bold text-text">{currentUser.currentStreak} <span className="text-xs font-semibold text-text-muted">{currentUser.currentStreak === 1 ? 'day' : 'days'}</span></div>
                                        </div>
                                    </div>
                                )}

                                {actualWeeklyPoints > 0 && (
                                    <div className="bg-white border-2 border-primary/20 px-3 py-2 rounded-lg shadow-sm flex items-center gap-2.5">
                                        <div className="p-1.5 bg-primary/10 rounded-lg">
                                            <StarIcon className="text-primary" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">This Week</div>
                                            <div className="text-base font-bold text-text">{actualWeeklyPoints} <span className="text-xs font-semibold text-text-muted">points</span></div>
                                        </div>
                                    </div>
                                )}

                                {currentUser && currentUser.points > 0 && (
                                    <div className="bg-white border-2 border-secondary/20 px-3 py-2 rounded-lg shadow-sm flex items-center gap-2.5">
                                        <div className="p-1.5 bg-secondary/10 rounded-lg">
                                            <TrophyIcon className="text-secondary" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Total</div>
                                            <div className="text-base font-bold text-text">{currentUser.points} <span className="text-xs font-semibold text-text-muted">points</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content Area - Left Side */}
                        <div className="lg:col-span-3 space-y-8">

                            {/* This Week's Activities */}
                            <section className="animate-fade-in-up delay-100">
                                <TodaysAssignments
                                    initialAssignments={featuredAssignments}
                                    title="Weekly Checklist"
                                    ctaLabel="Start"
                                    variant="checklist"
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section className="animate-fade-in-up delay-200">
                                <div className="bg-white border border-border/40 shadow-lg rounded-2xl p-6 bg-gradient-to-b from-white to-bg-light/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-secondary tracking-widest uppercase">Explore</p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-1">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl">
                                                Browse everything in one place with categories and progress tracking.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/activities"
                                            className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white hover:brightness-110 transition font-semibold text-sm"
                                        >
                                            Browse →
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar Sidebar - Right Side (hidden on mobile) */}
                        <aside className="animate-fade-in-up delay-100 hidden md:block">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList
                                    events={calendarEvents.filter(event => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                                        eventEndDate.setHours(0, 0, 0, 0);
                                        return eventEndDate >= today;
                                    })}
                                    allowDelete={false}
                                />

                                <div className="pt-4 mt-4 border-t border-border/40 space-y-2">
                                    <h3 className="text-sm font-semibold text-text">Quick Links</h3>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/grammar-map"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <MapIcon className="w-4 h-4" />
                                            <span>Grammar Map</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/leaderboard"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <TrophyIcon className="w-4 h-4" />
                                            <span>Leaderboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition flex items-center gap-2"
                                        >
                                            <StarIcon className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </aside>
                    </div>

                </main>

                {/* Mobile Bottom Nav - Student */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/activities', label: 'Activities', icon: <BookOpenIcon /> },
                        { href: '/grammar-map', label: 'Map', icon: <MapIcon /> },
                        { href: '/dashboard/leaderboard', label: 'Board', icon: <TrophyIcon /> },
                    ]}
                />
            </div>
        );
    }
}
