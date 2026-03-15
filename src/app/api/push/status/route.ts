import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const userId = (session!.user as { id: string }).id;

  const sub = await prisma.pushSubscription.findUnique({
    where: { userId },
    select: { id: true },
  });

  return NextResponse.json({ subscribed: Boolean(sub) });
}
