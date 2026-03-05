import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTimeframedLeaderboard, LeaderboardRange } from '@/lib/gamification';
import { prisma } from '@/lib/prisma';
import { classOwnershipWhere, ensureTeacher } from '@/lib/policies';

/**
 * GET /api/gamification/leaderboard
 * Get the leaderboard for a timeframe (day, week, month)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeframeParam = (searchParams.get('timeframe') || 'week').toLowerCase() as LeaderboardRange;
    const timeframe: LeaderboardRange = ['day', 'week', 'month'].includes(timeframeParam) ? timeframeParam : 'week';
    const user = session.user;
    let resolvedClassId: string | undefined = classId || undefined;

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
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else {
        const teacherCheck = ensureTeacher(user);
        if (!teacherCheck.ok) {
          return NextResponse.json({ error: teacherCheck.error }, { status: teacherCheck.status });
        }
        const targetClass = await prisma.class.findUnique({
          where: { id: resolvedClassId },
          select: { id: true, teacherId: true },
        });
        if (!targetClass) {
          return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }
        if (!teacherCheck.admin && targetClass.teacherId !== user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    } else if (user.role === "student") {
      const enrollment = await prisma.classEnrollment.findFirst({
        where: { studentId: user.id },
        orderBy: { joinedAt: "desc" },
        select: { classId: true },
      });
      resolvedClassId = enrollment?.classId;
    } else {
      const teacherCheck = ensureTeacher(user);
      if (!teacherCheck.ok) {
        return NextResponse.json({ error: teacherCheck.error }, { status: teacherCheck.status });
      }
      const firstClass = await prisma.class.findFirst({
        where: classOwnershipWhere(user, teacherCheck.admin),
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      resolvedClassId = firstClass?.id;
    }

    const leaderboard = await getTimeframedLeaderboard(timeframe, limit, resolvedClassId);
    const userRank = leaderboard.findIndex((entry) => entry.id === user.id) + 1;

    return NextResponse.json({
      leaderboard,
      userRank: userRank > 0 ? userRank : null,
      classId: resolvedClassId || null,
    });
  } catch (error) {
    console.error('[Leaderboard] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
