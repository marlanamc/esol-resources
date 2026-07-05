import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_VOCAB_SOURCE_KEY,
} from "@/lib/vocab/sources";
import {
  addDays,
  applyVocabReviewRating,
  buildVocabReviewQueue,
  buildVocabReviewSeedCards,
  buildVocabReviewSummary,
  getVocabReviewSummaryForUser,
  normalizeVocabTerm,
  saveVocabReviewRating,
  type VocabReviewCardLike,
  type VocabReviewStateLike,
} from "@/lib/vocab/review";

test("normalizeVocabTerm merges hyphen and spacing variants", () => {
  assert.equal(normalizeVocabTerm("follow-up"), "follow up");
  assert.equal(normalizeVocabTerm("Follow   Up"), "follow up");
});

test("buildVocabReviewSeedCards merges duplicate words and preserves earliest source content", () => {
  const activities = [
    {
      id: "vocab-october-flashcards",
      title: "Unit 2: Daily Life in the Community \u2014 Flash Cards",
      description: "Unit 2 flash cards: Daily Life in the Community",
      content: `1) follow-up \u2014 a next step after a first conversation
Example: Send a follow-up email after the interview.

2) obstacle \u2014 something that blocks your way
Example: Language was an obstacle at first.`,
    },
    {
      id: "vocab-feb-10-12",
      title: "Unit 6: February 10\u201312",
      description: "Unit 6 vocabulary: Workplace Phrasal Verbs. follow up, timesheet",
      content: JSON.stringify({
        type: "vocabulary",
        flashcards: {
          cards: [
            {
              term: "follow up",
              definition: "to check in later about something",
              example: "I will follow up with my supervisor tomorrow.",
            },
            {
              term: "timesheet",
              definition: "a form that records your work hours",
              example: "Turn in your timesheet every Friday.",
            },
          ],
        },
      }),
    },
  ];

  const cards = buildVocabReviewSeedCards(activities);

  assert.equal(cards.length, 3);

  const followUp = cards.find((card) => card.normalizedTerm === "follow up");
  assert.ok(followUp);
  assert.equal(followUp.term, "follow-up");
  assert.equal(followUp.definition, "a next step after a first conversation");
  assert.deepEqual(followUp.sourceKeys, ["october", "feb-10-12"]);
  assert.deepEqual(followUp.unitNumbers, [2, 6]);
  assert.deepEqual(followUp.topics, ["Daily Life in the Community", "Workplace Phrasal Verbs"]);
});

test("buildVocabReviewSummary and queue apply all-vs-source ordering rules", () => {
  const cards: VocabReviewCardLike[] = [
    {
      id: "due-card",
      term: "obstacle",
      definition: "something that blocks your way",
      example: null,
      audioPath: "/audio/vocab/obstacle.mp3",
      sourceKeys: ["october"],
      sourceLabels: ["Unit 2: October"],
      unitNumbers: [2],
      topics: ["Daily Life in the Community"],
      sortOrder: 1,
    },
    {
      id: "new-card",
      term: "timesheet",
      definition: "a form that records your work hours",
      example: null,
      audioPath: "/audio/vocab/timesheet.mp3",
      sourceKeys: ["feb-10-12"],
      sourceLabels: ["Unit 6: February 10-12"],
      unitNumbers: [6],
      topics: ["Workplace Phrasal Verbs"],
      sortOrder: 2,
    },
    {
      id: "scheduled-card",
      term: "beneficial",
      definition: "helpful or advantageous",
      example: null,
      audioPath: "/audio/vocab/beneficial.mp3",
      sourceKeys: ["october"],
      sourceLabels: ["Unit 2: October"],
      unitNumbers: [2],
      topics: ["Daily Life in the Community"],
      sortOrder: 3,
    },
  ];

  const now = new Date("2026-03-10T12:00:00.000Z");
  const states: VocabReviewStateLike[] = [
    {
      vocabCardId: "due-card",
      step: 1,
      dueAt: new Date("2026-03-09T12:00:00.000Z"),
      lastRating: "good",
      lastReviewedAt: new Date("2026-03-08T12:00:00.000Z"),
      totalReviews: 2,
      lapses: 0,
    },
    {
      vocabCardId: "scheduled-card",
      step: 3,
      dueAt: new Date("2026-04-01T12:00:00.000Z"),
      lastRating: "easy",
      lastReviewedAt: new Date("2026-03-01T12:00:00.000Z"),
      totalReviews: 4,
      lapses: 0,
    },
  ];

  const summary = buildVocabReviewSummary(cards, states, now);
  assert.equal(summary.dueCount, 1);
  assert.equal(summary.newCount, 1);
  assert.equal(summary.totalCount, 3);

  const allQueue = buildVocabReviewQueue(cards, states, ALL_VOCAB_SOURCE_KEY, 12, now);
  assert.deepEqual(allQueue.cards.map((card) => card.id), ["due-card", "new-card", "scheduled-card"]);
  assert.equal(allQueue.totalCount, 3);

  const octoberQueue = buildVocabReviewQueue(cards, states, "october", 12, now);
  assert.deepEqual(octoberQueue.cards.map((card) => card.id), ["due-card", "scheduled-card"]);
  assert.equal(octoberQueue.totalCount, 2);
});

