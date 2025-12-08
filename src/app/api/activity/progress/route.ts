import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const record = await prisma.activityProgress.upsert({
        where: {
            userId_activityId: {
                userId: (session.user as any).id,
                activityId,
            },
        },
        create: {
            userId: (session.user as any).id,
            activityId,
            progress: value,
            status,
        },
        update: {
            progress: value,
            status,
        },
    });

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
}


