import { prisma } from "@/lib/database/prisma";
import { awardPoints, checkAndAwardAchievements, updateStreak } from "./gamification";
import type { DbClient } from "./gamification";

export type AwardChainResult = {
  streakUpdated: boolean;
  newStreak: number;
  streakPointsAwarded: number;
  newAchievementsCount: number;
  totalPoints: number;
  currentStreak: number;
  /** True when a duplicate award was detected and skipped (see dedupeKey). */
  deduped?: boolean;
};

export async function applyAwardChain(params: {
  userId: string;
  points: number;
  reason: string;
  /** Ledger source for reporting; default "award". Use "activity" for activity completion. */
  source?: string;
  /**
   * When set, the award is skipped if an identical (userId, source, reason) ledger entry
   * already exists within `dedupeWindowMs`. Callers that lack their own claim step — notably
   * /api/activity/progress, whose client effects can fire concurrently — pass this so a
   * double-submit cannot write duplicate ledger rows and double the points.
   *
   * Callers with an atomic claim of their own (e.g. /api/activity/submit via
   * claimSubmissionPointsOnce) should leave this unset.
   */
  dedupeKey?: boolean;
  dedupeWindowMs?: number;
}): Promise<AwardChainResult> {
  const {
    userId,
    points,
    reason,
    source = 'award',
    dedupeKey = false,
    dedupeWindowMs = 60_000,
  } = params;

  if (points <= 0) {
    return {
      streakUpdated: false,
      newStreak: 0,
      streakPointsAwarded: 0,
      newAchievementsCount: 0,
      totalPoints: 0,
      currentStreak: 0,
    };
  }

  // Wrap all gamification operations in a single transaction for atomicity.
  // If any step fails, the entire chain rolls back — no partial point awards.
  return prisma.$transaction(async (tx) => {
    const db = tx as unknown as DbClient;

    if (dedupeKey) {
      // Serialize concurrent awards for this (user, source, reason) before reading the
      // ledger. Under the default Read Committed isolation a plain read cannot see a
      // sibling transaction's uncommitted insert, so without this lock three simultaneous
      // completion POSTs each find no duplicate and each award. The lock is transaction
      // scoped (pg_advisory_xact_lock), so it is released on commit or rollback.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`award:${userId}:${source}:${reason}`}))`;

      const since = new Date(Date.now() - dedupeWindowMs);
      const duplicate = await db.pointsLedger.findFirst({
        where: { userId, source, reason, createdAt: { gte: since } },
        select: { id: true },
      });

      if (duplicate) {
        const current = await db.user.findUnique({
          where: { id: userId },
          select: { points: true, currentStreak: true },
        });
        return {
          streakUpdated: false,
          newStreak: current?.currentStreak ?? 0,
          streakPointsAwarded: 0,
          newAchievementsCount: 0,
          totalPoints: current?.points ?? 0,
          currentStreak: current?.currentStreak ?? 0,
          deduped: true,
        };
      }
    }

    const updatedUser = await awardPoints(userId, points, reason, source, db);
    const streakResult = await updateStreak(userId, points, db);
    const newAchievements = await checkAndAwardAchievements(userId, db);

    return {
      streakUpdated: streakResult.streakUpdated,
      newStreak: streakResult.newStreak,
      streakPointsAwarded: streakResult.pointsAwarded,
      newAchievementsCount: newAchievements.length,
      totalPoints: updatedUser.points,
      currentStreak: updatedUser.currentStreak,
    };
  }, { timeout: 10000 });
}
