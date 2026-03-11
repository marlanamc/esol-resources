import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_VOCAB_SOURCE_KEY,
} from "@/lib/vocab-review-sources";
import {
  addDays,
  applyVocabReviewRating,
  buildVocabReviewQueue,
  buildVocabReviewSeedCards,
  buildVocabReviewSummary,
  normalizeVocabTerm,
  type VocabReviewCardLike,
  type VocabReviewStateLike,
} from "@/lib/vocab-review";

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
  assert.deepEqual(allQueue.cards.map((card) => card.id), ["due-card", "new-card"]);
  assert.equal(allQueue.totalCount, 2);

  const octoberQueue = buildVocabReviewQueue(cards, states, "october", 12, now);
  assert.deepEqual(octoberQueue.cards.map((card) => card.id), ["due-card", "scheduled-card"]);
  assert.equal(octoberQueue.totalCount, 2);
});

test("applyVocabReviewRating uses the expected spaced repetition intervals", () => {
  const base = new Date("2026-03-10T12:00:00.000Z");

  const again = applyVocabReviewRating({ step: 4, totalReviews: 8, lapses: 1 }, "again", base);
  assert.equal(again.step, 0);
  assert.equal(again.dueAt.toISOString(), "2026-03-10T16:00:00.000Z");
  assert.equal(again.lapses, 2);
  assert.equal(again.shouldRepeatInSession, true);

  const hardLow = applyVocabReviewRating({ step: 0, totalReviews: 1, lapses: 0 }, "hard", base);
  assert.equal(hardLow.step, 1);
  assert.equal(hardLow.dueAt.toISOString(), addDays(base, 1).toISOString());

  const hardHigh = applyVocabReviewRating({ step: 4, totalReviews: 6, lapses: 0 }, "hard", base);
  assert.equal(hardHigh.step, 3);
  assert.equal(hardHigh.dueAt.toISOString(), addDays(base, 14).toISOString());

  const good = applyVocabReviewRating({ step: 1, totalReviews: 2, lapses: 0 }, "good", base);
  assert.equal(good.step, 2);
  assert.equal(good.dueAt.toISOString(), addDays(base, 7).toISOString());

  const easy = applyVocabReviewRating({ step: 1, totalReviews: 2, lapses: 0 }, "easy", base);
  assert.equal(easy.step, 3);
  assert.equal(easy.dueAt.toISOString(), addDays(base, 14).toISOString());
});
