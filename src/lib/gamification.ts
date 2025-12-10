import { prisma } from './prisma';

// Points awarded for different actions
export const POINTS = {
  QUIZ_COMPLETION: 10,
  QUIZ_PERFECT_SCORE: 20, // Bonus for 100%
  QUIZ_HIGH_SCORE: 10, // 90%+
  QUIZ_GOOD_SCORE: 5, // 80%+

  // Activity type points (tiered by difficulty)
  FLASHCARDS: 2,
  MATCHING_GAME: 3,
  FILL_IN_BLANK: 5,
  GRAMMAR_GUIDE: 10,
  ACTIVITY_COMPLETION: 5, // Default fallback

  // Streaks
  DAILY_STREAK: 5,
  WEEKLY_STREAK: 25,

  // Achievements
  ACHIEVEMENT_BONUS: 50,
} as const;

/**
 * Get points for completing an activity based on its type
 */
export function getActivityPoints(activityType: string, activityId?: string): number {
  // Check activity type
  const type = activityType.toLowerCase();

  if (type === 'game') {
    // For games, check the ID to determine game type
    if (activityId?.includes('flashcard')) {
      return POINTS.FLASHCARDS;
    } else if (activityId?.includes('matching')) {
      return POINTS.MATCHING_GAME;
    } else if (activityId?.includes('fillblank') || activityId?.includes('fill-blank')) {
      return POINTS.FILL_IN_BLANK;
    }
    return POINTS.ACTIVITY_COMPLETION; // Default for unknown games
  } else if (type === 'guide') {
    return POINTS.GRAMMAR_GUIDE;
  } else if (type === 'quiz') {
    return POINTS.QUIZ_COMPLETION;
  }

  return POINTS.ACTIVITY_COMPLETION; // Default
}

/**
 * Award points to a user and update their total
 */
async function logPointsLedger(userId: string, points: number, reason: string, source: string = 'system') {
  try {
    await prisma.pointsLedger.create({
      data: {
        userId,
        points,
        reason,
        source,
      },
    });
  } catch (err) {
    console.error('[Gamification] Failed to log points ledger entry', err);
  }
}

export async function awardPoints(userId: string, points: number, reason: string = '') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
      weeklyPoints: { increment: points },
    },
  });

  await logPointsLedger(userId, points, reason || 'Points awarded', 'award');

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
    if (pointsAwarded > 0) {
      await logPointsLedger(
        userId,
        pointsAwarded,
        newStreak % 7 === 0 && pointsAwarded > POINTS.DAILY_STREAK
          ? 'Streak + weekly bonus'
          : 'Streak bonus',
        'streak'
      );
    }
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

export type LeaderboardRange = 'day' | 'week' | 'month';

function getRangeStart(range: LeaderboardRange) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'day':
      return startOfToday;
    case 'week': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 6); // last 7 days including today
      return start;
    }
    case 'month':
    default: {
      return new Date(now.getFullYear(), now.getMonth(), 1); // beginning of current month
    }
  }
}

/**
 * Get leaderboard for a given timeframe using the points ledger.
 * Shows all students, merging ledger data with students who have no points yet.
 */
export async function getTimeframedLeaderboard(
  range: LeaderboardRange = 'week',
  limit: number = 10,
  classId?: string
) {
  const since = getRangeStart(range);

  // First, get all students (excluding test accounts)
  const studentWhere: any = { 
    role: 'student',
    username: { not: 'marlie' }, // Exclude test account from leaderboard
  };
  if (classId) {
    studentWhere.classes = { some: { classId } };
  }

  const allStudents = await prisma.user.findMany({
    where: studentWhere,
    select: {
      id: true,
      name: true,
      currentStreak: true,
      lastWeekRank: true,
    },
  });

  // Then get points from ledger for this timeframe (excluding test accounts)
  const whereLedger: any = {
    createdAt: { gte: since },
    user: {
      role: 'student',
      username: { not: 'marlie' }, // Exclude test account from leaderboard
    },
  };

  if (classId) {
    whereLedger.user.classes = {
      some: {
        classId,
      },
    };
  }

  const grouped = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    where: whereLedger,
    _sum: { points: true },
  });

  // Create a map of userId -> points from ledger
  const pointsMap = new Map(grouped.map((entry) => [entry.userId, entry._sum.points || 0]));

  // Combine all students with their points (0 if not in ledger)
  const rankings = allStudents.map((student) => ({
    userId: student.id,
    points: pointsMap.get(student.id) || 0,
    name: student.name || 'Student',
    currentStreak: student.currentStreak,
    lastWeekRank: student.lastWeekRank,
  }));

  // Filter out students with 0 points - only rank students who have earned points
  const studentsWithPoints = rankings.filter((r) => r.points > 0);

  // Sort by points descending, then by name alphabetically for display order
  studentsWithPoints.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  // Apply limit and add rank (same rank for ties)
  const limitedRankings = studentsWithPoints.slice(0, limit);

  return limitedRankings.map((r, idx) => {
    // Find the rank: same as first student with same points, otherwise idx + 1
    let rank = idx + 1;
    if (idx > 0) {
      // Check if any previous student has the same points
      const firstWithSamePoints = limitedRankings.findIndex(lr => lr.points === r.points);
      if (firstWithSamePoints < idx) {
        // Use the rank of the first student with these points
        rank = firstWithSamePoints + 1;
      }
    }

    return {
      id: r.userId,
      name: r.name,
      weeklyPoints: r.points,
      currentStreak: r.currentStreak || 0,
      rank: rank,
      rankChange: range === 'week' ? (r.lastWeekRank ? r.lastWeekRank - rank : null) : null,
    };
  });
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
  const earnedAchievementIds = new Set(
    user.achievements.map((ua: { achievementId: string }) => ua.achievementId)
  );
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
        const perfectQuizzes = user.submissions.filter((s: { score: number | null }) => s.score === 100).length;
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
    username: { not: 'marlie' }, // Exclude test account from leaderboard
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
    where: {
      ...whereClause,
      weeklyPoints: { gt: 0 }, // Only include students with points > 0
    },
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

  // Add rank and rank change (same rank for ties)
  return students.map(
    (
      student: { id: string; lastWeekRank: number | null; weeklyPoints: number },
      index: number
    ) => {
      // Find the rank: same as first student with same points, otherwise index + 1
      let rank = index + 1;
      if (index > 0) {
        // Check if any previous student has the same points
        const firstWithSamePoints = students.findIndex(s => s.weeklyPoints === student.weeklyPoints);
        if (firstWithSamePoints < index) {
          // Use the rank of the first student with these points
          rank = firstWithSamePoints + 1;
        }
      }

      return {
        ...student,
        rank: rank,
        rankChange: student.lastWeekRank ? student.lastWeekRank - rank : null,
      };
    }
  );
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

  // Get user's rank in weekly leaderboard (excluding test accounts)
  const allStudents = await prisma.user.findMany({
    where: { 
      role: 'student',
      username: { not: 'marlie' }, // Exclude test account from leaderboard
    },
    orderBy: { weeklyPoints: 'desc' },
    select: { id: true },
  });

  const rank = allStudents.findIndex((s: { id: string }) => s.id === userId) + 1;

  return {
    points: user.points,
    weeklyPoints: user.weeklyPoints,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    rank: rank > 0 ? rank : null,
    lastWeekRank: user.lastWeekRank,
    rankChange: user.lastWeekRank && rank > 0 ? user.lastWeekRank - rank : null,
    achievements: user.achievements.map((ua: { achievement: { id: string; name: string; description: string; icon: string }; earnedAt: Date }) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      earnedAt: ua.earnedAt,
    })),
  };
}
