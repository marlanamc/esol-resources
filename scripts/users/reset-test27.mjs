/**
 * Reset the test27 preview account to a clean slate.
 *
 * Removes the points, achievements and activity progress generated while testing the
 * duplicate-award bug on 2026-09-12, keeping the two original 0-point login rows so the
 * account's login history stays intact.
 *
 * Every statement is scoped to the single test27 user id. Dry run by default:
 *
 *   node scripts/users/reset-test27.mjs           # show what would change
 *   node scripts/users/reset-test27.mjs --apply   # actually write
 */
import { PrismaClient } from '@prisma/client';

const APPLY = process.argv.includes('--apply');
// Everything from the first test award onward; the two rows before this are genuine logins.
const CUTOFF = new Date('2026-09-12T16:52:00.000Z');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { username: 'test27' },
    select: { id: true, username: true, points: true, weeklyPoints: true },
  });

  if (!user) {
    console.error('test27 not found — nothing done.');
    process.exitCode = 1;
    return;
  }

  const ledger = await prisma.pointsLedger.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    select: { points: true, source: true, reason: true, createdAt: true },
  });

  const doomed = ledger.filter((row) => row.createdAt >= CUTOFF);
  const kept = ledger.filter((row) => row.createdAt < CUTOFF);

  console.log(`points=${user.points} weeklyPoints=${user.weeklyPoints} ledgerRows=${ledger.length}`);
  console.log(`would remove ${doomed.length} row(s), keep ${kept.length}:`);
  for (const row of kept) {
    console.log(`  keep  ${row.createdAt.toISOString()} ${row.points} [${row.source}] ${row.reason}`);
  }

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.');
    return;
  }

  const [removedLedger, removedAchievements, removedProgress] = await prisma.$transaction([
    prisma.pointsLedger.deleteMany({ where: { userId: user.id, createdAt: { gte: CUTOFF } } }),
    prisma.userAchievement.deleteMany({ where: { userId: user.id } }),
    prisma.activityProgress.deleteMany({ where: { userId: user.id, updatedAt: { gte: CUTOFF } } }),
  ]);

  const reset = await prisma.user.update({
    where: { id: user.id },
    data: { points: 0, weeklyPoints: 0 },
    select: { username: true, points: true, weeklyPoints: true, currentStreak: true },
  });

  console.log(
    `removed ledger=${removedLedger.count} achievements=${removedAchievements.count} progress=${removedProgress.count}`
  );
  console.log('reset:', JSON.stringify(reset));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
