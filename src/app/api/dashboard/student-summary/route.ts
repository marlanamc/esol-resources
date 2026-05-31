import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { ApiErrors, handleApiError } from "@/lib/api-response";

export async function GET() {
    const requestId = crypto.randomUUID();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ApiErrors.unauthorized();
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

        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [weeklyPointsData, recentLedgerEntries] = await Promise.all([
            timedQuery(
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
            ),
            timedQuery(
                {
                    route: "/api/dashboard/student-summary",
                    queryLabel: "pointsLedger.findMany.sevenDayActivity",
                    userRole,
                    requestId,
                },
                () =>
                    withPrismaReadRetry(() =>
                        prisma.pointsLedger.findMany({
                            where: {
                                userId: session.user.id,
                                createdAt: { gte: oneWeekAgo },
                                points: { gt: 0 },
                            },
                            select: { createdAt: true },
                        })
                    )
            ),
        ]);

        // Build a 7-element boolean array for the rolling week ending today (index 0 = 6 days ago, index 6 = today)
        const activeDates = new Set(
            recentLedgerEntries.map((e: { createdAt: Date }) => {
                const d = new Date(e.createdAt);
                return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
            })
        );
        const sevenDayActivity: boolean[] = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now);
            d.setDate(d.getDate() - (6 - i));
            return activeDates.has(`${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`);
        });

        return NextResponse.json({
            totalPoints: user?.points ?? 0,
            effectiveCurrentStreak: getEffectiveStreak(user?.currentStreak ?? 0, user?.lastActivityDate ?? null),
            actualWeeklyPoints: weeklyPointsData._sum.points ?? 0,
            sevenDayActivity,
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to load student dashboard summary",
        });
    }
}
