import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { handleApiError } from "@/lib/api/response";

interface Params { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
    try {
        return await handlePost(request, { params });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to record vote",
            path: "/api/writing-session/[id]/vote",
        });
    }
}

async function handlePost(request: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const { id: sessionId } = await params;

    const body = await request.json().catch(() => ({})) as { submissionId?: string; voteType?: string };
    const { submissionId, voteType } = body;

    if (!submissionId || !voteType) {
        return NextResponse.json({ error: "submissionId and voteType required" }, { status: 400 });
    }
    if (voteType !== "group" && voteType !== "class") {
        return NextResponse.json({ error: "voteType must be 'group' or 'class'" }, { status: 400 });
    }

    const ws = await prisma.writingSession.findUnique({ where: { id: sessionId } });
    if (!ws) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    // Only session participants (group members) may vote
    const voterMembership = await prisma.writingGroupMember.findFirst({
        where: { studentId: userId, group: { sessionId } },
        select: { groupId: true },
    });
    if (!voterMembership) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    const expectedStatus = voteType === "group" ? "group-vote" : "class-vote";
    if (ws.status !== expectedStatus) {
        return NextResponse.json({ error: `Session is not in ${expectedStatus} phase` }, { status: 400 });
    }

    // Verify submission exists in the current round
    const round = await prisma.writingRound.findFirst({
        where: { sessionId, roundIndex: ws.currentRound },
    });
    if (!round) return NextResponse.json({ error: "Round not found" }, { status: 500 });

    const submission = await prisma.writingSubmission.findFirst({
        where: { id: submissionId, roundId: round.id },
    });
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    // Can't vote for own writing
    if (submission.studentId === userId) {
        return NextResponse.json({ error: "Cannot vote for your own writing" }, { status: 400 });
    }

    // Group votes stay within your own group; class votes exclude your own group
    if (voteType === "group" && submission.groupId !== voterMembership.groupId) {
        return NextResponse.json({ error: "Can only vote within your own group" }, { status: 400 });
    }
    if (voteType === "class" && submission.groupId === voterMembership.groupId) {
        return NextResponse.json({ error: "Cannot vote for your own group" }, { status: 400 });
    }

    if (voteType === "group") {
        await prisma.writingGroupVote.upsert({
            where: { roundId_voterId: { roundId: round.id, voterId: userId } },
            create: { roundId: round.id, voterId: userId, submissionId },
            update: { submissionId },
        });
    } else {
        await prisma.writingClassVote.upsert({
            where: { roundId_voterId: { roundId: round.id, voterId: userId } },
            create: { roundId: round.id, voterId: userId, submissionId },
            update: { submissionId },
        });
    }

    return NextResponse.json({ ok: true });
}
