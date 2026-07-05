import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { isAdmin } from "@/lib/auth/roles";
import Link from "next/link";
import {
    Users, BookOpen, Calendar, BarChart2, Eye, AlertCircle, Clock,
    MapPin, GraduationCap, Megaphone, Trophy, LayoutGrid, ArrowRight,
    AlertTriangle, Plus,
} from "lucide-react";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";
import { TeachClassSwitcher } from "@/components/teach/TeachClassSwitcher";
import { getTimeframedLeaderboard } from "@/lib/gamification/gamification";
import { resolveTeachClassId } from "@/lib/teach/active-class";

async function getActiveClass(userId: string, admin: boolean, classId: string) {
    const cls = await withPrismaReadRetry(() =>
        prisma.class.findFirst({
            where: {
                id: classId,
                ...(admin ? {} : { teacherId: userId }),
            },
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

function AvatarInitial({ name, color }: { name: string; color: string }) {
    return (
        <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white"
            style={{ background: color }}
            aria-hidden="true"
        >
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export default async function TeachHomePage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const params = await searchParams;
    const userId = session.user.id;
    const admin = isAdmin(session.user);
    const { classId: resolvedClassId, classes: classOptions } = await resolveTeachClassId(
        userId,
        admin,
        params.classId
    );

    const { cls, pendingReviews, leaderboard } = resolvedClassId
        ? await getActiveClass(userId, admin, resolvedClassId)
        : { cls: null, pendingReviews: 0, leaderboard: [] };

    const firstName = (session.user.name ?? session.user.username ?? "").split(" ")[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    if (!cls) {
        return (
            <div className="space-y-6 text-[#2d261f]">
                <div className="space-y-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dddeda] px-3 py-1.5 text-xs font-bold text-[#345476]">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Teaching · Class workspace
                    </span>
                    <div className="space-y-1">
                        <h1 className="font-display text-2xl font-bold text-[#2d261f] sm:text-3xl">
                            {greeting}, {firstName}
                        </h1>
                        <p className="text-sm font-medium text-[#756b60]">
                            Create a class to start assigning activities and tracking student progress.
                        </p>
                    </div>
                </div>
                <div
                    className="rounded-xl border border-dashed bg-[#f6f5f2] p-12 text-center"
                    style={{ borderColor: "#c9c0b5" }}
                >
                    <p className="mb-4 text-sm font-medium text-[#9a9186]">No class yet — create one to get started.</p>
                    <Link
                        href="/dashboard/classes"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow"
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

    const statCards = [
        {
            label: "Active Students",
            value: activeCount,
            Icon: GraduationCap,
            color: "#345476",
            href: `/teach/classes/${cls.id}`,
            sub: `enrolled in ${cls.name}`,
            warn: false,
        },
        {
            label: "Needs Attention",
            value: attentionStudents.length,
            Icon: AlertTriangle,
            color: attentionStudents.length > 0 ? "#c86531" : "#4f8b64",
            href: `/teach/classes/${cls.id}`,
            sub: "silent 7+ days",
            warn: attentionStudents.length > 0,
        },
        {
            label: "Upcoming Assignments",
            value: cls.assignments.length,
            Icon: Calendar,
            color: "#b75b3f",
            href: `/dashboard/classes/${cls.id}/assignments/new`,
            sub: "due in the next 2 weeks",
            warn: false,
        },
    ];

    const teachingTools = [
        { href: `/teach/classes/${cls.id}`, label: "Roster", Icon: Users, desc: "View & manage students", color: "#4a8ca0" },
        { href: "/teach/activities", label: "Activities", Icon: BookOpen, desc: "Browse & release content", color: "#b05740" },
        { href: "/teach/calendar", label: "Calendar", Icon: Calendar, desc: "Schedule & deadlines", color: "#6a8d73" },
        { href: `/teach/gradebook?classId=${cls.id}`, label: "Gradebook", Icon: GraduationCap, desc: "Mini-quiz scores", color: "#345476" },
        { href: "/teach/reports", label: "Reports", Icon: BarChart2, desc: "Progress & analytics", color: "#8a7abc" },
        { href: "/teach/map", label: "Course Map", Icon: MapPin, desc: currentWeek ? `Week ${currentWeek.number} revealed` : "Manage week reveals", color: "#c86633" },
    ];

    return (
        <div className="space-y-6 text-[#2d261f]">
            <div className="space-y-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dddeda] px-3 py-1.5 text-xs font-bold text-[#345476]">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Teaching · Class workspace
                </span>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="font-display text-2xl font-bold text-[#2d261f] sm:text-3xl">
                            {cls.name}
                        </h1>
                        <p className="max-w-4xl text-sm font-medium text-[#756b60]">
                            {greeting}, <strong className="font-bold text-[#2d261f]">{firstName}</strong>
                            {" · "}Join code <span className="font-mono font-bold tracking-widest text-[#2d261f]">{cls.code}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <TeachClassSwitcher
                            classes={classOptions}
                            selectedClassId={cls.id}
                        />
                        <Link
                            href={`/teach/classes/${cls.id}`}
                            className="inline-flex items-center gap-1.5 rounded border px-3 py-2 text-sm font-bold text-[#345476] transition-colors hover:bg-[#f4f2ee]"
                            style={{ borderColor: "#bdb7af" }}
                        >
                            Class settings
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {statCards.map(({ label, value, Icon, color, href, sub, warn }) => (
                    <Link
                        key={label}
                        href={href}
                        className="group min-h-[130px] rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(45,38,31,0.10)]"
                        style={{ borderColor: warn ? `${color}66` : "#c9c9c7" }}
                    >
                        <div className="flex h-full flex-col justify-between gap-4">
                            <div className="flex items-start justify-between">
                                <span
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_6px_14px_rgba(45,38,31,0.12)]"
                                    style={{ background: color }}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                {warn ? <AlertTriangle className="h-4 w-4" style={{ color }} /> : null}
                            </div>
                            <div>
                                <p
                                    className="text-3xl font-extrabold leading-none tabular-nums"
                                    style={{ color: warn ? color : "#2d261f" }}
                                >
                                    {value.toLocaleString()}
                                </p>
                                <p className="mt-1.5 text-sm font-bold text-[#6d6358]">{label}</p>
                                {sub ? <p className="mt-0.5 text-xs font-medium text-[#9a9186]">{sub}</p> : null}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <section>
                        <h2 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                            Teaching tools
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            {teachingTools.map(({ href, label, Icon, desc, color }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group flex min-h-[72px] items-center gap-3 rounded-xl border bg-[#fbfbfa] px-4 py-3 shadow-[0_4px_14px_rgba(45,38,31,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(45,38,31,0.08)]"
                                    style={{ borderColor: "#c9c9c7" }}
                                >
                                    <span
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-[0_4px_10px_rgba(45,38,31,0.12)]"
                                        style={{ background: color }}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-bold text-[#2d261f]">{label}</span>
                                        <span className="mt-0.5 block truncate text-xs font-medium text-[#9a9186]">{desc}</span>
                                    </span>
                                </Link>
                            ))}
                            <Link
                                href={`/teach/classes/${cls.id}`}
                                className="flex min-h-[72px] items-center justify-center gap-2 rounded-xl border border-dashed bg-[#f6f5f2] px-4 py-3 text-sm font-bold text-[#a79d91] transition-colors hover:bg-[#f0eeea]"
                                style={{ borderColor: "#c9c0b5" }}
                            >
                                <Plus className="h-4 w-4" />
                                Class settings
                            </Link>
                        </div>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                                Upcoming assignments
                            </h2>
                            <Link
                                href={`/dashboard/classes/${cls.id}/assignments/new`}
                                className="text-xs font-bold text-[#b05740]"
                            >
                                + Assign
                            </Link>
                        </div>
                        <div
                            className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]"
                            style={{ borderColor: "#c9c9c7" }}
                        >
                            {cls.assignments.length === 0 ? (
                                <p className="text-sm font-medium text-[#9a9186]">
                                    No upcoming assignments in the next two weeks.
                                </p>
                            ) : (
                                <ul className="divide-y" style={{ borderColor: "#d5d1cc" }}>
                                    {cls.assignments.map((assignment) => (
                                        <li key={assignment.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                            <span className="min-w-0 truncate text-sm font-bold text-[#2d261f]">
                                                {assignment.activity.title}
                                            </span>
                                            {assignment.dueDate ? (
                                                <span className="shrink-0 rounded-full bg-[#f0eeea] px-2.5 py-1 text-xs font-bold text-[#6d6358]">
                                                    {formatDueDate(assignment.dueDate)}
                                                </span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {attentionStudents.length > 0 ? (
                        <section>
                            <h2 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                                Needs attention
                            </h2>
                            <div
                                className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]"
                                style={{ borderColor: attentionStudents.length > 0 ? "#e8b4a8" : "#c9c9c7" }}
                            >
                                <ul className="divide-y" style={{ borderColor: "#d5d1cc" }}>
                                    {attentionStudents.slice(0, 6).map((student) => (
                                        <li key={student.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                            <AvatarInitial name={student.name ?? student.username} color="#c86531" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-[#2d261f]">
                                                    {student.name ?? student.username}
                                                </p>
                                                <p className="text-xs font-medium text-[#9a9186]">
                                                    {student.lastActivityDate
                                                        ? `Last active ${daysAgo(student.lastActivityDate)}d ago`
                                                        : "Never active"}
                                                </p>
                                            </div>
                                            <AlertCircle className="h-4 w-4 shrink-0 text-[#c86531]" />
                                        </li>
                                    ))}
                                </ul>
                                {attentionStudents.length > 6 ? (
                                    <p className="mt-3 border-t pt-3 text-center text-xs font-medium text-[#9a9186]" style={{ borderColor: "#d5d1cc" }}>
                                        +{attentionStudents.length - 6} more students
                                    </p>
                                ) : null}
                            </div>
                        </section>
                    ) : null}

                    {leaderboard.length > 0 ? (
                        <section>
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="flex items-center gap-1.5 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                                    <Trophy className="h-3.5 w-3.5 text-[#d08721]" />
                                    This week
                                </h2>
                                <Link href="/dashboard/leaderboard" className="text-xs font-bold text-[#b05740]">
                                    Full board →
                                </Link>
                            </div>
                            <div
                                className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]"
                                style={{ borderColor: "#c9c9c7" }}
                            >
                                <ul className="divide-y" style={{ borderColor: "#d5d1cc" }}>
                                    {leaderboard.map((entry, idx) => {
                                        const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                                        return (
                                            <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                                <span className="w-5 shrink-0 text-center text-sm">
                                                    {medal ?? <span className="text-xs font-bold tabular-nums text-[#9a9186]">{idx + 1}</span>}
                                                </span>
                                                <AvatarInitial name={entry.name} color="#6a8d73" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-[#2d261f]">{entry.name}</p>
                                                    {entry.currentStreak > 0 ? (
                                                        <p className="text-xs font-medium text-[#9a9186]">🔥 {entry.currentStreak} day streak</p>
                                                    ) : null}
                                                </div>
                                                <span className="shrink-0 text-sm font-bold tabular-nums text-[#b05740]">
                                                    {entry.weeklyPoints} pts
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </section>
                    ) : null}
                </div>

                <aside className="space-y-6">
                    {pendingReviews > 0 ? (
                        <section
                            className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.08)]"
                            style={{ borderColor: "#e8b4a8" }}
                        >
                            <h2 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                                Pending reviews
                            </h2>
                            <Link
                                href="/dashboard/students"
                                className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-[#f4f2ee]"
                                style={{ borderColor: "#d5d1cc" }}
                            >
                                <span
                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                                    style={{ background: "#b05740" }}
                                >
                                    <Clock className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-2xl font-extrabold tabular-nums text-[#b05740]">{pendingReviews}</p>
                                    <p className="text-sm font-bold text-[#6d6358]">speaking submissions to review</p>
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 text-[#9a9186]" />
                            </Link>
                        </section>
                    ) : null}

                    <section
                        className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.08)]"
                        style={{ borderColor: "#c9c9c7" }}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <Megaphone className="h-4 w-4 shrink-0 text-[#b05740]" />
                            <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                                Announcement
                            </h2>
                        </div>
                        <ClassAnnouncementEditor
                            classId={cls.id}
                            initialAnnouncement={cls.announcement ?? null}
                        />
                    </section>

                    <section className="flex items-center gap-3 rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]" style={{ borderColor: "#c9c9c7" }}>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4e5df] text-[#c86633]">
                            <Eye className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-bold text-[#2d261f]">Course Map</h2>
                            <p className="text-xs font-medium leading-snug text-[#9a9186]">
                                {currentWeek
                                    ? `Students can see up to Week ${currentWeek.number}${currentWeek.title ? ` · ${currentWeek.title}` : ""}`
                                    : "No weeks revealed yet"}
                            </p>
                        </div>
                        <Link
                            href="/teach/map"
                            className="inline-flex shrink-0 items-center gap-1 rounded border px-3 py-2 text-sm font-bold text-[#345476] transition-colors hover:bg-[#f4f2ee]"
                            style={{ borderColor: "#bdb7af" }}
                        >
                            Manage <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>
                </aside>
            </div>
        </div>
    );
}
