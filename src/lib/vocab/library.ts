import { isVocabLibraryTopicSlug } from "@/lib/vocab/library-topics";

export type VocabLibrarySort = "curriculum" | "alpha";

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

export function buildVocabLibraryHref(options: {
  topic?: string | null;
  sort?: VocabLibrarySort;
}): string {
  const params = new URLSearchParams();
  if (options.topic) {
    params.set("topic", options.topic);
  }
  if (options.sort === "alpha") {
    params.set("sort", "alpha");
  }
  const query = params.toString();
  return query ? `/dashboard/vocab-library?${query}` : "/dashboard/vocab-library";
}
