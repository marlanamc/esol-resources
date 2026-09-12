import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { isAdmin } from "@/lib/auth/roles";
import { CalendarMonthSplit, CalendarEvent } from "@/components/dashboard";
import { CreateCalendarEventForm } from "@/components/dashboard/CreateCalendarEventForm";
import { resolveTeachClassId } from "@/lib/teach/active-class";

export const metadata = { title: "Calendar | My ESOL Class" };

export default async function TeachCalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const params = await searchParams;
    const userId = session.user.id;
    const admin = isAdmin(session.user);
    const { classId: activeClassId } = await resolveTeachClassId(userId, admin, params.classId);

    const classes = await prisma.class.findMany({
        where: {
            ...(admin ? {} : { teacherId: userId }),
            ...(activeClassId ? { id: activeClassId } : {}),
        },
        include: {
            assignments: {
                include: {
                    activity: { select: { id: true, title: true } },
                },
            },
            calendarEvents: {
                select: {
                    id: true, title: true, description: true,
                    date: true, endDate: true, type: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const allAssignments = classes.flatMap((c) => c.assignments);

    const calendarEvents: CalendarEvent[] = [
        ...allAssignments
            .filter((a) => a.dueDate)
            .map((a) => ({
                date: a.dueDate as Date,
                endDate: null,
                type: (a.title || a.activity.title || "").toLowerCase().includes("quiz")
                    ? ("quiz" as const)
                    : ("due" as const),
                title: a.title || a.activity.title || "Assignment",
            })),
        ...classes.flatMap((cls) =>
            cls.calendarEvents.map((ev) => ({
                id: ev.id,
                date: ev.date,
                endDate: ev.endDate ?? null,
                type: (ev.type as CalendarEvent["type"]) || "holiday",
                title: ev.title,
                description: ev.description ?? undefined,
            }))
        ),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const classOptions = classes.map((c) => ({
        id: c.id,
        name: c.name,
    }));
    const activeClassName = classes.find((c) => c.id === activeClassId)?.name ?? null;

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Schedule
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Calendar
                </h1>
                {activeClassName ? (
                    <p className="mt-1 text-sm font-medium text-text-muted">{activeClassName}</p>
                ) : null}
            </div>

            <CalendarMonthSplit
                events={calendarEvents}
                allowDelete
                showSyncedLabel
                extraColumn={
                    <div
                        className="rounded-2xl border p-4 sm:p-5 self-start"
                        style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
                    >
                        <h2 className="font-semibold text-sm text-text mb-3">
                            Add event
                        </h2>
                        <CreateCalendarEventForm classes={classOptions} defaultClassId={activeClassId} />
                    </div>
                }
            />
        </div>
    );
}
