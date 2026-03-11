import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification";
import { logger } from "@/lib/logger";
import { parseCategoryData } from "@/lib/categoryData";
import { renderAnnouncementMarkdown } from "@/utils/announcementMarkdown";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
    BookOpenIcon,
    TrophyIcon,
    UsersIcon,
    ClipboardIcon,
    BarChartIcon,
    CalendarIcon,
    StarIcon,
    MapIcon
} from "@/components/icons/Icons";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ClearFeaturedButton,
    ClassAnnouncement
} from "@/components/dashboard";
import { TeacherPendingReviewsStat } from "@/components/dashboard/TeacherPendingReviewsStat";
import { isTeacherAdmin } from "@/lib/roles";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { getVocabReviewSummaryForUser } from "@/lib/vocab-review";

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
    createdAt: Date;
    updatedAt: Date;
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
        description: string | null;
        date: Date;
        endDate: Date | null;
        type: string;
    }[];
};

type StudentEnrollment = {
    classId: string;
    class: {
        name: string;
        announcement: string | null;
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
            createdAt: Date;
            updatedAt: Date;
        }[];
        calendarEvents: {
            id: string;
            title: string;
            description: string | null;
            date: Date;
            endDate: Date | null;
            type: string;
        }[];
    };
};

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const userId = session.user.id;
    const admin = isTeacherAdmin(session.user);

    // Count daily app opens toward streak without blocking dashboard render.
    void trackLogin(userId).catch((err) => {
        logger.warn("Failed to track login for streak", { userId, error: String(err) });
    });

    if (userRole === "teacher") {
        // Teacher Dashboard
        const classes = await timedQuery(
            {
                route: "/dashboard",
                queryLabel: "class.findMany.teacherDashboard",
                userRole,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.class.findMany({
                        where: admin ? {} : { teacherId: userId },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            enrollments: {
                                where: {
                                    student: {
                                        isSystemAccount: false,
                                    },
                                },
                                select: {
                                    id: true,
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
                                select: {
                                    id: true,
                                    title: true,
                                    activityId: true,
                                    classId: true,
                                    isFeatured: true,
                                    dueDate: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    activity: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            type: true,
                                            category: true,
                                        },
                                    },
                                },
                            },
                            calendarEvents: {
                                select: {
                                    id: true,
                                    title: true,
                                    date: true,
                                    endDate: true,
                                    type: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    })
                ),
            (result) => result.length
        ) as TeacherClass[];

        const allAssignments = classes.flatMap((c: TeacherClass) => c.assignments);
        const featuredAssignments = allAssignments.filter((a: TeacherAssignment) => a.isFeatured);

        // When sections sync assignments, teacher dashboard can receive repeated entries.
        // Collapse same activity/title into a single checklist row and keep the newest.
        const dedupedFeaturedAssignments = Array.from(
            featuredAssignments.reduce<
                Map<string, { assignment: TeacherAssignment; sectionCount: number }>
            >((map, assignment) => {
                const dedupeKey = `${assignment.activityId}::${(assignment.title || assignment.activity.title || "").trim().toLowerCase()}`;
                const existing = map.get(dedupeKey);
                const assignmentFeaturedAt = (assignment.updatedAt ?? assignment.createdAt).getTime();
                const existingFeaturedAt = existing
                    ? (existing.assignment.updatedAt ?? existing.assignment.createdAt).getTime()
                    : -1;

                if (!existing) {
                    map.set(dedupeKey, { assignment, sectionCount: 1 });
                    return map;
                }

                const nextAssignment = assignmentFeaturedAt > existingFeaturedAt
                    ? assignment
                    : existing.assignment;
                map.set(dedupeKey, {
                    assignment: nextAssignment,
                    sectionCount: existing.sectionCount + 1,
                });
                return map;
            }, new Map<string, { assignment: TeacherAssignment; sectionCount: number }>())
                .values()
        );

        const featuredAssignmentsForDisplay = dedupedFeaturedAssignments.map(({ assignment, sectionCount }) => ({
            id: assignment.id,
            title: assignment.title,
            activityId: assignment.activityId,
            sectionCount,
            featuredAt: assignment.updatedAt ?? assignment.createdAt,
            isNewRelease: isWithinNewReleaseWindow(assignment.updatedAt ?? assignment.createdAt),
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
                    description: ev.description,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const totalStudents = classes.reduce((acc, c) => acc + c.enrollments.length, 0);
        const totalClasses = classes.length;
        const isTeacherUser = admin;
        const importantPageSections = [
            {
                heading: "Student Insights",
                links: [
                    {
                        href: "/dashboard/leaderboard",
                        title: "Leaderboard",
                        subtitle: "See who is leading this week.",
                        icon: TrophyIcon,
                    },
                    {
                        href: "/dashboard/stats",
                        title: "Student Stats",
                        subtitle: "Review progress, points, and engagement.",
                        icon: BarChartIcon,
                    },
                    {
                        href: "/dashboard/gradebook",
                        title: "Grammar Gradebook",
                        subtitle: "Check mini-quiz scores by student.",
                        icon: ClipboardIcon,
                    },
                ],
            },
            {
                heading: "Planning",
                links: [
                    {
                        href: "/dashboard/classes",
                        title: "Your Classes",
                        subtitle: "Manage classes, codes, and rosters.",
                        icon: UsersIcon,
                    },
                    {
                        href: "/dashboard/calendar/new",
                        title: "Add Event",
                        subtitle: "Post class dates, due dates, or reminders.",
                        icon: CalendarIcon,
                    },
                    {
                        href: "/dashboard/classes",
                        title: "Create Announcement",
                        subtitle: "Set a class announcement for students.",
                        icon: ClipboardIcon,
                    },
                    {
                        href: "/dashboard/teaching-schedule",
                        title: "Teaching Schedule",
                        subtitle: "Plan and review your weekly teaching flow.",
                        icon: CalendarIcon,
                    },
                ],
            },
            {
                heading: "Content & Setup",
                links: [
                    {
                        href: "/grammar-map",
                        title: "Grammar Map",
                        subtitle: "Browse all grammar topics and connections.",
                        icon: MapIcon,
                    },
                    {
                        href: "/dashboard/activities/new",
                        title: "Create Activity",
                        subtitle: "Build a new lesson, quiz, or guide.",
                        icon: BookOpenIcon,
                    },
                    {
                        href: "/dashboard/passwords",
                        title: "Reset Passwords",
                        subtitle: "Help students regain account access.",
                        icon: ClipboardIcon,
                    },
                ],
            },
        ];

        if (isTeacherUser) {
            importantPageSections[2].links.push({
                href: "/dashboard/backend",
                title: "Backend Users",
                subtitle: "View account roles and permission flags.",
                icon: UsersIcon,
            });
        }


        return (
            <div className="min-h-screen bg-bg">
                <main id="main-content" className="container mx-auto pt-4 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                    <div className="dashboard-shell grid grid-cols-1 gap-6 p-0 md:grid-cols-12 md:p-6 lg:p-8 md:items-start">
                        {/* Main Content Area - Left Side */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6 sm:space-y-8">
                            {/* Welcome Header */}
                            <div>
                                {/* Desktop: Welcome + Stats horizontal */}
                                <div className="hidden lg:flex items-center gap-6">
                                    <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0 tracking-tight">
                                        Welcome, <span className="font-display tracking-tight text-primary/90 relative inline-block">
                                            {session.user?.name === "Teacher User" ? "Teacher" : session.user?.name}
                                            <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#88A392]/45 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        {/* Total Students */}
                                        <div className="dashboard-pill flex items-center gap-2.5 border-emerald-200/50 dark:border-emerald-800/50 pl-2.5 pr-4 py-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                <UsersIcon className="text-secondary" size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Students</div>
                                                <div className="text-lg font-bold text-text leading-tight tabular-nums">{totalStudents} <span className="text-xs font-semibold text-text-muted">active</span></div>
                                            </div>
                                        </div>

                                        {/* Total Classes */}
                                        <div className="dashboard-pill flex items-center gap-2.5 border-blue-200/50 dark:border-blue-800/50 pl-2.5 pr-4 py-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                                                <StarIcon className="text-info" size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Classes</div>
                                                <div className="text-lg font-bold text-text leading-tight tabular-nums">{totalClasses} <span className="text-xs font-semibold text-text-muted">total</span></div>
                                            </div>
                                        </div>

                                        <TeacherPendingReviewsStat />

                                        {isTeacherUser && (
                                            <Link
                                                href="/dashboard/backend"
                                                className="dashboard-soft-button inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[var(--dashboard-surface-start)] px-4 py-2 text-sm font-semibold text-primary hover:border-primary/50 dark:border-primary/50 dark:bg-[var(--surface-elevated)]"
                                            >
                                                <UsersIcon size={14} />
                                                Backend Users
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile: Welcome */}
                                <div className="lg:hidden">
                                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4 leading-[1.15] tracking-tight">
                                        Welcome, <span className="font-display tracking-tight text-primary/90 relative inline-block">
                                            {session.user?.name === "Teacher User" ? "Teacher" : session.user?.name}
                                            <span className="absolute -bottom-0.5 left-0 right-0 h-1.5 sm:h-2 bg-[#88A392]/45 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        <div className="dashboard-pill flex items-center gap-2 border-emerald-200/50 dark:border-emerald-800/50 pl-2 pr-3 py-1.5">
                                            <div className="w-7 h-7 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                <UsersIcon className="text-secondary" size={14} />
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base font-bold text-text tabular-nums">{totalStudents}</span>
                                                <span className="text-[10px] font-semibold text-text-muted uppercase">students</span>
                                            </div>
                                        </div>

                                        <TeacherPendingReviewsStat mobile />

                                        {isTeacherUser && (
                                            <Link
                                                href="/dashboard/backend"
                                                className="dashboard-soft-button inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-[var(--dashboard-surface-start)] px-3 py-1.5 text-xs font-semibold text-primary dark:border-primary/50 dark:bg-[var(--surface-elevated)]"
                                            >
                                                <UsersIcon size={12} />
                                                Backend Users
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Quick Actions - Only visible on mobile */}
                            <section className="md:hidden">
                                <h2 className="text-lg font-bold font-display text-text mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-7">
                                    <Link
                                        href="/dashboard/classes"
                                        className="dashboard-panel flex flex-col items-center justify-center p-6 border-primary/20 dark:border-primary/40 hover:border-primary/40"
                                    >
                                        <UsersIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Classes</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/activities/new"
                                        className="dashboard-panel flex flex-col items-center justify-center p-6 border-secondary/20 dark:border-secondary/40 hover:border-secondary/40"
                                    >
                                        <BookOpenIcon className="w-6 h-6 text-secondary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Create Activity</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/stats"
                                        className="dashboard-panel flex flex-col items-center justify-center p-6 border-accent/20 dark:border-accent/40 hover:border-accent/40"
                                    >
                                        <BarChartIcon className="w-6 h-6 text-accent mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Student Stats</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/calendar/new"
                                        className="dashboard-panel flex flex-col items-center justify-center p-6 border-primary/20 dark:border-primary/40 hover:border-primary/40"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Add Event</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/teaching-schedule"
                                        className="dashboard-panel flex flex-col items-center justify-center p-6 border-primary/20 dark:border-primary/40 hover:border-primary/40"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Teaching Schedule</span>
                                    </Link>
                                </div>
                            </section>

                            {/* Featured Assignments (styled like student view) */}
                            <section>
                                <TodaysAssignments
                                    title="Weekly Checklist"
                                    ctaLabel="Open"
                                    initialAssignments={featuredAssignmentsForDisplay}
                                    variant="checklist"
                                    actions={<ClearFeaturedButton />}
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section>
                                <div className="dashboard-panel dashboard-panel-hover paper-texture rounded-2xl p-6 group relative overflow-hidden">
                                    {/* Decorative gradient blob */}
                                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-primary/14 via-accent/18 to-secondary/14 rounded-full blur-3xl opacity-55 group-hover:opacity-75 transition-opacity duration-500"></div>

                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-xs font-bold text-text-muted tracking-widest uppercase flex items-center gap-2">
                                                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary/60 to-secondary/40"></span>
                                                Explore
                                            </p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-2">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl leading-relaxed">
                                                Browse all activities organized by category. Feature assignments for your classes and create new content.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/activities"
                                            className="btn-polish dashboard-soft-button shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-b from-primary to-[color-mix(in_srgb,var(--primary-color)_88%,#000)] text-[color:var(--text-on-accent)] border border-primary/80 font-semibold text-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                                            style={{
                                                '--dashboard-button-shadow-override': '0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(176,87,64,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                                                '--dashboard-button-shadow-hover-override': '0 2px 4px rgba(0,0,0,0.12), 0 8px 18px rgba(176,87,64,0.32), inset 0 1px 0 rgba(255,255,255,0.24)',
                                            } as React.CSSProperties}
                                        >
                                            Browse
                                            <span className="arrow-animate">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar & Important Pages Sidebar (hidden on mobile) */}
                        <aside className="hidden md:block md:col-span-4 md:-mt-2 lg:col-span-3 lg:-mt-3">
                            <div className="dashboard-panel paper-texture sticky top-2 space-y-8 p-6 md:top-4">
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

                                <div className="mt-8 border-t pt-8 space-y-4" style={{ borderColor: 'var(--dashboard-divider)' }}>
                                    <h3 className="text-sm font-semibold text-text">Important Pages</h3>
                                    <p className="text-xs text-text-muted">
                                        Organized by task so you can find tools faster.
                                    </p>
                                    {importantPageSections.map((section) => (
                                        <div key={section.heading} className="space-y-1.5">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                                                {section.heading}
                                            </p>
                                            <div className="flex flex-col gap-1.5">
                                                {section.links.map((link) => {
                                                    const Icon = link.icon;
                                                    return (
                                                        <Link
                                                            key={`${section.heading}-${link.title}`}
                                                            href={link.href}
                                                            className="quick-link w-full rounded-2xl border px-4 py-3 text-text flex items-start gap-3"
                                                            style={{ borderColor: 'var(--dashboard-divider)' }}
                                                        >
                                                            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <div className="leading-tight">
                                                                <p className="text-sm font-semibold text-text">{link.title}</p>
                                                                <p className="text-xs text-text-muted mt-0.5">{link.subtitle}</p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div className="max-w-[1800px] mx-auto mt-12 pb-8 px-4 sm:px-6 lg:px-10 flex justify-center md:justify-end">
                        <LogoutButton />
                    </div>
                </main>

            </div>
        );
    } else {
        // Student Dashboard
        const enrollments = await timedQuery(
            {
                route: "/dashboard",
                queryLabel: "classEnrollment.findMany.studentDashboard",
                userRole,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.classEnrollment.findMany({
                        where: { studentId: userId },
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
                                            dueDate: true,
                                            createdAt: true,
                                            updatedAt: true,
                                            activity: {
                                                select: {
                                                    id: true,
                                                    title: true,
                                                    description: true,
                                                    type: true,
                                                    category: true,
                                                    content: true,
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: "desc" },
                                    },
                                    calendarEvents: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            date: true,
                                            endDate: true,
                                            type: true,
                                        },
                                    },
                                },
                            },
                        },
                    })
                ),
            (result) => result.length
        ) as StudentEnrollment[];

        type ReleasableAssignment = {
            activity: {
                type: string;
                content?: string | null;
            };
        };

        // Filter out unreleased speaking activities from assignments
        const filterReleasedActivities = (assignment: ReleasableAssignment) => {
            if (assignment.activity.type !== "speaking") {
                return true; // Show all non-speaking activities
            }
            if (!assignment.activity.content) {
                return false;
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
        const classAnnouncements = enrollments
            .map((enrollment: StudentEnrollment) => ({
                className: enrollment.class.name,
                message: enrollment.class.announcement?.trim() || "",
                messageHtml: renderAnnouncementMarkdown(enrollment.class.announcement),
            }))
            .filter((announcement) => announcement.message.length > 0);

        const classIds = enrollments.map(e => e.classId);
        const featuredAssignmentsRawUnfiltered = classIds.length === 0 ? [] : await timedQuery(
            {
                route: "/dashboard",
                queryLabel: "assignment.findMany.featuredStudentDashboard",
                userRole,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                isFeatured: true,
                activity: { id: { not: "" } }
            },
            include: {
                activity: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        content: true,
                    },
                },
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
                    })
                ),
            (result) => result.length
        );

        // Filter out unreleased speaking activities from featured assignments
        const featuredAssignmentsRaw = featuredAssignmentsRawUnfiltered.filter(filterReleasedActivities);

        const featuredActivityIds = Array.from(new Set(featuredAssignmentsRaw.map((a) => a.activityId)));
        const featuredProgressRows =
            featuredActivityIds.length === 0
                ? []
                : await timedQuery(
                    {
                        route: "/dashboard",
                        queryLabel: "activityProgress.findMany.featuredActivities",
                        userRole,
                    },
                    () =>
                        withPrismaReadRetry(() =>
                            prisma.activityProgress.findMany({
                      where: { userId, activityId: { in: featuredActivityIds } },
                      select: { activityId: true, progress: true, status: true, categoryData: true, updatedAt: true },
                      orderBy: { updatedAt: "desc" },
                            })
                        ),
                    (result) => result.length
                );

        const featuredProgressMap = (featuredProgressRows as Array<{
            activityId: string;
            progress: number;
            status: string;
            categoryData: string | null;
        }>).reduce<Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>>(
            (map, row) => {
                if (map.has(row.activityId)) {
                    return map;
                }

                map.set(row.activityId, {
                    progress: row.progress,
                    status: row.status,
                    categoryData: parseCategoryData(row.categoryData),
                });
                return map;
            },
            new Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>()
        );

        let vocabReviewSummary = null;
        try {
            vocabReviewSummary = await getVocabReviewSummaryForUser(prisma, userId);
        } catch (error) {
            logger.warn("Failed to load vocab review dashboard summary", {
                userId,
                error: String(error),
            });
        }

        const featuredAssignments = featuredAssignmentsRaw
            .map((a) => {
                const p = featuredProgressMap.get(a.activityId);
                const isGrammarGuide =
                    (a.activity.type || "").toLowerCase() === "guide" &&
                    (a.activity.category || "").toLowerCase() === "grammar";
                const hasPassedMiniQuiz = isGrammarGuide && a.submissions.some(
                    (s) => !!s.completedAt && typeof s.score === "number" && s.score > 70
                );
                
                const isDailyVocab = a.activityId === 'vocab-daily-review';
                
                return {
                    ...a,
                    href: isDailyVocab ? "/dashboard/vocab-review" : undefined,
                    featuredAt: a.updatedAt ?? a.createdAt,
                    isNewRelease: isWithinNewReleaseWindow(a.updatedAt ?? a.createdAt),
                    progress: hasPassedMiniQuiz ? 100 : (p?.progress ?? 0),
                    progressStatus: hasPassedMiniQuiz ? "completed" : (p?.status ?? "in_progress"),
                    categoryData: p?.categoryData ?? null,
                };
            })
            .filter((a) => {
                // If it's the daily vocab assignment, hide it if there's nothing left to review today
                if (a.activityId === 'vocab-daily-review' && vocabReviewSummary) {
                    return vocabReviewSummary.dueCount > 0 || vocabReviewSummary.newCount > 0;
                }
                return true;
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
                enrollment.class.calendarEvents.map((ev: { id: string; date: Date; endDate: Date | null; type: string; title: string; description: string | null }) => ({
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                    description: ev.description,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const firstClassId = enrollments[0]?.classId;
        const studentLeaderboard = firstClassId ? await getTimeframedLeaderboard("week", 20, firstClassId) : [];
        const studentEntry = studentLeaderboard.find((e) => e.id === userId);
        const studentLeaderboardRank = studentEntry && studentEntry.rank <= 3 ? studentEntry.rank : null;
        const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;
        const isMarlie = (session.user as { username?: string })?.username?.toLowerCase() === "marlie";
        const desktopNameEmoji = isMarlie ? "🙋🏻‍♀️" : studentLeaderboardMedal;

        return (
            <div className="min-h-screen bg-bg">
                <main id="main-content" className="container mx-auto pt-2 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                    <div className="dashboard-shell grid grid-cols-1 gap-6 p-0 md:grid-cols-12 md:p-6 lg:p-8 md:items-start">
                        {/* Main Content Area - Left Side */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6 sm:space-y-8">
                            {/* Welcome Header */}
                            <div className="hidden lg:flex items-center gap-6">
                                <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0 tracking-tight" style={{ textWrap: 'balance' }}>
                                    Welcome, <span className="font-display tracking-tight text-primary/90 relative inline-block">
                                        {session.user?.name}
                                        <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#88A392]/45 -z-10 rounded-sm transform -rotate-1"></span>
                                    </span>
                                    {desktopNameEmoji && <span className="ml-1.5 inline-block text-3xl leading-none" {...(isMarlie ? { "aria-hidden": true } : { "aria-label": `Rank ${studentLeaderboardRank}` })}>{desktopNameEmoji}</span>}
                                    !
                                </h1>
                            </div>

                            <ClassAnnouncement announcements={classAnnouncements} />

                            {/* This Week's Activities */}
                            <section>
                                <TodaysAssignments
                                    initialAssignments={featuredAssignments}
                                    title="Weekly Checklist"
                                    ctaLabel="Start"
                                    variant="checklist"
                                    mobileTasksLinkHref="/dashboard/activities"
                                    mobileTasksLinkLabel="All Activities"
                                    showStudentStats
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section className="hidden md:block">
                                <div className="dashboard-panel dashboard-panel-hover paper-texture p-6 group relative overflow-hidden">
                                    {/* Decorative gradient blob */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/12 via-accent/18 to-secondary/12 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-xs font-bold text-text-muted tracking-widest uppercase flex items-center gap-2">
                                                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary/60 to-secondary/40"></span>
                                                Explore
                                            </p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-2">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl leading-relaxed">
                                                Keep building your skills — browse by category and track your progress.
                                            </p>
                                            {/* Category quick-jump chips */}
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {[
                                                    { label: 'Grammar', href: '/dashboard/activities?category=grammar', tone: getLearnerCategoryTone('grammar') },
                                                    { label: 'Vocabulary', href: '/dashboard/activities?category=vocabulary', tone: getLearnerCategoryTone('vocabulary') },
                                                    { label: 'Quizzes', href: '/dashboard/activities?category=quizzes', tone: getLearnerCategoryTone('quizzes') },
                                                    { label: 'Games', href: '/dashboard/activities?category=games', tone: getLearnerCategoryTone('games') },
                                                    { label: 'Pronunciation', href: '/dashboard/activities?category=pronunciation', tone: getLearnerCategoryTone('pronunciation') },
                                                ].map(chip => (
                                                    <Link
                                                        key={chip.label}
                                                        href={chip.href}
                                                        className="dashboard-soft-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border active:scale-95 transition-all duration-200"
                                                        style={{
                                                            color: chip.tone.chipText,
                                                            backgroundColor: chip.tone.chipBg,
                                                            borderColor: chip.tone.border,
                                                            '--dashboard-button-shadow-override': 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.05), 0 6px 14px rgba(40,31,23,0.05)',
                                                            '--dashboard-button-shadow-hover-override': 'inset 0 1px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(0,0,0,0.06), 0 10px 18px rgba(40,31,23,0.08)',
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
                                                '--dashboard-button-shadow-override': '0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(176,87,64,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                                                '--dashboard-button-shadow-hover-override': '0 2px 4px rgba(0,0,0,0.12), 0 8px 18px rgba(176,87,64,0.32), inset 0 1px 0 rgba(255,255,255,0.24)',
                                            } as React.CSSProperties}
                                        >
                                            Browse
                                            <span className="arrow-animate">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar Sidebar - Right Side (hidden on mobile) */}
                        <aside className="hidden md:block md:col-span-4 md:-mt-2 lg:col-span-3 lg:-mt-3">
                            <div className="dashboard-panel paper-texture sticky top-2 space-y-8 p-6 md:top-4">
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
                                    showSyncedLabel={false}
                                />
                            </div>
                        </aside>
                    </div>

                </main>

            </div>
        );
    }
}
