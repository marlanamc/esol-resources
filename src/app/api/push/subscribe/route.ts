import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { isPushConfigured, savePushSubscription } from "@/lib/push";
import type { PushSubscriptionPayload } from "@/lib/push";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  if (!isPushConfigured()) {
    return ApiErrors.unavailable("Push notifications not configured");
  }

  const userId = (session!.user as { id: string }).id;
  const role = (session!.user as { role?: string }).role;
  if (role !== "student") {
    return ApiErrors.forbidden("Only students can subscribe to vocab reminders");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid body", 400);
  }

  const sub = body as PushSubscriptionPayload;
  if (
    !sub ||
    typeof sub.endpoint !== "string" ||
    !sub.keys ||
    typeof sub.keys.p256dh !== "string" ||
    typeof sub.keys.auth !== "string"
  ) {
    return apiError("Invalid subscription", 400);
  }

  try {
    await savePushSubscription(userId, sub);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: "Failed to save subscription",
    });
  }
}
