import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { buildCalendarWeekActivity, getCalendarWeekStart } from "@/lib/gamification/calendar-week";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { ApiErrors, handleApiError } from "@/lib/api/response";

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
        const calendarWeekStart = getCalendarWeekStart(now);

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
                                createdAt: { gte: calendarWeekStart },
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
                                createdAt: { gte: calendarWeekStart },
                            },
                            select: { createdAt: true },
                        })
                    )
            ),
        ]);

        const sevenDayActivity = buildCalendarWeekActivity(recentLedgerEntries, now);

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
