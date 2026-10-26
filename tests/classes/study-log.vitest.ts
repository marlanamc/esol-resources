import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
    session: vi.fn(),
    award: vi.fn(),
    lock: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    classFindUnique: vi.fn(),
    enrollmentFindMany: vi.fn(),
    userFindUnique: vi.fn(),
    userUpdate: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
vi.mock('@/lib/database/prisma', () => {
    const tx = { $executeRaw: mocks.lock, studyLog: { count: mocks.count, create: mocks.create } };
    return { prisma: {
        $transaction: (run: (client: typeof tx) => unknown) => run(tx),
        studyLog: { findMany: mocks.findMany },
        class: { findUnique: mocks.classFindUnique },
        classEnrollment: { findMany: mocks.enrollmentFindMany },
        user: { findUnique: mocks.userFindUnique, update: mocks.userUpdate },
    } };
});
vi.mock('@/lib/api/response', () => ({
    apiError: (error: string, status: number) => Response.json({ error }, { status }),
    handleApiError: () => Response.json({ error: 'failed' }, { status: 500 }),
}));
import { GET, POST } from '@/app/api/study-log/route';
import { GET as TEACHER_GET } from '@/app/api/teacher/study-log/route';
import { PUT as GOAL_PUT } from '@/app/api/study-log/goal/route';
import {
    buildStudyJournal,
    buildStudyWeek,
    countPracticeDays,
    getWeekStartForDayKey,
    buildTeacherStudyRows,
    MAX_STUDY_LOGS_PER_DAY,
    normalizePracticeGoalDays,
    parseStudyLogText,
    parseWeekStartDayKey,
} from '@/lib/learner/study-log';

const json = (url: string, method: string, body?: unknown) => new NextRequest(`http://localhost${url}`, {
    method, body: body === undefined ? undefined : JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
});
const student = { user: { id: 'student-1', role: 'student' } };
const teacher = { user: { id: 'teacher-1', role: 'teacher' } };
const log = { kind: 'watch', text: 'I watched a cooking video.' };

beforeEach(() => {
    vi.resetAllMocks();
    mocks.session.mockResolvedValue(student);
    mocks.count.mockResolvedValue(0);
    mocks.findMany.mockResolvedValue([]);
    mocks.userFindUnique.mockResolvedValue({ practiceGoalDays: 4 });
    mocks.award.mockResolvedValue({ streakPointsAwarded: 3, currentStreak: 4 });
});

