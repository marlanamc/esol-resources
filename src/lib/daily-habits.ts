import type { PrismaClient } from "@prisma/client";
import { getVocabReviewSummaryForUser } from "@/lib/vocab-review";
import type { VocabReviewSummary } from "@/types/vocab-review";

export const LEARNER_DAY_TIME_ZONE = "America/New_York";
export const DAILY_HABIT_KEYS = {
    vocabReview: "vocab-review",
} as const;

export type DailyHabitKey = (typeof DAILY_HABIT_KEYS)[keyof typeof DAILY_HABIT_KEYS];
export type DailyChecklistHabitStatus = "needs-review" | "done-today";

export interface DailyChecklistHabit {
    key: DailyHabitKey;
    title: string;
    description: string;
    href: string;
    status: DailyChecklistHabitStatus;
    dueCount: number;
    newCount: number;
    completedToday: boolean;
    reviewedTodayCount: number;
}

type DailyHabitDbClient = Pick<PrismaClient, "dailyHabitCompletion" | "pointsLedger">;
type DailyVocabHabitDbClient = Pick<PrismaClient, "activity" | "vocabCard" | "userVocabReviewState" | "dailyHabitCompletion" | "pointsLedger">;

function isMissingDailyHabitPersistenceError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const maybePrismaError = error as {
        code?: unknown;
        message?: unknown;
        meta?: { modelName?: unknown; table?: unknown; column?: unknown };
    };

    const metaValues = [maybePrismaError.meta?.modelName, maybePrismaError.meta?.table, maybePrismaError.meta?.column]
        .filter((value): value is string => typeof value === "string")
        .join(" ");
    const message = typeof maybePrismaError.message === "string" ? maybePrismaError.message : "";
    const haystack = `${metaValues} ${message}`;

    return (
        maybePrismaError.code === "P2021" ||
        maybePrismaError.code === "P2022" ||
        haystack.includes("DailyHabitCompletion") ||
        haystack.includes("dailyHabitCompletion")
    );
}

export function getLearnerDayKey(date: Date = new Date()): string {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: LEARNER_DAY_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return formatter.format(date);
}

export function isDailyVocabActionable(summary: Pick<VocabReviewSummary, "dueCount" | "newCount"> | null | undefined): boolean {
    return Boolean(summary && (summary.dueCount > 0 || summary.newCount > 0));
}

export function shouldShowDailyVocabHabit(
    summary: (Pick<VocabReviewSummary, "dueCount" | "newCount"> & { totalCount?: number }) | null | undefined,
    completedToday: boolean
): boolean {
    if (completedToday || isDailyVocabActionable(summary)) {
        return true;
    }

    return Boolean(summary && (summary.totalCount ?? 0) > 0);
}

export function buildDailyVocabHabit(
    summary: (Pick<VocabReviewSummary, "dueCount" | "newCount"> & { totalCount?: number }) | null | undefined,
    completedToday: boolean,
    reviewedTodayCount = 0
): DailyChecklistHabit | null {
    if (!shouldShowDailyVocabHabit(summary, completedToday)) {
        return null;
    }

    const dueCount = summary?.dueCount ?? 0;
    const newCount = summary?.newCount ?? 0;
    const totalCount = summary?.totalCount ?? 0;
    const description = completedToday && dueCount === 0 && newCount === 0
        ? "You finished today's vocab review. Come back tomorrow or open review again anytime."
        : completedToday
            ? "You already finished one vocab review session today. Come back for extra practice anytime."
            : dueCount > 0 && newCount > 0
            ? `${dueCount} cards are due today and ${newCount} new cards are ready.`
            : dueCount > 0
                ? `${dueCount} cards are due today.`
                : newCount > 0
                    ? `${newCount} new cards are ready.`
                    : totalCount > 0
                        ? "You're caught up for now. Open review to practice again or check what's next."
                        : "Open vocab review to keep your words fresh.";

    return {
        key: DAILY_HABIT_KEYS.vocabReview,
        title: "Daily Vocab Review",
        description,
        href: "/dashboard/vocab-review",
        status: completedToday ? "done-today" : "needs-review",
        dueCount,
        newCount,
        completedToday,
        reviewedTodayCount,
    };
}

export async function getDailyHabitCompletionForUser(
    db: DailyHabitDbClient,
    userId: string,
    habitKey: DailyHabitKey,
    date: Date = new Date()
): Promise<boolean> {
    const dayKey = getLearnerDayKey(date);
    try {
        const completion = await db.dailyHabitCompletion.findUnique({
            where: {
                userId_habitKey_dayKey: {
                    userId,
                    habitKey,
                    dayKey,
                },
            },
            select: {
                id: true,
            },
        });

        return Boolean(completion);
    } catch (error) {
        if (isMissingDailyHabitPersistenceError(error)) {
            return false;
        }
        throw error;
    }
}

function parseReviewedCardCount(reason: string): number {
    const match = reason.match(/Vocab review:\s*(\d+)\s+card/i);
    return match ? Number.parseInt(match[1] || "0", 10) : 0;
}

async function getVocabReviewLedgerStatsForDay(
    db: Pick<PrismaClient, "pointsLedger">,
    userId: string,
    date: Date = new Date()
): Promise<{ completedToday: boolean; reviewedTodayCount: number }> {
    if (!("pointsLedger" in db) || !db.pointsLedger) {
        return { completedToday: false, reviewedTodayCount: 0 };
    }

    const dayKey = getLearnerDayKey(date);
    const lookbackStart = new Date(date.getTime() - 48 * 60 * 60 * 1000);
    const entries = await db.pointsLedger.findMany({
        where: {
            userId,
            source: "award",
            reason: {
                startsWith: "Vocab review:",
            },
            createdAt: {
                gte: lookbackStart,
            },
        },
        select: {
            createdAt: true,
            reason: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    const todaysEntries = entries.filter((entry) => getLearnerDayKey(entry.createdAt) === dayKey);

    return {
        completedToday: todaysEntries.length > 0,
        reviewedTodayCount: todaysEntries.reduce((total, entry) => total + parseReviewedCardCount(entry.reason ?? ""), 0),
    };
}

export async function markDailyHabitCompleted(
    db: DailyHabitDbClient,
    userId: string,
    habitKey: DailyHabitKey,
    completedAt: Date = new Date()
): Promise<void> {
    const dayKey = getLearnerDayKey(completedAt);

    try {
        await db.dailyHabitCompletion.upsert({
            where: {
                userId_habitKey_dayKey: {
                    userId,
                    habitKey,
                    dayKey,
                },
            },
            update: {
                completedAt,
            },
            create: {
                userId,
                habitKey,
                dayKey,
                completedAt,
            },
        });
    } catch (error) {
        if (isMissingDailyHabitPersistenceError(error)) {
            return;
        }
        throw error;
    }
}

export async function getDailyVocabHabitForUser(
    db: DailyVocabHabitDbClient,
    userId: string,
    now: Date = new Date()
): Promise<DailyChecklistHabit | null> {
    const [summary, completedFromTable, ledgerStats] = await Promise.all([
        getVocabReviewSummaryForUser(db, userId, now),
        getDailyHabitCompletionForUser(db, userId, DAILY_HABIT_KEYS.vocabReview, now),
        getVocabReviewLedgerStatsForDay(db, userId, now),
    ]);
    const completedToday = completedFromTable || ledgerStats.completedToday;
    if (!shouldShowDailyVocabHabit(summary, completedToday)) {
        return null;
    }

    return buildDailyVocabHabit(summary, completedToday, ledgerStats.reviewedTodayCount);
}
