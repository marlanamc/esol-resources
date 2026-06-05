import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import Link from "next/link";
import {
    Users, BookOpen, GraduationCap, Activity,
    AlertTriangle, CheckCircle, BarChart2, Stethoscope,
    MapPin, ScrollText,
} from "lucide-react";

async function getAdminStats() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalStudents,
        activeStudents,
        activitiesByKind,
        studentsNeedingAttention,
        recentlyActive,
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
            color: "#4a8ca0",
            href: "/admin/users",
            sub: `${stats.activeStudents} active this week`,
        },
        {
            label: "Practice Activities",
            value: stats.practiceActivities,
            Icon: BookOpen,
            color: "#b05740",
            href: "/admin/content",
            sub: `+ ${stats.mapActivities} map activities`,
        },
        {
            label: "Needs Attention",
            value: stats.studentsNeedingAttention,
            Icon: AlertTriangle,
            color: stats.studentsNeedingAttention > 0 ? "#ca5c43" : "#4d6b53",
            href: "/admin/users",
            sub: "active students, 7+ days silent",
            warn: stats.studentsNeedingAttention > 0,
        },
    ];

    const quickLinks = [
        { href: "/admin/users", label: "Manage Users", Icon: Users, desc: "Roles, passwords, leaderboard" },
        { href: "/admin/content", label: "Content Health", Icon: BookOpen, desc: "Releases, map items, kinds" },
        { href: "/dashboard/backend", label: "Legacy Backend", Icon: BarChart2, desc: "Full user table view" },
        { href: "/admin/diagnostics", label: "Diagnostics", Icon: Stethoscope, desc: "Class skills, student skills" },
        { href: "/summer-planning-wiki/", label: "Summer Planning Wiki", Icon: ScrollText, desc: "Research, roadmap, course plan", external: true },
    ] as const;

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "#1e2640" }}>
                    Control Center
                </h1>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Signed in as <strong>{firstName}</strong> · System overview
                </p>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {statCards.map(({ label, value, Icon, color, href, sub, warn }) => (
                    <Link
                        key={label}
                        href={href}
                        className="group flex flex-col gap-3 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md"
                        style={{ borderColor: warn ? `${color}40` : "rgba(0,0,0,0.08)" }}
                    >
                        <div className="flex items-start justify-between">
                            <span
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"
                                style={{ background: color }}
                            >
                                <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                            </span>
                            {warn && <AlertTriangle className="h-4 w-4 text-warning" />}
                            {!warn && value === 0 && <CheckCircle className="h-4 w-4 text-secondary" />}
                        </div>
                        <div>
                            <p className="text-3xl font-bold tabular-nums" style={{ color: warn ? color : "#1e2640" }}>
                                {value.toLocaleString()}
                            </p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: "#475569" }}>
                                {label}
                            </p>
                            {sub && (
                                <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                                    {sub}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Quick links */}
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                        Admin tools
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickLinks.map(({ href, label, Icon, desc, ...rest }) => {
                            const isExternal = "external" in rest && rest.external;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="flex items-start gap-3 rounded-xl border bg-white px-4 py-4 transition-shadow hover:shadow-md"
                                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                                >
                                    <span
                                        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                                        style={{ background: isExternal ? "#6a8d73" : "#1e2640" }}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm" style={{ color: "#1e2640" }}>
                                            {label}
                                        </p>
                                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#64748b" }}>
                                            {desc}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Recently active students */}
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                        Recently active
                    </h2>
                    <div
                        className="rounded-2xl border bg-white overflow-hidden"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        {stats.recentlyActive.length === 0 ? (
                            <p className="text-sm text-text-muted p-5">No recent activity.</p>
                        ) : (
                            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                                {stats.recentlyActive.map((student) => (
                                    <li key={student.id} className="flex items-center gap-3 px-4 py-3">
                                        <span
                                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                            style={{ background: "#4a8ca0" }}
                                        >
                                            {(student.name ?? student.username).charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold truncate" style={{ color: "#1e2640" }}>
                                                {student.name ?? student.username}
                                            </p>
                                            <p className="text-xs" style={{ color: "#94a3b8" }}>
                                                🔥 {student.currentStreak} · {student.weeklyPoints} pts this week
                                            </p>
                                        </div>
                                        <span className="text-xs shrink-0" style={{ color: "#94a3b8" }}>
                                            <RelativeTime date={student.lastActivityDate} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div
                            className="px-4 py-2.5 border-t"
                            style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f8f9fc" }}
                        >
                            <Link
                                href="/admin/users"
                                className="text-xs font-semibold flex items-center justify-center gap-1"
                                style={{ color: "#1e2640" }}
                            >
                                <Activity className="h-3 w-3" />
                                View all students
                            </Link>
                        </div>
                    </div>

                    {/* Map position */}
                    <div
                        className="mt-4 rounded-xl border bg-white px-4 py-3.5 flex items-center gap-3"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        <MapPin className="h-4 w-4 shrink-0" style={{ color: "#b05740" }} />
                        <div className="text-sm">
                            <p className="font-semibold" style={{ color: "#1e2640" }}>Course Map</p>
                            <p style={{ color: "#64748b" }}>
                                {stats.mapActivities} activities across map weeks
                            </p>
                        </div>
                        <Link
                            href="/dashboard/map"
                            className="ml-auto text-xs font-semibold"
                            style={{ color: "#b05740" }}
                        >
                            View →
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
