import { prisma } from "@/lib/prisma";
import { awardPoints, checkAndAwardAchievements, updateStreak } from "./gamification";
import type { DbClient } from "./gamification";

export type AwardChainResult = {
  streakUpdated: boolean;
  newStreak: number;
  streakPointsAwarded: number;
  newAchievementsCount: number;
  totalPoints: number;
  currentStreak: number;
};

export async function applyAwardChain(params: {
  userId: string;
  points: number;
  reason: string;
  /** Ledger source for reporting; default "award". Use "activity" for activity completion. */
  source?: string;
}): Promise<AwardChainResult> {
  const { userId, points, reason, source = 'award' } = params;

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
