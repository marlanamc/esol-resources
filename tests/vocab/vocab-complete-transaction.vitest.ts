import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ transaction: vi.fn(), award: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: async () => ({ user: { id: 'student' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: mocks.transaction } }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
import { POST } from '@/app/api/vocab-review/complete/route';
let complete: boolean, balance: number, ledger: number[], tail: Promise<unknown>;
const request = (cardsReviewed: unknown = 12) => new Request('http://localhost/api/vocab-review/complete', { method: 'POST', body: JSON.stringify({ cardsReviewed }) });

beforeEach(() => {
  vi.clearAllMocks(); complete = false; balance = 0; ledger = []; tail = Promise.resolve();
  mocks.transaction.mockImplementation(run => {
    const next = tail.then(async () => {
      let draftComplete = complete, draftBalance = balance, locked = false;
      const draftLedger = [...ledger];
      const tx = {
        $executeRaw: async () => { locked = true; },
        dailyHabitCompletion: {
          findUnique: async () => { expect(locked).toBe(true); return draftComplete ? { id: 'done' } : null; },
          create: async () => { draftComplete = true; },
        },
        credit: (points: number) => { draftBalance += points; draftLedger.push(points); },
      };
      const response = await run(tx);
      complete = draftComplete; balance = draftBalance; ledger = draftLedger;
      return response;
    });
    tail = next.catch(() => undefined);
    return next;
  });
  mocks.award.mockImplementation(async ({ transaction, points }) => {
    transaction.credit(points); return { streakUpdated: true, newStreak: 1 };
  });
});

describe('daily vocabulary credit', () => {
  it('serializes simultaneous completions and awards only once', async () => {
    const results = await Promise.all([POST(request()), POST(request())]);
    expect(await Promise.all(results.map(r => r.json()))).toEqual([
      expect.objectContaining({ points: 12 }), expect.objectContaining({ points: 0, duplicate: true }),
    ]);
    expect(balance).toBe(12); expect(ledger).toEqual([12]); expect(complete).toBe(true);
  });
  it('rolls back the daily marker and partial credit so a failed award remains retryable', async () => {
    mocks.award.mockImplementationOnce(async ({ transaction, points }) => { transaction.credit(points); throw new Error('award failed'); });
    expect((await POST(request())).status).toBe(500);
    expect(complete).toBe(false); expect(balance).toBe(0); expect(ledger).toEqual([]);
    expect((await (await POST(request())).json()).points).toBe(12);
    expect(balance).toBe(12); expect(ledger).toEqual([12]);
  });
  it('fails without awarding if completion persistence is unavailable', async () => {
    mocks.transaction.mockRejectedValueOnce(new Error('missing table'));
    expect((await POST(request())).status).toBe(500);
    expect(mocks.award).not.toHaveBeenCalled();
  });
  it.each([0, -1, 1.5, '12', null, 1e100])('rejects invalid card count %s', async count => {
    expect((await POST(request(count))).status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
