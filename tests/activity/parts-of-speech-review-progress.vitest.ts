import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REVIEW_LESSONS, reviewChoices, reviewCorrectAnswer, type ReviewLessonId } from '@/lib/parts-of-speech-review/content';
const db = vi.hoisted(() => ({ rows: [] as Array<Record<string, unknown>>, transaction: vi.fn(), lock: vi.fn(), writes: 0 }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: db.transaction } }));
import { savePartsOfSpeechReview } from '@/lib/activity/progress/parts-of-speech-review';
function correctAnswers(lessonId: ReviewLessonId) { return REVIEW_LESSONS[lessonId].questions.map(q => ({ questionId: q.id, answer: reviewCorrectAnswer(q) })); }
function wrongAnswers(lessonId: ReviewLessonId) { const lesson = REVIEW_LESSONS[lessonId]; return lesson.questions.map(q => ({ questionId: q.id, answer: reviewChoices(q, lesson).find(c => c !== reviewCorrectAnswer(q))! })); }
function attempt() { return { version: 1, attemptId: '11111111-1111-4111-8111-111111111111', lessonId: 'nouns-verbs', answers: correctAnswers('nouns-verbs') }; }
beforeEach(() => {
  vi.clearAllMocks(); db.rows = []; db.writes = 0;
  let tail = Promise.resolve();
  db.transaction.mockImplementation((work: (tx: unknown) => Promise<unknown>) => {
    const result = tail.then(() => work({ $executeRaw: db.lock, activityProgress: {
      findFirst: async () => db.rows[0] ?? null,
      update: async ({ data }: { data: object }) => { db.writes++; db.rows[0] = { ...db.rows[0], ...data }; },
      create: async ({ data }: { data: object }) => { db.writes++; db.rows.push({ id: 'progress', ...data }); },
    } }));
    tail = result.then(() => undefined, () => undefined); return result;
  });
});
describe('Parts of Speech review persistence', () => {
  it('serializes retries, saves once, and returns no rewards', async () => {
    const responses = await Promise.all([savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt()), savePartsOfSpeechReview('student', 'parts-of-speech-game', attempt())]);
    expect(db.rows).toHaveLength(1); expect(db.writes).toBe(1); expect(db.lock).toHaveBeenCalledTimes(2);
    for (const response of responses) expect(await response.json()).toMatchObject({ ok: true, progress: 100, status: 'completed', pointsAwarded: 0, correct: 8 });
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

it('saves a later week independently without completing the foundation or issuing rewards', async () => {
    const lessonId = 'week-5-subjects';
    const input = { ...attempt(), lessonId, answers: correctAnswers(lessonId) };
    const response = await savePartsOfSpeechReview('student', 'parts-of-speech-game', input);
    expect(await response.json()).toMatchObject({ progress: 0, status: 'in_progress', pointsAwarded: 0, review: { lessons: { 'week-5-subjects': { completed: true, correct: 8 } } } });
    await savePartsOfSpeechReview('student', 'parts-of-speech-game', input);
    expect(db.writes).toBe(1);
    const saved = JSON.parse(db.rows[0].categoryData as string)._partsOfSpeechReview.lessons;
    expect(saved['nouns-verbs']).toBeUndefined();
});
