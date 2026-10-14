import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { getVisibleWeekIdsForClasses } from "@/lib/course-map";
import { buildActivityHref } from "@/lib/learner/navigation";
import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";
import { CLASS_TIME_ZONE } from "@/data/school-calendar-2026-27";

const DONE_STATUSES = ["submitted", "graded", "completed"];

export type WeeklyQuizStatus = {
    state: "open" | "late" | "done";
    activityId: string;
    href: string;
    weekNumber: number;
    dueAt: Date;
    /** When the next week's quiz opens; shown on the done bar. */
    nextOpensAt: Date | null;
};

type QuizCandidate = { id: string; content: string; assignmentId?: string | null };

function readWeekNumber(content: string): number | null {
    try {
        const parsed = JSON.parse(content);
        return parsed?.type === "weekly-quiz" && Number.isInteger(parsed.weekNumber) ? parsed.weekNumber : null;
    } catch {
        return null;
    }
}

/**
 * The quiz that opened most recently is "this week's" quiz: open until it is due
 * Tuesday, late until the next one opens Thursday, done once submitted. Students
 * who joined after it was due are not expected to take it, so they see no bar.
 */
export function pickWeeklyQuizStatus(input: {
    quizzes: QuizCandidate[];
    doneActivityIds: Set<string>;
    joinedAt: Date;
    now: Date;
}): WeeklyQuizStatus | null {
    const current = input.quizzes
        .flatMap((quiz) => {
            const weekNumber = readWeekNumber(quiz.content);
            const schedule = weekNumber === null ? null : getWeeklyQuizSchedule(weekNumber);
            return schedule && weekNumber !== null && schedule.opensAt <= input.now ? [{ quiz, weekNumber, ...schedule }] : [];
        })
        .sort((a, b) => b.opensAt.getTime() - a.opensAt.getTime())[0];
    if (!current || input.joinedAt > current.dueAt) return null;

    const done = input.doneActivityIds.has(current.quiz.id);
    return {
        state: done ? "done" : input.now >= current.dueAt ? "late" : "open",
        activityId: current.quiz.id,
        href: buildActivityHref(current.quiz.id, current.quiz.assignmentId),
        weekNumber: current.weekNumber,
        dueAt: current.dueAt,
        nextOpensAt: getWeeklyQuizSchedule(current.weekNumber + 1)?.opensAt ?? null,
    };
}

/** Released weekly quizzes on the student's visible map weeks or class assignments. */
export async function getStudentWeeklyQuizStatus(userId: string, now = new Date()): Promise<WeeklyQuizStatus | null> {
    const enrollments = await withPrismaReadRetry(() =>
        prisma.classEnrollment.findMany({
            where: { studentId: userId, status: "active" },
            select: {
                classId: true,
                joinedAt: true,
                class: { select: { createdAt: true, assignments: { select: { id: true, activityId: true } } } },
            },
        }),
    );
    if (!enrollments.length) return null;

    const weekIds = [...(await getVisibleWeekIdsForClasses(enrollments.map((e) => e.classId), now))];
    const assignments = enrollments.flatMap((e) => e.class.assignments);
    const quizzes = await withPrismaReadRetry(() =>
        prisma.activity.findMany({
            where: {
                type: "quiz",
                deletedAt: null,
                content: { contains: '"type":"weekly-quiz"' },
                OR: [
                    { courseMapItems: { some: { weekId: { in: weekIds } } } },
                    { id: { in: assignments.map((a) => a.activityId) } },
                ],
            },
            select: { id: true, content: true },
        }),
    );
    if (!quizzes.length) return null;

    // Same cutoff as the teacher's completion list: work from before this enrollment does not count.
    const since = new Date(Math.min(...enrollments.map((e) => Math.max(e.joinedAt.getTime(), e.class.createdAt.getTime()))));
    const submissions = await withPrismaReadRetry(() =>
        prisma.submission.findMany({
            where: { userId, activityId: { in: quizzes.map((q) => q.id) }, status: { in: DONE_STATUSES } },
            select: { activityId: true, completedAt: true, updatedAt: true },
        }),
    );
    const assignmentByActivityId = new Map(assignments.map((a) => [a.activityId, a.id]));
    return pickWeeklyQuizStatus({
        quizzes: quizzes.map((q) => ({ ...q, assignmentId: assignmentByActivityId.get(q.id) ?? null })),
        doneActivityIds: new Set(submissions.filter((s) => (s.completedAt ?? s.updatedAt) >= since).map((s) => s.activityId)),
        joinedAt: since,
        now,
    });
}

function dayKey(date: Date): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: CLASS_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Whole calendar days (class time zone) from `now` until `date`. */
export function calendarDaysUntil(date: Date, now: Date): number {
    return Math.round((Date.parse(dayKey(date)) - Date.parse(dayKey(now))) / 86_400_000);
}

function quizDateParts(date: Date) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: CLASS_TIME_ZONE, weekday: "long", hour: "numeric", minute: "2-digit" }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const minute = get("minute");
    return { weekday: get("weekday"), time: `${get("hour")}${minute && minute !== "00" ? `:${minute}` : ""} ${get("dayPeriod")}` };
}

/** "6 PM" in class time. */
export function formatQuizTime(date: Date): string {
    return quizDateParts(date).time;
}

/** "Tuesday, 6 PM" — weekday and time only, which is how the class talks about the deadline. */
export function formatQuizDay(date: Date): string {
    const { weekday, time } = quizDateParts(date);
    return `${weekday}, ${time}`;
}
