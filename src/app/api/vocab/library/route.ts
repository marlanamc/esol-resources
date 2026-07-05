import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { VOCAB_LIBRARY_TOPICS } from "@/lib/vocab/library-topics";
import {
  parseVocabLibrarySort,
  resolveVocabLibraryTopicSlug,
  sortVocabLibraryCards,
} from "@/lib/vocab/library";
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

  const topicParam = request.nextUrl.searchParams.get("topic");
  const sortParam = request.nextUrl.searchParams.get("sort");
  const selectedSlug = resolveVocabLibraryTopicSlug(topicParam);
  const sort = parseVocabLibrarySort(sortParam);

  if (topicParam && topicParam !== "all" && selectedSlug === null) {
    return noStoreJson({ error: "Unknown topic" }, 400);
  }

  try {
    const [cards, totalCount, topicCounts] = await Promise.all([
      prisma.vocabCard.findMany({
        where: selectedSlug ? { topics: { has: selectedSlug } } : {},
        select: {
          id: true,
          term: true,
          definition: true,
          example: true,
          pos: true,
          audioPath: true,
          topics: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.vocabCard.count(),
      Promise.all(
        VOCAB_LIBRARY_TOPICS.map((t) =>
          prisma.vocabCard.count({ where: { topics: { has: t.slug } } })
        )
      ),
    ]);

    const counts: Record<string, number> = {};
    VOCAB_LIBRARY_TOPICS.forEach((t, i) => {
      counts[t.slug] = topicCounts[i] ?? 0;
    });

    const words = sortVocabLibraryCards(cards, sort).map((c) => ({
      id: c.id,
      term: c.term,
      definition: c.definition,
      example: c.example,
      pos: c.pos,
      audioPath: c.audioPath,
      topics: c.topics,
    }));

    return noStoreJson({
      topics: VOCAB_LIBRARY_TOPICS.map((t) => ({
        ...t,
        count: counts[t.slug] ?? 0,
      })),
      totalCount,
      selectedTopic: selectedSlug ?? (topicParam === "all" || !topicParam ? "all" : null),
      sort,
      words,
    });
  } catch (error) {
    logger.error("Failed to load vocab library", error);
    return noStoreJson({ error: "Failed to load vocab library" }, 500);
  }
}
