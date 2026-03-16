import { awardPoints, checkAndAwardAchievements, updateStreak } from "./gamification";

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

  const updatedUser = await awardPoints(userId, points, reason, source);
  const streakResult = await updateStreak(userId, points);
  const newAchievements = await checkAndAwardAchievements(userId);

  return {
    streakUpdated: streakResult.streakUpdated,
    newStreak: streakResult.newStreak,
    streakPointsAwarded: streakResult.pointsAwarded,
    newAchievementsCount: newAchievements.length,
    totalPoints: updatedUser.points,
    currentStreak: updatedUser.currentStreak,
  };
}
