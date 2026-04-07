import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ANIMAL_GROUPS } from "@/lib/writing-session";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");

    if (!activityId) {
        return NextResponse.json({ error: "activityId required" }, { status: 400 });
    }

    // Find which classes this user is associated with
    let classIds: string[] = [];
    if ((session.user as { role: string }).role === "teacher") {
        const classes = await prisma.class.findMany({ where: { teacherId: userId }, select: { id: true } });
        classIds = classes.map((c) => c.id);
    } else {
        const enrollments = await prisma.classEnrollment.findMany({ where: { studentId: userId }, select: { classId: true } });
        classIds = enrollments.map((e) => e.classId);
    }

    const activeSession = await prisma.writingSession.findFirst({
        where: {
            activityId,
            classId: { in: classIds },
            status: { not: "finished" },
        },
        orderBy: { createdAt: "desc" },
    });

    if (!activeSession) {
        return NextResponse.json({ session: null });
    }

    // Find the student's group if they are a student
    const role = (session.user as { role: string }).role;
    let myGroup: { id: string; animalName: string; colorHex: string } | null = null;
    if (role === "student") {
        const membership = await prisma.writingGroupMember.findFirst({
            where: { studentId: userId, group: { sessionId: activeSession.id } },
            include: { group: true },
        });
        if (membership) {
            myGroup = {
                id: membership.group.id,
                animalName: membership.group.animalName,
                colorHex: membership.group.colorHex,
            };
        }
    }

    const animal = ANIMAL_GROUPS.find((a) => a.name === myGroup?.animalName);

    return NextResponse.json({
        session: {
            id: activeSession.id,
            status: activeSession.status,
            myGroup: myGroup ? { ...myGroup, emoji: animal?.emoji ?? "✏️" } : null,
        },
    });
}
