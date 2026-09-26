import { beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import { buildWordSortDecks } from '@/lib/word-sort/progression';
import type { WordSortAttempt, WordSortLevel } from '@/lib/word-sort/types';

const db = vi.hoisted(() => ({ rows: [] as Array<Record<string, unknown>>, transaction: vi.fn(), lock: vi.fn(), award: vi.fn(), streak: vi.fn(), achievements: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: db.transaction } }));
vi.mock('@/lib/gamification/gamification', () => ({ awardPoints: db.award, updateStreak: db.streak, checkAndAwardAchievements: db.achievements }));
import { saveWordSortAttempt } from '@/lib/activity/progress/word-sort';

function attempt(level: WordSortLevel = 'words'): WordSortAttempt {
  return { id: randomUUID(), level, review: false, responses: buildWordSortDecks('verb', level).flatMap(deck => deck.cards.map(card => ({ cardId: card.id, leftBucket: deck.leftBucket, rightBucket: deck.rightBucket, chosen: card.correctBucket }))) };
}
const save = (input: WordSortAttempt) => saveWordSortAttempt('learner', 'parts-of-speech-word-sort-guided', 'Word Sort: Verbs', 'verb', input);
beforeEach(() => {
  vi.clearAllMocks(); db.rows = [];
  let tail = Promise.resolve();
  db.transaction.mockImplementation((work: (tx: unknown) => Promise<unknown>) => {
    const result = tail.then(async () => {
      const before = structuredClone(db.rows);
      const tx = { $executeRaw: db.lock, activityProgress: {
        findMany: async () => db.rows,
        update: async ({ data }: { data: object }) => { db.rows[0] = { ...db.rows[0], ...data }; },
        create: async ({ data }: { data: object }) => { db.rows.push({ id: 'progress-1', ...data }); },
      } };
      try { return await work(tx); } catch (error) { db.rows = before; throw error; }
    });
    tail = result.then(() => undefined, () => undefined);
    return result;
  });
});
describe('Word Sort save transaction', () => {
  it('serializes concurrent completions and awards beginner points once', async () => {
    const input = attempt();
    const [first, duplicate] = await Promise.all([save(input), save(input)]);
    expect((await first.json()).pointsAwarded).toBe(3);
    expect((await duplicate.json()).pointsAwarded).toBe(0);
    expect(db.lock).toHaveBeenCalledTimes(2);
    expect(db.award).toHaveBeenCalledTimes(1);
    expect(db.rows).toHaveLength(1);
    expect(JSON.parse(db.rows[0].categoryData as string).wordSort.levels.words.attempts).toBe(1);
    expect(db.rows[0].progress).toBe(100);
  });
  it('does not reaward for new attempts, old retry IDs, extensions, or review', async () => {
    const original = attempt();
    await save(original); await save(attempt()); await save(original);
    await save(attempt('sentences')); await save(attempt('challenge'));
    expect(db.award).toHaveBeenCalledTimes(1);
    const state = JSON.parse(db.rows[0].categoryData as string).wordSort;
    expect(state.levels.words.attempts).toBe(2);
    expect(state.levels.challenge.passed).toBe(true);
  });
  it('preserves completed legacy work without awarding it again', async () => {
    db.rows = [{ id: 'legacy', assignmentId: null, progress: 100, status: 'completed', categoryData: JSON.stringify({ 'pos-1-verbs': { completed: true, accuracy: 90 } }) }];
    await save(attempt('sentences'));
    expect(db.award).not.toHaveBeenCalled();
    expect(db.rows[0].progress).toBe(100);
    expect(JSON.parse(db.rows[0].categoryData as string)['pos-1-verbs'].accuracy).toBe(90);
  });
  it('rolls back and lets the same attempt retry if the award fails', async () => {
    db.award.mockRejectedValueOnce(new Error('database unavailable'));
    const input = attempt();
    await expect(save(input)).rejects.toThrow('database unavailable');
    expect(db.rows).toHaveLength(0);
    await save(input);
    expect(db.rows).toHaveLength(1);
  });
  it('rejects a forged locked-level submission without writing', async () => {
    await expect(save(attempt('challenge'))).rejects.toThrow('previous');
    expect(db.rows).toHaveLength(0);
    expect(db.award).not.toHaveBeenCalled();
  });
});
