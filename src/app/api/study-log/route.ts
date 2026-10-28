import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";
import { applyAwardChain } from "@/lib/gamification/award-chain";
import { POINTS } from "@/lib/gamification/constants";
import { getLearnerDayKey } from "@/lib/gamification/calendar-week";
import {
    getStudyWeekRange,
    isStudyLogKind,
    MAX_STUDY_LOGS_PER_DAY,
    normalizePracticeGoalDays,
    parseStudyLogText,
} from "@/lib/learner/study-log";
import { loadStudentStudyWeek } from "@/lib/learner/study-log-data";

/** The learner's practice logs for this week. */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        return NextResponse.json(await loadStudentStudyWeek(session.user.id));
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not load your practice", path: request.url });
    }
}

/**
 * Saves one log. Every log earns POINTS.STUDY_LOG and counts for the streak; the log that brings
 * the week's days practiced up to the learner's goal also earns POINTS.STUDY_GOAL_BONUS, once a week.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);
        const userId = session.user.id;

        const body = await request.json().catch(() => null);
        if (!isStudyLogKind(body?.kind)) return apiError("Pick what you did.", 400);
        const parsed = parseStudyLogText(body?.text);
        if ("error" in parsed) return apiError(parsed.error, 400);

        const now = new Date();
        const dayKey = getLearnerDayKey(now);

        const result = await prisma.$transaction(
            async (tx) => {
                // Serialize this learner's logs so two quick taps can't both be "first today" and both award.
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}), hashtext('study-log'))`;
                const loggedToday = await tx.studyLog.count({ where: { userId, dayKey } });
                if (loggedToday >= MAX_STUDY_LOGS_PER_DAY) return { limited: true as const };

                await tx.studyLog.create({ data: { userId, kind: body.kind, text: parsed.text, dayKey } });
                const award = await applyAwardChain({
                    userId,
                    points: POINTS.STUDY_LOG,
                    reason: `Study log ${dayKey}`,
                    source: "study-log",
                    transaction: tx,
                });

                // The lock above also keeps two logs from both claiming the week's goal bonus.
                const { start, end } = getStudyWeekRange(now);
                const goalReason = `Practice goal week ${start}`;
                const weekDays = await tx.studyLog.groupBy({
                    by: ["dayKey"],
                    where: { userId, dayKey: { gte: start, lte: end } },
                });
                const user = await tx.user.findUnique({ where: { id: userId }, select: { practiceGoalDays: true } });
                const bonusAlready = await tx.pointsLedger.findFirst({
                    where: { userId, source: "study-goal", reason: goalReason },
                    select: { id: true },
                });
                const goalReached = weekDays.length >= normalizePracticeGoalDays(user?.practiceGoalDays);
                let goalBonus = 0;
                if (goalReached && !bonusAlready) {
                    await applyAwardChain({
                        userId,
                        points: POINTS.STUDY_GOAL_BONUS,
                        reason: goalReason,
                        source: "study-goal",
                        transaction: tx,
                    });
                    goalBonus = POINTS.STUDY_GOAL_BONUS;
                }

                return {
                    limited: false as const,
                    pointsAwarded: POINTS.STUDY_LOG + award.streakPointsAwarded + goalBonus,
                    goalBonus,
                    streak: award.currentStreak,
                };
            },
            { timeout: 10000 }
        );

        if (result.limited) {
            return apiError(`You can log ${MAX_STUDY_LOGS_PER_DAY} things a day. Great work today!`, 429);
        }
        const studyWeek = await loadStudentStudyWeek(userId, now);
        return NextResponse.json(
            { ...studyWeek, pointsAwarded: result.pointsAwarded, goalBonus: result.goalBonus, streak: result.streak },
            { status: 201 }
        );
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not save your practice", path: request.url });
    }
}