describe('study log helpers', () => {
    // Wednesday Oct 28 2026, midday Eastern.
    const wednesday = new Date('2026-10-28T16:00:00Z');

    it('builds Mon–Sun with each kind once per day and counts practiced days', () => {
        const week = buildStudyWeek([
            { kind: 'watch', dayKey: '2026-10-26' },
            { kind: 'watch', dayKey: '2026-10-26' },
            { kind: 'listen', dayKey: '2026-10-26' },
            { kind: 'write', dayKey: '2026-10-28' },
            { kind: 'write', dayKey: '2026-10-25' }, // last Sunday: previous week
            { kind: 'dance', dayKey: '2026-10-27' }, // unknown kind
            { kind: 'switch', dayKey: '2026-10-29' }, // saved before Other replaced Switch
        ], wednesday);
        expect(week.weekStartDayKey).toBe('2026-10-26');
        expect(week.days.map((d) => d.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        expect(week.days[0].kinds).toEqual(['watch', 'listen']);
        expect(week.days[1].kinds).toEqual([]);
        expect(week.days[2]).toMatchObject({ isToday: true, isFuture: false, kinds: ['write'] });
        expect(week.days[3]).toMatchObject({ isFuture: true, kinds: ['other'] });
        expect(week.daysPracticed).toBe(3);
    });

    it('uses the learner day, not UTC: 11pm Sunday Eastern is still last week', () => {
        expect(buildStudyWeek([], new Date('2026-11-02T03:30:00Z')).weekStartDayKey).toBe('2026-10-26');
    });

    it('checks the sentence', () => {
        expect(parseStudyLogText('  I watched TV.  ')).toEqual({ text: 'I watched TV.' });
        expect(parseStudyLogText('   ')).toHaveProperty('error');
        expect(parseStudyLogText(42)).toHaveProperty('error');
        expect(parseStudyLogText('x'.repeat(301))).toHaveProperty('error');
    });

    it('only accepts real Mondays as a teacher week', () => {
        expect(parseWeekStartDayKey('2026-10-19', wednesday)).toBe('2026-10-19');
        expect(parseWeekStartDayKey('2026-10-20', wednesday)).toBe('2026-10-26');
        expect(parseWeekStartDayKey('2026-02-30', wednesday)).toBe('2026-10-26');
        expect(parseWeekStartDayKey('nope', wednesday)).toBe('2026-10-26');
    });

    it('gives the teacher one row per student in name order, newest log first', () => {
        const at = (iso: string) => new Date(iso);
        const rows = buildTeacherStudyRows(
            [{ id: 'b', name: 'Wei', username: 'wei' }, { id: 'a', name: null, username: 'ana' }],
            [
                { id: '1', userId: 'b', kind: 'listen', text: 'I listened to music.', dayKey: '2026-10-26', createdAt: at('2026-10-26T12:00:00Z') },
                { id: '2', userId: 'b', kind: 'write', text: 'I wrote a text.', dayKey: '2026-10-27', createdAt: at('2026-10-27T12:00:00Z') },
            ],
            '2026-10-26'
        );
        expect(rows.map((r) => r.studentName)).toEqual(['ana', 'Wei']);
        expect(rows[0]).toMatchObject({ daysPracticed: 0, entries: [] });
        expect(rows[1].days.slice(0, 3)).toEqual([['listen'], ['write'], []]);
        expect(rows[1].entries.map((e) => e.id)).toEqual(['2', '1']);
    });
});

describe('leaderboard practice days', () => {
    it('counts distinct days per learner and skips learners with no logs', () => {
        const days = countPracticeDays([
            { userId: 'a', dayKey: '2026-10-26' },
            { userId: 'a', dayKey: '2026-10-26' },
            { userId: 'a', dayKey: '2026-10-28' },
            { userId: 'b', dayKey: '2026-10-27' },
        ]);
        expect(days.get('a')).toBe(2);
        expect(days.get('b')).toBe(1);
        expect(days.has('c')).toBe(false);
    });
});

describe('practice journal', () => {
    it('finds the Monday of any day', () => {
        expect(getWeekStartForDayKey('2026-10-26')).toBe('2026-10-26'); // Monday
        expect(getWeekStartForDayKey('2026-11-01')).toBe('2026-10-26'); // Sunday
        expect(getWeekStartForDayKey('2026-11-02')).toBe('2026-11-02');
    });

    it('groups logs by week, newest first, and counts distinct days', () => {
        const entry = (id: string, dayKey: string, hour: number) => ({
            id, kind: 'watch' as const, text: id, dayKey, createdAt: `${dayKey}T${String(hour).padStart(2, '0')}:00:00.000Z`,
        });
        const journal = buildStudyJournal([
            entry('a', '2026-10-20', 12),
            entry('b', '2026-10-27', 12),
            entry('c', '2026-10-27', 18),
            entry('d', '2026-11-01', 12),
        ]);
        expect(journal.daysPracticed).toBe(3);
        expect(journal.weeks.map((w) => [w.weekStart, w.entries.map((e) => e.id)])).toEqual([
            ['2026-10-26', ['d', 'c', 'b']],
            ['2026-10-19', ['a']],
        ]);
    });
});

describe('POST /api/study-log', () => {
    it('requires a signed-in student', async () => {
        mocks.session.mockResolvedValue(null);
        expect((await POST(json('/api/study-log', 'POST', log))).status).toBe(401);
        mocks.session.mockResolvedValue(teacher);
        expect((await POST(json('/api/study-log', 'POST', log))).status).toBe(403);
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it.each([{ text: 'Hi.' }, { kind: 'dance', text: 'Hi.' }, { kind: 'watch' }, { kind: 'watch', text: '  ' }])(
        'rejects bad input: %j',
        async (body) => {
            expect((await POST(json('/api/study-log', 'POST', body))).status).toBe(400);
            expect(mocks.create).not.toHaveBeenCalled();
        }
    );

    it('awards 5 points through the award chain for the first log of the day', async () => {
        const res = await POST(json('/api/study-log', 'POST', { ...log, userId: 'someone-else' }));
        expect(res.status).toBe(201);
        expect(mocks.lock).toHaveBeenCalled();
        expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: 'student-1', kind: 'watch', text: log.text }) });
        expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ userId: 'student-1', points: 5, source: 'study-log' }));
        expect(await res.json()).toMatchObject({ pointsAwarded: 8, streak: 4, goalDays: 4 });
    });

    it('saves later logs that day without points', async () => {
        mocks.count.mockResolvedValue(1);
        const res = await POST(json('/api/study-log', 'POST', log));
        expect(res.status).toBe(201);
        expect(mocks.create).toHaveBeenCalled();
        expect(mocks.award).not.toHaveBeenCalled();
        expect((await res.json()).pointsAwarded).toBe(0);
    });

    it('stops at the daily limit', async () => {
        mocks.count.mockResolvedValue(MAX_STUDY_LOGS_PER_DAY);
        expect((await POST(json('/api/study-log', 'POST', log))).status).toBe(429);
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it('GET only reads the signed-in student\'s logs', async () => {
        const res = await GET(json('/api/study-log', 'GET'));
        expect(res.status).toBe(200);
        expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 'student-1' }) }));
    });
});

