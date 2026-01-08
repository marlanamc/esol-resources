import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, getActivityPoints, POINTS, updateStreak, checkAndAwardAchievements } from "@/lib/gamification";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, progress = 100, status, accuracy, category, assignmentId } = body;

    // SECURITY: Input validation
    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    // Validate and sanitize progress (0-100)
    const value = typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    // Validate and sanitize accuracy (0-100) if provided
    const sanitizedAccuracy = accuracy !== undefined && accuracy !== null
        ? Math.max(0, Math.min(100, Math.round(Number(accuracy))))
        : undefined;

    // Validate category if provided
    if (category !== undefined && typeof category !== 'string') {
        return NextResponse.json({ error: "Invalid category format" }, { status: 400 });
    }

    const computedStatus = status || (value >= 100 ? "completed" : "in_progress");

    const userId = session.user.id;

    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
    const progressWhere = {
        userId,
        activityId,
        assignmentId: assignmentKey,
    };

    const existing = await prisma.activityProgress.findFirst({
        where: progressWhere,
    });

    // Handle category data updates for activities with categories (like Numbers Game)
    let updatedCategoryData: string | undefined;
    if (category && sanitizedAccuracy !== undefined) {
        // Client sent a category update - merge with existing category data
        const currentData = existing?.categoryData
            ? JSON.parse(existing.categoryData)
            : {};

        // Update or add this category's progress
        currentData[category] = {
            completed: value >= 100,
            accuracy: sanitizedAccuracy,
            completedAt: value >= 100 ? new Date().toISOString() : currentData[category]?.completedAt,
            attempts: (currentData[category]?.attempts || 0) + 1
        };

        updatedCategoryData = JSON.stringify(currentData);

        // Don't override progress to 100% unless explicitly set - keep category-based progress
        // Only set to 100 if this specific category round is complete
    }

    const progressData = {
        progress: value,
        status: computedStatus,
    };
    if (updatedCategoryData) {
        Object.assign(progressData, { categoryData: updatedCategoryData });
    }

    let record;
    if (existing) {
        record = await prisma.activityProgress.update({
            where: { id: existing.id },
            data: progressData,
        });
    } else {
        record = await prisma.activityProgress.create({
            data: {
                userId,
                activityId,
                assignmentId: assignmentKey,
                ...progressData,
            },
        });
    }

    // Award points based on activity type
    // For activities with categories, award points per category completion
    // For other activities, award points the first time reaching 100%
    const shouldAwardPoints = category
        ? (value >= 100 && updatedCategoryData && !(existing?.categoryData && JSON.parse(existing.categoryData)[category]?.completed))
        : ((existing?.progress ?? 0) < 100 && value >= 100);

    if (shouldAwardPoints) {
        // Get the activity to determine type
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { type: true, title: true, content: true }
        });

        if (activity) {
            let points = getActivityPoints(activity.type, activityId);

            // Special handling for numbers game - award difficulty-based points per category
            if (activityId === 'numbers-game' || activityId?.includes('numbers-game')) {
                // Determine difficulty based on category
                const categoryStr = (category || '').toLowerCase();
                let basePoints: number;
                let perfectBonus: number;
                let highBonus: number;
                
                // Easy: Basic Numbers (0-99), Round Numbers
                if (categoryStr.includes('basic numbers') || categoryStr.includes('round numbers')) {
                    basePoints = POINTS.NUMBERS_GAME_EASY;
                    perfectBonus = POINTS.NUMBERS_GAME_PERFECT_EASY;
                    highBonus = POINTS.NUMBERS_GAME_HIGH_EASY;
                }
                // Medium: Hundreds (100-999), Ordinal Numbers
                else if ((categoryStr.includes('hundreds') && categoryStr.includes('100-999')) || categoryStr.includes('ordinal numbers')) {
                    basePoints = POINTS.NUMBERS_GAME_MEDIUM;
                    perfectBonus = POINTS.NUMBERS_GAME_PERFECT_MEDIUM;
                    highBonus = POINTS.NUMBERS_GAME_HIGH_MEDIUM;
                }
                // Medium-Hard: One Thousand to Ten Thousand, Ten Thousands
                else if (categoryStr.includes('one thousand to ten thousand') || categoryStr.includes('ten thousands')) {
                    basePoints = POINTS.NUMBERS_GAME_MEDIUM_HARD;
                    perfectBonus = POINTS.NUMBERS_GAME_PERFECT_MEDIUM_HARD;
                    highBonus = POINTS.NUMBERS_GAME_HIGH_MEDIUM_HARD;
                }
                // Hard: Hundred Thousands, Millions, Billions, Trillions, Years, All Cardinal
                else {
                    basePoints = POINTS.NUMBERS_GAME_HARD;
                    perfectBonus = POINTS.NUMBERS_GAME_PERFECT_HARD;
                    highBonus = POINTS.NUMBERS_GAME_HIGH_HARD;
                }
                
                let bonusPoints = 0;

                // Award accuracy-based bonus if accuracy is provided
                if (sanitizedAccuracy !== undefined) {
                    if (sanitizedAccuracy === 100) {
                        bonusPoints = perfectBonus;
                    } else if (sanitizedAccuracy >= 90) {
                        bonusPoints = highBonus;
                    }
                } else {
                    // Fallback: if no accuracy provided but completed, award perfect bonus
                    bonusPoints = perfectBonus;
                }

                points = basePoints + bonusPoints;
            }
            
            await awardPoints(userId, points, `Completed: ${activity.title}`);
        } else {
            // Fallback if activity not found (shouldn't happen)
            await awardPoints(userId, 5, `Completed activity ${activityId}`);
        }

        // Update streak and check for achievements after awarding points
        await updateStreak(userId);
        await checkAndAwardAchievements(userId);
    }

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
}
