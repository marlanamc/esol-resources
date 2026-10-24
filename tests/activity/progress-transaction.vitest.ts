import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(), award: vi.fn(), findActivity: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: async () => ({ user: { id: 'learner', role: 'student' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { $transaction: mocks.transaction, activity: { findUnique: mocks.findActivity } } }));
vi.mock('@/lib/gamification/gamification', () => ({
  resolveActivityGameUi: () => 'flashcards', getActivityPoints: () => 5,
  getVocabularyTypePoints: () => 5, getSentenceBuilderPoints: () => 5, POINTS: {},
}));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
import { POST } from '@/lib/activity/progress/post-progress';

type Row = { id: string; userId: string; activityId: string; assignmentId: string | null; progress: number; status: string; categoryData?: string };
let rows: Row[];
let balance: number;
let ledger: number[];
let tail: Promise<unknown>;
const request = (body: Record<string, unknown> = {}, key?: string) => new NextRequest('http://localhost/api/activity/progress', {
  method: 'POST', headers: key ? { 'x-idempotency-key': key } : {},
  body: JSON.stringify({ activityId: 'vocab', progress: 100, vocabType: 'flashcards', ...body }),
});

beforeEach(() => {
  vi.clearAllMocks(); rows = []; balance = 0; ledger = []; tail = Promise.resolve();
  mocks.findActivity.mockResolvedValue({ type: 'vocabulary', title: 'Words', content: '{}', ui: 'flashcards', category: null });
  // Transaction double models rollback and serialization. Assertions below also
  // require the real route to acquire its DB lock before reading or writing.
  mocks.transaction.mockImplementation((run) => {
    const next = tail.then(async () => {
      let draft = structuredClone(rows); let draftBalance = balance; const draftLedger = [...ledger]; let locked = false;
      const tx = {
        $executeRaw: vi.fn(async () => { locked = true; }),
        activityProgress: {
          findFirst: vi.fn(async ({ where }) => {
            expect(locked).toBe(true);
            return draft.find(r => r.assignmentId === where.assignmentId) ?? null;
          }),
          create: vi.fn(async ({ data }) => { const r = { id: String(draft.length), ...data }; draft.push(r); return r; }),
          update: vi.fn(async ({ where, data }) => { draft = draft.map(r => r.id === where.id ? { ...r, ...data } : r); return draft.find(r => r.id === where.id); }),
        },
        credit: (points: number) => { draftBalance += points; draftLedger.push(points); },
      };
      const result = await run(tx);
      rows = draft; balance = draftBalance; ledger = draftLedger;
      return result;
    });
    tail = next.catch(() => undefined);
    return next;
  });
  mocks.award.mockImplementation(async ({ transaction, points }) => {
    expect(transaction).toBeDefined(); transaction.credit(points); return { deduped: false };
  });
});

describe('progress and credit commit together', () => {
  it('rolls back completion, balance, and ledger after an award failure, allowing retry', async () => {
    mocks.award.mockImplementationOnce(async ({ transaction, points }) => { transaction.credit(points); throw new Error('ledger unavailable'); });
    expect((await POST(request())).status).toBe(500);
    expect(rows).toEqual([]); expect(balance).toBe(0); expect(ledger).toEqual([]);
    const saved = await (await POST(request())).json();
    expect(saved.pointsAwarded).toBe(5); expect(balance).toBe(5); expect(ledger).toEqual([5]);
    expect(JSON.parse(rows[0].categoryData!).flashcards.completed).toBe(true);
  });

  it('reads under the scope lock so simultaneous first completions award only once', async () => {
    const responses = await Promise.all([POST(request()), POST(request())]);
    expect(await Promise.all(responses.map(r => r.json()))).toEqual([
      expect.objectContaining({ pointsAwarded: 5 }), expect.objectContaining({ pointsAwarded: 0 }),
    ]);
    expect(rows).toHaveLength(1); expect(balance).toBe(5); expect(ledger).toEqual([5]);
  });

  it('preserves different vocab modes saved concurrently', async () => {
    await Promise.all([POST(request()), POST(request({ vocabType: 'matching' }))]);
    const data = JSON.parse(rows[0].categoryData!);
    expect(data.flashcards.completed).toBe(true); expect(data.matching.completed).toBe(true);
    expect(balance).toBe(10); expect(ledger).toEqual([5, 5]);
  });

  it('persists the retry key alongside serialized category data', async () => {
    await POST(request({}, 'attempt-1'));
    expect(JSON.parse(rows[0].categoryData!).pwaLastProgressIdempotencyKey).toBe('attempt-1');
    expect((await (await POST(request({}, 'attempt-1'))).json()).pointsAwarded).toBe(0);
    expect(mocks.award).toHaveBeenCalledTimes(1);
  });

  it('includes assignment-to-global progress in the same transaction', async () => {
    await POST(request({ assignmentId: 'homework' }));
    expect(rows.map(r => r.assignmentId)).toEqual(['homework', null]);
    expect(balance).toBe(5);
  });
});
