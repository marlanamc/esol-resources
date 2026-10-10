import { prisma } from "@/lib/database/prisma";
import { getStudentCourseMapStatus } from "@/lib/course-map-week";
import { mapWithConcurrencyLimit } from "@/lib/shared/concurrency";
import { ClassRoster } from "./ClassRoster";

/** Call only after the page has resolved and authorized the selected class. */
export async function ClassRosterLoader({ classId }: { classId: string }) {
    const now = new Date();
    const enrollments = await prisma.classEnrollment.findMany({
        where: {
            classId,
            status: "active",
            student: { isSystemAccount: false },
        },
        select: {
            student: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    weeklyPoints: true,
                    currentStreak: true,
                    lastActivityDate: true,
                },
            },
        },
    });
    const students = await mapWithConcurrencyLimit(
        enrollments,
        8,
        async ({ student }) => ({
            ...student,
            lastActivityDate: student.lastActivityDate?.toISOString() ?? null,
            courseMap: await getStudentCourseMapStatus(
                { id: student.id, role: "student" },
                { now },
            ),
        }),
    );
    return (
        <ClassRoster
            students={students}
            classId={classId}
            now={now.getTime()}
        />
    );
}
