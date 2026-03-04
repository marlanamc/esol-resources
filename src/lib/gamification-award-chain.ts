import { awardPoints, checkAndAwardAchievements, updateStreak } from "@/lib/gamification";

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
}): Promise<AwardChainResult> {
  const { userId, points, reason } = params;

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

  const updatedUser = await awardPoints(userId, points, reason);
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
