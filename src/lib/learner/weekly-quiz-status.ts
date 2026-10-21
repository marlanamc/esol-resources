import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { getVisibleWeekIdsForClasses } from "@/lib/course-map";
import { buildActivityHref } from "@/lib/learner/navigation";
import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";
import { CLASS_TIME_ZONE } from "@/data/school-calendar-2026-27";

const DONE_STATUSES = ["submitted", "graded", "completed"];
/** Longest the green "You finished the quiz!" bar can stay; the bar itself hides on the next app open. */
export const DONE_BAR_MS = 24 * 60 * 60 * 1000;

export type WeeklyQuizStatus = {
    state: "open" | "late" | "done";
    activityId: string;
    href: string;
    weekNumber: number;
    dueAt: Date;
    /** When the next week's quiz opens; shown on the done bar. */
    nextOpensAt: Date | null;
};

type QuizCandidate = { id: string; title?: string | null; content: string; assignmentId?: string | null };

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
 * Tuesday, late until the next one opens Thursday, done once submitted. The done
 * bar shows for a day after submitting, then the bar goes away until the next
 * quiz opens. Students who joined after it was due are not expected to take it,
 * so they see no bar.
 */
export function pickWeeklyQuizStatus(input: {
    quizzes: QuizCandidate[];
    /** When each finished quiz was submitted, by activity id. */
    completedAtById: Map<string, Date>;
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

    const completedAt = input.completedAtById.get(current.quiz.id);
    if (completedAt && input.now.getTime() - completedAt.getTime() > DONE_BAR_MS) return null;
    return {
        state: completedAt ? "done" : input.now >= current.dueAt ? "late" : "open",
        activityId: current.quiz.id,
        href: buildActivityHref(current.quiz.id, current.quiz.assignmentId),
        weekNumber: current.weekNumber,
        dueAt: current.dueAt,
        nextOpensAt: getWeeklyQuizSchedule(current.weekNumber + 1)?.opensAt ?? null,
    };
}

type StudentWeeklyQuizzes = {
    quizzes: QuizCandidate[];
    /** Finished submissions from this enrollment, by activity id. */
    doneById: Map<string, { completedAt: Date; score: number | null }>;
    /** Start of the student's current enrollment; earlier quizzes are not expected. */
    since: Date;
};

/** Released weekly quizzes on the student's visible map weeks or class assignments. */
async function loadStudentWeeklyQuizzes(userId: string, now: Date): Promise<StudentWeeklyQuizzes | null> {
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
            select: { id: true, title: true, content: true },
        }),
    );
    if (!quizzes.length) return null;

    // Same cutoff as the teacher's completion list: work from before this enrollment does not count.
    const since = new Date(Math.min(...enrollments.map((e) => Math.max(e.joinedAt.getTime(), e.class.createdAt.getTime()))));
    const submissions = await withPrismaReadRetry(() =>
        prisma.submission.findMany({
            where: { userId, activityId: { in: quizzes.map((q) => q.id) }, status: { in: DONE_STATUSES } },
            select: { activityId: true, completedAt: true, updatedAt: true, score: true },
        }),
    );
    const assignmentByActivityId = new Map(assignments.map((a) => [a.activityId, a.id]));
    return {
        quizzes: quizzes.map((q) => ({ ...q, assignmentId: assignmentByActivityId.get(q.id) ?? null })),
        doneById: new Map(
            submissions
                .map((s) => [s.activityId, { completedAt: s.completedAt ?? s.updatedAt, score: s.score }] as const)
                .filter(([, done]) => done.completedAt >= since),
        ),
        since,
    };
}

export async function getStudentWeeklyQuizStatus(userId: string, now = new Date()): Promise<WeeklyQuizStatus | null> {
    const loaded = await loadStudentWeeklyQuizzes(userId, now);
    if (!loaded) return null;
    return pickWeeklyQuizStatus({
        quizzes: loaded.quizzes,
        completedAtById: new Map([...loaded.doneById].map(([id, done]) => [id, done.completedAt])),
        joinedAt: loaded.since,
        now,
    });
}

