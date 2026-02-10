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

    // First try to find with specific assignmentId
    let record = await prisma.activityProgress.findFirst({
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
        orderBy: {
            updatedAt: "desc",
        },
    });

    // Fallback: if assignment-specific progress doesn't exist, use the newest record for this activity.
    // This avoids stale/empty state when a vocab sub-activity saved under a different assignment context.
    if (!record) {
        record = await prisma.activityProgress.findFirst({
            where: {
                userId,
                activityId,
            },
            select: {
                progress: true,
                status: true,
                categoryData: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }

    return NextResponse.json({
        progress: record?.progress ?? 0,
        status: record?.status ?? "in_progress",
        categoryData: record?.categoryData ?? null,
        updatedAt: record?.updatedAt ?? null,
    }, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, progress = 100, status: statusInput, accuracy, category, assignmentId, guideState, vocabType } = body;

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
    // and guide resume state (grammar guides: last section index)
    let updatedCategoryData: string | undefined;
    let aggregatedNumbersProgress: number | undefined;
    const currentData: Record<string, unknown> = existing?.categoryData
        ? (() => {
            try {
                return JSON.parse(existing.categoryData) as Record<string, unknown>;
            } catch {
                return {};
            }
        })()
        : {};

    if (category) {
        // Update or add this category's progress
        currentData[category] = {
            completed: rawProgress >= 100,
            ...(sanitizedAccuracy !== undefined ? { accuracy: sanitizedAccuracy } : {}),
            completedAt: rawProgress >= 100 ? new Date().toISOString() : (currentData[category] as { completedAt?: string })?.completedAt,
            attempts: ((currentData[category] as { attempts?: number })?.attempts || 0) + 1
        };

        if (isNumbersGameCategoryName(category)) {
            aggregatedNumbersProgress = calculateNumbersGameCompletionPercentage(currentData as Record<string, { completed?: boolean; accuracy?: number }>);
        }
    }

    // Handle vocabulary type updates (word-list, flashcards, matching, fill-blank)
    if (vocabType) {
        const validVocabTypes = ['word-list', 'flashcards', 'matching', 'fill-blank'];
        if (validVocabTypes.includes(vocabType)) {
            currentData[vocabType] = {
                completed: rawProgress >= 100,
                progress: rawProgress,
                completedAt: rawProgress >= 100 ? new Date().toISOString() : (currentData[vocabType] as { completedAt?: string })?.completedAt,
            };

            // Calculate overall progress across all 4 vocab types
            let completedCount = 0;
            const completedTypes: string[] = [];
            for (const vType of validVocabTypes) {
                const typeData = currentData[vType] as { completed?: boolean } | undefined;
                if (typeData?.completed) {
                    completedCount++;
                    completedTypes.push(vType);
                }
            }
            aggregatedNumbersProgress = (completedCount / validVocabTypes.length) * 100;
        }
    }

    // Grammar guides: store last section index so the guide can open to the page the student left off on
    if (guideState != null && typeof guideState === "object" && typeof (guideState as { lastSectionIndex?: number }).lastSectionIndex === "number") {
        const lastSectionIndex = Math.max(0, Math.round((guideState as { lastSectionIndex: number }).lastSectionIndex));
        currentData._guide = { lastSectionIndex };
    }

    if (category || "_guide" in currentData || vocabType) {
        updatedCategoryData = JSON.stringify(currentData);
        console.log('[VOCAB DEBUG] Setting categoryData:', { vocabType, currentData, updatedCategoryData: updatedCategoryData.substring(0, 100) });
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
        console.log('[VOCAB DEBUG] Progress data includes categoryData:', Object.keys(progressData));
    } else {
        console.log('[VOCAB DEBUG] No categoryData to include in progressData');
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

    // For vocabulary activities with assignmentId, also sync to a global progress record
    if (vocabType && assignmentKey && updatedCategoryData) {
        try {
            // Find the global record (without assignmentId)
            const globalRecord = await prisma.activityProgress.findFirst({
                where: {
                    userId,
                    activityId,
                    assignmentId: null,
                },
            });

            if (globalRecord) {
                // Merge the categoryData - update this vocabType while preserving others
                const existingGlobalData = globalRecord.categoryData ?
                    (typeof globalRecord.categoryData === 'string' ? JSON.parse(globalRecord.categoryData) : globalRecord.categoryData) : {};
                const newData = typeof updatedCategoryData === 'string' ? JSON.parse(updatedCategoryData) : updatedCategoryData;

                // Merge: take the new data for this vocabType, keep existing for others
                const mergedData = { ...existingGlobalData, ...newData };

                // Calculate overall progress
                const vocabTypes = ['word-list', 'flashcards', 'matching', 'fill-blank'];
                const completedCount = vocabTypes.filter(vType => mergedData[vType]?.completed).length;
                const globalProgress = (completedCount / vocabTypes.length) * 100;
                const globalStatus = globalProgress >= 100 ? 'completed' : 'in_progress';

                await prisma.activityProgress.update({
                    where: { id: globalRecord.id },
                    data: {
                        categoryData: JSON.stringify(mergedData),
                        progress: globalProgress,
                        status: globalStatus,
                    },
                });
            } else {
                // Create new global record
                await prisma.activityProgress.create({
                    data: {
                        userId,
                        activityId,
                        assignmentId: null,
                        ...progressData,
                    },
                });
            }
        } catch (error) {
            // Log error but don't fail the main operation
            console.error('Failed to sync global vocabulary progress:', error);
        }
    }

    // Award points based on activity type
    // - For category-based activities WITH accuracy (Numbers Game), award per category completion
    // - For vocabulary types, award per type completion (once per type)
    // - For other activities (including Matching Game round tracking), award once when overall progress hits 100%
    const isAccuracyCategoryUpdate = category && sanitizedAccuracy !== undefined;
    const isVocabularyTypeUpdate = vocabType && ['word-list', 'flashcards', 'matching', 'fill-blank'].includes(vocabType);
    const existingCategoryData = existing?.categoryData ? JSON.parse(existing.categoryData) : {};
    const wasVocabTypeCompleted = isVocabularyTypeUpdate && existingCategoryData[vocabType]?.completed;

    const shouldAwardPoints = isVocabularyTypeUpdate
        ? (rawProgress >= 100 && !wasVocabTypeCompleted)
        : (isAccuracyCategoryUpdate
            ? (rawProgress >= 100 && updatedCategoryData && !(existingCategoryData[category]?.completed))
            : ((existing?.progress ?? 0) < 100 && progressValue >= 100));

    let pointsAwarded = 0;

    if (shouldAwardPoints) {
        // Get the activity to determine type
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { type: true, title: true, content: true, ui: true }
        });

        let points = 5; // Default fallback points
        if (activity) {
            // Determine activity type label for display
            let activityTypeLabel = '';

            // Special handling for vocabulary activities - award type-specific points
            if (activity.type === 'vocabulary' && isVocabularyTypeUpdate) {
                const vocabPoints: Record<string, number> = {
                    'word-list': 5,
                    'flashcards': 4,
                    'matching': 7,
                    'fill-blank': 5,
                };
                points = vocabPoints[vocabType] || 5;

                // Set type label for vocab activities
                const vocabTypeLabels: Record<string, string> = {
                    'word-list': 'Word List',
                    'flashcards': 'Flashcards',
                    'matching': 'Matching',
                    'fill-blank': 'Fill in the Blank',
                };
                activityTypeLabel = vocabTypeLabels[vocabType] || vocabType;
            } else {
                points = getActivityPoints(activity.type, activity);

                // Set type label for game activities
                const gameUi = resolveActivityGameUi(activity);
                const gameTypeLabels: Record<string, string> = {
                    'numbers': 'Numbers Game',
                    'matching': 'Matching Game',
                    'fill-in-blank': 'Fill in the Blank',
                    'flashcards': 'Flashcards',
                    'verb-forms': 'Verb Forms',
                    'word-list': 'Word List',
                };
                if (activity.type === 'game' && gameTypeLabels[gameUi]) {
                    activityTypeLabel = gameTypeLabels[gameUi];
                } else if (activity.type === 'guide') {
                    activityTypeLabel = 'Grammar Guide';
                }
            }

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
            } else if (resolveActivityGameUi(activity) === 'verb-forms') {
                // Determine difficulty based on category passed from client
                const difficulty = (category || 'medium').toLowerCase();
                let pointsPerVerb: number = POINTS.VERB_FORMS_MEDIUM;
                if (difficulty === 'easy') pointsPerVerb = POINTS.VERB_FORMS_EASY;
                if (difficulty === 'hard') pointsPerVerb = POINTS.VERB_FORMS_HARD;

                // Accuracy is items correct / total verbs (usually 10)
                const correctCount = Math.round((sanitizedAccuracy || 0) * 10 / 100);
                
                let sessionPoints = correctCount * pointsPerVerb;
                
                // Add bonus for perfection
                if (sanitizedAccuracy === 100) {
                    sessionPoints += POINTS.VERB_FORMS_BONUS;
                }
                
                points = sessionPoints;
            }

            // Include activity type in the reason for better display
            const reason = activityTypeLabel
                ? `${activity.title}|${activityTypeLabel}`
                : `Completed: ${activity.title}`;
            await awardPoints(userId, points, reason);
            pointsAwarded = points;
        } else {
            // Fallback if activity not found (shouldn't happen)
            await awardPoints(userId, 5, `Completed activity ${activityId}`);
            pointsAwarded = 5;
        }

        // Update streak and check for achievements after awarding points
        await updateStreak(userId, pointsAwarded);
        await checkAndAwardAchievements(userId);
    }

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status, pointsAwarded });
}
