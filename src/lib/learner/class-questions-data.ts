import { prisma } from "@/lib/database/prisma";

export interface UnseenClassAnswers {
    count: number;
    /** The week of the newest unseen answer, so Home can link straight to it. */
    weekNumber: number;
}

/** Answered questions the learner hasn't tapped "Thanks!" on yet, or null when there are none. */
export async function loadUnseenClassAnswers(studentId: string): Promise<UnseenClassAnswers | null> {
    const where = { studentId, answeredAt: { not: null }, answerSeenAt: null };
    const [count, newest] = await Promise.all([
        prisma.classQuestion.count({ where }),
        prisma.classQuestion.findFirst({ where, orderBy: { answeredAt: "desc" }, select: { weekNumber: true } }),
    ]);
    return newest ? { count, weekNumber: newest.weekNumber } : null;
}
