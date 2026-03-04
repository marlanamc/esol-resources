import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { applyAwardChain } from '@/lib/gamification-award-chain';
import { normalizeAssignmentId } from '@/lib/assignment-scope';
import { acquireUserActivityScopeLock } from '@/lib/db-locks';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const body = await request.json();
        const { activityId, assignmentId } = body;

        // Validate required fields
        if (!activityId) {
            return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
        }

        // Get activity content to check if it's a warmup (optional validation)
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { content: true },
        });

        // Check if this is a warmup activity (parse content to verify)
        let isWarmup = false;
        let participationPoints = 3; // Default

        if (activity?.content) {
            try {
                const content = JSON.parse(activity.content);
                if (content.type === 'speaking' && content.warmupMode) {
                    isWarmup = true;
                    participationPoints = content.participationPoints || 3;
                }
            } catch {
                // Content parsing failed, assume not warmup
            }
        }

        if (!isWarmup) {
            return NextResponse.json({ error: 'Activity is not a warmup activity' }, { status: 400 });
        }

        const assignmentKey = normalizeAssignmentId(assignmentId);
        const completionResult = await prisma.$transaction(async (tx) => {
            await acquireUserActivityScopeLock(tx, {
                userId,
                activityId,
                assignmentId: assignmentKey,
            });

            const existingProgress = await tx.activityProgress.findFirst({
                where: {
                    userId,
                    activityId,
                    assignmentId: assignmentKey,
                },
                select: { id: true, status: true },
            });

            if (existingProgress?.status === 'completed') {
                return { alreadyCompleted: true };
            }

            const progressData = {
                userId,
                activityId,
                assignmentId: assignmentKey,
                progress: 100,
                status: 'completed' as const,
                updatedAt: new Date(),
            };

            if (existingProgress) {
                await tx.activityProgress.update({
                    where: { id: existingProgress.id },
                    data: progressData,
                });
            } else {
                await tx.activityProgress.create({
                    data: progressData,
                });
            }

            return { alreadyCompleted: false };
        });

        if (completionResult.alreadyCompleted) {
            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                message: 'Activity already completed'
            });
        }

        // Award participation points - get activity title for better display
        const activityWithTitle = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { title: true },
        });
        const activityTitle = activityWithTitle?.title || activityId;
        const awardResult = await applyAwardChain({
            userId,
            points: participationPoints,
            reason: `${activityTitle}|Warmup`,
        });

        return NextResponse.json({
            success: true,
            pointsAwarded: participationPoints,
            streakUpdated: awardResult.streakUpdated,
            streakBonus: awardResult.streakPointsAwarded,
            newAchievements: awardResult.newAchievementsCount,
            totalPoints: awardResult.totalPoints,
            currentStreak: awardResult.currentStreak,
        });
    } catch (error) {
        console.error('Error completing warmup activity:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
