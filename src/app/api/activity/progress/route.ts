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

    const { activityId, progress = 100, status = progress >= 100 ? "completed" : "in_progress" } = await request.json();

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

    // Award a small amount of points the first time this activity reaches 100%
    if ((existing?.progress ?? 0) < 100 && value >= 100) {
        await awardPoints(userId, 1, `Completed activity ${activityId}`);
    }

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
}



