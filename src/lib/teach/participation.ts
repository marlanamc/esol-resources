import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { isLeaderboardExcludedUser } from "@/lib/gamification/leaderboard-filter";
import { latestActivityDate } from "./participation-status";

/** Match the existing Reports population and its three last-activity signals. */
export async function getClassParticipation(classId: string) {
    const enrollments = await withPrismaReadRetry(() =>
        prisma.classEnrollment.findMany({
            where: {
                classId,
                status: "active",
                student: {
                    isSystemAccount: false,
                },
            },
            select: {
                joinedAt: true,
                student: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        weeklyPoints: true,
                        lastActivityDate: true,
                        isSystemAccount: true,
                        excludeFromLeaderboard: true,
                    },
                },
            },
        }),
    );
    const ids = enrollments.map((e) => e.student.id);
    if (!ids.length) return [];
    const [ledger, progress, latestPractice] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.pointsLedger.groupBy({
                by: ["userId"],
                where: { userId: { in: ids } },
                _max: { createdAt: true },
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.activityProgress.groupBy({
                by: ["userId"],
                where: { userId: { in: ids } },
                _max: { updatedAt: true },
            }),
        ),
        withPrismaReadRetry(() =>
            prisma.activityProgress.findMany({
                where: { userId: { in: ids } },
                distinct: ["userId"],
                orderBy: { updatedAt: "desc" },
                select: { userId: true, activity: { select: { title: true } } },
            }),
        ),
    ]);
    const ledgerById = new Map(ledger.map((r) => [r.userId, r._max.createdAt]));
    const progressById = new Map(
        progress.map((r) => [r.userId, r._max.updatedAt]),
    );
    const practiceById = new Map(
        latestPractice.map((r) => [r.userId, r.activity.title]),
    );
    return enrollments.map(({ joinedAt, student }) => ({
        id: student.id,
        name: student.name,
        username: student.username,
        joinedAt,
        weeklyPoints: student.weeklyPoints,
        lastActive: latestActivityDate(
            student.lastActivityDate,
            ledgerById.get(student.id),
            progressById.get(student.id),
        ),
        recentPractice: practiceById.get(student.id) ?? null,
        excludedFromLeaderboard: isLeaderboardExcludedUser(student),
    }));
}
