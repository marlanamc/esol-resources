import { describe, it, expect } from "vitest";
import {
  resolveFinalProgressState,
  shouldAwardProgressPoints,
} from "@/app/api/activity/progress/route";

describe("activity progress points gating", () => {
  it("vocab type completion awards once", () => {
    const firstAward = shouldAwardProgressPoints({
      rawProgress: 100,
      progressValue: 100,
      vocabType: "word-list",
      updatedCategoryData: JSON.stringify({}),
      existingProgress: 0,
      existingCategoryData: {},
    });
    expect(firstAward).toBe(true);

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
    expect(duplicateAward).toBe(false);
  });

  it("round-based category awards once per round", () => {
    const firstRound = shouldAwardProgressPoints({
      rawProgress: 20,
      progressValue: 20,
      category: "round-3",
      updatedCategoryData: JSON.stringify({}),
      existingProgress: 0,
      existingCategoryData: {},
    });
    expect(firstRound).toBe(true);

    const repeatedRound = shouldAwardProgressPoints({
      rawProgress: 20,
      progressValue: 20,
      category: "round-3",
      updatedCategoryData: JSON.stringify({}),
      existingProgress: 20,
      existingCategoryData: { "round-3": { completed: true } },
    });
    expect(repeatedRound).toBe(false);
  });

  it("pronunciation activities always stay in-progress", () => {
    const result = resolveFinalProgressState({
      rawProgress: 100,
      statusInput: "completed",
      aggregatedProgress: 100,
      isPronunciationPracticeActivity: true,
    });

    expect(result.progressValue).toBe(0);
    expect(result.finalStatus).toBe("in_progress");
  });
});