export type WeeklyQuizCatchUpItem = {
    activityId: string;
    title: string;
    href: string;
    weekNumber: number;
    dueAt: Date;
    score: number | null;
};

export type WeeklyQuizCatchUp = {
    /** Past due and never finished, oldest first. */
    missing: WeeklyQuizCatchUpItem[];
    /** Finished below 100%, lowest score first. Retakes keep the best score. */
    notPerfect: WeeklyQuizCatchUpItem[];
};

/**
 * Weekly quizzes the student still owes (missing) or can retake for a perfect
 * score. Only quizzes that are already due count as missing; the open quiz is
 * the dashboard bar's job.
 */
export function buildWeeklyQuizCatchUp(input: {
    quizzes: QuizCandidate[];
    doneById: Map<string, { score: number | null }>;
    joinedAt: Date;
    now: Date;
}): WeeklyQuizCatchUp {
    const items = input.quizzes.flatMap((quiz) => {
        const weekNumber = readWeekNumber(quiz.content);
        const schedule = weekNumber === null ? null : getWeeklyQuizSchedule(weekNumber);
        if (!schedule || weekNumber === null || schedule.opensAt > input.now) return [];
        const done = input.doneById.get(quiz.id);
        return [{
            done: Boolean(done),
            item: {
                activityId: quiz.id,
                title: quiz.title ?? `Week ${weekNumber} Quiz`,
                href: buildActivityHref(quiz.id, quiz.assignmentId),
                weekNumber,
                dueAt: schedule.dueAt,
                score: done?.score ?? null,
            },
        }];
    });
    return {
        missing: items
            .filter(({ done, item }) => !done && item.dueAt <= input.now && item.dueAt >= input.joinedAt)
            .map(({ item }) => item)
            .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()),
        notPerfect: items
            .filter(({ done, item }) => done && item.score !== null && item.score < 100)
            .map(({ item }) => item)
            .sort((a, b) => (a.score ?? 0) - (b.score ?? 0) || a.dueAt.getTime() - b.dueAt.getTime()),
    };
}

export async function getStudentWeeklyQuizCatchUp(userId: string, now = new Date()): Promise<WeeklyQuizCatchUp> {
    const loaded = await loadStudentWeeklyQuizzes(userId, now);
    if (!loaded) return { missing: [], notPerfect: [] };
    return buildWeeklyQuizCatchUp({ quizzes: loaded.quizzes, doneById: loaded.doneById, joinedAt: loaded.since, now });
}

/**
 * Calendar entries for each weekly quiz's Tuesday due time. Quizzes whose class
 * assignment already has its own due date are skipped so they don't show twice.
 */
export function weeklyQuizDueEvents(
    quizzes: { id: string; title?: string | null; content: string }[],
    skipActivityIds: Iterable<string> = [],
) {
    const skip = new Set(skipActivityIds);
    return quizzes.flatMap((quiz) => {
        const weekNumber = skip.has(quiz.id) ? null : readWeekNumber(quiz.content);
        const schedule = weekNumber === null ? null : getWeeklyQuizSchedule(weekNumber);
        return schedule && weekNumber !== null
            ? [{ date: schedule.dueAt, endDate: null, type: "quiz" as const, title: `Quiz due: ${quiz.title || `Week ${weekNumber} Quiz`}` }]
            : [];
    });
}

/** Due-date calendar entries for the student's released weekly quizzes. */
export async function getStudentWeeklyQuizDueEvents(userId: string, skipActivityIds: Iterable<string> = [], now = new Date()) {
    const loaded = await loadStudentWeeklyQuizzes(userId, now);
    return loaded ? weeklyQuizDueEvents(loaded.quizzes, skipActivityIds) : [];
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
