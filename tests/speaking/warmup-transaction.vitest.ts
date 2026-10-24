import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ transaction: vi.fn(), award: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: async () => ({ user: { id: 'student' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: mocks.transaction, activity: { findUnique: async () => ({ title: 'Warmup', content: JSON.stringify({ type: 'speaking', warmupMode: true, participationPoints: 3 }) }) } } }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/speaking/complete/route';
let complete: boolean, balance: number, ledger: number[], tail: Promise<unknown>;
const request = () => new NextRequest('http://localhost/api/speaking/complete', { method: 'POST', body: JSON.stringify({ activityId: 'warmup' }) });

beforeEach(() => {
  vi.clearAllMocks(); complete = false; balance = 0; ledger = []; tail = Promise.resolve();
  mocks.transaction.mockImplementation(run => {
    const next = tail.then(async () => {
      let draftComplete = complete, draftBalance = balance, locked = false;
      const draftLedger = [...ledger];
      const tx = {
        $executeRaw: async () => { locked = true; },
        activityProgress: {
          findFirst: async () => { expect(locked).toBe(true); return draftComplete ? { id: 'done', status: 'completed' } : null; },
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

describe('speaking warmup credit', () => {
  it('serializes simultaneous completions and awards only once', async () => {
    const results = await Promise.all([POST(request()), POST(request())]);
    expect(await Promise.all(results.map(r => r.json()))).toEqual([
      expect.objectContaining({ pointsAwarded: 3 }), expect.objectContaining({ pointsAwarded: 0, alreadyCompleted: true }),
    ]);
    expect(balance).toBe(3); expect(ledger).toEqual([3]); expect(complete).toBe(true);
  });
  it('rolls back the daily marker and partial credit so a failed award remains retryable', async () => {
    mocks.award.mockImplementationOnce(async ({ transaction, points }) => { transaction.credit(points); throw new Error('award failed'); });
    expect((await POST(request())).status).toBe(500);
    expect(complete).toBe(false); expect(balance).toBe(0); expect(ledger).toEqual([]);
    expect((await (await POST(request())).json()).pointsAwarded).toBe(3);
    expect(balance).toBe(3); expect(ledger).toEqual([3]);
  });
  it('fails without awarding if completion persistence is unavailable', async () => {
    mocks.transaction.mockRejectedValueOnce(new Error('missing table'));
    expect((await POST(request())).status).toBe(500);
    expect(mocks.award).not.toHaveBeenCalled();
  });
});
