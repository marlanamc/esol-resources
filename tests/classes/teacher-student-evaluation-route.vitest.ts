import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
    session: vi.fn(),
    enrollments: vi.fn(),
    user: vi.fn(),
    assignments: vi.fn(),
    reveals: vi.fn(),
    schedules: vi.fn(),
    activities: vi.fn(),
    progress: vi.fn(),
    submissions: vi.fn(),
    responses: vi.fn(),
    ledger: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({
    prisma: {
        classEnrollment: { findMany: mocks.enrollments },
        user: { findUnique: mocks.user },
        assignment: { findMany: mocks.assignments },
        classReveal: { findMany: mocks.reveals },
        classWeekSchedule: { findMany: mocks.schedules },
        activity: { findMany: mocks.activities },
        activityProgress: { findMany: mocks.progress },
        submission: { findMany: mocks.submissions },
        quizResponse: { findMany: mocks.responses },
        pointsLedger: { findMany: mocks.ledger },
    },
}));
import { GET } from '@/app/api/teacher/student-analytics/[id]/route';
const call = (query = '') =>
    GET(new Request(`http://localhost/api/teacher/student-analytics/student${query}`), {
        params: Promise.resolve({ id: 'student' }),
    });
beforeEach(() => {
    vi.resetAllMocks();
    mocks.session.mockResolvedValue({ user: { id: 'teacher', role: 'teacher' } });
    mocks.enrollments.mockResolvedValue([
        {
            classId: 'fy27',
            joinedAt: new Date('2026-09-15'),
            class: { id: 'fy27', name: 'FY27', createdAt: new Date('2026-09-11') },
        },
    ]);
    mocks.user.mockResolvedValue({
        id: 'student',
        name: 'Learner',
        username: 'learner',
        points: 20,
    });
    for (const fn of [
        mocks.assignments,
        mocks.reveals,
        mocks.schedules,
        mocks.activities,
        mocks.progress,
        mocks.submissions,
        mocks.responses,
        mocks.ledger,
    ])
        fn.mockResolvedValue([]);
});
describe('teacher evaluation access and source scope', () => {
    it('rejects anonymous requests before reading student data', async () => {
        mocks.session.mockResolvedValue(null);
        expect((await call()).status).toBe(401);
        expect(mocks.enrollments).not.toHaveBeenCalled();
    });
    it('rejects students, even when they know another student ID', async () => {
        mocks.session.mockResolvedValue({ user: { id: 'student', role: 'student' } });
        expect((await call()).status).toBe(403);
        expect(mocks.enrollments).not.toHaveBeenCalled();
    });
    it('limits teacher access to their active enrollments and rejects an unowned class selection', async () => {
        expect((await call('?classId=someone-elses-class')).status).toBe(404);
        expect(mocks.enrollments.mock.calls[0][0].where).toMatchObject({
            studentId: 'student',
            status: 'active',
            class: { teacherId: 'teacher' },
        });
        expect(mocks.progress).not.toHaveBeenCalled();
    });
    it('queries current class map quizzes rather than the global legacy quiz catalog', async () => {
        mocks.reveals.mockResolvedValue([{ weekId: 'week4' }]);
        mocks.schedules.mockResolvedValue([{ weekId: 'week5' }]);
        mocks.assignments.mockResolvedValue([{ id: 'assignment', activityId: 'linked-quiz' }]);
        const response = await call();
        const body = await response.json();
        expect(response.status).toBe(200);
        expect(response.headers.get('cache-control')).toBe('private, no-store');
        expect(body.scope).toMatchObject({ classId: 'fy27', since: '2026-09-15T00:00:00.000Z' });
        expect(mocks.activities.mock.calls[0][0].where.OR).toEqual([
            { courseMapItems: { some: { weekId: { in: ['week4', 'week5'] } } } },
            { id: { in: ['linked-quiz'] } },
        ]);
        for (const fn of [mocks.progress, mocks.submissions, mocks.responses])
            expect(fn.mock.calls[0][0].where.OR).toEqual([
                { assignmentId: null },
                { assignmentId: { in: ['assignment'] } },
            ]);
        expect(mocks.ledger.mock.calls[0][0].where.createdAt.gte).toEqual(new Date('2026-09-15'));
        expect(body).not.toHaveProperty('verbQuizResults');
    });
    it('permits an admin to select an active class without using a teacher ownership filter', async () => {
        mocks.session.mockResolvedValue({ user: { id: 'admin', role: 'admin' } });
        expect((await call('?classId=fy27')).status).toBe(200);
        expect(mocks.enrollments.mock.calls[0][0].where).not.toHaveProperty('class');
    });
});
