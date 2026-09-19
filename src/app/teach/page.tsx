import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus, CalendarDays, Map } from "lucide-react";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { getClassParticipation } from "@/lib/teach/participation";
import { participationStatus } from "@/lib/teach/participation-status";
import { getVisibleWeekIdsForClasses } from "@/lib/course-map";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";

export default async function TeachHomePage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");
    const { classId } = await resolveTeachClassId(
        session.user.id,
        isAdmin(session.user),
        (await searchParams).classId,
    );
    if (!classId)
        return (
            <div className="space-y-5">
                <h1 className="font-display text-3xl font-bold">
                    Your teaching workspace
                </h1>
                <p className="text-text-muted">
                    Create a class to assign activities and follow student
                    participation.
                </p>
                <Link
                    className="workspace-button workspace-button-primary"
                    href="/teach/classes/new"
                >
                    Create a class
                </Link>
            </div>
        );
    const now = new Date().getTime();
    const [cls, students, visibleWeekIds] = await Promise.all([
        prisma.class.findUnique({
            where: { id: classId },
            select: {
                name: true,
                code: true,
                announcement: true,
                assignments: {
                    where: {
                        dueDate: {
                            gte: new Date(now),
                            lte: new Date(now + 14 * 86400000),
                        },
                    },
                    orderBy: { dueDate: "asc" },
                    take: 4,
                    select: {
                        id: true,
                        title: true,
                        dueDate: true,
                        activity: { select: { title: true } },
                    },
                },
            },
        }),
        getClassParticipation(classId),
        getVisibleWeekIdsForClasses([classId]),
    ]);
    if (!cls) redirect("/teach/classes");
    const week = await prisma.courseWeek.findFirst({
        where: { id: { in: [...visibleWeekIds] } },
        orderBy: { number: "desc" },
        select: { number: true, title: true },
    });
    const counts = { active: 0, inactive: 0, never: 0 };
    students.forEach((s) => counts[participationStatus(s.lastActive, now)]++);
    const report = `/teach/reports?classId=${encodeURIComponent(classId)}`;
    const checkIns = students
        .filter((s) => participationStatus(s.lastActive, now) !== "active")
        .sort((a, b) =>
            (a.name || a.username).localeCompare(b.name || b.username),
        )
        .slice(0, 5);
    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="workspace-eyebrow mb-2">Your classroom</p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold">
                        Ready for class
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">
                        {cls.name} <span aria-hidden="true">·</span> Join code{" "}
                        <span className="font-semibold tracking-wider text-text">
                            {cls.code}
                        </span>
                    </p>
                </div>
                <Link
                    className="workspace-button"
                    href={`/teach/classes/${classId}`}
                >
                    Class details <ArrowRight size={16} />
                </Link>
            </div>
            <Link
                href={report}
                className="xl:hidden flex items-center justify-between gap-3 border-y border-border py-3 text-sm"
            >
                <span>
                    <strong>{counts.active}</strong> active this week{" "}
                    <span className="text-text-muted">
                        · {counts.inactive + counts.never} to check in with
                    </span>
                </span>
                <ArrowRight size={18} className="shrink-0" />
                <span className="sr-only">Open student participation</span>
            </Link>
            <div className="grid xl:grid-cols-[1fr_1.1fr] gap-6 items-start">
                <section className="workspace-panel space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-display text-xl font-bold">
                            Class preparation
                        </h2>
                        <Link
                            className="workspace-button workspace-button-primary"
                            href={`/teach/classes/${classId}/assignments/new`}
                        >
                            <Plus size={16} />
                            Assign work
                        </Link>
                    </div>
                    <div className="border-y border-border py-5">
                        <p className="workspace-eyebrow mb-2">
                            Available to students
                        </p>
                        <p className="text-lg font-semibold">
                            {week
                                ? `Week ${week.number} · ${week.title}`
                                : "No course weeks available yet"}
                        </p>
                        <Link
                            className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-primary mt-1"
                            href={`/teach/map?classId=${classId}`}
                        >
                            <Map size={16} />
                            Manage course releases <ArrowRight size={15} />
                        </Link>
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold">
                                Due in the next two weeks
                            </h3>
                            <Link
                                href={`/teach/calendar?classId=${classId}`}
                                aria-label="Open calendar"
                                className="workspace-icon-button text-primary"
                            >
                                <CalendarDays size={19} />
                            </Link>
                        </div>
                        {cls.assignments.length ? (
                            <ul className="divide-y divide-border">
                                {cls.assignments.map((a) => (
                                    <li key={a.id}>
                                        <Link
                                            className="flex items-start justify-between gap-4 py-4 min-h-11 text-sm"
                                            href={`/teach/classes/${classId}/assignments/${a.id}/submissions`}
                                        >
                                            <span className="font-medium">
                                                {a.title || a.activity.title}
                                            </span>
                                            <time
                                                className="shrink-0 text-text-muted"
                                                dateTime={a.dueDate?.toISOString()}
                                            >
                                                {a.dueDate?.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        timeZone:
                                                            "America/New_York",
                                                    },
                                                )}
                                            </time>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-text-muted py-4">
                                No upcoming deadlines. Assign an activity when
                                you’re ready.
                            </p>
                        )}
                    </div>
                    <details className="border-t border-border pt-4">
                        <summary className="min-h-11 cursor-pointer text-sm font-semibold">
                            {cls.announcement
                                ? "Edit class announcement"
                                : "Add a class announcement"}
                        </summary>
                        <div className="pt-2">
                            <ClassAnnouncementEditor
                                key={classId}
                                classId={classId}
                                initialAnnouncement={cls.announcement}
                            />
                        </div>
                    </details>
                </section>
                <section className="workspace-panel">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-display text-xl font-bold">
                            Student participation
                        </h2>
                        <Link
                            href={report}
                            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
                        >
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>
                    <p className="text-sm text-text-muted mt-1">
                        {students.length} students included in reporting
                    </p>
                    <div className="divide-y divide-border mt-4">
                        {(
                            [
                                {
                                    status: "active",
                                    label: "Active in the last 7 days",
                                },
                                {
                                    status: "inactive",
                                    label: "No activity for 7+ days",
                                },
                                { status: "never", label: "Not started yet" },
                            ] as const
                        ).map((item) => (
                            <Link
                                key={item.status}
                                href={`${report}&status=${item.status}`}
                                className="flex items-center gap-3 py-4 min-h-11 hover:text-primary"
                            >
                                <span
                                    className={`font-display text-3xl font-bold tabular-nums w-12 ${item.status === "active" ? "text-primary" : "text-text"}`}
                                >
                                    {counts[item.status]}
                                </span>
                                <span className="text-sm flex-1">
                                    {item.label}
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="text-text-muted"
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-border pt-5 mt-2">
                        <h3 className="workspace-eyebrow mb-3">
                            Check in with
                        </h3>
                        {checkIns.length ? (
                            <ul className="space-y-1">
                                {checkIns.map((s) => (
                                    <li key={s.id}>
                                        <Link
                                            className="flex items-center justify-between gap-3 min-h-11 text-sm"
                                            href={`/teach/students/${s.id}?classId=${classId}&returnTo=${encodeURIComponent(report)}`}
                                        >
                                            <span className="font-medium break-words">
                                                {s.name || s.username}
                                            </span>
                                            <span className="text-xs text-text-muted shrink-0">
                                                {s.lastActive
                                                    ? "7+ days away"
                                                    : "Not started"}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-text-muted">
                                {students.length
                                    ? "Everyone has been active in the last seven days."
                                    : "Participation will appear here as students join."}
                            </p>
                        )}
                    </div>
                    <p className="text-xs text-text-muted mt-4 leading-relaxed">
                        Participation reflects app activity, not mastery.
                        Reporting excludes system accounts and students excluded
                        from reporting.
                    </p>
                </section>
            </div>
        </div>
    );
}