test("applyVocabReviewRating uses FSRS spaced repetition intervals", () => {
  const base = new Date("2026-03-10T12:00:00.000Z");

  // "Again": resets to step 0, 1-day interval, lapses incremented, repeat in session
  const again = applyVocabReviewRating(
    {
      step: 4,
      totalReviews: 8,
      lapses: 1,
      easeFactor: 2.5,
      difficulty: 0.3,
      stability: 1.2,
      lastInterval: 14,
      performanceHistory: [0.8, 0.5, 0.8, 0.2, 0.9],
    },
    "again",
    base
  );
  assert.equal(again.step, 0);
  assert.equal(again.dueAt.toISOString(), addDays(base, 1).toISOString());
  assert.equal(again.lapses, 2);
  assert.equal(again.shouldRepeatInSession, true);

  // "Hard" at step 0: advances to step 1, always 1-day interval (see again soon, no 4th button)
  const hardLow = applyVocabReviewRating(
    {
      step: 0,
      totalReviews: 1,
      lapses: 0,
      easeFactor: 2.5,
      difficulty: 0.0,
      stability: 0.0,
      lastInterval: 0,
      performanceHistory: [],
    },
    "hard",
    base
  );
  assert.equal(hardLow.step, 1);
  assert.equal(hardLow.dueAt.toISOString(), addDays(base, 1).toISOString(), "Hard = 1 day");
  assert.equal(hardLow.shouldRepeatInSession, false);

  // "Hard" on mature card: also 1 day (consistent "see again soon")
  const hardMature = applyVocabReviewRating(
    {
      step: 4,
      totalReviews: 8,
      lapses: 0,
      easeFactor: 2.5,
      difficulty: 0.3,
      stability: 1.2,
      lastInterval: 14,
      performanceHistory: [0.8, 0.8, 0.8, 0.8],
    },
    "hard",
    base
  );
  assert.equal(hardMature.dueAt.toISOString(), addDays(base, 1).toISOString(), "Hard on mature card = 1 day");

  // "Good" and "Easy": advance step, FSRS-calculated intervals
  const good = applyVocabReviewRating(
    {
      step: 1,
      totalReviews: 2,
      lapses: 0,
      easeFactor: 2.6,
      difficulty: 0.2,
      stability: 0.8,
      lastInterval: 3,
      performanceHistory: [0.8, 0.7],
    },
    "good",
    base
  );
  assert.equal(good.step, 2);
  assert.ok(good.dueAt.getTime() > base.getTime());
  assert.ok(good.lastInterval >= 1);

  const easy = applyVocabReviewRating(
    {
      step: 1,
      totalReviews: 2,
      lapses: 0,
      easeFactor: 2.6,
      difficulty: 0.1,
      stability: 0.8,
      lastInterval: 3,
      performanceHistory: [0.8, 0.9],
    },
    "easy",
    base
  );
  assert.equal(easy.step, 3);
  assert.ok(easy.dueAt.getTime() > base.getTime());
  assert.ok(easy.lastInterval >= 1);
});

test("getVocabReviewSummaryForUser falls back when FSRS columns are missing", async () => {
  const card: VocabReviewCardLike = {
    id: "due-card",
    term: "obstacle",
    definition: "something that blocks your way",
    example: null,
    audioPath: "/audio/vocab/obstacle.mp3",
    sourceKeys: ["october"],
    sourceLabels: ["Unit 2: October"],
    unitNumbers: [2],
    topics: ["Daily Life in the Community"],
    sortOrder: 1,
  };

  const legacyState: VocabReviewStateLike = {
    vocabCardId: "due-card",
    step: 1,
    dueAt: new Date("2026-03-09T12:00:00.000Z"),
    lastRating: "good",
    lastReviewedAt: new Date("2026-03-08T12:00:00.000Z"),
    totalReviews: 2,
    lapses: 0,
  };

  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      count: async () => 1,
      findMany: async () => [card],
    },
    userVocabReviewState: {
      findMany: async ({ select }: { select: Record<string, boolean> }) => {
        if ("easeFactor" in select) {
          throw { code: "P2022", meta: { column: "UserVocabReviewState.easeFactor" } };
        }
        return [legacyState];
      },
    },
  };

  const summary = await getVocabReviewSummaryForUser(db as never, "student-1", new Date("2026-03-10T12:00:00.000Z"));
  assert.equal(summary.totalCount, 1);
  assert.equal(summary.dueCount, 1);
  assert.equal(summary.newCount, 0);
});

test("saveVocabReviewRating falls back to legacy writes when FSRS columns are missing", async () => {
  const recordedUpserts: Array<{ update: Record<string, unknown>; create: Record<string, unknown> }> = [];

  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      findUnique: async () => ({ id: "card-1" }),
    },
    userVocabReviewState: {
      findUnique: async ({ select }: { select: Record<string, boolean> }) => {
        if ("easeFactor" in select) {
          throw { code: "P2022", meta: { column: "UserVocabReviewState.easeFactor" } };
        }
        return {
          step: 1,
          totalReviews: 2,
          lapses: 0,
        };
      },
      upsert: async (args: { update: Record<string, unknown>; create: Record<string, unknown> }) => {
        recordedUpserts.push({
          update: args.update,
          create: args.create,
        });
        return {
          step: 2,
          dueAt: new Date("2026-03-15T12:00:00.000Z"),
        };
      },
    },
  };

  const saved = await saveVocabReviewRating(db as never, "student-1", "card-1", "good", new Date("2026-03-10T12:00:00.000Z"));
  assert.ok(saved);
  assert.equal(recordedUpserts.length, 1);
  assert.equal("easeFactor" in recordedUpserts[0].update, false);
  assert.equal("performanceHistory" in recordedUpserts[0].create, false);
});
