import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ALL_VOCAB_SOURCE_KEY, isKnownVocabReviewSourceKey } from "@/lib/vocab-review-sources";
import { saveVocabReviewRating } from "@/lib/vocab-review";
import type { VocabReviewRating, VocabReviewSubmissionResult } from "@/types/vocab-review";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function isRating(value: unknown): value is VocabReviewRating {
  return value === "again" || value === "hard" || value === "good" || value === "easy";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;
  const userId = (session!.user as { id: string }).id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noStoreJson({ error: "Invalid request body" }, 400);
  }

  const cardId = typeof (body as { cardId?: unknown })?.cardId === "string"
    ? (body as { cardId: string }).cardId.trim()
    : "";
  const rating = (body as { rating?: unknown })?.rating;
  const source = (body as { source?: unknown })?.source;

  if (!cardId) {
    return noStoreJson({ error: "cardId is required" }, 400);
  }

  if (!isRating(rating)) {
    return noStoreJson({ error: "Invalid review rating" }, 400);
  }

  if (
    source !== undefined &&
    source !== null &&
    (typeof source !== "string" ||
      (source !== ALL_VOCAB_SOURCE_KEY && !isKnownVocabReviewSourceKey(source)))
  ) {
    return noStoreJson({ error: "Invalid review source" }, 400);
  }

  try {
    const saved = await saveVocabReviewRating(prisma, userId, cardId, rating);
    if (!saved) {
      return noStoreJson({ error: "Card not found" }, 404);
    }

    const response: VocabReviewSubmissionResult = {
      ok: true,
      cardId,
      rating,
      step: saved.step,
      dueAt: saved.dueAt.toISOString(),
      shouldRepeatInSession: saved.shouldRepeatInSession,
    };

    return noStoreJson(response);
  } catch (error) {
    console.error("Failed to save vocab review rating", error);
    return noStoreJson({ error: "Failed to save review" }, 500);
  }
}
