import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { POINTS } from '@/lib/gamification/constants';
// A 0% weekly quiz still earns the homework bonus plus completion points.
const EFFORT_POINTS = POINTS.WEEKLY_QUIZ_HOMEWORK_BONUS + POINTS.QUIZ_COMPLETION;
const mocks = vi.hoisted(() => ({
  activity: vi.fn(), createSubmission: vi.fn(), createProgress: vi.fn(), award: vi.fn(),
  findProgress: vi.fn(), findSubmission: vi.fn(), claim: vi.fn(), updateSubmission: vi.fn(), updateProgress: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: async () => ({ user: { id: 'student', role: 'student' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/locks', () => ({ acquireUserActivityScopeLock: async () => {} }));
vi.mock('@/lib/shared/perf-log', () => ({ timedQuery: async (_meta: unknown, fn: () => unknown) => fn() }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {
  activity: { findFirst: mocks.activity },
  $transaction: async (fn: (tx: unknown) => unknown) => fn({
    activityProgress: { findFirst: mocks.findProgress, create: mocks.createProgress, update: mocks.updateProgress },
    submission: { findFirst: mocks.findSubmission, create: mocks.createSubmission, updateMany: mocks.claim, update: mocks.updateSubmission },
  }),
} }));
import { POST } from '@/app/api/activity/submit/route';
const quiz = quizzes['verb-quiz-1'];
function request(answers: Record<string, string>) {
  return new NextRequest('https://example.test/api/activity/submit', { method: 'POST', headers: { 'content-type': 'application/json', 'x-idempotency-key': 'one-attempt' }, body: JSON.stringify({ activityId: 'verb-quiz-1', score: 100, content: { answers } }) });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(new Date("2026-10-08T22:00:00Z"));
  mocks.activity.mockResolvedValue({ id: 'verb-quiz-1', title: quiz.title, type: 'quiz', content: JSON.stringify(quiz), isReleased: true });
  mocks.findProgress.mockResolvedValue(null);
  mocks.findSubmission.mockResolvedValue(null);
  mocks.claim.mockResolvedValue({ count: 1 });
  mocks.createSubmission.mockImplementation(async ({ data }) => ({ id: 'submission', score: data.score }));
  mocks.award.mockResolvedValue({ pointsAwarded: 2 });
});
afterEach(() => vi.useRealTimers());
describe('weekly quiz submission', () => {
  it('saves completion, grades on the server, and awards effort despite an incorrect attempt', async () => {
    const response = await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.score).toBe(0);
    expect(data.points).toBe(EFFORT_POINTS);
    expect(data.weeklyQuizResult.results).toHaveLength(quiz.questions.length);
    expect(mocks.createSubmission.mock.calls[0][0].data.score).toBe(0);
    expect(mocks.createProgress.mock.calls[0][0].data.status).toBe('completed');
    expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ userId: 'student', points: EFFORT_POINTS, source: 'activity' }));
  });
  it('accepts late completion and still awards effort points', async () => {
    vi.setSystemTime(new Date('2027-06-30T22:00:00Z'));
    const response = await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))));
    expect(response.status).toBe(200);
    expect((await response.json()).points).toBe(EFFORT_POINTS);
    expect(mocks.createProgress.mock.calls[0][0].data.status).toBe('completed');
  });
  it('rejects unanswered quizzes before writing progress or points', async () => {
    expect((await POST(request({}))).status).toBe(400);
    expect(mocks.createProgress).not.toHaveBeenCalled();
    expect(mocks.award).not.toHaveBeenCalled();
  });
  it('honors the release gate', async () => {
    vi.setSystemTime(new Date('2026-10-08T21:59:59Z'));
    mocks.activity.mockResolvedValue({ type: 'quiz', content: JSON.stringify(quiz), isReleased: true });
    expect((await POST(request({}))).status).toBe(403);
    expect(mocks.createSubmission).not.toHaveBeenCalled();
  });
  it('does not award points again for the same network request', async () => {
    mocks.findProgress.mockResolvedValue({ id: 'progress', categoryData: JSON.stringify({ pwaLastSubmissionIdempotencyKey: 'one-attempt' }) });
    mocks.findSubmission.mockResolvedValue({ id: 'submission', score: 0 });
    const data = await (await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))))).json();
    expect(data.duplicate).toBe(true);
    expect(data.points).toBe(0);
    expect(mocks.award).not.toHaveBeenCalled();
  });
});

it('joins the completion transaction when awarding effort points', async () => {
  await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))));
  expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ transaction: expect.objectContaining({ submission: expect.any(Object), activityProgress: expect.any(Object) }) }));
});
it('returns a failed save when an award fails instead of confirming uncredited completion', async () => {
  mocks.award.mockRejectedValueOnce(new Error('connection exhausted'));
  const response = await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))));
  expect(response.status).toBe(500);
  expect((await response.json()).points).toBeUndefined();
});
it('rejects replay under another student account before querying activity data', async () => {
  const req=request({}); req.headers.set('x-outbox-user-id','another-student');
  expect((await POST(req)).status).toBe(403);
  expect(mocks.activity).not.toHaveBeenCalled();
});

it('recovers an older completed request whose point claim was reset after a failed award', async () => {
  mocks.findProgress.mockResolvedValue({ id: 'progress', categoryData: JSON.stringify({ pwaLastSubmissionIdempotencyKey: 'one-attempt' }) });
  mocks.findSubmission.mockResolvedValue({ id: 'submission', score: 0, pointsAwarded: 0 });
  mocks.updateSubmission.mockResolvedValue({ id: 'submission', score: 0 });
  const response = await POST(request(Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']))));
  expect(response.status).toBe(200);
  expect((await response.json()).points).toBe(EFFORT_POINTS);
  expect(mocks.award).toHaveBeenCalledTimes(1);
});

describe('weekly quiz retakes', () => {
  const allRight = () => Object.fromEntries(quiz.questions.map(q => [q.id, q.answers[0]]));
  const allWrong = () => Object.fromEntries(quiz.questions.map(q => [q.id, 'wrong']));
  const saved = (score: number, correctCount: number) => ({ id: 'submission', score, content: JSON.stringify({ type: 'weekly-quiz', version: 1, answers: {}, results: [], correctCount, totalQuestions: quiz.questions.length, score }) });
  beforeEach(() => {
    mocks.findProgress.mockResolvedValue({ id: 'progress', categoryData: null });
    mocks.updateSubmission.mockImplementation(async ({ data }) => ({ id: 'submission', score: data.score }));
  });
  it('keeps the best saved score when a retake scores lower, but shows this attempt', async () => {
    mocks.findSubmission.mockResolvedValue(saved(90, 9));
    const data = await (await POST(request(allWrong()))).json();
    expect(data.weeklyQuizResult.score).toBe(0);
    expect(mocks.updateSubmission.mock.calls[0][0].data.score).toBe(90);
    expect(JSON.parse(mocks.updateSubmission.mock.calls[0][0].data.content).correctCount).toBe(9);
  });
  it('replaces the saved score when a retake does better', async () => {
    mocks.findSubmission.mockResolvedValue(saved(50, 5));
    await POST(request(allRight()));
    expect(mocks.updateSubmission.mock.calls[0][0].data.score).toBe(100);
  });
});
