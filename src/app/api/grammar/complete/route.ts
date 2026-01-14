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

    const { slug } = await request.json();
    if (!slug || typeof slug !== "string") {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const reason = `grammar:${slug}`;

    const existing = await prisma.pointsLedger.findFirst({
        where: {
            userId,
            reason,
        },
    });

    if (existing) {
        return NextResponse.json({ ok: true, awarded: false });
    }

    const points = determineGrammarCompletionPoints();
    await awardPoints(userId, points, reason);

    // Update streak and check for achievements
    await updateStreak(userId, points);
    await checkAndAwardAchievements(userId);

    return NextResponse.json({ ok: true, awarded: true, points });
}