describe('practice goal', () => {
    it('falls back to 3 days for a stored value that is not an option', () => {
        expect(normalizePracticeGoalDays(5)).toBe(5);
        expect(normalizePracticeGoalDays(6)).toBe(3);
        expect(normalizePracticeGoalDays(null)).toBe(3);
    });

    it('PUT saves an allowed goal for the signed-in student only', async () => {
        const res = await GOAL_PUT(json('/api/study-log/goal', 'PUT', { days: 5, userId: 'someone-else' }));
        expect(res.status).toBe(200);
        expect(mocks.userUpdate).toHaveBeenCalledWith({ where: { id: 'student-1' }, data: { practiceGoalDays: 5 } });
        expect(mocks.award).not.toHaveBeenCalled();
    });

    it.each([{ days: 6 }, { days: '5' }, {}])('PUT rejects %j', async (body) => {
        expect((await GOAL_PUT(json('/api/study-log/goal', 'PUT', body))).status).toBe(400);
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it('PUT is students only', async () => {
        mocks.session.mockResolvedValue(teacher);
        expect((await GOAL_PUT(json('/api/study-log/goal', 'PUT', { days: 5 }))).status).toBe(403);
    });
});

describe('GET /api/teacher/study-log', () => {
    beforeEach(() => mocks.session.mockResolvedValue(teacher));

    it('is teacher-only and limited to classes they manage', async () => {
        mocks.session.mockResolvedValue(student);
        expect((await TEACHER_GET(json('/api/teacher/study-log?classId=c1', 'GET'))).status).toBe(403);
        mocks.session.mockResolvedValue(teacher);
        mocks.classFindUnique.mockResolvedValue({ teacherId: 'other-teacher' });
        expect((await TEACHER_GET(json('/api/teacher/study-log?classId=c1', 'GET'))).status).toBe(404);
        expect(mocks.findMany).not.toHaveBeenCalled();
    });

    it('returns a row per enrolled student for the requested week', async () => {
        mocks.classFindUnique.mockResolvedValue({ teacherId: 'teacher-1' });
        mocks.enrollmentFindMany.mockResolvedValue([{ student: { id: 's1', name: 'Ana', username: 'ana', practiceGoalDays: 5 } }]);
        const res = await TEACHER_GET(json('/api/teacher/study-log?classId=c1&week=2026-10-19', 'GET'));
        expect(res.status).toBe(200);
        expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { userId: { in: ['s1'] }, dayKey: { gte: '2026-10-19', lte: '2026-10-25' } },
        }));
        const body = await res.json();
        expect(body.weekStart).toBe('2026-10-19');
        expect(body.rows).toHaveLength(1);
        expect(body.rows[0].goalDays).toBe(5);
    });
});
