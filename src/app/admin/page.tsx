import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";
import Link from "next/link";
import {
    Users, BookOpen, GraduationCap, Activity,
    AlertTriangle, BarChart2, Stethoscope,
    MapPin, ScrollText, Plus, ShieldCheck, ArrowRight, Flame,
} from "lucide-react";

async function getAdminStats() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const independentLearnerWhere = buildIndependentLearnerWhere();

    const [
        totalStudents,
        activeStudents,
        activitiesByKind,
        studentsNeedingAttention,
        recentlyActive,
        independentTotal,
        independentActive,
        independentNewThisMonth,
        independentRecent,
    ] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: { role: "student", isSystemAccount: false },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    lastActivityDate: { gte: sevenDaysAgo },
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.activity.groupBy({
                by: ["contentKind"],
                where: { deletedAt: null },
                _count: { id: true },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.classEnrollment.count({
                where: {
                    status: "active",
                    student: {
                        isSystemAccount: false,
                        OR: [
                            { lastActivityDate: null },
                            { lastActivityDate: { lt: sevenDaysAgo } },
                        ],
                    },
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.findMany({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    lastActivityDate: { gte: sevenDaysAgo },
                },
                orderBy: { lastActivityDate: "desc" },
                take: 8,
                select: {
                    id: true,
                    username: true,
                    name: true,
                    currentStreak: true,
                    lastActivityDate: true,
                    weeklyPoints: true,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    ...independentLearnerWhere,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    lastActivityDate: { gte: sevenDaysAgo },
                    ...independentLearnerWhere,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    createdAt: { gte: monthStart },
                    ...independentLearnerWhere,
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.user.findMany({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    ...independentLearnerWhere,
                },
                orderBy: [{ lastActivityDate: "desc" }, { createdAt: "desc" }],
                take: 5,
                select: {
                    id: true,
                    username: true,
                    name: true,
                    currentStreak: true,
                    lastActivityDate: true,
                    weeklyPoints: true,
                },
            })
        ),
    ]);

    const countByKind = Object.fromEntries(
        activitiesByKind.map((k) => [k.contentKind, k._count.id])
    );

    return {
        totalStudents,
        activeStudents,
        practiceActivities: countByKind["practice"] ?? 0,
        mapActivities: countByKind["map"] ?? 0,
        studentsNeedingAttention,
        recentlyActive,
        independentTotal,
        independentActive,
        independentNewThisMonth,
        independentRecent,
    };
}

function msSince(date: Date) { return Date.now() - date.getTime(); }

function RelativeTime({ date }: { date: Date | null }) {
    if (!date) return <span className="text-text-light">Never</span>;
    const diff = msSince(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return <span>Just now</span>;
    if (hours < 24) return <span>{hours}h ago</span>;
    const days = Math.floor(hours / 24);
    if (days < 7) return <span>{days}d ago</span>;
    return <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>;
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const stats = await getAdminStats();
    const firstName = (session.user.name ?? session.user.username ?? "").split(" ")[0];

    type StatCard = {
        label: string;
        value: number;
        Icon: React.ComponentType<{ className?: string }>;
        color: string;
        href: string;
        sub?: string;
        warn?: boolean;
    };

    const statCards: StatCard[] = [
        {
            label: "Total Students",
            value: stats.totalStudents,
            Icon: GraduationCap,
            color: "#345476",
            href: "/admin/users",
            sub: `${stats.activeStudents} active this week`,
        },
        {
            label: "Practice Activities",
            value: stats.practiceActivities,
            Icon: BookOpen,
            color: "#b75b3f",
            href: "/admin/content",
            sub: `+ ${stats.mapActivities} map activities`,
        },
        {
            label: "Needs Attention",
            value: stats.studentsNeedingAttention,
            Icon: AlertTriangle,
            color: stats.studentsNeedingAttention > 0 ? "#c86531" : "#4f8b64",
            href: "/admin/users",
            sub: "active students, 7+ days silent",
            warn: stats.studentsNeedingAttention > 0,
        },
    ];

    const quickLinks = [
        { href: "/admin/users", label: "Manage Users", Icon: Users, desc: "Roles, passwords, leaderboard" },
        { href: "/admin/content", label: "Content Health", Icon: BookOpen, desc: "Releases, map items, kinds" },
        { href: "/admin/diagnostics", label: "Diagnostics", Icon: Stethoscope, desc: "Grammar skill gaps by class" },
        { href: "/dashboard/backend", label: "Legacy Backend", Icon: BarChart2, desc: "Full user table view" },
        { href: "/summer-planning-wiki/", label: "Summer Planning Wiki", Icon: ScrollText, desc: "Research, roadmap, course plan", external: true },
    ] as const;

    return (
        <div className="space-y-6 text-[#2d261f]">
            <div className="space-y-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dddeda] px-3 py-1.5 text-xs font-bold text-[#345476]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin · System overview
                </span>

                <div className="space-y-1">
                    <h1 className="font-display text-2xl font-bold text-[#2d261f] sm:text-3xl">
                        Control Center
                    </h1>
                    <p className="max-w-4xl text-sm font-medium text-[#756b60]">
                        Signed in as <strong className="font-bold text-[#2d261f]">{firstName}</strong> · Class Companion — every class, student & independent learner.
                    </p>
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
                                <p className="text-3xl font-extrabold leading-none tabular-nums" style={{ color: warn ? color : "#2d261f" }}>
                                    {value.toLocaleString()}
                                </p>
                                <p className="mt-1.5 text-sm font-bold text-[#6d6358]">
                                    {label}
                                </p>
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
                            Admin tools
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            {quickLinks.map(({ href, label, Icon, desc, ...rest }) => {
                                const isExternal = "external" in rest && rest.external;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        className="group flex min-h-[72px] items-center gap-3 rounded-xl border bg-[#fbfbfa] px-4 py-3 shadow-[0_4px_14px_rgba(45,38,31,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(45,38,31,0.08)]"
                                        style={{ borderColor: "#c9c9c7" }}
                                    >
                                        <span
                                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                                            style={{ background: isExternal ? "#58916a" : "#345476" }}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-bold text-[#2d261f]">{label}</span>
                                            <span className="mt-0.5 block truncate text-xs font-medium text-[#9a9186]">{desc}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                            <div
                                className="flex min-h-[72px] items-center justify-center gap-2 rounded-xl border border-dashed bg-[#f6f5f2] px-4 py-3 text-sm font-bold text-[#a79d91]"
                                style={{ borderColor: "#c9c0b5" }}
                            >
                                <Plus className="h-4 w-4" />
                                More settings
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                            Independent learners
                        </h2>
                        <div className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]" style={{ borderColor: "#c9c9c7" }}>
                            <div className="grid gap-4 border-b pb-4 sm:grid-cols-3" style={{ borderColor: "#d5d1cc" }}>
                                <div>
                                    <p className="text-2xl font-extrabold tabular-nums">{stats.independentTotal.toLocaleString()}</p>
                                    <p className="mt-1 text-sm font-bold text-[#6d6358]">Total</p>
                                </div>
                                <div className="sm:border-l sm:pl-6" style={{ borderColor: "#d5d1cc" }}>
                                    <p className="text-2xl font-extrabold tabular-nums">{stats.independentActive.toLocaleString()}</p>
                                    <p className="mt-1 text-sm font-bold text-[#6d6358]">Active this week</p>
                                </div>
                                <div className="sm:border-l sm:pl-6" style={{ borderColor: "#d5d1cc" }}>
                                    <p className="text-2xl font-extrabold tabular-nums">+{stats.independentNewThisMonth.toLocaleString()}</p>
                                    <p className="mt-1 text-sm font-bold text-[#6d6358]">New this month</p>
                                </div>
                            </div>

                            {stats.independentRecent.length === 0 ? (
                                <p className="py-6 text-sm font-medium text-[#9a9186]">No independent learner activity yet.</p>
                            ) : (
                                <ul className="divide-y" style={{ borderColor: "#d5d1cc" }}>
                                    {stats.independentRecent.map((student) => (
                                        <li key={student.id} className="flex items-center gap-3 py-3">
                                            <AvatarInitial name={student.name ?? student.username} color="#6f9a78" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-[#2d261f]">{student.name ?? student.username}</p>
                                                <p className="text-xs font-medium text-[#9a9186]">
                                                    <RelativeTime date={student.lastActivityDate} />
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#b3832d]">
                                                <Flame className="h-4 w-4 fill-[#d08721] text-[#d08721]" />
                                                {student.weeklyPoints.toLocaleString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.08)]" style={{ borderColor: "#c9c9c7" }}>
                        <h2 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-[#8f8579]">
                            Recently active
                        </h2>
                        {stats.recentlyActive.length === 0 ? (
                            <p className="text-sm font-medium text-[#9a9186]">No recent activity.</p>
                        ) : (
                            <ul className="divide-y" style={{ borderColor: "#d5d1cc" }}>
                                {stats.recentlyActive.slice(0, 5).map((student) => (
                                    <li key={student.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <AvatarInitial name={student.name ?? student.username} color="#345476" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-[#2d261f]">{student.name ?? student.username}</p>
                                            <p className="text-xs font-medium text-[#9a9186]">
                                                <span className="text-[#d06b32]">🔥</span> {student.currentStreak} · {student.weeklyPoints.toLocaleString()} pts this week
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs font-medium text-[#9a9186]">
                                            <RelativeTime date={student.lastActivityDate} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Link
                            href="/admin/users"
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 border-t pt-4 text-sm font-bold text-[#345476]"
                            style={{ borderColor: "#d5d1cc" }}
                        >
                            <Activity className="h-4 w-4" />
                            View all students
                        </Link>
                    </section>

                    <section className="flex items-center gap-3 rounded-xl border bg-[#fbfbfa] p-5 shadow-[0_8px_24px_rgba(45,38,31,0.06)]" style={{ borderColor: "#c9c9c7" }}>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4e5df] text-[#c86633]">
                            <MapPin className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-bold text-[#2d261f]">Course Map</h2>
                            <p className="text-xs font-medium leading-snug text-[#9a9186]">
                                {stats.mapActivities.toLocaleString()} activities across map weeks
                            </p>
                        </div>
                        <Link
                            href="/dashboard/map"
                            className="inline-flex shrink-0 items-center gap-1 rounded border px-3 py-2 text-sm font-bold text-[#345476] transition-colors hover:bg-[#f4f2ee]"
                            style={{ borderColor: "#bdb7af" }}
                        >
                            View <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>
                </aside>
            </div>
        </div>
    );
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
