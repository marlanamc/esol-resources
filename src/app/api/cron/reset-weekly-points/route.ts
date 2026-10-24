import { NextRequest } from "next/server";
import { resetWeeklyPoints } from "@/lib/gamification/gamification";
import { ApiErrors, apiSuccess } from "@/lib/api/response";
import { logger } from "@/lib/shared/logger";

/**
 * Cron job to reset weekly leaderboard points
 * Runs at both candidate UTC offsets for Monday midnight in New York.
 * Only the matching local-midnight invocation refreshes the counters.
 *
 * This endpoint is secured by Vercel Cron's authorization header
 */
export async function GET(request: NextRequest) {
    // SECURITY: Validate CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET;

    // Fail closed - deny if secret not configured
    if (!cronSecret) {
        logger.error("[Cron] CRITICAL: CRON_SECRET not configured in environment variables");
        return ApiErrors.unavailable();
    }

    // Verify this request is from Vercel Cron
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${cronSecret}`) {
        logger.warn("[Cron] Unauthorized cron attempt - invalid authorization header");
        return ApiErrors.unauthorized();
    }

    const now = new Date();
    const local = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(now);
    if (local.find(p => p.type === 'weekday')?.value !== 'Mon' || local.find(p => p.type === 'hour')?.value !== '00') {
        return apiSuccess({ skipped: true });
    }
    try {
        await resetWeeklyPoints(now);

        logger.info("[Cron] Weekly points reset completed successfully");

        return apiSuccess({
            success: true,
            message: "Weekly points reset successfully. New week started!",
            resetDate: new Date().toISOString()
        });
    } catch (error) {
        logger.error("[Cron] Error resetting weekly points", error);
        return ApiErrors.internal("Failed to reset weekly points");
    }
}
