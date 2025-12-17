import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/gamification";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, points = 1 } = await request.json();
    if (!slug || typeof slug !== "string") {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;
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

    await awardPoints(userId, points, reason);

    return NextResponse.json({ ok: true, awarded: true, points });
}




