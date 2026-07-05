import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import { ALL_VOCAB_SOURCE_KEY, isKnownVocabReviewSourceKey } from "@/lib/vocab/sources";
import { DEFAULT_VOCAB_REVIEW_LIMIT, getVocabReviewQueueForUser } from "@/lib/vocab/review";
import { logger } from "@/lib/shared/logger";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;
  const userId = (session!.user as { id: string }).id;

  const source = request.nextUrl.searchParams.get("source") || ALL_VOCAB_SOURCE_KEY;
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : DEFAULT_VOCAB_REVIEW_LIMIT;

  if (source !== ALL_VOCAB_SOURCE_KEY && !isKnownVocabReviewSourceKey(source)) {
    return noStoreJson({ error: "Invalid vocab review source" }, 400);
  }

  if (!Number.isFinite(limit)) {
    return noStoreJson({ error: "Invalid queue limit" }, 400);
  }

  try {
    const queue = await getVocabReviewQueueForUser(prisma, userId, source, limit);
    return noStoreJson(queue);
  } catch (error) {
    logger.error("Failed to load vocab review queue", error);
    return noStoreJson({ error: "Failed to load review queue" }, 500);
  }
}
