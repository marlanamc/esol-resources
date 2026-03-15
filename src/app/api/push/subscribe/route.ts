import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { isPushConfigured, savePushSubscription } from "@/lib/push";
import type { PushSubscriptionPayload } from "@/lib/push";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push notifications not configured" }, { status: 503 });
  }

  const userId = (session!.user as { id: string }).id;
  const role = (session!.user as { role?: string }).role;
  if (role !== "student") {
    return NextResponse.json({ error: "Only students can subscribe to vocab reminders" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const sub = body as PushSubscriptionPayload;
  if (
    !sub ||
    typeof sub.endpoint !== "string" ||
    !sub.keys ||
    typeof sub.keys.p256dh !== "string" ||
    typeof sub.keys.auth !== "string"
  ) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  try {
    await savePushSubscription(userId, sub);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save push subscription", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
