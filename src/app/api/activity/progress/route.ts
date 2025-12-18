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

    const { activityId, progress = 100, status = progress >= 100 ? "completed" : "in_progress", accuracy, category } = await request.json();

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const value = typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    const userId = (session.user as any).id;

    const existing = await (prisma.activityProgress as any).findUnique({
        where: {
            userId_activityId: {
                userId,
                activityId,
            },
        },
    });

    // Handle category data updates for activities with categories (like Numbers Game)
    let updatedCategoryData: string | undefined;
    if (category && accuracy !== undefined) {
        // Client sent a category update - merge with existing category data
        const currentData = existing?.categoryData
            ? JSON.parse(existing.categoryData)
            : {};

        // Check if this category was already completed
        const wasCategoryCompleted = currentData[category]?.completed || false;

        // Update or add this category's progress
        currentData[category] = {
            completed: value >= 100,
            accuracy: accuracy,
            completedAt: value >= 100 ? new Date().toISOString() : currentData[category]?.completedAt,
            attempts: (currentData[category]?.attempts || 0) + 1
        };

        updatedCategoryData = JSON.stringify(currentData);

        // Calculate overall progress based on categories completed
        const totalCategories = Object.keys(currentData).length;
        const completedCategories = Object.values(currentData).filter((c: any) => c.completed).length;

        // Don't override progress to 100% unless explicitly set - keep category-based progress
        // Only set to 100 if this specific category round is complete
    }

    const record = await (prisma.activityProgress as any).upsert({
        where: {
            userId_activityId: {
                userId,
                activityId,
            },
        },
        create: {
            userId,
            activityId,
            progress: value,
            status,
            categoryData: updatedCategoryData
        },
        update: {
            progress: value,
            status,
            ...(updatedCategoryData && { categoryData: updatedCategoryData })
        },
    });

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
                if (typeof accuracy === 'number') {
                    if (accuracy === 100) {
                        bonusPoints = perfectBonus;
                    } else if (accuracy >= 90) {
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



