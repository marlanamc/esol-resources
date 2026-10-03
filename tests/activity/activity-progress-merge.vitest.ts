import { describe, it, expect } from "vitest";
import { applyProgressCategoryUpdates } from "@/lib/activity/progress/category-updates";
import { buildProgressGetResponse } from "@/lib/activity/progress";
import {
  chooseBestProgressRecord,
  mergeVocabProgressRecords,
} from "@/lib/vocab/progress-merge";

describe("activity progress merge", () => {
  it("mergeVocabProgressRecords keeps max progress per vocab type", () => {
    const assignmentRecord = {
      progress: 50,
      status: "in_progress",
      categoryData: JSON.stringify({
        "word-list": { progress: 50, completed: false },
        matching: { progress: 100, completed: true },
      }),
      updatedAt: new Date("2026-03-03T10:00:00.000Z"),
    };

    const globalRecord = {
      progress: 25,
      status: "in_progress",
      categoryData: JSON.stringify({
        "word-list": { progress: 100, completed: true },
        flashcards: { progress: 100, completed: true },
      }),
      updatedAt: new Date("2026-03-04T10:00:00.000Z"),
    };

    const merged = mergeVocabProgressRecords(assignmentRecord, globalRecord);
    expect(merged).toBeTruthy();
    if (!merged) return;
    expect(merged.progress).toBe(75);
    expect(merged.status).toBe("in_progress");
    expect(merged.updatedAt.toISOString()).toBe("2026-03-04T10:00:00.000Z");

    const mergedData = JSON.parse(merged.categoryData || "{}");
    expect(mergedData["word-list"].progress).toBe(100);
    expect(mergedData["word-list"].completed).toBe(true);
    expect(mergedData.flashcards.completed).toBe(true);
    expect(mergedData.matching.completed).toBe(true);
  });

  it("chooseBestProgressRecord picks highest progress, then newest updatedAt", () => {
    const olderHigher = {
      progress: 80,
      status: "in_progress",
      categoryData: null,
      updatedAt: new Date("2026-03-03T10:00:00.000Z"),
    };
    const newerHigher = {
      progress: 80,
      status: "in_progress",
      categoryData: null,
      updatedAt: new Date("2026-03-04T10:00:00.000Z"),
    };
    const lower = {
      progress: 20,
      status: "in_progress",
      categoryData: null,
      updatedAt: new Date("2026-03-05T10:00:00.000Z"),
    };

    expect(chooseBestProgressRecord([])).toBeNull();
    expect(chooseBestProgressRecord([lower, olderHigher])).toEqual(olderHigher);
    expect(chooseBestProgressRecord([olderHigher, newerHigher])).toEqual(newerHigher);
  });

  it("buildProgressGetResponse always sets no-store cache header", async () => {
    const response = buildProgressGetResponse({
      progress: 50,
      status: "in_progress",
      categoryData: null,
      updatedAt: null,
    });

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const body = await response.json();
    expect(body.progress).toBe(50);
    expect(body.status).toBe("in_progress");
  });
});


describe("revised grammar guide progress", () => {
  it("keeps retired section evidence and exercise rewards when saving the shorter guide", () => {
    const exercises = { "your-study-toolkit:vfo-reference-practice": { completed: true, pointsAwarded: 5 } };
    const result = applyProgressCategoryUpdates({
      currentData: { _guide: { completedSectionIds: ["your-study-toolkit", "five-codes"] }, exercises, totalExercisePoints: 5 },
      rawProgress: 60,
      guideState: { lastSectionIndex: 1, completedSectionIds: ["five-codes", "present-forms"] },
    });
    expect(result.currentData._guide).toEqual({ lastSectionIndex: 1, completedSectionIds: ["your-study-toolkit", "five-codes", "present-forms"] });
    expect(result.currentData.exercises).toEqual(exercises);
    expect(result.currentData.totalExercisePoints).toBe(5);
  });
});
