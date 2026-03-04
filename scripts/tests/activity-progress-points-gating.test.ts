import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveFinalProgressState,
  shouldAwardProgressPoints,
} from "@/app/api/activity/progress/route";

test("vocab type completion awards once", () => {
  const firstAward = shouldAwardProgressPoints({
    rawProgress: 100,
    progressValue: 100,
    vocabType: "word-list",
    updatedCategoryData: JSON.stringify({}),
    existingProgress: 0,
    existingCategoryData: {},
  });
  assert.equal(firstAward, true);

  const duplicateAward = shouldAwardProgressPoints({
    rawProgress: 100,
    progressValue: 100,
    vocabType: "word-list",
    updatedCategoryData: JSON.stringify({}),
    existingProgress: 100,
    existingCategoryData: {
      "word-list": { completed: true },
    },
  });
  assert.equal(duplicateAward, false);
});

test("round-based category awards once per round", () => {
  const firstRound = shouldAwardProgressPoints({
    rawProgress: 20,
    progressValue: 20,
    category: "round-3",
    updatedCategoryData: JSON.stringify({}),
    existingProgress: 0,
    existingCategoryData: {},
  });
  assert.equal(firstRound, true);

  const repeatedRound = shouldAwardProgressPoints({
    rawProgress: 20,
    progressValue: 20,
    category: "round-3",
    updatedCategoryData: JSON.stringify({}),
    existingProgress: 20,
    existingCategoryData: { "round-3": { completed: true } },
  });
  assert.equal(repeatedRound, false);
});

test("pronunciation activities always stay in-progress", () => {
  const result = resolveFinalProgressState({
    rawProgress: 100,
    statusInput: "completed",
    aggregatedProgress: 100,
    isPronunciationPracticeActivity: true,
  });

  assert.equal(result.progressValue, 0);
  assert.equal(result.finalStatus, "in_progress");
});

