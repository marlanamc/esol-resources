/**
 * Finds and optionally reverses "achievement backfill" PointsLedger entries —
 * the lump-sum awards caused by the writing-session/[id]/advance bug where
 * checkAndAwardAchievements() was never chained after point awards, letting
 * a student's stats silently cross several achievement thresholds before
 * some later action finally ran the check and dumped them all at once.
 *
 * That code path is now fixed (updateStreak + checkAndAwardAchievements are
 * chained after every writing-session award), so this script only cleans up
 * historical entries created before the fix.
 *
 * Usage:
 *   List every suspicious lump-sum entry across all students (read-only):
 *     npx tsx scripts/gamification/audit-and-reverse-achievement-backfill.ts
 *
 *   List only one student's entries:
 *     npx tsx scripts/gamification/audit-and-reverse-achievement-backfill.ts --username=ricardo
 *
 *   Reverse one specific entry (requires the ledger id from the list above):
 *     npx tsx scripts/gamification/audit-and-reverse-achievement-backfill.ts \
 *       --reverse --ledger-id=<id> --confirm
 *
 * Reversing a production database additionally requires the existing
 * db-guard env vars (see scripts/lib/require-safe-db-target.js):
 *   ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=<host> npx tsx ... --reverse --ledger-id=<id> --confirm
 *
 * Reversal never deletes the original ledger row or revokes the earned
 * achievement badges — it inserts a compensating negative PointsLedger entry
 * (source: "correction") and decrements User.points/weeklyPoints, so the
 * audit trail (what was awarded, and why it was clawed back) stays intact.
 */
import { PrismaClient } from "@prisma/client";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

const LUMP_SUM_REASON_PREFIX = "Achievements: ";
// A lump-sum backfill bundles several achievements into one reason string
// ("Achievements: A, B, C"); a normal single unlock only ever names one.
const MIN_BUNDLED_ACHIEVEMENTS = 2;

function parseArgs(argv: string[]) {
  const args = new Map<string, string | true>();
  for (const raw of argv) {
    const match = raw.match(/^--([^=]+)(?:=(.*))?$/);
    if (!match) continue;
    args.set(match[1], match[2] ?? true);
  }
  return args;
}

function countBundledAchievements(reason: string | null) {
  if (!reason || !reason.startsWith(LUMP_SUM_REASON_PREFIX)) return 0;
  return reason.slice(LUMP_SUM_REASON_PREFIX.length).split(",").length;
}

async function listSuspiciousEntries(username?: string) {
  const entries = await prisma.pointsLedger.findMany({
    where: {
      source: "award",
      reason: { startsWith: LUMP_SUM_REASON_PREFIX },
      ...(username ? { user: { username } } : {}),
    },
    include: { user: { select: { username: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const suspicious = entries.filter(
    (e) => countBundledAchievements(e.reason) >= MIN_BUNDLED_ACHIEVEMENTS
  );

  if (suspicious.length === 0) {
    console.log("No lump-sum achievement backfill entries found.");
    return;
  }

  console.log(`Found ${suspicious.length} lump-sum entr${suspicious.length === 1 ? "y" : "ies"}:\n`);
  for (const e of suspicious) {
    console.log(
      `  ledger-id=${e.id}  user=${e.user.username} (${e.user.name ?? "no name"})  +${e.points}  ${e.createdAt.toISOString()}`
    );
    console.log(`    reason: ${e.reason}\n`);
  }
  console.log("To reverse one entry, re-run with --reverse --ledger-id=<id> --confirm");
}

async function reverseEntry(ledgerId: string, confirmed: boolean) {
  const entry = await prisma.pointsLedger.findUnique({
    where: { id: ledgerId },
    include: { user: { select: { id: true, username: true, points: true, weeklyPoints: true } } },
  });

  if (!entry) {
    console.error(`No PointsLedger entry found with id=${ledgerId}`);
    process.exitCode = 1;
    return;
  }

  if (countBundledAchievements(entry.reason) < MIN_BUNDLED_ACHIEVEMENTS) {
    console.error(
      `Refusing to reverse: entry ${ledgerId} does not look like a bundled achievement backfill (reason: "${entry.reason}").`
    );
    process.exitCode = 1;
    return;
  }

  const newLifetime = Math.max(0, entry.user.points - entry.points);
  const newWeekly = Math.max(0, entry.user.weeklyPoints - entry.points);

  console.log(`About to reverse ledger entry ${ledgerId}:`);
  console.log(`  user: ${entry.user.username}`);
  console.log(`  reason: ${entry.reason}`);
  console.log(`  amount: -${entry.points}`);
  console.log(`  lifetime points: ${entry.user.points} -> ${newLifetime}`);
  console.log(`  weekly points:   ${entry.user.weeklyPoints} -> ${newWeekly}`);

  if (!confirmed) {
    console.log("\nDry run only — nothing was changed. Re-run with --confirm to apply.");
    return;
  }

  requireSafeDbTarget(`reverse achievement backfill ledger ${ledgerId}`);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: entry.user.id },
      data: { points: newLifetime, weeklyPoints: newWeekly },
    }),
    prisma.pointsLedger.create({
      data: {
        userId: entry.user.id,
        points: -entry.points,
        reason: `Correction: reversed backfilled lump-sum award (ledger ${ledgerId})`,
        source: "correction",
      },
    }),
  ]);

  console.log("\nReversed. The original ledger entry and achievement badges were left in place for the audit trail.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = typeof args.get("username") === "string" ? (args.get("username") as string) : undefined;
  const reverse = args.has("reverse");
  const ledgerId = typeof args.get("ledger-id") === "string" ? (args.get("ledger-id") as string) : undefined;
  const confirmed = args.has("confirm");

  if (reverse) {
    if (!ledgerId) {
      console.error("--reverse requires --ledger-id=<id> (get it from a plain listing run first).");
      process.exitCode = 1;
      return;
    }
    await reverseEntry(ledgerId, confirmed);
    return;
  }

  await listSuspiciousEntries(username);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
