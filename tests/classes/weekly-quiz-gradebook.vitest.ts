import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ activities: vi.fn(), submissions: vi.fn(), weeks: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {
    activity: { findMany: mocks.activities }, submission: { findMany: mocks.submissions },
} }));
vi.mock('@/lib/database/retry', () => ({ withPrismaReadRetry: (fn: () => unknown) => fn() }));
vi.mock('@/lib/course-map', () => ({ getVisibleWeekIdsForClasses: mocks.weeks }));
import { loadWeeklyQuizGradebook } from '@/lib/teach/weekly-quiz-gradebook';

const quiz = (id: string, weekNumber: number) => ({ id, title: id, content: JSON.stringify({ type: 'weekly-quiz', weekNumber }) });

describe('weekly quiz gradebook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.weeks.mockResolvedValue(new Set(['week-4']));
        mocks.submissions.mockResolvedValue([]);
    });
    it('excludes legacy quizzes and future weeks, and orders opened quizzes chronologically', async () => {
        mocks.activities.mockResolvedValue([
            quiz('week-5', 5), quiz('week-4', 4), quiz('future', 20),
            { id: 'guide', title: 'Old guide', content: '{"miniQuiz":[]}' },
            { id: 'broken', title: 'Broken', content: '{' },
        ]);
        const result = await loadWeeklyQuizGradebook({ classIds: ['class-1'], studentIds: ['student'], now: new Date('2026-11-11') });
        expect(result.activities.map(a => a.id)).toEqual(['week-4', 'week-5']);
        expect(mocks.activities).toHaveBeenCalledWith(expect.objectContaining({ where: {
            type: 'quiz', deletedAt: null, OR: [
                { courseMapItems: { some: { weekId: { in: ['week-4'] } } } },
                { assignments: { some: { classId: { in: ['class-1'] } } } },
            ],
        } }));
        expect(mocks.submissions.mock.calls[0][0].where.activityId).toEqual({ in: ['week-4', 'week-5'] });
    });
    it('keeps a best score across assignment and course-map records, including zero scores', async () => {
        mocks.activities.mockResolvedValue([quiz('quiz', 4)]);
        const row = { userId: 'student', activityId: 'quiz', updatedAt: new Date('2026-11-01') };
        mocks.submissions.mockResolvedValue([
            { ...row, score: 90 }, { ...row, score: 40, updatedAt: new Date('2026-11-02') },
            { ...row, userId: 'other', score: 0 },
        ]);
        const result = await loadWeeklyQuizGradebook({ classIds: ['class-1'], studentIds: ['student', 'other'], now: new Date('2026-11-11') });
        expect(result.submissions.map(s => s.score)).toEqual([90, 0]);
    });
    it('does not query submissions when no weekly quizzes have opened', async () => {
        mocks.activities.mockResolvedValue([quiz('future', 20)]);
        const result = await loadWeeklyQuizGradebook({ classIds: ['class-1'], studentIds: ['student'], now: new Date('2026-11-11') });
        expect(result).toEqual({ activities: [], submissions: [] });
        expect(mocks.submissions).not.toHaveBeenCalled();
    });
});
