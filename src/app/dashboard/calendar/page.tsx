import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MiniCalendar, UpcomingEventsList, CalendarEvent } from "@/components/dashboard";
import { redirect } from "next/navigation";
import { isTeacherAdmin } from "@/lib/roles";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;
    const admin = isTeacherAdmin(session.user);

    let calendarEvents: CalendarEvent[] = [];

    if (userRole === "teacher") {
        const classes = await prisma.class.findMany({
            where: admin ? {} : { teacherId: userId },
            include: {
                assignments: {
                    include: { activity: true },
                },
                calendarEvents: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const allAssignments = classes.flatMap((c) => c.assignments);

        calendarEvents = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
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
    } else {
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
        });

        const allAssignments = enrollments.flatMap((enrollment) =>
            enrollment.class.assignments.map((assignment) => ({
                ...assignment,
                className: enrollment.class.name,
            }))
        );

        calendarEvents = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment) =>
                enrollment.class.calendarEvents.map((ev) => ({
                    id: ev.id,
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                    description: ev.description,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return (
        <div className="min-h-screen bg-bg">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 md:pb-12">
                {/* Calendar - Full width on mobile, centered on larger screens */}
                <div className="flex justify-center w-full">
                    <div className="w-full max-w-md rounded-2xl border border-[#e4ddd1] bg-gradient-to-b from-[#fffdf9] to-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(33,41,52,0.08)]">
                        <MiniCalendar events={calendarEvents} />
                    </div>
                </div>

                {/* Upcoming Events - Full Width */}
                <div className="rounded-2xl border border-[#e4ddd1] bg-gradient-to-b from-[#fffdf9] to-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(33,41,52,0.08)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-display font-bold text-text flex items-center gap-3">
                            <span className="w-1.5 h-6 rounded-full bg-[#7a6955]"></span>
                            Upcoming
                        </h2>
                    </div>
                    <UpcomingEventsList
                        events={calendarEvents.filter(event => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                            eventEndDate.setHours(0, 0, 0, 0);
                            return eventEndDate >= today;
                        })}
                        allowDelete={userRole === 'teacher'}
                        showSyncedLabel={userRole === 'teacher'}
                    />
                </div>
            </main>
        </div>
    );
}
