import { NextRequest } from "next/server";
import { resetWeeklyPoints } from "@/lib/gamification";
import { ApiErrors, apiSuccess } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * Cron job to reset weekly leaderboard points
 * Runs every Tuesday at midnight UTC
 * Week runs: Tuesday - Monday
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

    try {
        await resetWeeklyPoints();

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
