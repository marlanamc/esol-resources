import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { buildCalendarWeekActivity, getCalendarWeekStart } from "@/lib/gamification/calendar-week";

export interface StudentMomentumSnapshot {
    initialStreak: number;
    initialLongestStreak: number;
    initialSevenDayActivity: boolean[];
    initialTotalPoints: number;
}

export async function getStudentMomentumSnapshot(
    userId: string
): Promise<StudentMomentumSnapshot> {
    const calendarWeekStart = getCalendarWeekStart();

    const [userStats, ledgerEntries] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.user.findUnique({
                where: { id: userId },
                select: { currentStreak: true, longestStreak: true, points: true },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.pointsLedger.findMany({
                where: { userId, createdAt: { gte: calendarWeekStart } },
                select: { createdAt: true },
            })
        ),
    ]);

    return {
        initialStreak: userStats?.currentStreak ?? 0,
        initialLongestStreak: userStats?.longestStreak ?? 0,
        initialSevenDayActivity: buildCalendarWeekActivity(ledgerEntries),
        initialTotalPoints: userStats?.points ?? 0,
    };
}
