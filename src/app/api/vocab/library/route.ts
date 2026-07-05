import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import { VOCAB_LIBRARY_TOPICS } from "@/lib/vocab/library-topics";
import {
  computeVocabLibraryPageMeta,
  parseVocabLibraryLimit,
  parseVocabLibraryPage,
  parseVocabLibrarySort,
  resolveVocabLibraryTopicSlug,
  sortVocabLibraryCards,
} from "@/lib/vocab/library";
import { logger } from "@/lib/shared/logger";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

const CARD_SELECT = {
  id: true,
  term: true,
  definition: true,
  example: true,
  pos: true,
  audioPath: true,
  topics: true,
  sortOrder: true,
} as const;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const topicParam = request.nextUrl.searchParams.get("topic");
  const sortParam = request.nextUrl.searchParams.get("sort");
  const pageParam = request.nextUrl.searchParams.get("page");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const selectedSlug = resolveVocabLibraryTopicSlug(topicParam);
  const sort = parseVocabLibrarySort(sortParam);
  const page = parseVocabLibraryPage(pageParam);
  const limit = parseVocabLibraryLimit(limitParam);
  const isAllView = !selectedSlug;

  if (topicParam && topicParam !== "all" && selectedSlug === null) {
    return noStoreJson({ error: "Unknown topic" }, 400);
  }

  try {
    const [totalCount, topicCounts] = await Promise.all([
      selectedSlug
        ? prisma.vocabCard.count({ where: { topics: { has: selectedSlug } } })
        : prisma.vocabCard.count(),
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

    let words;
    let pagination: ReturnType<typeof computeVocabLibraryPageMeta> | null = null;

    if (isAllView) {
      pagination = computeVocabLibraryPageMeta(totalCount, page, limit);
      words = await prisma.vocabCard.findMany({
        select: CARD_SELECT,
        orderBy: sort === "alpha" ? { term: "asc" } : { sortOrder: "asc" },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      });
    } else {
      const cards = await prisma.vocabCard.findMany({
        where: { topics: { has: selectedSlug } },
        select: CARD_SELECT,
        orderBy: { sortOrder: "asc" },
      });
      words = sortVocabLibraryCards(cards, sort);
    }

    const mappedWords = words.map((c) => ({
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
      words: mappedWords,
      ...(pagination
        ? {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: pagination.totalPages,
            hasMore: pagination.hasMore,
          }
        : {}),
    });
  } catch (error) {
    logger.error("Failed to load vocab library", error);
    return noStoreJson({ error: "Failed to load vocab library" }, 500);
  }
}
