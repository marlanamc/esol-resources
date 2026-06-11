import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ANIMAL_GROUPS } from "@/lib/writing-session";
import { handleApiError } from "@/lib/api-response";

interface Params { params: Promise<{ id: string }> }

// Assign a late-joining student to an existing group (after the round has already started).
async function autoAssignGroup(sessionId: string, userId: string): Promise<{ id: string; animalName: string; colorHex: string }> {
    return prisma.$transaction(async (tx) => {
        const existing = await tx.writingGroupMember.findFirst({
            where: { studentId: userId, group: { sessionId } },
            include: { group: true },
        });
        if (existing) return existing.group;

        const groups = await tx.writingGroup.findMany({
            where: { sessionId },
            include: { members: true },
            orderBy: { id: "asc" },
        });

        const available = groups.find((g) => g.members.length < 4) ?? null;
        if (available) {
            await tx.writingGroupMember.create({ data: { groupId: available.id, studentId: userId } });
            return { id: available.id, animalName: available.animalName, colorHex: available.colorHex };
        }

        const usedNames = new Set(groups.map((g) => g.animalName));
        const nextAnimal = ANIMAL_GROUPS.find((a) => !usedNames.has(a.name));
        if (nextAnimal) {
            const newGroup = await tx.writingGroup.create({
                data: { sessionId, animalName: nextAnimal.name, colorHex: nextAnimal.color },
            });
            await tx.writingGroupMember.create({ data: { groupId: newGroup.id, studentId: userId } });
            return { id: newGroup.id, animalName: newGroup.animalName, colorHex: newGroup.colorHex };
        }

        const lastGroup = groups[groups.length - 1];
        await tx.writingGroupMember.create({ data: { groupId: lastGroup.id, studentId: userId } });
        return { id: lastGroup.id, animalName: lastGroup.animalName, colorHex: lastGroup.colorHex };
    });
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        return await handleGet(request, { params });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to load writing session state",
            path: "/api/writing-session/[id]/state",
        });
    }
}

