import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import { getVocabReviewSummaryForUser } from "@/lib/vocab/review";
import { logger } from "@/lib/shared/logger";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;
  const userId = (session!.user as { id: string }).id;

  try {
    const summary = await getVocabReviewSummaryForUser(prisma, userId);
    return noStoreJson(summary);
  } catch (error) {
    logger.error("Failed to load vocab review summary", error);
    return noStoreJson({ error: "Failed to load review summary" }, 500);
  }
}
