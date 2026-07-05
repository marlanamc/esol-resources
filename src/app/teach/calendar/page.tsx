import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { isAdmin } from "@/lib/auth/roles";
import { MiniCalendar, UpcomingEventsList, CalendarEvent } from "@/components/dashboard";
import { CreateCalendarEventForm } from "@/components/dashboard/CreateCalendarEventForm";

export const metadata = { title: "Calendar | Class Companion" };

export default async function TeachCalendarPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const classes = await prisma.class.findMany({
        where: admin ? {} : { teacherId: userId },
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEvents = calendarEvents.filter((ev) => {
        const end = ev.endDate ? new Date(ev.endDate) : new Date(ev.date);
        end.setHours(0, 0, 0, 0);
        return end >= today;
    });

    const classOptions = classes.map((c) => ({
        id: c.id,
        name: c.name,
    }));

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Schedule
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Calendar
                </h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-[auto_1fr_300px]">
                {/* Mini calendar */}
                <div
                    className="w-full max-w-sm rounded-2xl border p-4 sm:p-5 self-start"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
                    }}
                >
                    <MiniCalendar events={calendarEvents} />
                </div>

                {/* Upcoming events */}
                <div
                    className="rounded-2xl border p-4 sm:p-5"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
                    }}
                >
                    <h2 className="font-display font-bold text-lg text-text flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-5 rounded-full" style={{ background: "#7a6955" }} />
                        Upcoming
                    </h2>
                    <UpcomingEventsList
                        events={upcomingEvents}
                        allowDelete
                        showSyncedLabel
                    />
                </div>

                {/* Add event form */}
                <div
                    className="rounded-2xl border p-4 sm:p-5 self-start"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
                >
                    <h2 className="font-semibold text-sm text-text mb-3">
                        Add event
                    </h2>
                    <CreateCalendarEventForm classes={classOptions} />
                </div>
            </div>
        </div>
    );
}
