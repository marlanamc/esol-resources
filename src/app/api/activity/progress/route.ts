import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActivityProgressStatus } from "@/lib/activityProgress";
import { awardPoints, getActivityPoints, POINTS, resolveActivityGameUi, updateStreak, checkAndAwardAchievements } from "@/lib/gamification";
import { calculateNumbersGameCompletionPercentage, isNumbersGameCategoryName } from "@/data/numbersGameCategories";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId");
    const assignmentId = url.searchParams.get("assignmentId");

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;

    const record = await prisma.activityProgress.findFirst({
        where: {
            userId,
            activityId,
            assignmentId: assignmentKey,
        },
        select: {
            progress: true,
            status: true,
            categoryData: true,
            updatedAt: true,
        },
    });

    return NextResponse.json({
        progress: record?.progress ?? 0,
        status: record?.status ?? "in_progress",
        categoryData: record?.categoryData ?? null,
        updatedAt: record?.updatedAt ?? null,
    });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, progress = 100, status: statusInput, accuracy, category, assignmentId } = body;

    // SECURITY: Input validation
    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    // Validate and sanitize progress (0-100)
    const rawProgress = typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    // Validate and sanitize accuracy (0-100) if provided
    const sanitizedAccuracy = accuracy !== undefined && accuracy !== null
        ? Math.max(0, Math.min(100, Math.round(Number(accuracy))))
        : undefined;

    // Validate category if provided
    if (category !== undefined && typeof category !== 'string') {
        return NextResponse.json({ error: "Invalid category format" }, { status: 400 });
    }

    let progressValue = rawProgress;
    let statusValue: ActivityProgressStatus | undefined;
    if (typeof statusInput === "string") {
        statusValue = statusInput as ActivityProgressStatus;
    }

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

    // Handle category data updates (Numbers Game uses accuracy; Matching Game uses category-only rounds)
    let updatedCategoryData: string | undefined;
    let aggregatedNumbersProgress: number | undefined;
    if (category) {
        // Client sent a category update - merge with existing category data
        const currentData = existing?.categoryData
            ? JSON.parse(existing.categoryData)
            : {};

        // Update or add this category's progress
        currentData[category] = {
            completed: rawProgress >= 100,
            ...(sanitizedAccuracy !== undefined ? { accuracy: sanitizedAccuracy } : {}),
            completedAt: rawProgress >= 100 ? new Date().toISOString() : currentData[category]?.completedAt,
            attempts: (currentData[category]?.attempts || 0) + 1
        };

        updatedCategoryData = JSON.stringify(currentData);

        if (isNumbersGameCategoryName(category)) {
            aggregatedNumbersProgress = calculateNumbersGameCompletionPercentage(currentData);
        }

        // Don't override progress to 100% unless explicitly set - keep category-based progress
        // Only set to 100 if this specific category round is complete
    }

    if (aggregatedNumbersProgress !== undefined) {
        progressValue = aggregatedNumbersProgress;
        statusValue = aggregatedNumbersProgress >= 100 ? "completed" : "in_progress";
    }

    const finalStatus: ActivityProgressStatus = statusValue ?? (progressValue >= 100 ? "completed" : "in_progress");

    const progressData = {
        progress: progressValue,
        status: finalStatus,
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
    // - For category-based activities WITH accuracy (Numbers Game), award per category completion
    // - For other activities (including Matching Game round tracking), award once when overall progress hits 100%
    const isAccuracyCategoryUpdate = category && sanitizedAccuracy !== undefined;
    const shouldAwardPoints = isAccuracyCategoryUpdate
        ? (rawProgress >= 100 && updatedCategoryData && !(existing?.categoryData && JSON.parse(existing.categoryData)[category]?.completed))
        : ((existing?.progress ?? 0) < 100 && progressValue >= 100);

    if (shouldAwardPoints) {
        // Get the activity to determine type
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { type: true, title: true, content: true, ui: true }
        });

        let points = 5; // Default fallback points
        if (activity) {
            points = getActivityPoints(activity.type, activity);

            // Special handling for numbers game - award difficulty-based points per category
            if (resolveActivityGameUi(activity) === 'numbers') {
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
        await updateStreak(userId, points);
        await checkAndAwardAchievements(userId);
    }

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
}
