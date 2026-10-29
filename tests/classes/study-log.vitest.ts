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
    groupBy: vi.fn(),
    ledgerFindFirst: vi.fn(),
    logFindUnique: vi.fn(),
    logUpdate: vi.fn(),
    logUpdateMany: vi.fn(),
    enrollmentFindFirst: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
vi.mock('@/lib/database/prisma', () => {
    const tx = {
        $executeRaw: mocks.lock,
        studyLog: { count: mocks.count, create: mocks.create, groupBy: mocks.groupBy },
        user: { findUnique: mocks.userFindUnique },
        pointsLedger: { findFirst: mocks.ledgerFindFirst },
    };
    return { prisma: {
        $transaction: (run: (client: typeof tx) => unknown) => run(tx),
        studyLog: { findMany: mocks.findMany, findUnique: mocks.logFindUnique, update: mocks.logUpdate, updateMany: mocks.logUpdateMany },
        class: { findUnique: mocks.classFindUnique },
        classEnrollment: { findMany: mocks.enrollmentFindMany, findFirst: mocks.enrollmentFindFirst },
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
import { PUT as REPLY_PUT } from '@/app/api/teacher/study-log/reply/route';
import { POST as SEEN_POST } from '@/app/api/study-log/reply-seen/route';
import {
    countUnreadReplies,
    diffRecastWords,
    parseStudyLogRecast,
    toStudyLogEntry,
    buildStudyJournal,
    buildStudyWeek,
    countPracticeDays,
    getWeekStartForDayKey,
    buildTeacherStudyRows,
    MAX_STUDY_LOGS_PER_DAY,
    normalizePracticeGoalDays,
    parseDayKey,
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
    mocks.groupBy.mockResolvedValue([{ dayKey: '2026-10-26' }]);
    mocks.ledgerFindFirst.mockResolvedValue(null);
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
            id, kind: 'watch' as const, text: id, dayKey, reply: null, createdAt: `${dayKey}T${String(hour).padStart(2, '0')}:00:00.000Z`,
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

    it('awards 5 points through the award chain for a log', async () => {
        const res = await POST(json('/api/study-log', 'POST', { ...log, userId: 'someone-else' }));
        expect(res.status).toBe(201);
        expect(mocks.lock).toHaveBeenCalled();
        expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: 'student-1', kind: 'watch', text: log.text }) });
        expect(mocks.award).toHaveBeenCalledTimes(1);
        expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ userId: 'student-1', points: 5, source: 'study-log' }));
        expect(await res.json()).toMatchObject({ pointsAwarded: 8, goalBonus: 0, streak: 4, goalDays: 4 });
    });

    it('awards 5 points for later logs the same day too', async () => {
        mocks.count.mockResolvedValue(3);
        mocks.award.mockResolvedValue({ streakPointsAwarded: 0, currentStreak: 4 });
        const res = await POST(json('/api/study-log', 'POST', log));
        expect(res.status).toBe(201);
        expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ points: 5, source: 'study-log' }));
        expect((await res.json()).pointsAwarded).toBe(5);
    });

    it('adds a 25-point bonus the first time the week reaches the goal', async () => {
        mocks.groupBy.mockResolvedValue(['a', 'b', 'c', 'd'].map((dayKey) => ({ dayKey })));
        const res = await POST(json('/api/study-log', 'POST', log));
        expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ userId: 'student-1', points: 25, source: 'study-goal' }));
        expect(await res.json()).toMatchObject({ pointsAwarded: 33, goalBonus: 25 });
    });

    it('gives the goal bonus only once a week', async () => {
        mocks.groupBy.mockResolvedValue(['a', 'b', 'c', 'd', 'e'].map((dayKey) => ({ dayKey })));
        mocks.ledgerFindFirst.mockResolvedValue({ id: 'already' });
        const res = await POST(json('/api/study-log', 'POST', log));
        expect(mocks.award).toHaveBeenCalledTimes(1);
        expect(await res.json()).toMatchObject({ pointsAwarded: 8, goalBonus: 0 });
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
        expect(normalizePracticeGoalDays(6)).toBe(6);
        expect(normalizePracticeGoalDays(8)).toBe(3);
        expect(normalizePracticeGoalDays(null)).toBe(3);
    });

    it('PUT saves an allowed goal for the signed-in student only', async () => {
        const res = await GOAL_PUT(json('/api/study-log/goal', 'PUT', { days: 5, userId: 'someone-else' }));
        expect(res.status).toBe(200);
        expect(mocks.userUpdate).toHaveBeenCalledWith({ where: { id: 'student-1' }, data: { practiceGoalDays: 5 } });
        expect(mocks.award).not.toHaveBeenCalled();
    });

    it.each([{ days: 8 }, { days: '5' }, {}])('PUT rejects %j', async (body) => {
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

    it('returns one day, and only students who logged that day, with day=', async () => {
        mocks.classFindUnique.mockResolvedValue({ teacherId: 'teacher-1' });
        mocks.enrollmentFindMany.mockResolvedValue([
            { student: { id: 's1', name: 'Ana', username: 'ana' } },
            { student: { id: 's2', name: 'Wei', username: 'wei' } },
        ]);
        mocks.findMany.mockResolvedValue([
            { id: '1', userId: 's2', kind: 'watch', text: 'I watched TV.', dayKey: '2026-10-28', createdAt: new Date('2026-10-28T12:00:00Z') },
        ]);
        const res = await TEACHER_GET(json('/api/teacher/study-log?classId=c1&day=2026-10-28', 'GET'));
        expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: { in: ['s1', 's2'] }, dayKey: '2026-10-28' } }));
        const body = await res.json();
        expect(body.weekStart).toBe('2026-10-26');
        expect(body.rows.map((r: { studentName: string }) => r.studentName)).toEqual(['Wei']);
    });

    it('rejects a day that is not a real date', async () => {
        mocks.classFindUnique.mockResolvedValue({ teacherId: 'teacher-1' });
        expect((await TEACHER_GET(json('/api/teacher/study-log?classId=c1&day=2026-02-30', 'GET'))).status).toBe(400);
        expect(parseDayKey('2026-10-28')).toBe('2026-10-28');
        expect(parseDayKey('10/28/2026')).toBeNull();
    });
});

