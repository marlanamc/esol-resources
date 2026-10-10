import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyRescueAction, emptyRescueProgress } from '@/lib/word-rescue/progression';
const db = vi.hoisted(() => ({ rows: [] as Array<Record<string, unknown>>, ledger: [] as Array<{ userId: string; reason: string }>, transaction: vi.fn(), award: vi.fn(), lock: vi.fn(), balance: 0, fail: false }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: db.transaction } }));
vi.mock('@/lib/gamification/gamification', () => ({ awardPoints: db.award, updateStreak: vi.fn(), checkAndAwardAchievements: vi.fn() }));
import { saveRescueAction } from '@/lib/word-rescue/save';

const id = '11111111-1111-4111-8111-111111111111';
const finish = { type: 'finish', sessionId: id, wordId: 'everyday-through', confidence: 'again' };
beforeEach(() => {
  vi.clearAllMocks(); db.rows = []; db.ledger = []; db.balance = 0; db.fail = false;
  let state = applyRescueAction(emptyRescueProgress(), { type: 'start', id, collectionId: 'everyday' }).state;
  for (const clip of ['word', 'sentence']) state = applyRescueAction(state, { type: 'heard', sessionId: id, wordId: 'everyday-through', clip }).state;
  state = applyRescueAction(state, { type: 'said', sessionId: id, wordId: 'everyday-through' }).state;
  db.rows.push({ id: 'global', assignmentId: null, categoryData: JSON.stringify({ wordRescue: state }) });
  db.award.mockImplementation(async (userId: string, points: number, reason: string) => { db.balance += points; db.ledger.push({ userId, reason }); });
  let tail = Promise.resolve();
  db.transaction.mockImplementation((work: (tx: unknown) => Promise<unknown>) => {
    const result = tail.then(async () => {
      const snapshot = structuredClone({ rows: db.rows, ledger: db.ledger, balance: db.balance });
      try { return await work({ $executeRaw: db.lock, pointsLedger: { findFirst: async ({ where }: { where: { userId: string; reason: string } }) => db.ledger.find(row => row.userId === where.userId && row.reason === where.reason) ?? null }, activityProgress: {
        findFirst: async ({ where }: { where: { assignmentId: string | null } }) => db.rows.find(row => row.assignmentId === where.assignmentId) ?? null,
        update: async ({ where, data }: { where: { id: string }; data: object }) => { if (db.fail) throw new Error('connection lost'); const index = db.rows.findIndex(row => row.id === where.id); db.rows[index] = { ...db.rows[index], ...data }; },
        create: async ({ data }: { data: object }) => { db.rows.push({ id: 'assignment', ...data }); },
      } }); } catch (error) { db.rows = snapshot.rows; db.ledger = snapshot.ledger; db.balance = snapshot.balance; throw error; }
    });
    tail = result.then(() => undefined, () => undefined); return result;
  });
});

describe('Word Rescue credit persistence', () => {
  it('credits concurrent retries once in the balance and ledger', async () => {
    const responses = await Promise.all([saveRescueAction('student', finish), saveRescueAction('student', finish)]);
    expect(responses.map(result => result.pointsAwarded)).toEqual([2, 0]);
    expect(responses.every(result => result.credited)).toBe(true);
    expect(db.balance).toBe(2); expect(db.ledger).toHaveLength(1); expect(db.rows).toHaveLength(1);
    expect(db.lock).toHaveBeenCalledTimes(2);
  });
  it('rolls back awards and completion together, then recovers on retry', async () => {
    db.fail = true;
    await expect(saveRescueAction('student', finish)).rejects.toThrow('connection lost');
    expect(db.balance).toBe(0); expect(db.ledger).toHaveLength(0);
    expect(JSON.parse(db.rows[0].categoryData as string).wordRescue.session.index).toBe(0);
    db.fail = false;
    expect((await saveRescueAction('student', finish)).pointsAwarded).toBe(2);
  });
  it('reconciles a confirmed completion with missing credit exactly once', async () => {
    await saveRescueAction('student', finish);
    db.ledger = []; db.balance = 0;
    const first = await saveRescueAction('student', finish);
    const second = await saveRescueAction('student', finish);
    expect([first.pointsAwarded, second.pointsAwarded]).toEqual([2, 0]);
    expect(second.state.words['everyday-through'].attempts).toBe(1);
  });
  it('updates assignment progress without a second award', async () => {
    await saveRescueAction('student', finish, 'assignment-id');
    const result = await saveRescueAction('student', finish, 'assignment-id');
    expect(result.pointsAwarded).toBe(0); expect(db.balance).toBe(2);
    expect(db.rows.find(row => row.assignmentId === 'assignment-id')?.progress).toBe(33);
  });
});
