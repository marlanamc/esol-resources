import { NextResponse } from "next/server";

/**
 * POST /api/gamification/award-points
 * Deprecated in favor of /api/activity/submit and /api/activity/progress.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Endpoint retired",
      message: "Use /api/activity/submit or /api/activity/progress for points updates.",
    },
    { status: 410 }
  );
}
