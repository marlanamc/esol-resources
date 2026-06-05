import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { isAdmin } from "@/lib/roles";
import Link from "next/link";
import {
    Users, BookOpen, Calendar, BarChart2, ChevronRight,
    Eye, AlertCircle, Clock, MapPin, UserCheck, Megaphone, Trophy,
} from "lucide-react";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";
import { getTimeframedLeaderboard } from "@/lib/gamification";

async function getActiveClass(userId: string, admin: boolean) {
    const cls = await withPrismaReadRetry(() =>
        prisma.class.findFirst({
            where: admin ? {} : { teacherId: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                code: true,
                announcement: true,
                classReveals: {
                    orderBy: { week: { number: "desc" } },
                    take: 1,
                    select: { week: { select: { number: true, title: true } } },
                },
                assignments: {
                    where: {
                        dueDate: {
                            gte: new Date(),
                            lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                        },
                    },
                    orderBy: { dueDate: "asc" },
                    take: 4,
                    select: {
                        id: true,
                        dueDate: true,
                        activity: { select: { title: true } },
                    },
                },
                enrollments: {
                    where: { status: "active" },
                    select: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                lastActivityDate: true,
                                currentStreak: true,
                                weeklyPoints: true,
                            },
                        },
                    },
                },
            },
        })
    );

    const [pendingReviews, leaderboard] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.speakingSubmission.count({
                where: {
                    status: "submitted",
                    ...(admin ? {} : { session: { teacherId: userId } }),
                },
            })
        ),
        cls ? getTimeframedLeaderboard("week", 20, cls.id) : Promise.resolve([]),
    ]);

    return { cls, pendingReviews, leaderboard };
}

const daysAgo = (date: Date) => Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));

function getNeedsAttentionStudents(
    enrollments: { student: { id: string; name: string | null; username: string; lastActivityDate: Date | null } }[]
) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return enrollments
        .filter((e) => !e.student.lastActivityDate || e.student.lastActivityDate.getTime() < cutoff)
        .map((e) => e.student);
}

