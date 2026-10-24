import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/database/prisma';
import { getLeaderboardPeriod } from './leaderboard-period';
import { buildLeaderboardEligibleUserWhere } from './leaderboard-filter';

export function rankPointTotals(rows: { userId: string; _sum: { points: number | null } }[]) {
  const sorted = rows.filter(row => (row._sum.points ?? 0) > 0)
    .sort((a, b) => (b._sum.points ?? 0) - (a._sum.points ?? 0));
  let rank = 1;
  return new Map(sorted.map((row, index) => {
    if (index && row._sum.points !== sorted[index - 1]._sum.points) rank = index + 1;
    return [row.userId, { points: row._sum.points!, rank }];
  }));
}

export async function weeklyRankings(
  range: 'week' | 'last-week', now = new Date(),
  userWhere: Prisma.UserWhereInput = buildLeaderboardEligibleUserWhere(),
  db: Pick<typeof prisma, 'pointsLedger'> = prisma,
) {
  const period = getLeaderboardPeriod(range, now);
  const rows = await db.pointsLedger.groupBy({
    by: ['userId'], _sum: { points: true },
    where: { user: userWhere, createdAt: { gte: period.start!, lt: period.end! } },
  });
  return rankPointTotals(rows);
}
