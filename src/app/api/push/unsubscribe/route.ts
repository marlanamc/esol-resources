import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { removePushSubscription } from "@/lib/push";
import { handleApiError } from "@/lib/api/response";

export async function POST() {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const userId = (session!.user as { id: string }).id;

  try {
    await removePushSubscription(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: "Failed to unsubscribe",
    });
  }
}
