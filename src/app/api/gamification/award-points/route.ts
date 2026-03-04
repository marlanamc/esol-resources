import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { awardPoints, updateStreak, calculateQuizPoints, getActivityPoints, checkAndAwardAchievements } from '@/lib/gamification';
import { prisma } from '@/lib/prisma';
import { claimSubmissionPointsOnce } from '@/lib/submission-points-award';

/**
 * POST /api/gamification/award-points
 * Award points when a student completes an activity/quiz
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { submissionId, activityType, score } = await req.json() as {
      submissionId?: string;
      activityType?: string;
      score?: number | null;
    };

    if (!submissionId || typeof submissionId !== 'string') {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    // Load submission and enforce ownership.
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        userId: true,
        pointsAwarded: true,
        activityId: true,
        activity: {
          select: {
            id: true,
            type: true,
            content: true,
            ui: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Calculate points based on activity type and score
    // For quizzes, use score-based calculation; for other activities, use type-based
    const activityTypeFromDb = submission.activity?.type ?? activityType ?? 'activity';
    const isQuiz = activityTypeFromDb?.toLowerCase() === 'quiz';
    const points = isQuiz
      ? calculateQuizPoints(typeof score === 'number' ? score : null)
      : getActivityPoints(activityTypeFromDb, submission.activity ?? undefined);

    const claimResult = await claimSubmissionPointsOnce({
      submission: prisma.submission,
      submissionId,
      userId,
      pointsAwarded: points,
    });

    if (!claimResult.claimed) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        pointsAwarded: 0,
        existingPointsAwarded: claimResult.existingPointsAwarded,
      });
    }

    let streakResult = { streakUpdated: false, newStreak: 0, pointsAwarded: 0 };
    let newAchievements: string[] = [];

    if (points > 0) {
      try {
        await awardPoints(userId, points, `Completed activity ${submission.activityId}`);
        streakResult = await updateStreak(userId, points);
        newAchievements = await checkAndAwardAchievements(userId);
      } catch (awardError) {
        // Roll back claim so a retried request can safely award.
        await prisma.submission.updateMany({
          where: {
            id: submissionId,
            userId,
            pointsAwarded: points,
          },
          data: {
            pointsAwarded: 0,
          },
        });
        throw awardError;
      }
    }

    // Get updated user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        weeklyPoints: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    return NextResponse.json({
      success: true,
      duplicate: false,
      pointsAwarded: points,
      streak: {
        updated: streakResult.streakUpdated,
        current: streakResult.newStreak,
        pointsFromStreak: streakResult.pointsAwarded,
      },
      newAchievements: newAchievements.length,
      user,
    });
  } catch (error) {
    console.error('[Award Points] Error:', error);
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
  }
}
