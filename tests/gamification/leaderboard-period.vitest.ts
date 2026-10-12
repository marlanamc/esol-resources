import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getLeaderboardPeriod, getLeaderboardWeekLabel } from '@/lib/gamification/leaderboard-period';

const { groupBy, findMany, completion } = vi.hoisted(() => ({
  groupBy: vi.fn(), findMany: vi.fn(), completion: vi.fn(),
}));
vi.mock('@/lib/database/prisma', () => ({ prisma: { pointsLedger: { groupBy }, user: { findMany } } }));
vi.mock('@/lib/course-map-week', () => ({ getCurrentWeekCompletion: completion }));
import { getTimeframedLeaderboard } from '@/lib/gamification/gamification';

const monday = new Date('2026-10-12T04:00:00Z');

describe('leaderboard weekly transition', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps late Sunday effort in the previous week at Monday midnight Eastern', () => {
    const before = getLeaderboardPeriod('week', new Date('2026-10-12T03:59:59.999Z'));
    const after = getLeaderboardPeriod('week', monday);
    const previous = getLeaderboardPeriod('last-week', monday);
    expect(previous).toEqual(before);
    expect(previous.start?.toISOString()).toBe('2026-10-05T04:00:00.000Z');
    expect(previous.end).toEqual(after.start);
    expect(after.start?.toISOString()).toBe('2026-10-12T04:00:00.000Z');
    expect(after.end?.toISOString()).toBe('2026-10-19T04:00:00.000Z');
  });

  it.each([
    ['2026-11-02T12:00:00Z', '2026-10-26T04:00:00.000Z', '2026-11-02T05:00:00.000Z'],
    ['2026-03-09T12:00:00Z', '2026-03-02T05:00:00.000Z', '2026-03-09T04:00:00.000Z'],
  ])('uses local midnight across daylight-saving changes on %s', (now, start, end) => {
    const period = getLeaderboardPeriod('last-week', new Date(now));
    expect(period.start?.toISOString()).toBe(start);
    expect(period.end?.toISOString()).toBe(end);
  });

  it('labels the school week and advances automatically', () => {
    expect(getLeaderboardWeekLabel(monday)).toBe('Week 5');
    expect(getLeaderboardWeekLabel(monday, true)).toBe('Week 4');
    expect(getLeaderboardWeekLabel(new Date('2026-10-19T12:00:00Z'))).toBe('Week 6');
    expect(getLeaderboardWeekLabel(new Date('2026-08-03T12:00:00Z'))).toBe('This week');
  });

  it('reads historical points with an exclusive end and the matching course-week badges', async () => {
    groupBy.mockResolvedValue([{ userId: 's1', _sum: { points: 240 } }]);
    completion.mockResolvedValue({ weekComplete: true, weeklyQuizComplete: true, completedWeeksCount: 1 });
    findMany.mockResolvedValue([{ id: 's1', name: 'Student', username: 'student', currentStreak: 0 }]);
    const entries = await getTimeframedLeaderboard('last-week', 20, 'class1', undefined, { referenceDate: monday });
    expect(groupBy.mock.calls[0][0].where.createdAt).toEqual({
      gte: new Date('2026-10-05T04:00:00Z'), lt: monday,
    });
    expect(entries[0]).toMatchObject({ weeklyPoints: 240, rank: 1, rankChange: null, weekComplete: true, weeklyQuizComplete: true });
    expect(completion).toHaveBeenCalledWith({ id: 's1', role: 'student' }, { weekNumber: 4 });
  });

  it('keeps all-time ledger totals unbounded after the reset', async () => {
    groupBy.mockResolvedValue([]);
    await getTimeframedLeaderboard('all', 20, 'class1', undefined, { referenceDate: monday });
    expect(groupBy.mock.calls[0][0].where.createdAt).toBeUndefined();
  });
});