describe('teacher replies', () => {
    const changed = (original: string, corrected: string) =>
        diffRecastWords(original, corrected).filter((part) => part.changed).map((part) => part.word);

    it('marks only the new or fixed words in a recast', () => {
        expect(changed('I spook with my boss her name is Katherine.', 'I spoke with my boss. Her name is Katherine.'))
            .toEqual(['spoke', '.', 'Her']);
        expect(changed('I watched the move in English', 'I watched the movie in English.')).toEqual(['movie', '.']);
        expect(changed('I went store.', 'I went to the store.')).toEqual(['to', 'the']);
        expect(changed('Wow.', 'Wow!')).toEqual(['!']);
    });

    it('puts the sentence back together with spaces only between words', () => {
        const join = (parts: ReturnType<typeof diffRecastWords>) => parts.map((p) => (p.space ? ' ' : '') + p.word).join('');
        expect(join(diffRecastWords('I  watched tv', 'I watched TV, then slept.'))).toBe('I watched TV, then slept.');
        expect(join(diffRecastWords('x', 'Really?! ... ok'))).toBe('Really?! ... ok');
    });

    it('needs a recast that differs from the sentence', () => {
        expect(parseStudyLogRecast('  I spoke  with my boss. ', 'I spook with my boss.')).toEqual({ text: 'I spoke with my boss.' });
        expect(parseStudyLogRecast('I spook  with my boss.', ' I spook with my boss.')).toHaveProperty('error');
        expect(parseStudyLogRecast('', 'x')).toHaveProperty('error');
        expect(parseStudyLogRecast('y'.repeat(301), 'x')).toHaveProperty('error');
    });

    it('reads a reply onto the entry and counts unread ones', () => {
        const base = { id: '1', kind: 'watch', text: 'I watched tv.', dayKey: '2026-10-27', createdAt: new Date('2026-10-27T12:00:00Z') };
        const at = new Date('2026-10-28T12:00:00Z');
        expect(toStudyLogEntry(base)?.reply).toBeNull();
        const recast = toStudyLogEntry({ ...base, replyKind: 'recast', replyText: 'I watched TV.', repliedAt: at, replySeenAt: null })!;
        expect(recast.reply).toEqual({ kind: 'recast', text: 'I watched TV.', repliedAt: at.toISOString(), seen: false });
        const praise = toStudyLogEntry({ ...base, replyKind: 'praise', replyText: 'stray', repliedAt: at, replySeenAt: at })!;
        expect(praise.reply).toMatchObject({ kind: 'praise', text: null, seen: true });
        expect(toStudyLogEntry({ ...base, replyKind: 'recast', replyText: null, repliedAt: at })?.reply).toBeNull();
        expect(countUnreadReplies([recast, praise, toStudyLogEntry(base)!])).toBe(1);
    });

    describe('PUT /api/teacher/study-log/reply', () => {
        const put = (body: unknown) => REPLY_PUT(json('/api/teacher/study-log/reply', 'PUT', body));
        beforeEach(() => {
            mocks.session.mockResolvedValue(teacher);
            mocks.logFindUnique.mockResolvedValue({ userId: 's1', text: 'I spook with my boss.' });
            mocks.enrollmentFindFirst.mockResolvedValue({ id: 'e1' });
            mocks.logUpdate.mockImplementation(async ({ data }) => ({
                id: 'log-1', kind: 'speak', text: 'I spook with my boss.', dayKey: '2026-10-27', createdAt: new Date(), ...data,
            }));
        });

        it('is teacher-only and limited to students in their classes', async () => {
            mocks.session.mockResolvedValue(student);
            expect((await put({ logId: 'log-1', kind: 'praise' })).status).toBe(403);
            mocks.session.mockResolvedValue(teacher);
            mocks.enrollmentFindFirst.mockResolvedValue(null);
            expect((await put({ logId: 'log-1', kind: 'praise' })).status).toBe(404);
            expect(mocks.enrollmentFindFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: { studentId: 's1', status: 'active', class: { teacherId: 'teacher-1' } },
            }));
            expect(mocks.logUpdate).not.toHaveBeenCalled();
        });

        it('saves a recast as unread and never awards points', async () => {
            const res = await put({ logId: 'log-1', kind: 'recast', text: 'I spoke with my boss.' });
            expect(res.status).toBe(200);
            expect(mocks.logUpdate).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'log-1' },
                data: expect.objectContaining({ replyKind: 'recast', replyText: 'I spoke with my boss.', repliedById: 'teacher-1', replySeenAt: null }),
            }));
            expect((await res.json()).entry.reply).toMatchObject({ kind: 'recast', text: 'I spoke with my boss.', seen: false });
            expect(mocks.award).not.toHaveBeenCalled();
        });

        it('saves praise without text and clears a reply', async () => {
            await put({ logId: 'log-1', kind: 'praise', text: 'ignored' });
            expect(mocks.logUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ replyKind: 'praise', replyText: null }) }));
            const res = await put({ logId: 'log-1', kind: 'clear' });
            expect((await res.json()).entry.reply).toBeNull();
        });

        it.each([{ kind: 'praise' }, { logId: 'log-1', kind: 'grade' }, { logId: 'log-1', kind: 'recast', text: 'I spook with my boss.' }])(
            'rejects %j',
            async (body) => {
                expect((await put(body)).status).toBe(400);
                expect(mocks.logUpdate).not.toHaveBeenCalled();
            }
        );
    });

    describe('POST /api/study-log/reply-seen', () => {
        it('marks only the signed-in student\'s own replied log as read', async () => {
            mocks.logUpdateMany.mockResolvedValue({ count: 1 });
            const res = await SEEN_POST(json('/api/study-log/reply-seen', 'POST', { logId: 'log-1' }));
            expect(res.status).toBe(200);
            expect(mocks.logUpdateMany).toHaveBeenCalledWith({
                where: { id: 'log-1', userId: 'student-1', replyKind: { not: null }, replySeenAt: null },
                data: { replySeenAt: expect.any(Date) },
            });
        });

        it('is students only', async () => {
            mocks.session.mockResolvedValue(teacher);
            expect((await SEEN_POST(json('/api/study-log/reply-seen', 'POST', { logId: 'log-1' }))).status).toBe(403);
            expect(mocks.logUpdateMany).not.toHaveBeenCalled();
        });
    });
});