async function handleGet(_request: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;
    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role: string }).role;

    const ws = await prisma.writingSession.findUnique({
        where: { id: sessionId },
        include: {
            groups: { include: { members: { include: { student: { select: { id: true, name: true, username: true } } } } } },
            rounds: { orderBy: { roundIndex: "asc" } },
        },
    });

    if (!ws) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const currentRound = ws.rounds.find((r) => r.roundIndex === ws.currentRound) ?? null;

    // ── Teacher view ──────────────────────────────────────────────────────────
    if ((role === "teacher" || role === "admin") && ws.teacherId === userId) {
        const submittedCount = currentRound
            ? await prisma.writingSubmission.count({ where: { roundId: currentRound.id } })
            : 0;
        const totalCount = ws.groups.reduce((acc, g) => acc + g.members.length, 0);

        const groups = ws.groups.map((g) => {
            const animal = ANIMAL_GROUPS.find((a) => a.name === g.animalName);
            return {
                id: g.id,
                animalName: g.animalName,
                emoji: animal?.emoji ?? "✏️",
                colorHex: g.colorHex,
                members: g.members.map((m) => ({ id: m.student.id, name: m.student.name || m.student.username })),
            };
        });

        // During the initial lobby (no groups formed yet), return check-ins so teacher sees who's ready.
        // For round 2+ waiting, groups already exist — skip check-ins and show the group grid instead.
        let checkIns: { id: string; name: string }[] | undefined;
        if (ws.status === "waiting" && ws.groups.length === 0) {
            const rows = await prisma.writingSessionCheckIn.findMany({
                where: { sessionId },
                include: { student: { select: { id: true, name: true, username: true } } },
                orderBy: { joinedAt: "asc" },
            });
            checkIns = rows.map((r) => ({ id: r.student.id, name: r.student.name || r.student.username }));
        }

        return NextResponse.json({
            status: ws.status,
            currentRound: ws.currentRound,
            timerEndsAt: ws.timerEndsAt,
            totalRounds: ws.rounds.length > 0 ? Math.max(...ws.rounds.map((r) => r.roundIndex)) + 1 : 0,
            submittedCount,
            totalCount,
            groups,
            checkIns,
        });
    }

    // ── Student view ──────────────────────────────────────────────────────────

    // Only students enrolled in the session's class may check in or be grouped.
    const enrollment = await prisma.classEnrollment.findFirst({
        where: { classId: ws.classId, studentId: userId, status: "active" },
        select: { id: true },
    });
    if (!enrollment) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (ws.status === "finished") {
        return NextResponse.json({ error: "Session has ended" }, { status: 403 });
    }

    // During waiting, check if the student already has a group (round 2+)
    if (ws.status === "waiting") {
        const existingMembership = ws.groups
            .flatMap((g) => g.members.map((m) => ({ ...m, group: g })))
            .find((m) => m.student.id === userId);

        if (existingMembership) {
            // Between rounds — student knows their group already; skip check-in
            const animal = ANIMAL_GROUPS.find((a) => a.name === existingMembership.group.animalName);
            return NextResponse.json({
                status: "waiting",
                currentRound: ws.currentRound,
                timerEndsAt: null,
                myGroupName: existingMembership.group.animalName,
                myGroupColor: existingMembership.group.colorHex,
                myGroupEmoji: animal?.emoji ?? "✏️",
            });
        }

        // First-round lobby — record check-in, no group revealed yet
        await prisma.writingSessionCheckIn.upsert({
            where: { sessionId_studentId: { sessionId, studentId: userId } },
            create: { sessionId, studentId: userId },
            update: {},
        });
        return NextResponse.json({ status: "waiting", currentRound: ws.currentRound, timerEndsAt: null });
    }

    // For all other phases, the student needs a group assignment
    const existingMembership = ws.groups
        .flatMap((g) => g.members.map((m) => ({ ...m, group: g })))
        .find((m) => m.student.id === userId);

    let myGroup: { id: string; animalName: string; colorHex: string };

    if (existingMembership) {
        myGroup = existingMembership.group;
    } else {
        // Late joiner — assign them to an existing group
        myGroup = await autoAssignGroup(sessionId, userId);
    }

    const animal = ANIMAL_GROUPS.find((a) => a.name === myGroup.animalName);
    const myGroupId = myGroup.id;

    const base = {
        status: ws.status,
        currentRound: ws.currentRound,
        timerEndsAt: ws.timerEndsAt,
        myGroupName: myGroup.animalName,
        myGroupColor: myGroup.colorHex,
        myGroupEmoji: animal?.emoji ?? "✏️",
    };

    if (!currentRound) return NextResponse.json(base);

    if (ws.status === "writing") {
        const [mySubmission, submittedCount] = await Promise.all([
            prisma.writingSubmission.findUnique({
                where: { roundId_studentId: { roundId: currentRound.id, studentId: userId } },
            }),
            prisma.writingSubmission.count({ where: { roundId: currentRound.id } }),
        ]);
        const totalCount = ws.groups.reduce((acc, g) => acc + g.members.length, 0);
        return NextResponse.json({
            ...base,
            promptText: currentRound.promptText,
            promptImageUrl: currentRound.promptImageUrl,
            mySubmission: mySubmission ? { text: mySubmission.text } : null,
            submittedCount,
            totalCount,
        });
    }

    if (ws.status === "group-vote") {
        const teamSubmissions = await prisma.writingSubmission.findMany({
            where: { roundId: currentRound.id, groupId: myGroupId, studentId: { not: userId } },
            select: { id: true, text: true, wordCount: true },
        });
        const myVote = await prisma.writingGroupVote.findUnique({
            where: { roundId_voterId: { roundId: currentRound.id, voterId: userId } },
        });
        return NextResponse.json({ ...base, teamSubmissions, myVote: myVote ? myVote.submissionId : null });
    }

    if (ws.status === "class-vote") {
        const groupWinners = await prisma.writingSubmission.findMany({
            where: { roundId: currentRound.id, isGroupWinner: true },
            include: { group: true },
            orderBy: { group: { animalName: "asc" } },
        });
        const myVote = await prisma.writingClassVote.findUnique({
            where: { roundId_voterId: { roundId: currentRound.id, voterId: userId } },
        });
        return NextResponse.json({
            ...base,
            groupWinners: groupWinners.map((s) => {
                const a = ANIMAL_GROUPS.find((a) => a.name === s.group.animalName);
                return { id: s.id, text: s.text, wordCount: s.wordCount, groupName: s.group.animalName, groupEmoji: a?.emoji ?? "✏️", groupColor: s.group.colorHex };
            }),
            myVote: myVote ? myVote.submissionId : null,
        });
    }

    if (ws.status === "results") {
        const classWinnerSub = await prisma.writingSubmission.findFirst({
            where: { roundId: currentRound.id, isGroupWinner: true },
            include: { group: true, classVotes: true },
            orderBy: { classVotes: { _count: "desc" } },
        });
        // Check if the current student's submission was voted group winner
        const myGroupWinnerSub = await prisma.writingSubmission.findFirst({
            where: { roundId: currentRound.id, studentId: userId, isGroupWinner: true },
            include: { groupVotes: true },
        });
        return NextResponse.json({
            ...base,
            classWinner: classWinnerSub
                ? {
                    text: classWinnerSub.text,
                    groupName: classWinnerSub.group.animalName,
                    groupEmoji: ANIMAL_GROUPS.find((a) => a.name === classWinnerSub.group.animalName)?.emoji ?? "✏️",
                }
                : null,
            isGroupWinner: !!myGroupWinnerSub,
            classVoteCount: classWinnerSub?.classVotes.length ?? 0,
            groupVoteCount: myGroupWinnerSub?.groupVotes.length ?? 0,
        });
    }

    return NextResponse.json(base);
}
