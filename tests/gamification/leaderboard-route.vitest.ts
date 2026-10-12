import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { session, ranked, aggregate } = vi.hoisted(() => ({ session: vi.fn(), ranked: vi.fn(), aggregate: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock('@/lib/gamification/gamification', () => ({ getTimeframedLeaderboard: ranked }));
vi.mock('@/lib/learner-mode', () => ({ getLearnerState: async () => ({ mode: 'classroom' }) }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {
  classEnrollment: { findMany: async () => [{ classId: 'class1' }] },
  pointsLedger: { aggregate },
} }));
import { GET } from '@/app/api/gamification/leaderboard/route';

describe('leaderboard recap API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-12T12:00:00Z'));
    session.mockResolvedValue({ user: { id: 'viewer', role: 'student' } });
    ranked.mockResolvedValue([]);
    aggregate.mockResolvedValue({ _sum: { points: 240 } });
  });
  afterEach(() => vi.useRealTimers());

  it('recognizes a student outside the rankings and uses the course week label', async () => {
    const response = await GET(new NextRequest('http://localhost/api/gamification/leaderboard'));
    expect(await response.json()).toMatchObject({
      leaderboard: [], userRank: null, currentWeekLabel: 'Week 5', previousWeekLabel: 'Week 4', lastWeekPoints: 240,
    });
    expect(aggregate).toHaveBeenCalledWith({
      where: { userId: 'viewer', createdAt: { gte: new Date('2026-10-05T04:00:00Z'), lt: new Date('2026-10-12T04:00:00Z') } },
      _sum: { points: true },
    });
  });

  it('requests last week within the same authorized classroom scope', async () => {
    const response = await GET(new NextRequest('http://localhost/api/gamification/leaderboard?timeframe=last-week'));
    expect(response.status).toBe(200);
    expect(ranked).toHaveBeenCalledWith('last-week', 20, 'class1', undefined, {
      independentOnly: false, referenceDate: new Date('2026-10-12T04:00:00Z'),
    });
  });

  it('does not read personal points for an unauthenticated request', async () => {
    session.mockResolvedValue(null);
    const response = await GET(new NextRequest('http://localhost/api/gamification/leaderboard'));
    expect(response.status).toBe(401);
    expect(aggregate).not.toHaveBeenCalled();
  });
});
