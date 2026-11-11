import { beforeEach, expect, it, vi } from 'vitest';
import { gradebookAverages } from '@/lib/teach/gradebook-averages';
const mocks = vi.hoisted(() => ({ users: vi.fn(), quizzes: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { user: { findMany: mocks.users } } }));
vi.mock('@/lib/database/retry', () => ({ withPrismaReadRetry: (fn: () => unknown) => fn() }));
vi.mock('@/lib/teach/weekly-quiz-gradebook', () => ({ loadWeeklyQuizGradebook: mocks.quizzes }));
import { loadGradebookRoster } from '@/lib/teach/gradebook-roster';

beforeEach(() => vi.clearAllMocks());
it('uses best completed scores, counts real zeroes, and weights students equally', () => {
    const result = gradebookAverages([
        { userId: 'a', activityId: 'q1', score: 100 },
        { userId: 'a', activityId: 'q2', score: 0 },
        { userId: 'a', activityId: 'q1', score: 20 },
        { userId: 'b', activityId: 'q1', score: 100 },
        { userId: 'b', activityId: 'q2', score: null },
        { userId: 'former', activityId: 'q1', score: 0 },
    ], ['a', 'b', 'missing'], ['q1', 'q2']);
    expect(result).toEqual({ studentAverages: { a: 50, b: 100 }, classAverage: 75 });
    expect(gradebookAverages([], ['a'], ['q1']).classAverage).toBeNull();
});
it('separates leaderboard-ineligible students and keeps the class average independent of search and pagination', async () => {
    const student = (id: string, status: string) => ({ id, name: id, username: id, classes: [{ status }] });
    mocks.users.mockResolvedValueOnce([{ id: 'a' }, { id: 'b' }]).mockResolvedValueOnce([
        student('a', 'active'), student('b', 'active'), student('excluded', 'active'),
        student('graduate', 'graduated'), student('removed', 'inactive'),
    ]);
    mocks.quizzes.mockResolvedValue({ activities: [{ id: 'q1', title: 'Quiz' }], submissions: [
        { userId: 'a', activityId: 'q1', score: 100 },
        { userId: 'b', activityId: 'q1', score: 0 },
        { userId: 'graduate', activityId: 'q1', score: 0 },
    ] });
    const result = await loadGradebookRoster(['class'], '', 1, 1);
    expect(result.students.map(s => s.id)).toEqual(['a']);
    expect(result.formerStudents.map(s => s.enrollmentLabel)).toEqual(['Excluded from leaderboard', 'Graduated', 'Removed']);
    expect(result.classAverage).toBe(50);
    expect(result.pagination.total).toBe(2);
    expect(mocks.users.mock.calls[0][0].where).toMatchObject({ role: 'student', isSystemAccount: false, excludeFromLeaderboard: false, classes: { some: { classId: { in: ['class'] }, status: 'active' } } });
});
