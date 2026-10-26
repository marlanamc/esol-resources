import { prisma } from "@/lib/database/prisma";
import {
    buildStudyWeek,
    getStudyWeekRange,
    toStudyLogEntry,
    type StudyLogEntry,
    type StudyWeek,
} from "@/lib/learner/study-log";

export interface StudentStudyWeek {
    week: StudyWeek;
    /** This week's logs, newest first. */
    entries: StudyLogEntry[];
}

/** One learner's practice logs for the current Mon–Sun week. */
export async function loadStudentStudyWeek(userId: string, now: Date = new Date()): Promise<StudentStudyWeek> {
    const { start, end } = getStudyWeekRange(now);
    const rows = await prisma.studyLog.findMany({
        where: { userId, dayKey: { gte: start, lte: end } },
        orderBy: { createdAt: "desc" },
        select: { id: true, kind: true, text: true, dayKey: true, createdAt: true },
    });
    return {
        week: buildStudyWeek(rows, now),
        entries: rows.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null),
    };
}
