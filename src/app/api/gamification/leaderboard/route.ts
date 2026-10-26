import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getTimeframedLeaderboard, LeaderboardRange } from '@/lib/gamification/gamification';
import { prisma } from '@/lib/database/prisma';
import { classOwnershipWhere, ensureTeacher } from '@/lib/auth/policies';
import { ApiErrors, apiError, handleApiError } from '@/lib/api/response';
import { addDaysToDayKey, getCalendarWeekStartDayKey, getLearnerDayKey, getInstantForLearnerDayStart } from '@/lib/gamification/calendar-week';
import { getLeaderboardPeriod, getLeaderboardWeekLabel } from '@/lib/gamification/leaderboard-period';
import { getLearnerState } from '@/lib/learner-mode';
import { loadPracticeDaysForWeek } from '@/lib/learner/study-log-data';

/**
 * Leaderboard results are shared across every viewer of the same scope,
 * so cache per (timeframe, limit, class scope) for a short window instead
 * of re-aggregating the PointsLedger on every request. The callback must
 * only use its arguments — auth is resolved before this is called.
 */
const getCachedLeaderboard = unstable_cache(
  (
    timeframe: LeaderboardRange,
    limit: number,
    classId: string | undefined,
    classIds: string[] | undefined,
    independentOnly: boolean,
    referenceDay: string
  ) =>
    getTimeframedLeaderboard(
      timeframe,
      limit,
      classId,
      classIds,
      { independentOnly, referenceDate: new Date(referenceDay) }
    ),
  ['gamification-leaderboard'],
  { revalidate: 60, tags: ['leaderboard'] }
);

/**
 * GET /api/gamification/leaderboard
 * Get the leaderboard for a timeframe (day, week, last-week, month, all)
 */
