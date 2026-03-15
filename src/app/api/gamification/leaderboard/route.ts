import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTimeframedLeaderboard, LeaderboardRange } from '@/lib/gamification';
import { prisma } from '@/lib/prisma';
import { classOwnershipWhere, ensureTeacher } from '@/lib/policies';
import { ApiErrors, apiError, handleApiError } from '@/lib/api-response';

/**
 * GET /api/gamification/leaderboard
 * Get the leaderboard for a timeframe (day, week, month)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiErrors.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const scopeParam = (searchParams.get('scope') || 'section').toLowerCase();
    const scope = scopeParam === 'all' ? 'all' : 'section';
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeframeParam = (searchParams.get('timeframe') || 'week').toLowerCase() as LeaderboardRange;
    const timeframe: LeaderboardRange = ['day', 'week', 'month'].includes(timeframeParam) ? timeframeParam : 'week';
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

    if (user.role === "student") {
      const enrollments = await prisma.classEnrollment.findMany({
        where: { studentId: user.id },
        orderBy: { joinedAt: "desc" },
        select: {
          classId: true,
          class: {
            select: {
              teacherId: true,
            },
          },
        },
      });

      if (scope === "all") {
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

    const leaderboard = await getTimeframedLeaderboard(timeframe, limit, resolvedClassId, resolvedClassIds);
    const userRank = leaderboard.findIndex((entry) => entry.id === user.id) + 1;

    return NextResponse.json({
      leaderboard,
      userRank: userRank > 0 ? userRank : null,
      classId: resolvedClassId || null,
      scope,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch leaderboard',
      path: req.url,
    });
  }
}
