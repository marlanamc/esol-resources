import { prisma } from '@/lib/database/prisma';
import { withPrismaReadRetry } from '@/lib/database/retry';
import { getVisibleWeekIdsForClasses } from '@/lib/course-map';
import { readWeeklyQuizSchedule } from '@/lib/weekly-quiz-schedule';

/** Both teacher entry points use the same class-scoped weekly quiz results. */
export async function loadWeeklyQuizGradebook({ classIds, studentIds, now = new Date() }: {
    classIds: string[];
    studentIds: string[];
    now?: Date;
}) {
    const weekIds = [...await getVisibleWeekIdsForClasses(classIds, now)];
    const candidates = await withPrismaReadRetry(() => prisma.activity.findMany({
        where: {
            type: 'quiz',
            deletedAt: null,
            OR: [
                { courseMapItems: { some: { weekId: { in: weekIds } } } },
                { assignments: { some: { classId: { in: classIds } } } },
            ],
        },
        select: { id: true, title: true, content: true },
    }));
    // Weekly quizzes open on their schedule, regardless of the legacy release flag.
    const activities = candidates.flatMap((quiz) => {
        const schedule = readWeeklyQuizSchedule(quiz.content);
        return schedule && schedule.opensAt <= now
            ? [{ id: quiz.id, title: quiz.title, opensAt: schedule.opensAt }]
            : [];
    }).sort((a, b) => a.opensAt.getTime() - b.opensAt.getTime())
        .map(({ id, title }) => ({ id, title }));

    const rows = studentIds.length && activities.length
        ? await withPrismaReadRetry(() => prisma.submission.findMany({
            where: {
                userId: { in: studentIds },
                activityId: { in: activities.map((a) => a.id) },
                status: { in: ['submitted', 'graded', 'completed'] },
                score: { not: null },
                OR: [{ assignmentId: null }, { assignment: { classId: { in: classIds } } }],
            },
            select: { userId: true, activityId: true, score: true, updatedAt: true },
        })) : [];

    // An activity can have both course-map and assignment submissions. Keep the best score.
    const best = new Map<string, typeof rows[number]>();
    for (const row of rows) {
        const key = `${row.userId}:${row.activityId}`;
        const previous = best.get(key);
        if (!previous || (row.score ?? -1) > (previous.score ?? -1) ||
            (row.score === previous.score && row.updatedAt > previous.updatedAt)) {
            best.set(key, row);
        }
    }
    return { activities, submissions: [...best.values()] };
}
