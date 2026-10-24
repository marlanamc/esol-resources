import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ groupBy: vi.fn(), aggregate: vi.fn(), user: vi.fn(), users: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { pointsLedger: { groupBy: mocks.groupBy, aggregate: mocks.aggregate }, user: { findUnique: mocks.user, findMany: mocks.users } } }));
vi.mock('@/lib/course-map-week', () => ({ getCurrentWeekCompletion: async () => ({}) }));
import { getUserGamificationStats, getTimeframedLeaderboard } from '@/lib/gamification/gamification';
import { rankPointTotals } from '@/lib/gamification/weekly-rankings';
const learners = ['a', 'b', 'c'].map(id => ({ id, name: id, username: id, currentStreak: 0, lastWeekRank: 99 }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue({ ...learners[1], points: 500, weeklyPoints: 9999, achievements: [] });
  mocks.users.mockResolvedValue(learners);
  mocks.groupBy.mockImplementation(async ({ where }) => where.createdAt.gte.toISOString() === '2026-10-12T04:00:00.000Z'
    ? [{ userId: 'a', _sum: { points: 10 } }, { userId: 'b', _sum: { points: 10 } }, { userId: 'c', _sum: { points: 5 } }]
    : [{ userId: 'a', _sum: { points: 50 } }, { userId: 'b', _sum: { points: 20 } }]);
  mocks.aggregate.mockResolvedValue({ _sum: { points: 10 } });
});
describe('weekly stats parity', () => {
  it('uses Monday Eastern ledger totals and shared ranks rather than stale counters', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-12T04:01:00Z'));
    try {
      const stats = await getUserGamificationStats('b');
      const board = await getTimeframedLeaderboard('week');
      expect(stats).toMatchObject({ weeklyPoints: 10, rank: 1, lastWeekRank: 2, rankChange: 1 });
      expect(board.find(row => row.id === 'b')).toMatchObject({ weeklyPoints: 10, rank: 1, rankChange: 1 });
      expect(board.find(row => row.id === 'c')?.rank).toBe(3);
      expect(mocks.aggregate.mock.calls[0][0].where.createdAt).toEqual({ gte: new Date('2026-10-12T04:00Z'), lt: new Date('2026-10-19T04:00Z') });
    } finally { vi.useRealTimers(); }
  });
  it('does not rank zero/negative totals and uses competition ranking', () => {
    const ranks = rankPointTotals([20, 20, 10, 0, -2].map((points, i) => ({ userId: String(i), _sum: { points } })));
    expect([...ranks.values()].map(row => row.rank)).toEqual([1, 1, 3]);
  });
});
