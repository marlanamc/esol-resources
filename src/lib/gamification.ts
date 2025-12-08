import { prisma } from './prisma';

// Points awarded for different actions
export const POINTS = {
  QUIZ_COMPLETION: 10,
  QUIZ_PERFECT_SCORE: 20, // Bonus for 100%
  ACTIVITY_COMPLETION: 5,
  DAILY_STREAK: 5,
  WEEKLY_STREAK: 25,
  ACHIEVEMENT_BONUS: 50,
} as const;

/**
 * Award points to a user and update their total
 */
export async function awardPoints(userId: string, points: number, reason: string = '') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
      weeklyPoints: { increment: points },
    },
  });

  console.log(`[Gamification] Awarded ${points} points to user ${userId} for: ${reason}`);

  return user;
}

/**
 * Check and update user's streak based on activity completion
 */
export async function updateStreak(userId: string): Promise<{ streakUpdated: boolean; newStreak: number; pointsAwarded: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
  const lastActivityDay = lastActivity ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate()) : null;

  let streakUpdated = false;
  let newStreak = user.currentStreak;
  let pointsAwarded = 0;

  // If no last activity or last activity was yesterday, increment streak
  if (!lastActivityDay) {
    // First activity ever
    newStreak = 1;
    streakUpdated = true;
    pointsAwarded = POINTS.DAILY_STREAK;
  } else {
    const daysSinceLastActivity = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastActivity === 0) {
      // Already did activity today, no streak update
      streakUpdated = false;
    } else if (daysSinceLastActivity === 1) {
      // Did activity yesterday, continue streak
      newStreak = user.currentStreak + 1;
      streakUpdated = true;
      pointsAwarded = POINTS.DAILY_STREAK;

      // Bonus for weekly streak
      if (newStreak % 7 === 0) {
        pointsAwarded += POINTS.WEEKLY_STREAK;
      }
    } else {
      // Missed a day, reset streak
      newStreak = 1;
      streakUpdated = true;
      pointsAwarded = POINTS.DAILY_STREAK;
    }
  }

  if (streakUpdated) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActivityDate: now,
        points: { increment: pointsAwarded },
        weeklyPoints: { increment: pointsAwarded },
      },
    });
  } else {
    // Update last activity date even if streak wasn't updated
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastActivityDate: now,
      },
    });
  }

  return { streakUpdated, newStreak, pointsAwarded };
}

/**
 * Calculate points for a quiz/activity based on score
 */
export function calculateActivityPoints(score: number | null, activityType: string): number {
  if (score === null) return POINTS.ACTIVITY_COMPLETION;

  let points = POINTS.QUIZ_COMPLETION;

  // Perfect score bonus
  if (score === 100) {
    points += POINTS.QUIZ_PERFECT_SCORE;
  }

  // Additional points based on score tiers
  if (score >= 90) {
    points += 10;
  } else if (score >= 80) {
    points += 5;
  }

  return points;
}

/**
 * Check if user unlocked any achievements and award them
 */
export async function checkAndAwardAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
      },
      submissions: {
        where: { status: 'graded' },
      },
    },
  });

  if (!user) return [];

  const allAchievements = await prisma.achievement.findMany();
  const earnedAchievementIds = new Set(user.achievements.map((ua) => ua.achievementId));
  const newlyEarned: string[] = [];

  for (const achievement of allAchievements) {
    // Skip if already earned
    if (earnedAchievementIds.has(achievement.id)) continue;

    let shouldAward = false;

    switch (achievement.type) {
      case 'streak':
        shouldAward = user.currentStreak >= achievement.requirement;
        break;
      case 'points':
        shouldAward = user.points >= achievement.requirement;
        break;
      case 'quiz':
        const perfectQuizzes = user.submissions.filter((s) => s.score === 100).length;
        shouldAward = perfectQuizzes >= achievement.requirement;
        break;
      case 'activity':
        shouldAward = user.submissions.length >= achievement.requirement;
        break;
    }

    if (shouldAward) {
      // Award the achievement
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
        },
      });

      // Award bonus points
      if (achievement.points > 0) {
        await awardPoints(userId, achievement.points, `Achievement: ${achievement.name}`);
      }

      newlyEarned.push(achievement.id);
    }
  }

  return newlyEarned;
}

/**
 * Get weekly leaderboard (top students by weekly points)
 */
export async function getWeeklyLeaderboard(limit: number = 10, classId?: string) {
  const whereClause: any = {
    role: 'student',
  };

  // If classId provided, filter by students in that class
  if (classId) {
    whereClause.classes = {
      some: {
        classId: classId,
      },
    };
  }

  const students = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      weeklyPoints: 'desc',
    },
    take: limit,
    select: {
      id: true,
      name: true,
      weeklyPoints: true,
      currentStreak: true,
      lastWeekRank: true,
    },
  });

  // Add rank and rank change
  return students.map((student, index) => ({
    ...student,
    rank: index + 1,
    rankChange: student.lastWeekRank ? student.lastWeekRank - (index + 1) : null,
  }));
}

/**
 * Reset weekly points for all users (to be run weekly via cron)
 */
export async function resetWeeklyPoints() {
  // Get current rankings before reset
  const currentRankings = await getWeeklyLeaderboard(100);

  // Update each user's lastWeekRank
  for (const ranking of currentRankings) {
    await prisma.user.update({
      where: { id: ranking.id },
      data: {
        lastWeekRank: ranking.rank,
      },
    });
  }

  // Reset weekly points for all students
  await prisma.user.updateMany({
    where: { role: 'student' },
    data: {
      weeklyPoints: 0,
    },
  });

  console.log('[Gamification] Weekly points reset complete');
}

/**
 * Get user's gamification stats
 */
export async function getUserGamificationStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          earnedAt: 'desc',
        },
      },
    },
  });

  if (!user) return null;

  // Get user's rank in weekly leaderboard
  const allStudents = await prisma.user.findMany({
    where: { role: 'student' },
    orderBy: { weeklyPoints: 'desc' },
    select: { id: true },
  });

  const rank = allStudents.findIndex((s) => s.id === userId) + 1;

  return {
    points: user.points,
    weeklyPoints: user.weeklyPoints,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    rank: rank > 0 ? rank : null,
    lastWeekRank: user.lastWeekRank,
    rankChange: user.lastWeekRank && rank > 0 ? user.lastWeekRank - rank : null,
    achievements: user.achievements.map((ua) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      earnedAt: ua.earnedAt,
    })),
  };
}
