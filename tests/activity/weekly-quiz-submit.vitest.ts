import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { POINTS } from '@/lib/gamification/constants';
const mocks = vi.hoisted(() => ({ activity: vi.fn(), assignment: vi.fn(), award: vi.fn(), transaction: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: async () => ({ user: { id: 'student', role: 'student' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/locks', () => ({ acquireUserActivityScopeLock: async () => {} }));
vi.mock('@/lib/shared/perf-log', () => ({ timedQuery: async (_meta: unknown, fn: () => unknown) => fn() }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { activity: { findFirst: mocks.activity }, assignment: { findFirst: mocks.assignment }, $transaction: mocks.transaction } }));
import { POST } from '@/app/api/activity/submit/route';
const quiz = quizzes['verb-quiz-1'];
const effort = POINTS.WEEKLY_QUIZ_HOMEWORK_BONUS + POINTS.QUIZ_COMPLETION;
type Saved = { id: string; score: number; content: string; pointsAwarded: number; completedAt: Date; updatedAt: Date };
type Attempt = Omit<Saved, 'updatedAt'> & { submissionId: string; idempotencyKey: string };
let submission: Saved | null;
let attempts: Attempt[];
let progress: { id: string; categoryData: string; status: string } | null;
const right = () => Object.fromEntries(quiz.questions.map(q => [q.id, q.answers[0]]));
const wrong = () => Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']));
function request(answers = wrong(), key = 'one', assignmentId: string | null = null) {
  return new NextRequest('https://example.test/api/activity/submit', { method: 'POST', headers: { 'content-type': 'application/json', 'x-idempotency-key': key }, body: JSON.stringify({ activityId: 'verb-quiz-1', assignmentId, score: 100, content: { answers } }) });
}
async function send(answers = wrong(), key = 'one') {
  const response = await POST(request(answers, key));
  expect(response.status).toBe(200);
  return response.json();
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(new Date('2026-10-08T22:00:00Z'));
  submission = null; attempts = []; progress = null;
  mocks.activity.mockResolvedValue({ id: 'verb-quiz-1', title: quiz.title, type: 'quiz', content: JSON.stringify(quiz), isReleased: true });
  mocks.assignment.mockResolvedValue({ id: 'assignment' });
  mocks.award.mockResolvedValue({});
  // A transactional in-memory delegate exercises persistence and rollback together.
  mocks.transaction.mockImplementation(async fn => {
    const before = structuredClone({ submission, attempts, progress });
    const tx = {
      submission: {
        findFirst: async () => submission,
        create: async ({ data }: { data: Saved }) => submission = { ...data, id: 'submission', updatedAt: new Date() },
        update: async ({ data }: { data: Omit<Partial<Saved>, 'pointsAwarded'> & { pointsAwarded: number | { increment: number } } }) => {
          const pointsAwarded = typeof data.pointsAwarded === 'number' ? data.pointsAwarded : submission!.pointsAwarded + data.pointsAwarded.increment;
          return submission = { ...submission!, ...data, pointsAwarded, updatedAt: new Date() };
        },
      },
      quizAttempt: {
        findFirst: async () => attempts[0] ?? null,
        findUnique: async ({ where }: { where: { submissionId_idempotencyKey: { idempotencyKey: string } } }) => attempts.find(a => a.idempotencyKey === where.submissionId_idempotencyKey.idempotencyKey) ?? null,
        create: async ({ data }: { data: Attempt }) => { const attempt = { ...data, id: `attempt-${attempts.length}` }; attempts.push(attempt); return attempt; },
        update: async ({ where, data }: { where: { id: string }; data: Partial<Attempt> }) => Object.assign(attempts.find(a => a.id === where.id)!, data),
      },
      activityProgress: {
        findFirst: async () => progress,
        create: async ({ data }: { data: NonNullable<typeof progress> }) => progress = { ...data, id: 'progress' },
        update: async ({ data }: { data: NonNullable<typeof progress> }) => progress = { ...progress!, ...data },
      },
    };
    try { return await fn(tx); } catch (error) { ({ submission, attempts, progress } = before); throw error; }
  });
});
afterEach(() => vi.useRealTimers());
describe('unlimited quiz attempts', () => {
  it('grades on the server, saves answers and completion, and awards effort for incorrect work', async () => {
    const data = await send();
    expect(data.score).toBe(0); expect(data.points).toBe(effort);
    expect(attempts).toHaveLength(1);
    expect(JSON.parse(attempts[0].content).answers).toEqual(wrong());
    expect(attempts[0].completedAt).toEqual(new Date());
    expect(progress?.status).toBe('completed');
    expect(submission?.pointsAwarded).toBe(effort);
    expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ points: effort, transaction: expect.any(Object) }));
  });
  it('keeps best and latest separate and rewards genuine retakes, including after 100%', async () => {
    await send(right());
    const latest = await send(wrong(), 'two');
    expect(latest.quizResult.score).toBe(0); expect(latest.score).toBe(100);
    expect(latest.points).toBe(POINTS.QUIZ_COMPLETION);
    expect(attempts.map(a => a.score)).toEqual([100, 0]);
    expect(JSON.parse(submission!.content).score).toBe(100);
    for (let i = 3; i <= 12; i++) await send(wrong(), String(i));
    expect(attempts).toHaveLength(12);
  });
  it('awards effort plus an improvement bonus and pays the homework bonus only once', async () => {
    await send();
    const data = await send(right(), 'two');
    expect(data.points).toBe(POINTS.QUIZ_PERFECT_SCORE);
    expect(submission?.pointsAwarded).toBe(effort + POINTS.QUIZ_PERFECT_SCORE);
  });
  it('deduplicates an old request even after a newer attempt and returns the original answers', async () => {
    await send(right()); await send(wrong(), 'two');
    const replay = await send(wrong(), 'one');
    expect(replay.duplicate).toBe(true); expect(replay.points).toBe(0);
    expect(replay.quizResult.answers).toEqual(right());
    expect(attempts).toHaveLength(2); expect(mocks.award).toHaveBeenCalledTimes(2);
  });
  it('archives legacy results and timestamps before replacing the summary', async () => {
    const completedAt = new Date('2026-09-01T12:00:00Z');
    submission = { id: 'submission', score: 0, content: JSON.stringify({ answers: { old: 'answer' } }), pointsAwarded: effort, completedAt, updatedAt: completedAt };
    await send(right());
    expect(attempts).toHaveLength(2);
    expect(attempts[0].completedAt).toEqual(completedAt);
    expect(JSON.parse(attempts[0].content).answers).toEqual({ old: 'answer' });
    expect(submission.score).toBe(100);
  });
  it('reconciles confirmed unpaid legacy completion exactly once', async () => {
    submission = { id: 'submission', score: 0, content: JSON.stringify({ answers: wrong(), score: 0 }), pointsAwarded: 0, completedAt: new Date(), updatedAt: new Date() };
    progress = { id: 'progress', status: 'completed', categoryData: JSON.stringify({ pwaLastSubmissionIdempotencyKey: 'one' }) };
    expect((await send()).points).toBe(effort);
    expect((await send()).points).toBe(0);
    expect(attempts).toHaveLength(1); expect(mocks.award).toHaveBeenCalledTimes(1);
  });
  it('rolls back attempts, progress and balances if the ledger award fails', async () => {
    mocks.award.mockRejectedValueOnce(new Error('ledger unavailable'));
    expect((await POST(request())).status).toBe(500);
    expect(attempts).toHaveLength(0); expect(submission).toBeNull(); expect(progress).toBeNull();
    expect((await send()).points).toBe(effort);
    expect(attempts).toHaveLength(1);
  });
  it('rejects incomplete answers without saving or awarding', async () => {
    expect((await POST(request({}))).status).toBe(400);
    expect(attempts).toHaveLength(0); expect(mocks.award).not.toHaveBeenCalled();
  });
  it('requires a stable request key', async () => {
    const req = request(); req.headers.delete('x-idempotency-key');
    expect((await POST(req)).status).toBe(400);
  });
  it('accepts late practice', async () => {
    vi.setSystemTime(new Date('2027-06-30T22:00:00Z'));
    expect((await send()).points).toBe(effort);
  });
  it('honors the release gate', async () => {
    vi.setSystemTime(new Date('2026-10-08T21:59:59Z'));
    expect((await POST(request())).status).toBe(403);
  });
  it('rejects outbox replay under another student account', async () => {
    const req = request(); req.headers.set('x-outbox-user-id', 'another-student');
    expect((await POST(req)).status).toBe(403); expect(mocks.activity).not.toHaveBeenCalled();
  });
  it('rejects an assignment outside the learner scope', async () => {
    mocks.assignment.mockResolvedValue(null);
    expect((await POST(request(wrong(), 'one', 'other-assignment'))).status).toBe(403);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
