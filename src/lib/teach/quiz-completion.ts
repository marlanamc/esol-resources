import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { readWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";

const DONE_STATUSES = ["submitted", "graded", "completed"];

export type QuizCompletionStudent = {
    id: string;
    name: string | null;
    username: string;
    joinedAt: Date;
};

export type QuizCompletion = {
    id: string;
    title: string;
    opensAt: Date;
    dueAt: Date;
    expected: number;
    missing: QuizCompletionStudent[];
};

/**
 * Same rules as the student evaluation's required quizzes: a scheduled quiz is
 * released once it opens, and only counts for students enrolled before it was due.
 */
export function buildQuizCompletion(input: {
    quizzes: { id: string; title: string; content: string }[];
    students: QuizCompletionStudent[];
    submissions: {
        userId: string;
        activityId: string;
        status: string;
        completedAt: Date | null;
        updatedAt: Date;
    }[];
    classCreatedAt: Date;
    now: Date;
    limit?: number;
}): QuizCompletion[] {
    const studentsById = new Map(input.students.map((s) => [s.id, s]));
    const doneKeys = new Set(
        input.submissions
            .filter((s) => {
                const student = studentsById.get(s.userId);
                return (
                    !!student &&
                    DONE_STATUSES.includes(s.status) &&
                    (s.completedAt ?? s.updatedAt) >= since(student, input.classCreatedAt)
                );
            })
            .map((s) => `${s.userId}:${s.activityId}`),
    );
    return input.quizzes
        .flatMap((quiz) => {
            const schedule = readWeeklyQuizSchedule(quiz.content);
            if (!schedule || input.now < schedule.opensAt) return [];
            const expected = input.students.filter(
                (s) => schedule.dueAt >= since(s, input.classCreatedAt),
            );
            return [
                {
                    id: quiz.id,
                    title: quiz.title,
                    opensAt: schedule.opensAt,
                    dueAt: schedule.dueAt,
                    expected: expected.length,
                    missing: expected
                        .filter((s) => !doneKeys.has(`${s.id}:${quiz.id}`))
                        .sort((a, b) =>
                            (a.name || a.username).localeCompare(b.name || b.username),
                        ),
                },
            ];
        })
        .sort((a, b) => b.opensAt.getTime() - a.opensAt.getTime())
        .slice(0, input.limit ?? 3);
}

function since(student: QuizCompletionStudent, classCreatedAt: Date) {
    return student.joinedAt > classCreatedAt ? student.joinedAt : classCreatedAt;
}

/** Released quizzes on this class's visible map weeks or assignments. */
export async function getClassQuizCompletion(
    classId: string,
    students: QuizCompletionStudent[],
    now = new Date(),
) {
    const [cls, assignments, reveals, schedules] = await withPrismaReadRetry(() =>
        Promise.all([
            prisma.class.findUnique({
                where: { id: classId },
                select: { createdAt: true },
            }),
            prisma.assignment.findMany({
                where: { classId },
                select: { id: true, activityId: true },
            }),
            prisma.classReveal.findMany({
                where: { classId },
                select: { weekId: true },
            }),
            prisma.classWeekSchedule.findMany({
                where: { classId, revealAt: { lte: now } },
                select: { weekId: true },
            }),
        ]),
    );
    if (!cls) return [];
    const weekIds = [...new Set([...reveals, ...schedules].map((w) => w.weekId))];
    const quizzes = await withPrismaReadRetry(() =>
        prisma.activity.findMany({
            where: {
                type: "quiz",
                deletedAt: null,
                OR: [
                    { courseMapItems: { some: { weekId: { in: weekIds } } } },
                    { id: { in: assignments.map((a) => a.activityId) } },
                ],
            },
            select: { id: true, title: true, content: true },
        }),
    );
    if (!quizzes.length || !students.length) return [];
    const submissions = await withPrismaReadRetry(() =>
        prisma.submission.findMany({
            where: {
                userId: { in: students.map((s) => s.id) },
                activityId: { in: quizzes.map((q) => q.id) },
                status: { in: DONE_STATUSES },
                OR: [
                    { assignmentId: null },
                    { assignmentId: { in: assignments.map((a) => a.id) } },
                ],
            },
            select: {
                userId: true,
                activityId: true,
                status: true,
                completedAt: true,
                updatedAt: true,
            },
        }),
    );
    return buildQuizCompletion({
        quizzes,
        students,
        submissions,
        classCreatedAt: cls.createdAt,
        now,
    });
}
