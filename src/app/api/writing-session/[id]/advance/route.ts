import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chunkIntoGroups, ANIMAL_GROUPS, SESSION_POINTS } from "@/lib/writing-session";
import { awardPoints, type DbClient } from "@/lib/gamification";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";
import { handleApiError } from "@/lib/api-response";

interface Params { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
    try {
        return await handlePost(request, { params });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to advance writing session",
            path: "/api/writing-session/[id]/advance",
        });
    }
}

async function handlePost(request: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    if (!canUseTeacherTools(session.user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id: sessionId } = await params;

    const ws = await prisma.writingSession.findUnique({
        where: { id: sessionId },
        include: {
            groups: { include: { members: true } },
            activity: true,
        },
    });

    if (!ws) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (!isAdmin(session.user) && ws.teacherId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => ({})) as {
        action?: "extend" | "skip";
        extendSeconds?: number;
        timerSeconds?: number;
        promptText?: string;
        promptImageUrl?: string;
    };
    const { action, extendSeconds } = body;

    // ── Out-of-band actions (extend timer, skip round) ─────────────────────

    if (action === "extend") {
        if (ws.status !== "writing") {
            return NextResponse.json({ error: "Can only extend timer during writing phase" }, { status: 400 });
        }
        const seconds = extendSeconds && extendSeconds > 0 ? extendSeconds : 120;
        const baseTime = ws.timerEndsAt ?? new Date();
        const newEndsAt = new Date(baseTime.getTime() + seconds * 1000);
        await prisma.writingSession.update({ where: { id: sessionId }, data: { timerEndsAt: newEndsAt } });
        return NextResponse.json({ timerEndsAt: newEndsAt.toISOString() });
    }

    if (action === "skip") {
        if (ws.status !== "writing" && ws.status !== "group-vote") {
            return NextResponse.json({ error: "Can only skip during writing or voting phase" }, { status: 400 });
        }
        let totalPrompts = 1;
        try {
            const parsed = JSON.parse(ws.activity.content) as { prompts?: unknown[] };
            if (Array.isArray(parsed.prompts)) totalPrompts = parsed.prompts.length;
        } catch { /* use default */ }

        const nextRound = ws.currentRound + 1;
        if (nextRound >= totalPrompts) {
            await prisma.writingSession.update({ where: { id: sessionId }, data: { status: "finished", timerEndsAt: null } });
            return NextResponse.json({ status: "finished" });
        }
        await prisma.writingSession.update({ where: { id: sessionId }, data: { status: "waiting", currentRound: nextRound, timerEndsAt: null } });
        return NextResponse.json({ status: "waiting", currentRound: nextRound });
    }

    // ── State machine ──────────────────────────────────────────────────────

    if (ws.status === "waiting") {
        const { timerSeconds = 300, promptText, promptImageUrl } = body;
        if (!promptText) return NextResponse.json({ error: "promptText required" }, { status: 400 });

        // Wrap entirely in a transaction so the round creation (unique on sessionId+roundIndex)
        // acts as a concurrency lock — double-clicks / retries get a constraint error on the
        // second write before any groups are created, preventing duplicate group memberships.
        let round: { id: string };
        try {
            round = await prisma.$transaction(async (tx) => {
                // Create the round first — unique constraint prevents concurrent duplicates
                const newRound = await tx.writingRound.create({
                    data: {
                        sessionId,
                        roundIndex: ws.currentRound,
                        promptText,
                        promptImageUrl: promptImageUrl ?? null,
                    },
                });

                // Only assign groups when none exist yet (first round).
                // For round 2+ the groups persist across rounds; do not recreate them.
                const existingGroupCount = await tx.writingGroup.count({ where: { sessionId } });
                if (existingGroupCount === 0) {
                    const checkIns = await tx.writingSessionCheckIn.findMany({
                        where: { sessionId },
                        select: { studentId: true },
                    });
                    if (checkIns.length > 0) {
                        const studentIds = checkIns.map((c) => c.studentId);
                        const groupChunks = chunkIntoGroups(studentIds);
                        const animals = ANIMAL_GROUPS.slice(0, groupChunks.length);
                        for (let i = 0; i < groupChunks.length; i++) {
                            const animal = animals[i];
                            const group = await tx.writingGroup.create({
                                data: { sessionId, animalName: animal.name, colorHex: animal.color },
                            });
                            await tx.writingGroupMember.createMany({
                                data: groupChunks[i].map((sid) => ({ groupId: group.id, studentId: sid })),
                            });
                        }
                    }
                }

                await tx.writingSession.update({
                    where: { id: sessionId },
                    data: {
                        status: "writing",
                        timerEndsAt: new Date(Date.now() + timerSeconds * 1000),
                    },
                });

                return newRound;
            });
        } catch (err: unknown) {
            // Unique constraint violation means a concurrent request already created this round
            const isUniqueViolation =
                err instanceof Error && err.message.includes("Unique constraint");
            if (isUniqueViolation) {
                return NextResponse.json({ error: "Round already started" }, { status: 409 });
            }
            throw err;
        }

        return NextResponse.json({ status: "writing", roundId: round.id });
    }

    if (ws.status === "writing") {
        // Advance to group-vote
        const round = await prisma.writingRound.findFirst({
            where: { sessionId, roundIndex: ws.currentRound },
        });
        if (!round) return NextResponse.json({ error: "Round not found" }, { status: 500 });

        // Auto-submit blank for any students who haven't written
        const existingSubmissions = await prisma.writingSubmission.findMany({
            where: { roundId: round.id },
            select: { studentId: true },
        });
        const submittedIds = new Set(existingSubmissions.map((s) => s.studentId));

        const missingStudents = ws.groups.flatMap((g) =>
            g.members
                .filter((m) => !submittedIds.has(m.studentId))
                .map((m) => ({ studentId: m.studentId, groupId: g.id }))
        );

        if (missingStudents.length > 0) {
            await prisma.writingSubmission.createMany({
                data: missingStudents.map((s) => ({
                    roundId: round.id,
                    groupId: s.groupId,
                    studentId: s.studentId,
                    text: "",
                    wordCount: 0,
                })),
            });
        }

        await prisma.writingSession.update({
            where: { id: sessionId },
            data: { status: "group-vote", timerEndsAt: null },
        });

        return NextResponse.json({ status: "group-vote" });
    }

    if (ws.status === "group-vote") {
        // Advance to class-vote: compute group winners
        const round = await prisma.writingRound.findFirst({
            where: { sessionId, roundIndex: ws.currentRound },
            include: {
                submissions: { include: { groupVotes: true, group: true } },
            },
        });
        if (!round) return NextResponse.json({ error: "Round not found" }, { status: 500 });

        // For each group, find the submission with most votes (tie-break: wordCount)
        const byGroup = new Map<string, typeof round.submissions>();
        for (const sub of round.submissions) {
            const arr = byGroup.get(sub.groupId) ?? [];
            arr.push(sub);
            byGroup.set(sub.groupId, arr);
        }

        const winnerIds: string[] = [];
        for (const subs of byGroup.values()) {
            const winner = subs.reduce((best, sub) => {
                const bestVotes = best.groupVotes.length;
                const subVotes = sub.groupVotes.length;
                if (subVotes > bestVotes) return sub;
                if (subVotes === bestVotes && sub.wordCount > best.wordCount) return sub;
                return best;
            });
            // Only mark as winner if they actually wrote something
            if (winner.wordCount > 0) winnerIds.push(winner.id);
        }

        await prisma.writingSubmission.updateMany({
            where: { id: { in: winnerIds } },
            data: { isGroupWinner: true },
        });

        await prisma.writingSession.update({
            where: { id: sessionId },
            data: { status: "class-vote" },
        });

        return NextResponse.json({ status: "class-vote" });
    }

    if (ws.status === "class-vote") {
        // Advance to results: compute class winner + award points
        const round = await prisma.writingRound.findFirst({
            where: { sessionId, roundIndex: ws.currentRound },
            include: {
                submissions: {
                    include: {
                        classVotes: true,
                        groupVotes: true,
                        group: true,
                    },
                },
            },
        });
        if (!round) return NextResponse.json({ error: "Round not found" }, { status: 500 });

        // Find class winner (group winner with most class votes)
        const groupWinners = round.submissions.filter((s) => s.isGroupWinner);
        const classWinner = groupWinners.reduce<typeof groupWinners[0] | null>((best, sub) => {
            if (!best) return sub;
            if (sub.classVotes.length > best.classVotes.length) return sub;
            if (sub.classVotes.length === best.classVotes.length && sub.wordCount > best.wordCount) return sub;
            return best;
        }, null);

        // Award points to all participants
        const allSubmissions = round.submissions.filter((s) => s.wordCount > 0);
        const classWinnerGroupId = classWinner?.groupId;

        // Award points + flip status to "results" atomically. An advisory lock
        // serialises concurrent advance calls (teacher double-click, network
        // retry); the status recheck inside the lock guarantees the award loop
        // runs exactly once, so a whole class isn't double-awarded.
        await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${sessionId}), hashtext('writing-session-advance'))`;

            const fresh = await tx.writingSession.findUnique({
                where: { id: sessionId },
                select: { status: true },
            });
            // Another request already advanced past class-vote — points are done.
            if (!fresh || fresh.status !== "class-vote") return;

            for (const sub of allSubmissions) {
                let pts = SESSION_POINTS.PARTICIPATION;
                if (sub.isGroupWinner) pts += SESSION_POINTS.GROUP_WINNER;
                if (classWinnerGroupId && sub.groupId === classWinnerGroupId) pts += SESSION_POINTS.CLASS_WINNER;
                if (pts > 0) {
                    await awardPoints(sub.studentId, pts, "writing_session", "award", tx as unknown as DbClient);
                }
            }

            await tx.writingSession.update({
                where: { id: sessionId },
                data: { status: "results" },
            });
        }, { timeout: 20000 });

        return NextResponse.json({ status: "results" });
    }

    if (ws.status === "results") {
        // Either start next round or finish
        // Parse activity content to know how many prompts
        let totalPrompts = 1;
        try {
            const parsed = JSON.parse(ws.activity.content) as { prompts?: unknown[] };
            if (Array.isArray(parsed.prompts)) totalPrompts = parsed.prompts.length;
        } catch { /* use default */ }

        const nextRound = ws.currentRound + 1;
        if (nextRound >= totalPrompts) {
            // All prompts done — finish session
            await prisma.writingSession.update({
                where: { id: sessionId },
                data: { status: "finished" },
            });
            return NextResponse.json({ status: "finished" });
        }

        // Move to next round (back to waiting so teacher starts it)
        await prisma.writingSession.update({
            where: { id: sessionId },
            data: { status: "waiting", currentRound: nextRound },
        });

        return NextResponse.json({ status: "waiting", currentRound: nextRound });
    }

    return NextResponse.json({ error: `Cannot advance from status: ${ws.status}` }, { status: 400 });
}
