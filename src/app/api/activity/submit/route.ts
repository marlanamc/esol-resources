import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements, calculateQuizPoints, getActivityPoints } from "@/lib/gamification";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SECURITY: Never trust points from client - calculate server-side only
    const { activityId, content, score, assignmentId } = await request.json();

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Fetch activity to calculate points server-side
    const activity = await prisma.activity.findUnique({
        where: { id: activityId },
        select: { title: true, type: true, id: true, content: true, ui: true }
    });

    if (!activity) {
        return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Calculate points SERVER-SIDE based on activity type and score
    // NEVER trust points from client request
    const calculatedPoints = activity.type.toLowerCase() === 'quiz'
        ? calculateQuizPoints(score)
        : getActivityPoints(activity.type, activity);

    // Create or update submission
    const submission = await prisma.submission.upsert({
        where: {
            userId_activityId_assignmentId: {
                userId,
                activityId,
                assignmentId: assignmentId || null, // Use null for non-assignment submissions
            },
        },
        create: {
            userId,
            activityId,
            assignmentId: assignmentId || null,
            content: JSON.stringify(content),
            score: score || null,
            pointsAwarded: calculatedPoints,
            status: 'submitted',
            completedAt: new Date(),
        },
        update: {
            content: JSON.stringify(content),
            score: score || null,
            pointsAwarded: calculatedPoints,
            status: 'submitted',
            completedAt: new Date(),
        },
    });

    // Update activity progress to completed
    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
    const progressWhere = {
        userId,
        activityId,
        assignmentId: assignmentKey,
    };
    const existingProgress = await prisma.activityProgress.findFirst({
        where: progressWhere,
    });

    if (existingProgress) {
        await prisma.activityProgress.update({
        where: { id: existingProgress.id },
            data: {
                progress: 100,
                status: 'completed',
            },
        });
    } else {
        await prisma.activityProgress.create({
            data: {
                userId,
                activityId,
                assignmentId: typeof assignmentId === "string" ? assignmentId : null,
                progress: 100,
                status: 'completed',
            },
        });
    }

    // Award points (calculated server-side)
    if (calculatedPoints > 0) {
        await awardPoints(
            userId,
            calculatedPoints,
            `Completed: ${activity.title || activityId}`
        );

        // Update streak and check for achievements
        await updateStreak(userId, calculatedPoints);
        await checkAndAwardAchievements(userId);
    }

    return NextResponse.json({
        ok: true,
        submissionId: submission.id,
        score: submission.score,
        points: calculatedPoints
    });
}
