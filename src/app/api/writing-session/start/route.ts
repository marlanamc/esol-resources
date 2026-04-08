import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role: string }).role;
    if (role !== "teacher") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json() as { activityId?: string; classId?: string };
    const { activityId, classId } = body;

    if (!activityId || !classId) {
        return NextResponse.json({ error: "activityId and classId are required" }, { status: 400 });
    }

    // Verify teacher owns this class
    const cls = await prisma.class.findFirst({ where: { id: classId, teacherId: userId } });
    if (!cls) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    // Verify activity exists and is released
    const activity = await prisma.activity.findFirst({ where: { id: activityId, deletedAt: null } });
    if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    if (!activity.isReleased) return NextResponse.json({ error: "This activity is not released yet." }, { status: 403 });

    // Mark any existing active sessions for this activity+class as finished
    await prisma.writingSession.updateMany({
        where: { activityId, classId, status: { not: "finished" } },
        data: { status: "finished" },
    });

    // Create session — groups are assigned dynamically as students join
    const writingSession = await prisma.writingSession.create({
        data: {
            activityId,
            classId,
            teacherId: userId,
            status: "waiting",
        },
    });

    return NextResponse.json({ sessionId: writingSession.id });
}