function formatDueDate(date: Date): string {
    const diff = date.getTime() - Date.now();
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function TeachHomePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = session.user.id;
    const admin = isAdmin(session.user);
    const { cls, pendingReviews, leaderboard } = await getActiveClass(userId, admin);

    const firstName = (session.user.name ?? session.user.username ?? "").split(" ")[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    if (!cls) {
        return (
            <div className="space-y-6">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text">
                    {greeting}, {firstName}
                </h1>
                <div
                    className="rounded-2xl border-2 border-dashed p-12 text-center"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <p className="text-text-muted mb-4 text-sm">No class yet — create one to get started.</p>
                    <Link
                        href="/dashboard/classes"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow"
                        style={{ background: "var(--primary)" }}
                    >
                        Create a class
                    </Link>
                </div>
            </div>
        );
    }

    const activeCount = cls.enrollments.length;
    const currentWeek = cls.classReveals[0]?.week ?? null;
    const attentionStudents = getNeedsAttentionStudents(cls.enrollments);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <p className="text-text-muted text-sm mb-0.5">{greeting}, {firstName}</p>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-text">
                        {cls.name}
                    </h1>
                    <p className="text-xs text-text-muted mt-1 font-mono tracking-widest">
                        Join code: <span className="font-bold text-text">{cls.code}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {pendingReviews > 0 && (
                        <Link
                            href="/dashboard/students"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
                            style={{ background: "var(--primary)" }}
                        >
                            <Clock className="h-4 w-4" />
                            {pendingReviews} to review
                        </Link>
                    )}
                    <Link
                        href={`/teach/classes/${cls.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors hover:bg-[var(--surface-subtle)]"
                        style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                    >
                        Class settings
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
                <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white text-sm"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <Users className="h-4 w-4 shrink-0" style={{ color: "#4a8ca0" }} />
                    <span className="font-bold text-text">{activeCount}</span>
                    <span className="text-text-muted">active student{activeCount !== 1 ? "s" : ""}</span>
                </div>
                <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white text-sm"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <Eye className="h-4 w-4 shrink-0" style={{ color: "#6a8d73" }} />
                    {currentWeek ? (
                        <>
                            <span className="font-bold text-text">Week {currentWeek.number}</span>
                            {currentWeek.title && (
                                <span className="text-text-muted truncate max-w-[140px]">{currentWeek.title}</span>
                            )}
                        </>
                    ) : (
                        <span className="text-text-muted italic">No weeks revealed</span>
                    )}
                </div>
                {attentionStudents.length > 0 && (
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white text-sm"
                        style={{ borderColor: "#f9a8d4", background: "#fff1f5" }}
                    >
                        <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                        <span className="font-bold text-warning">{attentionStudents.length}</span>
                        <span style={{ color: "#be185d" }}>silent 7+ days</span>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-5">
                    {/* Upcoming assignments */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                                Upcoming assignments
                            </h2>
                            <Link
                                href={`/dashboard/classes/${cls.id}/assignments/new`}
                                className="text-xs font-semibold"
                                style={{ color: "var(--primary)" }}
                            >
                                + Assign
                            </Link>
                        </div>
                        {cls.assignments.length === 0 ? (
                            <div
                                className="rounded-xl border p-5 text-sm text-text-muted text-center"
                                style={{ borderColor: "var(--border-subtle)", background: "var(--surface-subtle)" }}
                            >
                                No upcoming assignments in the next two weeks.
                            </div>
                        ) : (
                            <ul
                                className="rounded-xl border bg-white divide-y overflow-hidden"
                                style={{ borderColor: "var(--border-subtle)" }}
                            >
                                {cls.assignments.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                        <span className="text-sm text-text font-medium truncate min-w-0">
                                            {a.activity.title}
                                        </span>
                                        {a.dueDate && (
                                            <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] text-text-muted">
                                                {formatDueDate(a.dueDate)}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Needs attention */}
                    {attentionStudents.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                                Needs attention
                            </h2>
                            <ul
                                className="rounded-xl border bg-white divide-y overflow-hidden"
                                style={{ borderColor: "#f9a8d4" }}
                            >
                                {attentionStudents.slice(0, 6).map((s) => (
                                    <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                                        <span
                                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                            style={{ background: "#be185d" }}
                                        >
                                            {(s.name ?? s.username).charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-text truncate min-w-0">
                                            {s.name ?? s.username}
                                        </span>
                                        <span className="ml-auto text-xs text-text-muted shrink-0">
                                            {s.lastActivityDate
                                                ? `${daysAgo(s.lastActivityDate)}d ago`
                                                : "Never active"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {attentionStudents.length > 6 && (
                                <p className="text-xs text-text-muted mt-2 text-center">
                                    +{attentionStudents.length - 6} more
                                </p>
                            )}
                        </section>
                    )}

                    {/* Class leaderboard */}
                    {leaderboard.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                    <Trophy className="h-3.5 w-3.5" style={{ color: "#e9c46a" }} />
                                    This week
                                </h2>
                                <Link href="/dashboard/leaderboard" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                                    Full board →
                                </Link>
                            </div>
                            <ul className="rounded-xl border bg-white divide-y overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
                                {leaderboard.map((entry, idx) => {
                                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                                    return (
                                        <li key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
                                            <span className="w-5 text-center text-sm shrink-0">
                                                {medal ?? <span className="text-xs text-text-muted tabular-nums">{idx + 1}</span>}
                                            </span>
                                            <span
                                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                                style={{ background: "var(--secondary)" }}
                                            >
                                                {entry.name.charAt(0).toUpperCase()}
                                            </span>
                                            <span className="text-sm font-medium text-text truncate min-w-0 flex-1">
                                                {entry.name}
                                            </span>
                                            <span className="text-xs font-semibold tabular-nums shrink-0" style={{ color: "var(--primary)" }}>
                                                {entry.weeklyPoints} pts
                                            </span>
                                            {entry.currentStreak > 0 && (
                                                <span className="text-xs text-text-muted shrink-0">
                                                    🔥{entry.currentStreak}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Right rail: quick links + course map */}
                <div className="space-y-4">
                    <section>
                        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                            Quick access
                        </h2>
                        <div className="space-y-2">
                            {[
                                {
                                    href: `/dashboard/classes/${cls.id}`,
                                    label: "Roster",
                                    desc: "View & manage students",
                                    Icon: UserCheck,
                                    color: "#4a8ca0",
                                },
                                {
                                    href: "/teach/activities",
                                    label: "Activities",
                                    desc: "Browse & release content",
                                    Icon: BookOpen,
                                    color: "#b05740",
                                },
                                {
                                    href: "/teach/calendar",
                                    label: "Calendar",
                                    desc: "Schedule & deadlines",
                                    Icon: Calendar,
                                    color: "#6a8d73",
                                },
                                {
                                    href: "/teach/reports",
                                    label: "Reports",
                                    desc: "Progress & analytics",
                                    Icon: BarChart2,
                                    color: "#8a7abc",
                                },
                            ].map(({ href, label, desc, Icon, color }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-shadow hover:shadow-md"
                                    style={{ borderColor: "var(--border-subtle)" }}
                                >
                                    <span
                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                                        style={{ background: color }}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-text">{label}</p>
                                        <p className="text-xs text-text-muted">{desc}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-text-muted ml-auto shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Course map reveal */}
                    <div
                        className="rounded-xl border bg-white px-4 py-4"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#b05740" }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-text">Course Map</p>
                                <p className="text-xs text-text-muted mt-0.5">
                                    {currentWeek
                                        ? `Students can see up to Week ${currentWeek.number}`
                                        : "No weeks revealed yet"}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/map"
                            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-[var(--surface-subtle)]"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Manage reveals
                        </Link>
                    </div>

                    {/* Announcement editor */}
                    <div
                        className="rounded-xl border bg-white px-4 py-4"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Megaphone className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                            <p className="text-sm font-semibold text-text">Announcement</p>
                        </div>
                        <ClassAnnouncementEditor
                            classId={cls.id}
                            initialAnnouncement={cls.announcement ?? null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
