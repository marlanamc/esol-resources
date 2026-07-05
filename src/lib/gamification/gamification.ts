import { prisma } from '@/lib/database/prisma';
import type { PrismaClient, Prisma } from "@prisma/client";
import { logger } from '@/lib/shared/logger';
import { POINTS } from "./constants";
import { shouldAwardStreak, getEffectiveStreak, getNextStreakState } from "./streak-utils";
import { buildIndependentLeaderboardUserWhere, buildLeaderboardEligibleUserWhere } from "./leaderboard-filter";
export { POINTS } from "./constants";
export { getActivityPoints, resolveActivityGameUi } from "./activity-points";
export {
  getExcludedLeaderboardUsernames,
  parseExcludedLeaderboardUsernames,
} from "./leaderboard-filter";

/** Prisma client or interactive transaction client */
export type DbClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

type AchievementDefinition = Prisma.AchievementGetPayload<Record<string, never>>;

// Achievement definitions are static seeded config that effectively never change
// at runtime, yet checkAndAwardAchievements() runs on every activity submit.
// Memoize them with a short TTL so we don't reload the whole table each time.
// Always read with the base `prisma` client (never an interactive tx), since this
// is immutable config and must not be coupled to a caller's transaction.
let achievementDefinitionCache: { data: AchievementDefinition[]; at: number } | null = null;
const ACHIEVEMENT_DEFINITION_TTL_MS = 5 * 60_000;

async function getAchievementDefinitions(): Promise<AchievementDefinition[]> {
  if (
    achievementDefinitionCache &&
    Date.now() - achievementDefinitionCache.at < ACHIEVEMENT_DEFINITION_TTL_MS
  ) {
    return achievementDefinitionCache.data;
  }
  const data = await prisma.achievement.findMany();
  achievementDefinitionCache = { data, at: Date.now() };
  return data;
}

/**
 * Clear the in-process achievement-definition cache. Call after seeding or
 * editing achievements in a long-running process so the next check reloads.
 */
export function invalidateAchievementDefinitions() {
  achievementDefinitionCache = null;
}

/**
 * Award points to a user and update their total
 */
async function logPointsLedger(userId: string, points: number, reason: string, source: string = 'system', db: DbClient = prisma) {
  try {
    await db.pointsLedger.create({
      data: {
        userId,
        points,
        reason,
        source,
      },
    });
  } catch (err) {
    logger.error('[Gamification] Failed to log points ledger entry', err);
  }
}

/**
 * Track user login activity (for activity calendar)
 * Creates a PointsLedger entry with 0 points to track login dates
 */
