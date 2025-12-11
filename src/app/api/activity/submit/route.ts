import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/gamification";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activityId, content, score, points, assignmentId } = await request.json();

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Create or update submission
    const submission = await prisma.submission.upsert({
        where: assignmentId ? {
            userId_activityId_assignmentId: {
                userId,
                activityId,
                assignmentId: assignmentId || '',
            },
        } : {
            userId_activityId_assignmentId: {
                userId,
                activityId,
                assignmentId: '', // Empty string for non-assignment submissions
            },
        },
        create: {
            userId,
            activityId,
            assignmentId: assignmentId || null,
            content: JSON.stringify(content),
            score: score || null,
            pointsAwarded: points || 0,
            status: 'submitted',
            completedAt: new Date(),
        },
        update: {
            content: JSON.stringify(content),
            score: score || null,
            pointsAwarded: points || 0,
            status: 'submitted',
            completedAt: new Date(),
        },
    });

    // Update activity progress to completed
    await (prisma.activityProgress as any).upsert({
        where: {
            userId_activityId: {
                userId,
                activityId,
            },
        },
        create: {
            userId,
            activityId,
            progress: 100,
            status: 'completed',
        },
        update: {
            progress: 100,
            status: 'completed',
        },
    });

    // Award points if provided
    if (points && typeof points === 'number') {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { title: true }
        });

        await awardPoints(
            userId,
            points,
            `Completed: ${activity?.title || activityId}`
        );
    }

    return NextResponse.json({
        ok: true,
        submissionId: submission.id,
        score: submission.score,
        points: submission.pointsAwarded
    });
}
