import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
    session: vi.fn(),
    enrollmentFindFirst: vi.fn(),
    classFindUnique: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    updateMany: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {
    classEnrollment: { findFirst: mocks.enrollmentFindFirst },
    class: { findUnique: mocks.classFindUnique },
    classQuestion: {
        findMany: mocks.findMany,
        findFirst: mocks.findFirst,
        count: mocks.count,
        create: mocks.create,
        update: mocks.update,
        delete: mocks.remove,
        updateMany: mocks.updateMany,
    },
} }));
vi.mock('@/lib/api/response', () => ({
    apiError: (error: string, status: number) => Response.json({ error }, { status }),
    handleApiError: () => Response.json({ error: 'failed' }, { status: 500 }),
}));
import { GET, POST } from '@/app/api/class-questions/route';
import { DELETE, PATCH } from '@/app/api/class-questions/[id]/route';
import { GET as TEACHER_GET, PATCH as TEACHER_PATCH } from '@/app/api/teacher/class-questions/route';

const json = (url: string, method: string, body?: unknown) => new NextRequest(`http://localhost${url}`, {
    method, body: body === undefined ? undefined : JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
});
const params = (id: string) => ({ params: Promise.resolve({ id }) });
const student = { user: { id: 'student-1', role: 'student' } };
const teacher = { user: { id: 'teacher-1', role: 'teacher' } };
const row = { id: 'q1', text: 'What is "if"?', anonymous: false, answeredAt: null };

beforeEach(() => {
    vi.resetAllMocks();
    mocks.session.mockResolvedValue(student);
    mocks.enrollmentFindFirst.mockResolvedValue({ classId: 'class-1' });
    mocks.count.mockResolvedValue(0);
    mocks.create.mockResolvedValue(row);
});

describe('student class questions', () => {
    it('requires a signed-in student', async () => {
        mocks.session.mockResolvedValue(null);
        expect((await POST(json('/api/class-questions', 'POST', { weekNumber: 7, text: 'Hi?' }))).status).toBe(401);
        mocks.session.mockResolvedValue(teacher);
        expect((await POST(json('/api/class-questions', 'POST', { weekNumber: 7, text: 'Hi?' }))).status).toBe(403);
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it.each([{ text: 'Hi?' }, { weekNumber: 7 }, { weekNumber: 7, text: '   ' }, { weekNumber: 7, text: 'x'.repeat(501) }, { weekNumber: 0, text: 'Hi?' }])(
        'rejects bad input: %j',
        async (body) => {
            expect((await POST(json('/api/class-questions', 'POST', body))).status).toBe(400);
            expect(mocks.create).not.toHaveBeenCalled();
        }
    );

    it('saves to the student and their class, trimming the text', async () => {
        const res = await POST(json('/api/class-questions', 'POST', { weekNumber: 7, text: '  What is "if"?  ', anonymous: true, studentId: 'someone-else' }));
        expect(res.status).toBe(201);
        expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
            data: { studentId: 'student-1', classId: 'class-1', weekNumber: 7, text: 'What is "if"?', anonymous: true },
        }));
        expect((await res.json()).question).toEqual({ id: 'q1', text: 'What is "if"?', anonymous: false, answered: false });
    });

    it('needs a class and caps questions per week', async () => {
        mocks.enrollmentFindFirst.mockResolvedValue(null);
        expect((await POST(json('/api/class-questions', 'POST', { weekNumber: 7, text: 'Hi?' }))).status).toBe(403);
        mocks.enrollmentFindFirst.mockResolvedValue({ classId: 'class-1' });
        mocks.count.mockResolvedValue(5);
        expect((await POST(json('/api/class-questions', 'POST', { weekNumber: 7, text: 'Hi?' }))).status).toBe(429);
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it('lists only the student\'s own questions for the week', async () => {
        mocks.findMany.mockResolvedValue([{ ...row, answeredAt: new Date() }]);
        const res = await GET(json('/api/class-questions?week=7', 'GET'));
        expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { studentId: 'student-1', weekNumber: 7 } }));
        expect((await res.json()).questions[0].answered).toBe(true);
    });

    it('edits and deletes only unanswered questions the student owns', async () => {
        mocks.findFirst.mockResolvedValue(null);
        expect((await PATCH(json('/api/class-questions/q1', 'PATCH', { text: 'New?' }), params('q1'))).status).toBe(404);
        expect(mocks.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'q1', studentId: 'student-1' } }));

        mocks.findFirst.mockResolvedValue({ id: 'q1', answeredAt: new Date() });
        expect((await DELETE(json('/api/class-questions/q1', 'DELETE'), params('q1'))).status).toBe(409);
        expect(mocks.remove).not.toHaveBeenCalled();

        mocks.findFirst.mockResolvedValue({ id: 'q1', answeredAt: null });
        mocks.update.mockResolvedValue({ ...row, text: 'New?' });
        expect((await PATCH(json('/api/class-questions/q1', 'PATCH', { text: 'New?' }), params('q1'))).status).toBe(200);
        expect((await DELETE(json('/api/class-questions/q1', 'DELETE'), params('q1'))).status).toBe(200);
        expect(mocks.remove).toHaveBeenCalledWith({ where: { id: 'q1' } });
    });
});

describe('teacher class questions', () => {
    beforeEach(() => {
        mocks.session.mockResolvedValue(teacher);
        mocks.classFindUnique.mockResolvedValue({ id: 'class-1', teacherId: 'teacher-1' });
    });

    it('is teacher-only and limited to the teacher\'s own class', async () => {
        mocks.session.mockResolvedValue(student);
        expect((await TEACHER_GET(json('/api/teacher/class-questions?classId=class-1&week=7', 'GET'))).status).toBe(403);
        mocks.session.mockResolvedValue(teacher);
        mocks.classFindUnique.mockResolvedValue({ id: 'class-1', teacherId: 'other-teacher' });
        expect((await TEACHER_GET(json('/api/teacher/class-questions?classId=class-1&week=7', 'GET'))).status).toBe(404);
        expect(mocks.findMany).not.toHaveBeenCalled();
    });

    it('hides the name on anonymous questions', async () => {
        mocks.findMany.mockResolvedValue([
            { ...row, createdAt: new Date('2026-10-26T12:00:00Z'), student: { name: 'Ricardo', username: 'ricardo' } },
            { ...row, id: 'q2', anonymous: true, createdAt: new Date('2026-10-26T13:00:00Z'), student: { name: 'Ana', username: 'ana' } },
        ]);
        const { questions } = await (await TEACHER_GET(json('/api/teacher/class-questions?classId=class-1&week=7', 'GET'))).json();
        expect(questions.map((q: { studentName: string | null }) => q.studentName)).toEqual(['Ricardo', null]);
    });

    it('marks answered only within the class', async () => {
        mocks.updateMany.mockResolvedValue({ count: 1 });
        const res = await TEACHER_PATCH(json('/api/teacher/class-questions', 'PATCH', { classId: 'class-1', ids: ['q1'], answered: true }));
        expect(res.status).toBe(200);
        expect(mocks.updateMany).toHaveBeenCalledWith({ where: { id: { in: ['q1'] }, classId: 'class-1' }, data: { answeredAt: expect.any(Date) } });
    });
});
