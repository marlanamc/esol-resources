import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { CalendarMonthSplit, CalendarEvent } from "@/components/dashboard";
import { redirect } from "next/navigation";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { isAdminInStudentMode } from "@/lib/admin-student-view";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;
    const admin = isAdmin(session.user);
    // A teacher/admin browsing in student view should see the learner calendar
    // for the classes they are enrolled in, not the all-classes teacher roll-up.
    const studentMode = await isAdminInStudentMode(session.user);
    const showTeacherView = canUseTeacherTools(session.user) && !studentMode;

    let calendarEvents: CalendarEvent[] = [];

    if (showTeacherView) {
        const classes = await prisma.class.findMany({
            where: admin ? {} : { teacherId: userId },
            include: {
                assignments: {
                    include: {
                        activity: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
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
            where: { studentId: userId, status: "active" },
            include: {
                class: {
                    include: {
                        assignments: {
                                include: {
                                    activity: {
                                        select: {
                                            id: true,
                                            title: true,
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
                <CalendarMonthSplit
                    events={calendarEvents}
                    allowDelete={showTeacherView && userRole === 'teacher'}
                    showSyncedLabel={showTeacherView && userRole === 'teacher'}
                />
            </main>
        </div>
    );
}
