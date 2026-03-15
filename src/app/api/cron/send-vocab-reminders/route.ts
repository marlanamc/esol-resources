import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVocabReminderToUser, isPushConfigured } from "@/lib/push";
import { getLearnerDayKey, DAILY_HABIT_KEYS } from "@/lib/daily-habits";
import { ApiErrors, apiSuccess } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * Cron job to send daily vocab review push notifications.
 * Runs once per day (e.g. 9am ET) and sends a push to students who:
 * - Have opted in (PushSubscription exists)
 * - Have NOT completed vocab review today
 *
 * Secured by CRON_SECRET (Vercel Cron or external scheduler).
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("[Cron] CRITICAL: CRON_SECRET not configured");
    return ApiErrors.unavailable();
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[Cron] Unauthorized vocab reminders attempt");
    return ApiErrors.unauthorized();
  }

  if (!isPushConfigured()) {
    logger.info("[Cron] Push not configured, skipping vocab reminders");
    return apiSuccess({ sent: 0, skipped: true, reason: "push_not_configured" });
  }

  const today = new Date();
  const dayKey = getLearnerDayKey(today);

  // Students who completed vocab today (via DailyHabitCompletion)
  const completedUserIds = await prisma.dailyHabitCompletion
    .findMany({
      where: {
        habitKey: DAILY_HABIT_KEYS.vocabReview,
        dayKey,
      },
      select: { userId: true },
    })
    .then((rows) => new Set(rows.map((r) => r.userId)));

  // Students with push subscriptions who haven't completed today
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      user: {
        role: "student",
        isSystemAccount: false,
      },
    },
    select: { userId: true },
  });

  const toNotify = subscriptions.filter((s) => !completedUserIds.has(s.userId));
  let sent = 0;

  for (const { userId } of toNotify) {
    const ok = await sendVocabReminderToUser(userId);
    if (ok) sent++;
  }

  logger.info(`[Cron] Vocab reminders: ${sent}/${toNotify.length} sent`);

  return apiSuccess({
    success: true,
    sent,
    total: toNotify.length,
    completedToday: completedUserIds.size,
  });
}
