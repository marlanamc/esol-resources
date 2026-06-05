import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";

interface Params { params: Promise<{ id: string }> }

export async function POST(_request: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    if (!canUseTeacherTools(session.user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id: sessionId } = await params;

    const ws = await prisma.writingSession.findUnique({ where: { id: sessionId } });
    if (!ws) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (!isAdmin(session.user) && ws.teacherId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.writingSession.update({
        where: { id: sessionId },
        data: { status: "finished" },
    });

    return NextResponse.json({ ok: true });
}
