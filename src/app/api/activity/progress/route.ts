import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, getActivityPoints, POINTS } from "@/lib/gamification";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activityId, progress = 100, status = progress >= 100 ? "completed" : "in_progress", accuracy } = await request.json();

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const value = typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    const userId = (session.user as any).id;

    const existing = await prisma.activityProgress.findUnique({
        where: {
            userId_activityId: {
                userId,
                activityId,
            },
        },
    });

    const record = await prisma.activityProgress.upsert({
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
        },
        update: {
            progress: value,
            status,
        },
    });

    // Award points based on activity type the first time this activity reaches 100%
    if ((existing?.progress ?? 0) < 100 && value >= 100) {
        // Get the activity to determine type
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { type: true, title: true, content: true }
        });

        if (activity) {
            let points = getActivityPoints(activity.type, activityId);
            
            // Special handling for numbers game - award accuracy-based bonus
            if (activityId === 'numbers-game' || activityId?.includes('numbers-game')) {
                const basePoints = POINTS.NUMBERS_GAME;
                let bonusPoints = 0;
                
                // Award accuracy-based bonus if accuracy is provided
                if (typeof accuracy === 'number') {
                    if (accuracy === 100) {
                        bonusPoints = POINTS.NUMBERS_GAME_PERFECT; // +10 for perfect score
                    } else if (accuracy >= 90) {
                        bonusPoints = POINTS.NUMBERS_GAME_HIGH; // +5 for 90%+
                    }
                } else {
                    // Fallback: if no accuracy provided but completed, award perfect bonus
                    bonusPoints = POINTS.NUMBERS_GAME_PERFECT;
                }
                
                points = basePoints + bonusPoints;
            }
            
            await awardPoints(userId, points, `Completed: ${activity.title}`);
        } else {
            // Fallback if activity not found (shouldn't happen)
            await awardPoints(userId, 5, `Completed activity ${activityId}`);
        }
    }

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
}



