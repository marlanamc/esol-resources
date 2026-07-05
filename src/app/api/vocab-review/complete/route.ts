import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import {
  DAILY_HABIT_KEYS,
  getDailyHabitCompletionForUser,
  markDailyHabitCompleted,
} from "@/lib/daily-habits";
import { applyAwardChain } from "@/lib/gamification/award-chain";
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

  const cardsReviewed =
    typeof (body as { cardsReviewed?: unknown })?.cardsReviewed === "number"
      ? Math.max(0, Math.floor((body as { cardsReviewed: number }).cardsReviewed))
      : 0;

  if (cardsReviewed === 0) {
    return json({ error: "No cards reviewed" }, 400);
  }

  const points = calculateVocabReviewPoints(cardsReviewed);

  // Idempotency guard: if the learner already completed today's vocab review,
  // a retry (network timeout, double-tap, PWA outbox replay) must not award
  // points a second time. The daily-habit upsert silently no-ops on replay,
  // but awardPoints does not — so gate on the completion record first.
  const alreadyCompleted = await getDailyHabitCompletionForUser(
    prisma,
    userId,
    DAILY_HABIT_KEYS.vocabReview
  );
  if (alreadyCompleted) {
    return json({ ok: true, points: 0, duplicate: true, streakUpdated: false });
  }

  await markDailyHabitCompleted(prisma, userId, DAILY_HABIT_KEYS.vocabReview);

  // applyAwardChain wraps awardPoints + updateStreak + checkAndAwardAchievements
  // in a single transaction so a mid-chain failure can't leave points awarded
  // without the streak/achievement updates that should accompany them.
  const chain = await applyAwardChain({
    userId,
    points,
    reason: `Vocab review: ${cardsReviewed} card${cardsReviewed === 1 ? "" : "s"}`,
  });

  return json({
    ok: true,
    points,
    streakUpdated: chain.streakUpdated,
    newStreak: chain.newStreak,
  });
}
