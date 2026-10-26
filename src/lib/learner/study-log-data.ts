import { prisma } from "@/lib/database/prisma";
import { addDaysToDayKey } from "@/lib/gamification/calendar-week";
import {
    buildStudyJournal,
    buildStudyWeek,
    countPracticeDays,
    normalizePracticeGoalDays,
    getStudyWeekRange,
    toStudyLogEntry,
    type StudyJournal,
    type StudyLogEntry,
    type StudyWeek,
} from "@/lib/learner/study-log";

export interface StudentStudyWeek {
    week: StudyWeek;
    /** This week's logs, newest first. */
    entries: StudyLogEntry[];
    /** Days a week the learner wants to practice. */
    goalDays: number;
}

/** One learner's practice logs for the current Mon–Sun week. */
export async function loadStudentStudyWeek(userId: string, now: Date = new Date()): Promise<StudentStudyWeek> {
    const { start, end } = getStudyWeekRange(now);
    const [rows, user] = await Promise.all([
        prisma.studyLog.findMany({
            where: { userId, dayKey: { gte: start, lte: end } },
            orderBy: { createdAt: "desc" },
            select: { id: true, kind: true, text: true, dayKey: true, createdAt: true },
        }),
        prisma.user.findUnique({ where: { id: userId }, select: { practiceGoalDays: true } }),
    ]);
    return {
        week: buildStudyWeek(rows, now),
        entries: rows.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null),
        goalDays: normalizePracticeGoalDays(user?.practiceGoalDays),
    };
}

export type StudentStudyJournal = StudyJournal & { goalDays: number };

/** A learner's logs for the profile journal (newest 1,000), their all-time count of days practiced, and their goal. */
export async function loadStudyJournal(userId: string): Promise<StudentStudyJournal> {
    const [rows, days, user] = await Promise.all([
        prisma.studyLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 1000,
            select: { id: true, kind: true, text: true, dayKey: true, createdAt: true },
        }),
        prisma.studyLog.groupBy({ by: ["dayKey"], where: { userId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { practiceGoalDays: true } }),
    ]);
    const journal = buildStudyJournal(rows.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null));
    return { ...journal, daysPracticed: days.length, goalDays: normalizePracticeGoalDays(user?.practiceGoalDays) };
}

/** How many days each learner logged practice in the Mon–Sun week starting weekStart. Learners with none are left out. */
export async function loadPracticeDaysForWeek(userIds: string[], weekStart: string): Promise<Map<string, number>> {
    if (userIds.length === 0) return new Map();
    const rows = await prisma.studyLog.groupBy({
        by: ["userId", "dayKey"],
        where: { userId: { in: userIds }, dayKey: { gte: weekStart, lte: addDaysToDayKey(weekStart, 6) } },
    });
    return countPracticeDays(rows);
}
