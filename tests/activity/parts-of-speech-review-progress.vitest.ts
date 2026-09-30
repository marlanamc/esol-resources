import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REVIEW_LESSONS, reviewChoices, reviewCorrectAnswer, type ReviewLessonId } from '@/lib/parts-of-speech-review/content';
const db = vi.hoisted(() => ({ rows: [] as Array<Record<string, unknown>>, transaction: vi.fn(), lock: vi.fn(), writes: 0, ledger: [] as Array<{ userId: string; reason: string }>, award: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: db.transaction } }));
vi.mock('@/lib/gamification/gamification', () => ({ awardPoints: db.award, updateStreak: vi.fn(), checkAndAwardAchievements: vi.fn() }));
import { savePartsOfSpeechReview } from '@/lib/activity/progress/parts-of-speech-review';
function correctAnswers(lessonId: ReviewLessonId) { return REVIEW_LESSONS[lessonId].questions.map(q => ({ questionId: q.id, answer: reviewCorrectAnswer(q) })); }
function wrongAnswers(lessonId: ReviewLessonId) { const lesson = REVIEW_LESSONS[lessonId]; return lesson.questions.map(q => ({ questionId: q.id, answer: reviewChoices(q, lesson).find(c => c !== reviewCorrectAnswer(q))! })); }
function attempt() { return { version: 1, attemptId: '11111111-1111-4111-8111-111111111111', lessonId: 'nouns-verbs', answers: correctAnswers('nouns-verbs') }; }
beforeEach(() => {
  vi.clearAllMocks(); db.rows = []; db.writes = 0; db.ledger = [];
  db.award.mockImplementation(async (userId: string, _points: number, reason: string) => { db.ledger.push({ userId, reason }); });
  let tail = Promise.resolve();
  db.transaction.mockImplementation((work: (tx: unknown) => Promise<unknown>) => {
    const result = tail.then(() => work({ $executeRaw: db.lock, pointsLedger: { findFirst: async ({ where }: { where: { userId: string; reason: string } }) => db.ledger.find(row => row.userId === where.userId && row.reason === where.reason) ?? null }, activityProgress: {
      findFirst: async () => db.rows[0] ?? null,
      update: async ({ data }: { data: object }) => { db.writes++; db.rows[0] = { ...db.rows[0], ...data }; },
      create: async ({ data }: { data: object }) => { db.writes++; db.rows.push({ id: 'progress', ...data }); },
    } }));
    tail = result.then(() => undefined, () => undefined); return result;
  });
});
describe('Parts of Speech review persistence', () => {
  it('serializes retries and awards the first completion exactly once', async () => {
    const responses = await Promise.all([savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt()), savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt())]);
    expect(db.rows).toHaveLength(1); expect(db.writes).toBe(1); expect(db.lock).toHaveBeenCalledTimes(2);
    const payloads = await Promise.all(responses.map(response => response.json()));
    expect(payloads.map(p => p.pointsAwarded)).toEqual([3, 0]);
    expect(db.award).toHaveBeenCalledTimes(1);
    for (const payload of payloads) expect(payload).toMatchObject({ ok: true, progress: 100, status: 'completed', correct: 8 });
  });
  it('preserves library records and completes even at zero correct', async () => {
    const library = { 'pos-1-verbs': { stage: 'mastered' } };
    db.rows = [{ id: 'existing', progress: 5, categoryData: JSON.stringify(library) }];
    const input = { ...attempt(), answers: wrongAnswers('nouns-verbs') };
    const response = await savePartsOfSpeechReview('student', 'parts-of-speech-game', input);
    expect(await response.json()).toMatchObject({ correct: 0, progress: 100 });
    expect(JSON.parse(db.rows[0].categoryData as string)['pos-1-verbs']).toEqual(library['pos-1-verbs']);
  });
  it('rejects incomplete attempts before any database write', async () => {
    await expect(savePartsOfSpeechReview('student', 'parts-of-speech-game', { ...attempt(), answers: [] })).rejects.toThrow();
    expect(db.transaction).not.toHaveBeenCalled();
  });
});

it('saves a later week independently without completing the foundation and awards its own three points', async () => {
    const lessonId = 'week-5-subjects';
    const input = { ...attempt(), lessonId, answers: correctAnswers(lessonId) };
    const response = await savePartsOfSpeechReview('student', 'parts-of-speech-game', input);
    expect(await response.json()).toMatchObject({ progress: 0, status: 'in_progress', pointsAwarded: 3, review: { lessons: { 'week-5-subjects': { completed: true, correct: 8 } } } });
    await savePartsOfSpeechReview('student', 'parts-of-speech-game', input);
    expect(db.writes).toBe(1);
    const saved = JSON.parse(db.rows[0].categoryData as string)._partsOfSpeechReview.lessons;
    expect(saved['nouns-verbs']).toBeUndefined();
});

 it('credits an old unscored completion once without rewriting its original result', async () => {
    await savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt());
    db.ledger = []; db.award.mockClear();
    const before = db.rows[0].categoryData;
    const first = await savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt());
    const retry = await savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt());
    expect((await first.json()).pointsAwarded).toBe(3);
    expect((await retry.json()).pointsAwarded).toBe(0);
    expect(db.rows[0].categoryData).toBe(before);
    expect(db.award).toHaveBeenCalledTimes(1);
  });
