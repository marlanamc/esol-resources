import { describe, expect, it } from "vitest";
import { buildVocabReviewSeedCards } from "@/lib/vocab/review";
import {
  buildVocabLibraryHref,
  computeVocabLibraryPageMeta,
  filterVocabLibraryCards,
  paginateVocabLibraryCards,
  parseVocabLibrarySort,
  resolveVocabLibraryTopicSlug,
  sortVocabLibraryCards,
} from "@/lib/vocab/library";

describe("resolveVocabLibraryTopicSlug", () => {
  it("treats missing and all as unfiltered", () => {
    expect(resolveVocabLibraryTopicSlug(undefined)).toBeNull();
    expect(resolveVocabLibraryTopicSlug("all")).toBeNull();
  });

  it("returns known topic slugs", () => {
    expect(resolveVocabLibraryTopicSlug("health")).toBe("health");
  });

  it("returns null for unknown slugs", () => {
    expect(resolveVocabLibraryTopicSlug("not-a-topic")).toBeNull();
  });
});

describe("filterVocabLibraryCards", () => {
  const cards = [
    { term: "apple", topics: ["health", "money"] },
    { term: "budget", topics: ["money"] },
  ];

  it("returns all cards when topic is null", () => {
    expect(filterVocabLibraryCards(cards, null)).toHaveLength(2);
  });

  it("filters by topic slug", () => {
    expect(filterVocabLibraryCards(cards, "health").map((c) => c.term)).toEqual(["apple"]);
  });
});

describe("sortVocabLibraryCards", () => {
  const cards = [
    { term: "zebra", sortOrder: 1 },
    { term: "apple", sortOrder: 2 },
  ];

  it("keeps curriculum order by default", () => {
    expect(sortVocabLibraryCards(cards, "curriculum").map((c) => c.term)).toEqual([
      "zebra",
      "apple",
    ]);
  });

  it("sorts alphabetically when requested", () => {
    expect(sortVocabLibraryCards(cards, "alpha").map((c) => c.term)).toEqual([
      "apple",
      "zebra",
    ]);
  });
});

describe("parseVocabLibrarySort and buildVocabLibraryHref", () => {
  it("parses alpha sort", () => {
    expect(parseVocabLibrarySort("alpha")).toBe("alpha");
    expect(parseVocabLibrarySort("curriculum")).toBe("curriculum");
    expect(parseVocabLibrarySort(undefined)).toBe("curriculum");
  });

  it("builds hrefs with topic and sort params", () => {
    expect(buildVocabLibraryHref({})).toBe("/dashboard/vocab-library");
    expect(buildVocabLibraryHref({ topic: "health" })).toBe(
      "/dashboard/vocab-library?topic=health"
    );
    expect(buildVocabLibraryHref({ topic: "health", sort: "alpha" })).toBe(
      "/dashboard/vocab-library?topic=health&sort=alpha"
    );
    expect(buildVocabLibraryHref({ sort: "alpha", page: 2 })).toBe(
      "/dashboard/vocab-library?sort=alpha&page=2"
    );
  });
});

describe("computeVocabLibraryPageMeta and paginateVocabLibraryCards", () => {
  it("computes page metadata from total count", () => {
    expect(computeVocabLibraryPageMeta(100, 1, 48)).toEqual({
      page: 1,
      limit: 48,
      totalCount: 100,
      totalPages: 3,
      hasMore: true,
    });
    expect(computeVocabLibraryPageMeta(100, 99, 48).page).toBe(3);
  });

  it("slices in-memory card lists", () => {
    const cards = Array.from({ length: 5 }, (_, i) => ({ term: `word-${i}` }));
    expect(paginateVocabLibraryCards(cards, 2, 2)).toEqual({
      items: [{ term: "word-2" }, { term: "word-3" }],
      page: 2,
      limit: 2,
      totalCount: 5,
      totalPages: 3,
      hasMore: true,
    });
  });
});

describe("buildVocabReviewSeedCards pos", () => {
  it("preserves pos from structured vocabulary content", () => {
    const activities = [
      {
        id: "vocab-feb-3-5",
        title: "Unit 6: February 3–5",
        description: "Unit 6 vocabulary: Topic. transition",
        content: JSON.stringify({
          type: "vocabulary",
          flashcards: {
            cards: [
              {
                term: "transition",
                definition: "the process of change from one situation to another",
                example: "Moving to a new country can be a big transition.",
                pos: "noun",
                topics: ["soft-skills"],
              },
            ],
          },
        }),
      },
    ];

    const cards = buildVocabReviewSeedCards(activities);
    const transition = cards.find((card) => card.normalizedTerm === "transition");
    expect(transition?.pos).toBe("noun");
  });

  it("keeps the first non-empty pos when merging duplicates", () => {
    const activities = [
      {
        id: "vocab-sep-w1",
        title: "Unit 1: Getting to Know You",
        description: "Unit 1 vocabulary: Getting to Know You. background",
        content: JSON.stringify({
          type: "vocabulary",
          flashcards: {
            cards: [
              {
                term: "background",
                definition: "your life experiences and history",
                pos: "noun",
                topics: [],
              },
            ],
          },
        }),
      },
      {
        id: "vocab-oct-w1",
        title: "Unit 2: Daily Life",
        description: "Unit 2 vocabulary: Daily Life. background",
        content: JSON.stringify({
          type: "vocabulary",
          flashcards: {
            cards: [
              {
                term: "background",
                definition: "your life experiences and history",
                pos: "verb",
                topics: [],
              },
            ],
          },
        }),
      },
    ];

    const cards = buildVocabReviewSeedCards(activities);
    const background = cards.find((card) => card.normalizedTerm === "background");
    expect(background?.pos).toBe("noun");
  });
});
