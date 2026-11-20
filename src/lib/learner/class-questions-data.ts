import { prisma } from "@/lib/database/prisma";
import { COURSE_MAP_UNITS } from "@/lib/course-map-data";

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

/** The course week an activity belongs to, from the course map. */
export function findCourseWeekForActivity(activityId: string): number | null {
    for (const unit of COURSE_MAP_UNITS) {
        for (const week of unit.weeks) {
            if (week.items.some((item) => item.activityId === activityId)) return week.number;
        }
    }
    return null;
}

/** The week a guide's "Something not clear?" box asks about, or null unless the learner is in a class. */
export async function loadGuideQuestionsWeek(studentId: string, activityId: string): Promise<number | null> {
    const weekNumber = findCourseWeekForActivity(activityId);
    if (weekNumber == null) return null;
    const enrollment = await prisma.classEnrollment.findFirst({ where: { studentId, status: "active" }, select: { id: true } });
    return enrollment ? weekNumber : null;
}
