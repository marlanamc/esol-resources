import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { CalendarMonthSplit, CalendarEvent } from "@/components/dashboard";
import { redirect } from "next/navigation";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { getLearnerDayKey } from "@/lib/gamification/calendar-week";
import type { StudyLogEntry } from "@/lib/learner/study-log";
import { loadStudyLogEntries } from "@/lib/learner/study-log-data";
import { StudentPracticeCalendar } from "@/components/study-log/StudentPracticeCalendar";

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
    let practiceEntries: StudyLogEntry[] | null = null;

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
                                type: true,
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

        const datedAssignments = classes.flatMap((c) => c.assignments).filter((a) => a.dueDate && a.activity.type !== "quiz" && !/quiz/i.test(a.title || a.activity.title));
        calendarEvents = [
            ...datedAssignments
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
                    type: "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...classes.flatMap((cls) =>
                cls.calendarEvents.filter((ev) => ev.description !== "Verb quiz due date" && !/^Quiz due:/i.test(ev.title)).map((ev) => ({
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
        // The calendar still opens if the practice log can't load; it just has no checks.
        practiceEntries = userId
            ? await loadStudyLogEntries(userId).catch((error) => {
                  console.error("[Calendar] Could not load practice logs", error);
                  return [];
              })
            : [];
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
                                            type: true,
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

        const datedAssignments = allAssignments.filter((a) => a.dueDate && a.activity.type !== "quiz" && !/quiz/i.test(a.title || a.activity.title));
        calendarEvents = [
            ...datedAssignments
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
                    type: "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment) =>
                enrollment.class.calendarEvents.filter((ev) => ev.description !== "Verb quiz due date" && !/^Quiz due:/i.test(ev.title)).map((ev) => ({
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
        <div className="min-h-dvh bg-bg">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 md:pb-12">
                {practiceEntries ? (
                    <StudentPracticeCalendar events={calendarEvents} entries={practiceEntries} todayKey={getLearnerDayKey(new Date())} />
                ) : (
                    <CalendarMonthSplit
                        events={calendarEvents}
                        allowDelete={showTeacherView && userRole === 'teacher'}
                        showSyncedLabel={showTeacherView && userRole === 'teacher'}
                    />
                )}
            </main>
        </div>
    );
}