/** All-time shows only the top few plus the viewer's own place, so long-tail ranks stay private. */
const ALL_TIME_VISIBLE = 10;
const ALL_TIME_RANK_LIMIT = 100;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiErrors.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const scopeParam = (searchParams.get('scope') || 'section').toLowerCase();
    const scope = scopeParam === 'all' || scopeParam === 'independent' ? scopeParam : 'section';
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeframeParam = (searchParams.get('timeframe') || 'week').toLowerCase() as LeaderboardRange;
    const timeframe: LeaderboardRange = ['day', 'week', 'last-week', 'month', 'all'].includes(timeframeParam) ? timeframeParam : 'week';
    const user = session.user;
    if (!user.id) {
      return ApiErrors.unauthorized();
    }
    let resolvedClassId: string | undefined = classId || undefined;
    let resolvedClassIds: string[] | undefined;

    if (resolvedClassId) {
      if (user.role === "student") {
        const enrollment = await prisma.classEnrollment.findUnique({
          where: {
            classId_studentId: {
              classId: resolvedClassId,
              studentId: user.id,
            },
          },
          select: { id: true },
        });
        if (!enrollment) {
          return ApiErrors.forbidden();
        }
      } else {
        const teacherCheck = ensureTeacher(user);
        if (!teacherCheck.ok) {
          return apiError(teacherCheck.error, teacherCheck.status);
        }
        const targetClass = await prisma.class.findUnique({
          where: { id: resolvedClassId },
          select: { id: true, teacherId: true },
        });
        if (!targetClass) {
          return ApiErrors.notFound('Class', resolvedClassId);
        }
        if (!teacherCheck.admin && targetClass.teacherId !== user.id) {
          return ApiErrors.forbidden();
        }
      }
    }

    let leaderboardOptions: { independentOnly?: boolean } | undefined;

    if (user.role === "student") {
      const enrollments = await prisma.classEnrollment.findMany({
        where: { studentId: user.id, status: "active" },
        orderBy: { joinedAt: "desc" },
        select: {
          classId: true,
        },
      });

      const learnerState = await getLearnerState(prisma, user.id);
      const learnerMode = learnerState.mode;

      if (scope === "independent" || learnerMode === "independent") {
        leaderboardOptions = { independentOnly: true };
        resolvedClassId = undefined;
        resolvedClassIds = undefined;
      } else if (scope === "all") {
        const activeClassId = resolvedClassId || enrollments[0]?.classId;

        if (activeClassId) {
          const activeClass = await prisma.class.findUnique({
            where: { id: activeClassId },
            select: { sectionGroupId: true },
          });

          if (activeClass?.sectionGroupId) {
            const siblingSections = await prisma.class.findMany({
              where: { sectionGroupId: activeClass.sectionGroupId },
              select: { id: true },
            });
            resolvedClassIds = siblingSections.map((item) => item.id);
          } else {
            resolvedClassIds = Array.from(new Set(enrollments.map((item) => item.classId)));
          }
        } else {
          resolvedClassIds = [];
        }
      } else {
        resolvedClassId = resolvedClassId || enrollments[0]?.classId;
      }
    } else {
      const teacherCheck = ensureTeacher(user);
      if (!teacherCheck.ok) {
        return apiError(teacherCheck.error, teacherCheck.status);
      }
      if (!resolvedClassId) {
        const firstClass = await prisma.class.findFirst({
          where: classOwnershipWhere(user, teacherCheck.admin),
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });
        resolvedClassId = firstClass?.id;
      }
    }

    const now = new Date();
    const period = getLeaderboardPeriod(timeframe, now);
    const previousWeek = getLeaderboardPeriod('last-week', now);
    const isAllTime = timeframe === 'all';
    const [ranked, lastWeekTotal] = await Promise.all([
      getCachedLeaderboard(
        timeframe,
        isAllTime ? ALL_TIME_RANK_LIMIT : limit,
        resolvedClassId,
        resolvedClassIds,
        leaderboardOptions?.independentOnly === true,
        // Include the date in the key so Monday never serves Sunday's cached board.
        getInstantForLearnerDayStart(getLearnerDayKey(now)).toISOString()
      ),
      user.role === 'student' ? prisma.pointsLedger.aggregate({
        // Personal recognition must not depend on making the visible top ranks.
        where: { userId: user.id, createdAt: { gte: previousWeek.start!, lt: previousWeek.end! } },
        _sum: { points: true },
      }) : Promise.resolve(null),
    ]);
    const visible = isAllTime ? ranked.slice(0, ALL_TIME_VISIBLE) : ranked;
    const rawViewerEntry = ranked.find((entry) => entry.id === user.id) ?? null;
    const viewerOutsideList = rawViewerEntry && !visible.some((entry) => entry.id === user.id);
    // Practice-log days are read live (not from the cached board) so a new log shows up right away.
    // They never change points or rank.
    const practiceWeekStart = timeframe === 'last-week'
      ? addDaysToDayKey(getCalendarWeekStartDayKey(now), -7)
      : getCalendarWeekStartDayKey(now);
    const practiceDays = timeframe === 'week' || timeframe === 'last-week'
      ? await loadPracticeDaysForWeek(
          [...visible, ...(viewerOutsideList && rawViewerEntry ? [rawViewerEntry] : [])].map((entry) => entry.id),
          practiceWeekStart
        )
      : new Map<string, number>();
    const withPractice = <T extends { id: string }>(entry: T) => ({ ...entry, practiceDays: practiceDays.get(entry.id) ?? 0 });
    const leaderboard = visible.map(withPractice);
    const viewerEntry = rawViewerEntry ? withPractice(rawViewerEntry) : null;

    return NextResponse.json({
      leaderboard,
      userRank: viewerEntry?.rank ?? null,
      viewerPoints: viewerEntry?.weeklyPoints ?? 0,
      viewerCompletedWeeks: viewerEntry?.completedWeeksCount ?? 0,
      viewerEntry: viewerOutsideList ? viewerEntry : null,
      timeframe,
      periodLabel: period.label,
      // Lets the learner card count down days left in the week.
      periodEnd: period.end ? period.end.toISOString() : null,
      currentWeekLabel: leaderboardOptions?.independentOnly ? 'This week' : getLeaderboardWeekLabel(now),
      previousWeekLabel: leaderboardOptions?.independentOnly ? 'Last week' : getLeaderboardWeekLabel(now, true),
      lastWeekPoints: lastWeekTotal?._sum.points ?? 0,
      classId: resolvedClassId || null,
      scope: leaderboardOptions?.independentOnly ? 'independent' : scope,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch leaderboard',
      path: req.url,
    });
  }
}
