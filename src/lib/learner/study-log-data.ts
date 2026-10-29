import { prisma } from "@/lib/database/prisma";
import { addDaysToDayKey } from "@/lib/gamification/calendar-week";
import {
    buildStudyJournal,
    buildStudyWeek,
    countPracticeDays,
    normalizePracticeGoalDays,
    getStudyWeekRange,
    STUDY_LOG_ENTRY_SELECT,
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
    /** Logs from before this week with a teacher reply the learner hasn't read, newest first. */
    earlierReplies: StudyLogEntry[];
}

/** Unread teacher replies on logs from before this week, so they aren't missed once the week turns over. */
const EARLIER_REPLIES_LIMIT = 10;

/** One learner's practice logs for the current Mon–Sun week. */
export async function loadStudentStudyWeek(userId: string, now: Date = new Date()): Promise<StudentStudyWeek> {
    const { start, end } = getStudyWeekRange(now);
    const [rows, earlier, user] = await Promise.all([
        prisma.studyLog.findMany({
            where: { userId, dayKey: { gte: start, lte: end } },
            orderBy: { createdAt: "desc" },
            select: STUDY_LOG_ENTRY_SELECT,
        }),
        prisma.studyLog.findMany({
            where: { userId, dayKey: { lt: start }, replyKind: { not: null }, replySeenAt: null },
            orderBy: { createdAt: "desc" },
            take: EARLIER_REPLIES_LIMIT,
            select: STUDY_LOG_ENTRY_SELECT,
        }),
        prisma.user.findUnique({ where: { id: userId }, select: { practiceGoalDays: true } }),
    ]);
    const toEntries = (list: typeof rows) => list.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null);
    return {
        week: buildStudyWeek(rows, now),
        entries: toEntries(rows),
        goalDays: normalizePracticeGoalDays(user?.practiceGoalDays),
        earlierReplies: toEntries(earlier).filter((entry) => entry.reply),
    };
}

export type StudentStudyJournal = StudyJournal & { goalDays: number };

/** A learner's newest logs (up to 1,000), newest first, with any teacher replies. */
export async function loadStudyLogEntries(userId: string): Promise<StudyLogEntry[]> {
    const rows = await prisma.studyLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 1000,
        select: STUDY_LOG_ENTRY_SELECT,
    });
    return rows.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null);
}

/** A learner's logs for the profile journal (newest 1,000), their all-time count of days practiced, and their goal. */
export async function loadStudyJournal(userId: string): Promise<StudentStudyJournal> {
    const [entries, days, user] = await Promise.all([
        loadStudyLogEntries(userId),
        prisma.studyLog.groupBy({ by: ["dayKey"], where: { userId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { practiceGoalDays: true } }),
    ]);
    const journal = buildStudyJournal(entries);
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

/** The days one learner logged practice, with how many logs each day. */
export async function loadStudentPracticeDays(userId: string): Promise<Record<string, number>> {
    const rows = await prisma.studyLog.groupBy({ by: ["dayKey"], where: { userId }, _count: { _all: true } });
    return Object.fromEntries(rows.map((row) => [row.dayKey, row._count._all]));
}

/** For each day, how many of these learners logged practice. Days with none are left out. */
export async function loadClassPracticeDayCounts(userIds: string[]): Promise<Record<string, number>> {
    if (userIds.length === 0) return {};
    const rows = await prisma.studyLog.groupBy({ by: ["userId", "dayKey"], where: { userId: { in: userIds } } });
    const counts: Record<string, number> = {};
    for (const row of rows) counts[row.dayKey] = (counts[row.dayKey] ?? 0) + 1;
    return counts;
}
