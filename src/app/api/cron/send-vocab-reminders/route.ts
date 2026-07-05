import { NextRequest } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sendVocabReminderToUser, isPushConfigured } from "@/lib/push";
import { getLearnerDayKey, DAILY_HABIT_KEYS } from "@/lib/daily-habits";
import { ApiErrors, apiSuccess } from "@/lib/api/response";
import { logger } from "@/lib/shared/logger";

export const maxDuration = 60;

const MAX_NOTIFICATIONS_PER_RUN = 100;
const NOTIFICATION_BATCH_SIZE = 20;

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

  // Distinct subscribed students who haven't completed today's vocab review.
  // groupBy dedupes multi-device users (one reminder per student, not per
  // subscription) and the relation filter keeps completed users out of the
  // result instead of loading every subscription and filtering in JS.
  const [toNotify, completedToday] = await Promise.all([
    prisma.pushSubscription.groupBy({
      by: ["userId"],
      where: {
        user: {
          role: "student",
          isSystemAccount: false,
          dailyHabitCompletions: {
            none: {
              habitKey: DAILY_HABIT_KEYS.vocabReview,
              dayKey,
            },
          },
        },
      },
      orderBy: { userId: "asc" },
    }),
    prisma.dailyHabitCompletion.count({
      where: {
        habitKey: DAILY_HABIT_KEYS.vocabReview,
        dayKey,
      },
    }),
  ]);

  const scheduledNotifications = toNotify.slice(0, MAX_NOTIFICATIONS_PER_RUN);
  const truncated = toNotify.length > scheduledNotifications.length;
  let sent = 0;

  for (let index = 0; index < scheduledNotifications.length; index += NOTIFICATION_BATCH_SIZE) {
    const batch = scheduledNotifications.slice(index, index + NOTIFICATION_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(({ userId }) => sendVocabReminderToUser(userId))
    );

    sent += results.filter((result) => result.status === "fulfilled" && result.value).length;
  }

  logger.info(`[Cron] Vocab reminders: ${sent}/${scheduledNotifications.length} sent`, {
    eligibleUsers: toNotify.length,
    truncated,
  });

  if (truncated) {
    logger.warn("[Cron] Vocab reminders truncated to stay within function limits", {
      eligibleUsers: toNotify.length,
      scheduledUsers: scheduledNotifications.length,
      remainingUsers: toNotify.length - scheduledNotifications.length,
    });
  }

  return apiSuccess({
    success: true,
    sent,
    total: scheduledNotifications.length,
    eligible: toNotify.length,
    truncated,
    remaining: Math.max(0, toNotify.length - scheduledNotifications.length),
    completedToday,
  });
}
