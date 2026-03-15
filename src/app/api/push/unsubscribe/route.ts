import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { removePushSubscription } from "@/lib/push";

export async function POST() {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const userId = (session!.user as { id: string }).id;

  try {
    await removePushSubscription(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to remove push subscription", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
