import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";

export async function GET() {
    const requestId = crypto.randomUUID();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user.role ?? "student";

        const user = await timedQuery(
            {
                route: "/api/dashboard/student-summary",
                queryLabel: "user.findUnique.studentSummary",
                userRole,
                requestId,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.user.findUnique({
                        where: { id: session.user.id },
                        select: {
                            points: true,
                            currentStreak: true,
                            lastActivityDate: true,
                        },
                    })
                )
        );

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyPointsData = await timedQuery(
            {
                route: "/api/dashboard/student-summary",
                queryLabel: "pointsLedger.aggregate.weeklyPoints",
                userRole,
                requestId,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.pointsLedger.aggregate({
                        where: {
                            userId: session.user.id,
                            createdAt: { gte: oneWeekAgo },
                        },
                        _sum: { points: true },
                    })
                )
        );

        return NextResponse.json({
            totalPoints: user?.points ?? 0,
            effectiveCurrentStreak: getEffectiveStreak(user?.currentStreak ?? 0, user?.lastActivityDate ?? null),
            actualWeeklyPoints: weeklyPointsData._sum.points ?? 0,
        });
    } catch (error) {
        console.error("Failed to load student dashboard summary", error);
        return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
    }
}
