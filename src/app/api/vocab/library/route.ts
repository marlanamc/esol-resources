import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  VOCAB_LIBRARY_TOPICS,
  isVocabLibraryTopicSlug,
} from "@/lib/vocab/library-topics";
import { logger } from "@/lib/logger";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const topic = request.nextUrl.searchParams.get("topic");

  if (topic && !isVocabLibraryTopicSlug(topic)) {
    return noStoreJson({ error: "Unknown topic" }, 400);
  }

  try {
    const allCards = await prisma.vocabCard.findMany({
      select: {
        id: true,
        term: true,
        definition: true,
        example: true,
        audioPath: true,
        topics: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    const counts: Record<string, number> = {};
    for (const t of VOCAB_LIBRARY_TOPICS) counts[t.slug] = 0;
    for (const card of allCards) {
      for (const t of card.topics) {
        if (counts[t] !== undefined) counts[t]++;
      }
    }

    const words = topic
      ? allCards
          .filter((c) => c.topics.includes(topic))
          .map((c) => ({
            id: c.id,
            term: c.term,
            definition: c.definition,
            example: c.example,
            audioPath: c.audioPath,
            topics: c.topics,
          }))
      : [];

    return noStoreJson({
      topics: VOCAB_LIBRARY_TOPICS.map((t) => ({
        ...t,
        count: counts[t.slug] ?? 0,
      })),
      selectedTopic: topic,
      words,
    });
  } catch (error) {
    logger.error("Failed to load vocab library", error);
    return noStoreJson({ error: "Failed to load vocab library" }, 500);
  }
}
