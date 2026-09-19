import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isAdmin } from "@/lib/auth/roles";

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
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    lastActivityDate: { gte: sevenDaysAgo },
                },
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.activity.groupBy({
                by: ["contentKind"],
                where: { deletedAt: null },
                _count: { id: true },
            }),
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
            }),
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
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    ...independentLearnerWhere,
                },
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    lastActivityDate: { gte: sevenDaysAgo },
                    ...independentLearnerWhere,
                },
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.user.count({
                where: {
                    role: "student",
                    isSystemAccount: false,
                    createdAt: { gte: monthStart },
                    ...independentLearnerWhere,
                },
            }),
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
            }),
        ),
    ]);

    const countByKind = Object.fromEntries(
        activitiesByKind.map((k) => [k.contentKind, k._count.id]),
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

function msSince(date: Date) {
    return Date.now() - date.getTime();
}

function RelativeTime({ date }: { date: Date | null }) {
    if (!date) return <span className="text-text-light">Never</span>;
    const diff = msSince(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return <span>Just now</span>;
    if (hours < 24) return <span>{hours}h ago</span>;
    const days = Math.floor(hours / 24);
    if (days < 7) return <span>{days}d ago</span>;
    return (
        <span>
            {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })}
        </span>
    );
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    if (!isAdmin(session.user)) redirect("/teach");
    const stats = await getAdminStats();
    return (
        <div className="space-y-7">
            <div>
                <p className="workspace-eyebrow mb-2">Administration</p>
                <h1 className="font-display text-3xl font-bold">
                    Workspace overview
                </h1>
                <p className="text-sm text-text-muted mt-2">
                    Accounts, content, and system tools across all classes.
                </p>
            </div>
            <div className="workspace-panel grid sm:grid-cols-3 gap-5">
                {[
                    {
                        href: "/admin/users",
                        label: "Student accounts",
                        value: stats.totalStudents,
                        detail: `${stats.activeStudents} active in the last 7 days`,
                    },
                    {
                        href: "/admin/content",
                        label: "Practice activities",
                        value: stats.practiceActivities,
                        detail: `${stats.mapActivities} course map activities`,
                    },
                    {
                        href: "/admin/users",
                        label: "Independent learners",
                        value: stats.independentTotal,
                        detail: `${stats.independentActive} active in the last 7 days`,
                    },
                ].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex sm:block items-center gap-4 min-h-11"
                    >
                        <span className="font-display text-3xl font-bold tabular-nums">
                            {item.value}
                        </span>
                        <span className="block">
                            <span className="block text-sm font-semibold sm:mt-2">
                                {item.label}
                            </span>
                            <span className="block text-xs text-text-muted mt-1">
                                {item.detail}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
            <div className="grid xl:grid-cols-2 gap-6">
                <section className="workspace-panel">
                    <h2 className="font-display text-xl font-bold mb-4">
                        Manage your workspace
                    </h2>
                    <div className="divide-y divide-border">
                        {[
                            {
                                href: "/admin/users",
                                label: "Accounts",
                                detail: "Students, roles, and password support",
                            },
                            {
                                href: "/admin/content",
                                label: "Content",
                                detail: "Activity releases and course content",
                            },
                            {
                                href: "/admin/health",
                                label: "System Health",
                                detail: "Check the app and content health",
                            },
                            {
                                href: "/admin/diagnostics",
                                label: "Skill Gaps",
                                detail: "Grammar results and areas for practice",
                            },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex gap-3 items-center py-4 min-h-11"
                            >
                                <span className="flex-1">
                                    <span className="block text-sm font-semibold">
                                        {item.label}
                                    </span>
                                    <span className="block text-sm text-text-muted mt-1">
                                        {item.detail}
                                    </span>
                                </span>
                                <ArrowRight size={17} />
                            </Link>
                        ))}
                    </div>
                    <details className="border-t border-border pt-3">
                        <summary className="min-h-11 text-sm font-semibold cursor-pointer">
                            Additional tools
                        </summary>
                        <Link
                            className="workspace-nav-link"
                            href="/dashboard/backend"
                        >
                            Legacy account tools
                        </Link>
                        <Link
                            className="workspace-nav-link"
                            href="/summer-planning-wiki"
                        >
                            Planning wiki
                        </Link>
                    </details>
                </section>
                <section className="workspace-panel">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <h2 className="font-display text-xl font-bold">
                            Recently active
                        </h2>
                        <Link
                            className="workspace-button"
                            href="/teach/reports"
                        >
                            Class participation
                        </Link>
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                        All student accounts, including independent learners.
                    </p>
                    <ul className="divide-y divide-border mt-4">
                        {stats.recentlyActive.slice(0, 5).map((student) => (
                            <li key={student.id}>
                                <Link
                                    href={`/teach/students/${student.id}`}
                                    className="flex gap-4 items-center justify-between py-4 min-h-11"
                                >
                                    <span className="font-semibold text-sm break-words">
                                        {student.name ?? student.username}
                                    </span>
                                    <span className="text-xs text-text-muted shrink-0">
                                        <RelativeTime
                                            date={student.lastActivityDate}
                                        />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!stats.recentlyActive.length && (
                        <p className="text-sm text-text-muted py-5">
                            No recent activity.
                        </p>
                    )}
                    <p className="text-xs text-text-muted mt-5">
                        {stats.independentNewThisMonth} new independent learners
                        this month.
                    </p>
                </section>
            </div>
        </div>
    );
}
