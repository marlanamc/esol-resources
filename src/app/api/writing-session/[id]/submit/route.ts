import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countWords } from "@/lib/writing-session";
import { handleApiError } from "@/lib/api-response";

interface Params { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
    try {
        return await handlePost(request, { params });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to save submission",
            path: "/api/writing-session/[id]/submit",
        });
    }
}

async function handlePost(request: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const { id: sessionId } = await params;

    const body = await request.json().catch(() => ({})) as { text?: string };
    const rawText = typeof body.text === "string" ? body.text : "";
    const text = rawText.slice(0, 5000);
    if (rawText.length > 5000) {
        return NextResponse.json({ error: "Submission exceeds 5 000 character limit" }, { status: 400 });
    }

    const ws = await prisma.writingSession.findUnique({
        where: { id: sessionId },
        include: { groups: { include: { members: true } } },
    });

    if (!ws) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (ws.status !== "writing") return NextResponse.json({ error: "Session is not in writing phase" }, { status: 400 });

    // Find student's group
    const membership = ws.groups
        .flatMap((g) => g.members.map((m) => ({ ...m, group: g })))
        .find((m) => m.studentId === userId);

    if (!membership) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    const round = await prisma.writingRound.findFirst({
        where: { sessionId, roundIndex: ws.currentRound },
    });
    if (!round) return NextResponse.json({ error: "Round not found" }, { status: 500 });

    const wc = countWords(text);
    await prisma.writingSubmission.upsert({
        where: { roundId_studentId: { roundId: round.id, studentId: userId } },
        create: {
            roundId: round.id,
            groupId: membership.group.id,
            studentId: userId,
            text,
            wordCount: wc,
        },
        update: { text, wordCount: wc },
    });

    return NextResponse.json({ ok: true });
}
