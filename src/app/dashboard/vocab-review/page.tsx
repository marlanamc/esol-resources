import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_VOCAB_SOURCE_KEY } from "@/lib/vocab-review-sources";
import { DEFAULT_VOCAB_REVIEW_LIMIT, getVocabReviewQueueForUser, getVocabReviewSummaryForUser } from "@/lib/vocab-review";
import { VocabReviewClient } from "@/components/vocab-review/VocabReviewClient";
import type { VocabReviewQueue, VocabReviewSummary } from "@/types/vocab-review";

function createEmptySummary(): VocabReviewSummary {
  return {
    dueCount: 0,
    newCount: 0,
    masteredCount: 0,
    totalCount: 0,
    filters: [
      {
        key: ALL_VOCAB_SOURCE_KEY,
        label: "All vocab",
        shortLabel: "All vocab",
        group: "all",
        unitNumber: null,
        dueCount: 0,
        newCount: 0,
        masteredCount: 0,
        totalCount: 0,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

function createEmptyQueue(limit: number): VocabReviewQueue {
  return {
    source: ALL_VOCAB_SOURCE_KEY,
    sourceLabel: "All vocab",
    cards: [],
    hasMore: false,
    totalCount: 0,
    dueCount: 0,
    newCount: 0,
    limit,
  };
}

export default async function VocabReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const limit = DEFAULT_VOCAB_REVIEW_LIMIT;
  let initialSummary = createEmptySummary();
  let initialQueue = createEmptyQueue(limit);

  try {
    [initialSummary, initialQueue] = await Promise.all([
      getVocabReviewSummaryForUser(prisma, session.user.id),
      getVocabReviewQueueForUser(prisma, session.user.id, ALL_VOCAB_SOURCE_KEY, limit),
    ]);
  } catch (error) {
    console.error("Failed to load vocab review page", error);
  }

  return <VocabReviewClient initialSummary={initialSummary} initialQueue={initialQueue} />;
}
