import { isVocabLibraryTopicSlug } from "@/lib/vocab/library-topics";

export type VocabLibrarySort = "curriculum" | "alpha";

export const VOCAB_LIBRARY_PAGE_SIZE = 48;
export const VOCAB_LIBRARY_MAX_PAGE_SIZE = 100;

export interface VocabLibraryPageSlice<T> {
  items: T[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export function parseVocabLibrarySort(raw: string | undefined | null): VocabLibrarySort {
  return raw === "alpha" ? "alpha" : "curriculum";
}

/** Returns null for "all" / missing topic (show every card). */
export function resolveVocabLibraryTopicSlug(raw: string | undefined | null): string | null {
  if (!raw || raw === "all") return null;
  return isVocabLibraryTopicSlug(raw) ? raw : null;
}

export function filterVocabLibraryCards<T extends { topics: string[] }>(
  cards: T[],
  topicSlug: string | null
): T[] {
  if (!topicSlug) return cards;
  return cards.filter((card) => card.topics.includes(topicSlug));
}

export function sortVocabLibraryCards<T extends { term: string }>(
  cards: T[],
  sort: VocabLibrarySort
): T[] {
  if (sort === "alpha") {
    return [...cards].sort((left, right) => left.term.localeCompare(right.term, "en"));
  }
  return cards;
}

export function parseVocabLibraryPage(raw: string | undefined | null): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export function parseVocabLibraryLimit(raw: string | undefined | null): number {
  const parsed = Number.parseInt(raw ?? String(VOCAB_LIBRARY_PAGE_SIZE), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return VOCAB_LIBRARY_PAGE_SIZE;
  }
  return Math.min(parsed, VOCAB_LIBRARY_MAX_PAGE_SIZE);
}

export function computeVocabLibraryPageMeta(
  totalCount: number,
  page: number,
  limit: number
): Omit<VocabLibraryPageSlice<never>, "items"> {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    page: safePage,
    limit,
    totalCount,
    totalPages,
    hasMore: safePage < totalPages,
  };
}

export function paginateVocabLibraryCards<T>(
  cards: T[],
  page: number,
  limit: number
): VocabLibraryPageSlice<T> {
  const meta = computeVocabLibraryPageMeta(cards.length, page, limit);
  const offset = (meta.page - 1) * meta.limit;

  return {
    ...meta,
    items: cards.slice(offset, offset + meta.limit),
  };
}

export function buildVocabLibraryHref(options: {
  topic?: string | null;
  sort?: VocabLibrarySort;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (options.topic) {
    params.set("topic", options.topic);
  }
  if (options.sort === "alpha") {
    params.set("sort", "alpha");
  }
  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }
  const query = params.toString();
  return query ? `/dashboard/vocab-library?${query}` : "/dashboard/vocab-library";
}
