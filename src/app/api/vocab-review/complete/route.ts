import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { DAILY_HABIT_KEYS, markDailyHabitCompleted } from "@/lib/daily-habits";
import { awardPoints, updateStreak, checkAndAwardAchievements } from "@/lib/gamification";
import { POINTS } from "@/lib/gamification/constants";

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

  const points = Math.min(
    POINTS.VOCAB_REVIEW_BASE + cardsReviewed * POINTS.VOCAB_REVIEW_PER_CARD,
    POINTS.VOCAB_REVIEW_MAX_PER_SESSION
  );

  await markDailyHabitCompleted(prisma, userId, DAILY_HABIT_KEYS.vocabReview);
  await awardPoints(userId, points, `Vocab review: ${cardsReviewed} card${cardsReviewed === 1 ? "" : "s"}`);
  const streakResult = await updateStreak(userId, points);
  await checkAndAwardAchievements(userId);

  return json({
    ok: true,
    points,
    streakUpdated: streakResult.streakUpdated,
    newStreak: streakResult.newStreak,
  });
}
