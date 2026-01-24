import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements } from "@/lib/gamification";
import { determineGrammarCompletionPoints } from "@/lib/gamification/grammar-points";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, score, total, activityId } = await request.json();
    if (!slug || typeof slug !== "string") {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const reason = `grammar:${slug}`;

    // 1. Record the quiz score if provided
    if (score !== undefined && total !== undefined) {
        const percentage = Math.round((score / total) * 100);
        
        // We use upsert here to maintain compatibility with the current unique constraint.
        // This will store the LATEST score for the student.
        await prisma.submission.upsert({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId: activityId || slug,
                    assignmentId: null as any
                }
            },
            update: {
                score: percentage,
                content: JSON.stringify({ type: 'mini-quiz', score, total, slug }),
                status: 'submitted',
                completedAt: new Date()
            },
            create: {
                userId,
                activityId: activityId || slug,
                assignmentId: null,
                score: percentage,
                content: JSON.stringify({ type: 'mini-quiz', score, total, slug }),
                status: 'submitted',
                completedAt: new Date()
            }
        });
    }

    // 2. Award points (only once)
    const existing = await prisma.pointsLedger.findFirst({
        where: {
            userId,
            reason,
        },
    });

    if (existing) {
        return NextResponse.json({ ok: true, awarded: false, scoreRecorded: score !== undefined });
    }

    const points = determineGrammarCompletionPoints();
    await awardPoints(userId, points, reason);

    // Update streak and check for achievements
    await updateStreak(userId, points);
    await checkAndAwardAchievements(userId);

    return NextResponse.json({ ok: true, awarded: true, points, scoreRecorded: score !== undefined });
}