export async function trackLogin(userId: string) {
  try {
    // Check if we already have a login entry for today (UTC-aligned with streak math)
    const now = new Date();
    const todayUtcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrowUtcStart = new Date(todayUtcStart);
    tomorrowUtcStart.setUTCDate(tomorrowUtcStart.getUTCDate() + 1);

    // Serialize concurrent logins for the same user (e.g. phone + tablet at the
    // start of class) with an advisory lock so the "already logged in today?"
    // check and the ledger/streak writes commit as one atomic unit. Without it,
    // both sessions can pass the check and write duplicate daily-login rows.
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}), hashtext('track-login'))`;

      const existingLogin = await tx.pointsLedger.findFirst({
        where: {
          userId,
          source: 'login',
          createdAt: {
            gte: todayUtcStart,
            lt: tomorrowUtcStart,
          },
        },
      });

      // Only process the first login marker of the UTC day
      if (existingLogin) return;

      await logPointsLedger(userId, 0, 'Daily login', 'login', tx as unknown as DbClient);

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
      });
      if (!user) return;

      const { streakUpdated, newStreak } = getNextStreakState(
        user.currentStreak,
        user.lastActivityDate,
        now
      );

      if (streakUpdated) {
        await tx.user.update({
          where: { id: userId },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, user.longestStreak),
            lastActivityDate: now,
          },
        });
      } else {
        await tx.user.update({
          where: { id: userId },
          data: { lastActivityDate: now },
        });
      }
    });
  } catch (err) {
    logger.error('[Gamification] Failed to track login', err);
  }
}

export async function awardPoints(userId: string, points: number, reason: string = '', source: string = 'award', db: DbClient = prisma) {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
      weeklyPoints: { increment: points },
    },
  });

  await logPointsLedger(userId, points, reason || 'Points awarded', source, db);

  logger.info("[Gamification] Awarded points", { userId, points, reason, source });

  return user;
}

/**
 * Check and update user's streak based on activity completion
 */
export async function updateStreak(userId: string, activityPoints: number, db: DbClient = prisma): Promise<{ streakUpdated: boolean; newStreak: number; pointsAwarded: number }> {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  if (!shouldAwardStreak(activityPoints)) {
    return { streakUpdated: false, newStreak: user.currentStreak, pointsAwarded: 0 };
  }

  const now = new Date();

  const { streakUpdated, newStreak } = getNextStreakState(
    user.currentStreak,
    user.lastActivityDate,
    now
  );
  let pointsAwarded = 0;
  if (streakUpdated) {
    pointsAwarded = POINTS.DAILY_STREAK;
    if (newStreak % 7 === 0) {
      pointsAwarded += POINTS.WEEKLY_STREAK;
    }
  }

  if (streakUpdated) {
    await db.user.update({
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
        'streak',
        db
      );
    }
  } else {
    // Update last activity date even if streak wasn't updated
    await db.user.update({
      where: { id: userId },
      data: {
        lastActivityDate: now,
      },
    });
  }

  return { streakUpdated, newStreak, pointsAwarded };
}

/**
 * Calculate points for a quiz based on score
 * Points are ONLY awarded based on accuracy - no participation points
 */
export function calculateQuizPoints(score: number | null): number {
  if (score === null) return 0;

  // Score-based points only - must earn through accuracy
  if (score === 100) {
    return POINTS.QUIZ_PERFECT_SCORE; // 15 points
  } else if (score >= 90) {
    return POINTS.QUIZ_HIGH_SCORE; // 10 points
  } else if (score >= 80) {
    return POINTS.QUIZ_GOOD_SCORE; // 5 points
  } else if (score >= 70) {
    return POINTS.QUIZ_PASSING_SCORE; // 2 points
  }
  
  // Below 70% = 0 points - need to study more!
  return 0;
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
  classId?: string,
  classIds?: string[],
  options?: { independentOnly?: boolean }
) {
  // SECURITY: Input validation
  if (classId !== undefined && typeof classId !== 'string') {
    throw new Error('Invalid classId: must be a string');
  }
  if (classIds !== undefined && !Array.isArray(classIds)) {
    throw new Error('Invalid classIds: must be an array of strings');
  }
  if (classIds?.some((id) => typeof id !== 'string')) {
    throw new Error('Invalid classIds: all entries must be strings');
  }

  // Sanitize limit to prevent excessive queries (1-100)
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

  const since = getRangeStart(range);

  const classFilter = classIds && classIds.length > 0
    ? { classes: { some: { classId: { in: classIds }, status: 'active' } } }
    : (classId ? { classes: { some: { classId, status: 'active' } } } : undefined);

  const studentWhere = options?.independentOnly
    ? buildIndependentLeaderboardUserWhere()
    : buildLeaderboardEligibleUserWhere(classFilter);

  // Sum points per user from the ledger for this timeframe. This is naturally
  // bounded by activity — only users who earned points in the window appear —
  // so we look up student metadata for just those users below, instead of
  // pulling the entire roster into memory on every leaderboard render.
  const whereLedger: Prisma.PointsLedgerWhereInput = {
    createdAt: { gte: since },
    user: { ...studentWhere },
  };

  const grouped = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    where: whereLedger,
    _sum: { points: true },
  });

  // Create a map of userId -> points from ledger
  const pointsMap = new Map(grouped.map((entry) => [entry.userId, entry._sum.points || 0]));

  // Only students with a positive timeframe total are shown (login entries log
  // 0 points, so a user can appear in the ledger with a zero sum).
  const rankedUserIds = grouped
    .filter((entry) => (entry._sum.points || 0) > 0)
    .map((entry) => entry.userId);

  if (rankedUserIds.length === 0) return [];

  const rankedStudents = await prisma.user.findMany({
    where: { AND: [studentWhere, { id: { in: rankedUserIds } }] },
    select: {
      id: true,
      name: true,
      username: true,
      currentStreak: true,
      lastActivityDate: true,
      lastWeekRank: true,
      avatar: true,
      avatarColor: true,
    },
  });

  // Combine the ranked students with their ledger points
  const rankings = rankedStudents.map((student) => ({
    userId: student.id,
    points: pointsMap.get(student.id) || 0,
    name: options?.independentOnly
      ? student.username
      : student.name || student.username || 'Student',
    currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
    lastWeekRank: student.lastWeekRank,
    avatar: student.avatar,
    avatarColor: student.avatarColor,
  }));

  // Keep leaderboard competitive: only include students who earned points this timeframe.
  const studentsWithPoints = rankings.filter((r) => r.points > 0);

  // Sort by points descending, then by name alphabetically for display order
  studentsWithPoints.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  // Apply limit and add rank (same rank for ties)
  const limitedRankings = studentsWithPoints.slice(0, safeLimit);

  let currentRank = 1;
  return limitedRankings.map((r, idx) => {
    if (idx > 0 && r.points !== limitedRankings[idx - 1].points) {
      currentRank = idx + 1;
    }

    return {
      id: r.userId,
      name: r.name,
      weeklyPoints: r.points,
      currentStreak: r.currentStreak || 0,
      rank: currentRank,
      rankChange: range === 'week' ? (r.lastWeekRank ? r.lastWeekRank - currentRank : null) : null,
      avatar: r.avatar,
      avatarColor: r.avatarColor,
    };
  });
}

/**
 * Check if user unlocked any achievements and award them
 */
export async function checkAndAwardAchievements(userId: string, db: DbClient = prisma) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  if (!user) return [];

  const allAchievements = await getAchievementDefinitions();
  const earnedAchievementIds = new Set(
    user.achievements.map((ua: { achievementId: string }) => ua.achievementId)
  );
  const newlyEarned: string[] = [];

  const toAward: typeof allAchievements = [];

  // Submission-derived counts are only needed for unearned quiz/activity
  // achievements. Use indexed COUNT queries instead of loading every submission
  // row into memory — that payload grows unbounded as a learner stays active.
  const submissionStatus = { in: ['submitted', 'graded'] };
  const unearned = allAchievements.filter((a) => !earnedAchievementIds.has(a.id));
  const submissionCount = unearned.some((a) => a.type === 'activity')
    ? await db.submission.count({ where: { userId, status: submissionStatus } })
    : 0;
  const perfectQuizCount = unearned.some((a) => a.type === 'quiz')
    ? await db.submission.count({ where: { userId, score: 100, status: submissionStatus } })
    : 0;

  for (const achievement of allAchievements) {
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
        shouldAward = perfectQuizCount >= achievement.requirement;
        break;
      case 'activity':
        shouldAward = submissionCount >= achievement.requirement;
        break;
    }

    if (shouldAward) {
      toAward.push(achievement);
      newlyEarned.push(achievement.id);
    }
  }

  if (toAward.length === 0) return newlyEarned;

  // Batch create all UserAchievement records in one query.
  // skipDuplicates guards against a concurrent-submission race where two
  // transactions both read the same "not yet earned" set and both try to
  // insert the same (userId, achievementId) — without it the second insert
  // throws a unique-constraint error that rolls back the whole award chain,
  // costing the learner their actual activity points.
  await db.userAchievement.createMany({
    data: toAward.map((a) => ({ userId: user.id, achievementId: a.id })),
    skipDuplicates: true,
  });

  const totalPoints = toAward.reduce((sum, a) => sum + a.points, 0);
  if (totalPoints > 0) {
    await awardPoints(userId, totalPoints, `Achievements: ${toAward.map((a) => a.name).join(', ')}`, 'award', db);
  }

  return newlyEarned;
}

/**
 * Get weekly leaderboard (top students by weekly points)
 */
export async function getWeeklyLeaderboard(limit: number = 10, classId?: string) {
  // SECURITY: Input validation
  if (classId !== undefined && typeof classId !== 'string') {
    throw new Error('Invalid classId: must be a string');
  }

  // Sanitize limit to prevent excessive queries (1-100)
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

  const whereClause = buildLeaderboardEligibleUserWhere();

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
    take: safeLimit,
    select: {
      id: true,
      name: true,
      weeklyPoints: true,
      currentStreak: true,
      lastActivityDate: true,
      lastWeekRank: true,
    },
  });

  // Add rank and rank change (same rank for ties)
  let currentRank = 1;
  return students.map((student, index: number) => {
      if (index > 0 && student.weeklyPoints !== students[index - 1].weeklyPoints) {
        currentRank = index + 1;
      }

      return {
        id: student.id,
        name: student.name,
        weeklyPoints: student.weeklyPoints,
        currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
        lastWeekRank: student.lastWeekRank,
        rank: currentRank,
        rankChange: student.lastWeekRank ? student.lastWeekRank - currentRank : null,
      };
    });
}

/**
 * Reset weekly points for all users (to be run weekly via cron)
 * PERFORMANCE: Uses single raw SQL batch update for lastWeekRank instead of N individual updates
 * All reads and writes happen inside a single transaction to prevent race conditions.
 */
export async function resetWeeklyPoints() {
  await prisma.$transaction(async (tx) => {
    // Snapshot rankings inside the transaction so no points are lost between read and reset
    const whereClause = buildLeaderboardEligibleUserWhere();
    const students = await tx.user.findMany({
      where: {
        ...whereClause,
        weeklyPoints: { gt: 0 },
      },
      orderBy: { weeklyPoints: 'desc' },
      take: 100,
      select: { id: true, name: true, weeklyPoints: true },
    });

    if (students.length === 0) {
      await tx.user.updateMany({
        where: { role: 'student' },
        data: { weeklyPoints: 0 },
      });
      logger.info('Weekly points reset complete (no rankings to save)');
      return;
    }

    // Calculate ranks with tie handling (O(n))
    let currentRank = 1;
    const rankings = students.map((s, idx) => {
      if (idx > 0 && s.weeklyPoints !== students[idx - 1].weeklyPoints) {
        currentRank = idx + 1;
      }
      return { id: s.id, rank: currentRank };
    });

    const params = rankings.flatMap((r) => [r.id, r.rank]);
    const valuesClause = rankings
      .map((_, i) => `($${i * 2 + 1}::text, $${i * 2 + 2}::int)`)
      .join(', ');

    await (tx as typeof prisma).$executeRawUnsafe(
      `UPDATE "User" AS u SET "lastWeekRank" = v.rank
       FROM (VALUES ${valuesClause}) AS v(id, rank)
       WHERE u.id = v.id`,
      ...params
    );
    await tx.user.updateMany({
      where: { role: 'student' },
      data: { weeklyPoints: 0 },
    });

    logger.info(`Weekly points reset complete (${rankings.length} rankings saved)`);
  }, { timeout: 15000 });
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

  // Get user's rank in weekly leaderboard (single count query instead of loading all students)
  const usersAheadOfMe = await prisma.user.count({
    where: {
      ...buildLeaderboardEligibleUserWhere(),
      OR: [
        { weeklyPoints: { gt: user.weeklyPoints } },
        { weeklyPoints: user.weeklyPoints, id: { lt: userId } },
      ],
    },
  });
  const rank = usersAheadOfMe + 1;

  return {
    points: user.points,
    weeklyPoints: user.weeklyPoints,
    currentStreak: getEffectiveStreak(user.currentStreak, user.lastActivityDate),
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
