import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import {
  DAILY_HABIT_KEYS,
  getLearnerDayKey,
} from "@/lib/daily-habits";
import { applyAwardChain } from "@/lib/gamification/award-chain";
import { handleApiError } from "@/lib/api/response";
import { calculateVocabReviewPoints } from "@/lib/gamification/constants";

function json<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;
  const userId = (session!.user as { id: string }).id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const cardsReviewed = (body as { cardsReviewed?: unknown })?.cardsReviewed;
  if (typeof cardsReviewed !== "number" || !Number.isSafeInteger(cardsReviewed) || cardsReviewed <= 0) {
    return json({ error: "cardsReviewed must be a positive integer" }, 400);
  }

  const points = calculateVocabReviewPoints(cardsReviewed);
  // Freeze the learner day for the whole request, including a midnight retry.
  const completedAt = new Date();
  const dayKey = getLearnerDayKey(completedAt);
  const habitKey = DAILY_HABIT_KEYS.vocabReview;

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`daily-habit:${userId}:${habitKey}:${dayKey}`}))`;
      const where = { userId_habitKey_dayKey: { userId, habitKey, dayKey } };
      // Use strict persistence here: the read-only dashboard's legacy fallback
      // must not silently permit credit when the idempotency table is missing.
      const existing = await tx.dailyHabitCompletion.findUnique({ where, select: { id: true } });
      if (existing) {
        return json({ ok: true, points: 0, duplicate: true, streakUpdated: false });
      }

      await tx.dailyHabitCompletion.create({ data: { userId, habitKey, dayKey, completedAt } });
      const chain = await applyAwardChain({
        userId,
        points,
        reason: `Vocab review: ${cardsReviewed} card${cardsReviewed === 1 ? "" : "s"}`,
        transaction: tx,
      });
      return json({ ok: true, points, streakUpdated: chain.streakUpdated, newStreak: chain.newStreak });
    }, { timeout: 10000 });
  } catch (error) {
    return handleApiError(error, { defaultMessage: "Review credit could not be saved. Please retry." });
  }
}
