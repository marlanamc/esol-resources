import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BottomNav } from "@/components/ui";
import {
    HomeIcon,
    BookOpenIcon,
    TrophyIcon,
    UserIcon,
    UsersIcon
} from "@/components/icons/Icons";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ActivityCategories
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

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role || "student";
    const userId = (session.user as any)?.id;

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

        const studentMap = new Map<string, StudentSummary>();
        classes.forEach((cls) => {
            cls.enrollments.forEach((enrollment) => {
                if (enrollment.student) {
                    studentMap.set(enrollment.student.id, enrollment.student);
                }
            });
        });
        const students = Array.from(studentMap.values());
        const allAssignments = classes.flatMap((c: TeacherClass) => c.assignments);
        const featuredAssignments = allAssignments.filter((a: TeacherAssignment) => a.isFeatured);

        const allActivities = await prisma.activity.findMany({
            orderBy: { createdAt: "desc" },
        });

        const featuredAssignmentsForDisplay = featuredAssignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            activityId: assignment.activityId,
            activity: {
                title: assignment.activity.title,
                description: assignment.activity.description,
                // fall back to type if category missing to keep badge styling
                category: (assignment.activity as any).category || assignment.activity.type || null,
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
                            <Link
                                href="/dashboard/stats/student"
                                className="text-xs font-semibold text-primary underline decoration-primary/50 underline-offset-4"
                            >
                                View progress
                            </Link>
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

                            {/* Featured Assignments (styled like student view) */}
                            <section className="animate-fade-in-up delay-100">
                                <TodaysAssignments
                                    title="Featured Assignments"
                                    ctaLabel="Open"
                                    initialAssignments={featuredAssignmentsForDisplay}
                                />
                            </section>

                            {/* All Activities - Organized by Category */}
                            <section className="animate-fade-in-up delay-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold font-display text-text flex items-center gap-3">
                                        <span className="w-2 h-8 rounded-full bg-secondary/80"></span>
                                        All Activities
                                    </h2>
                                </div>
                                <ActivityCategories activities={allActivities} completedActivityIds={new Set()} showEmpty />
                            </section>
                        </div>

                        {/* Calendar & Important Pages Sidebar */}
                        <aside className="animate-fade-in-up delay-100">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList events={calendarEvents} />

                                <div className="pt-4 mt-4 border-t border-border/40 space-y-2">
                                    <h3 className="text-sm font-semibold text-text">Important Pages</h3>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/dashboard/calendar/new"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition"
                                        >
                                            Add Event to Calendar
                                        </Link>
                                        <Link
                                            href="/dashboard/activities/new"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition"
                                        >
                                            Create Activity
                                        </Link>
                                        <Link
                                            href="/dashboard/passwords"
                                            className="w-full px-3 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:brightness-110 active:scale-95"
                                        >
                                            Reset Student Passwords
                                        </Link>
                                        <Link
                                            href="/dashboard/stats"
                                            className="w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition"
                                        >
                                            Student Stats
                                        </Link>
                                    </div>
                                </div>
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
        }) as StudentEnrollment[];

        const allAssignments = enrollments.flatMap((enrollment: StudentEnrollment) =>
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
            submissions.map(
                (s: { userId: string; activityId: string; assignmentId: string | null; status: string }) => [
                    `${s.userId}-${s.activityId}-${s.assignmentId ?? ""}`,
                    s,
                ]
            )
        );

        const totalAssignments = allAssignments.length;
        const completedAssignments = submissions.filter((s: { status: string }) => s.status === "submitted" || s.status === "graded").length;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const pendingAssignments = totalAssignments - completedAssignments;

        const gradedSubmissions = submissions.filter(
            (s: { status: string; score: number | null }) => s.status === "graded" && s.score !== null
        );
        const averageScore =
            gradedSubmissions.length > 0
                ? Math.round(
                      gradedSubmissions.reduce(
                          (sum: number, s: { score: number | null }) => sum + (s.score || 0),
                          0
                      ) / gradedSubmissions.length
                  )
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
            ...enrollments.flatMap((enrollment: StudentEnrollment) =>
                enrollment.class.calendarEvents.map((ev: { id: string; date: Date; endDate: Date | null; type: string; title: string }) => ({
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const upcomingAssignments = allAssignments
            .filter((a) => {
                const submission = submissionMap.get(`${userId}-${a.activityId}-${a.id}`) as
                    | { status?: string }
                    | undefined;
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

        // Activity progress (may be missing in older prisma clients, so cast)
        const progressEntries = await (prisma as any).activityProgress.findMany({
            where: { userId },
            select: { activityId: true, progress: true },
        });
        const progressMap = (progressEntries as Array<{ activityId: string; progress: number }>).reduce<Record<string, number>>(
            (acc: Record<string, number>, p: { activityId: string; progress: number }) => {
                acc[p.activityId] = p.progress;
                return acc;
            },
            {}
        );

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

        const completedActivityIds = new Set<string>(
            completedActivities.map((s: { activityId: string }) => s.activityId)
        );

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
                                <ActivityCategories activities={allActivities} completedActivityIds={completedActivityIds} progressMap={progressMap} />
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
