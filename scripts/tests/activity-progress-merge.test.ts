import test from "node:test";
import assert from "node:assert/strict";
import {
  buildProgressGetResponse,
  chooseBestProgressRecord,
  mergeVocabProgressRecords,
} from "@/app/api/activity/progress/route";

test("mergeVocabProgressRecords keeps max progress per vocab type", () => {
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
  assert.ok(merged);
  assert.equal(merged.progress, 75);
  assert.equal(merged.status, "in_progress");
  assert.equal(merged.updatedAt.toISOString(), "2026-03-04T10:00:00.000Z");

  const mergedData = JSON.parse(merged.categoryData || "{}");
  assert.equal(mergedData["word-list"].progress, 100);
  assert.equal(mergedData["word-list"].completed, true);
  assert.equal(mergedData.flashcards.completed, true);
  assert.equal(mergedData.matching.completed, true);
});

test("chooseBestProgressRecord picks highest progress, then newest updatedAt", () => {
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

  assert.equal(chooseBestProgressRecord([]), null);
  assert.deepEqual(chooseBestProgressRecord([lower, olderHigher]), olderHigher);
  assert.deepEqual(
    chooseBestProgressRecord([olderHigher, newerHigher]),
    newerHigher
  );
});

test("buildProgressGetResponse always sets no-store cache header", async () => {
  const response = buildProgressGetResponse({
    progress: 50,
    status: "in_progress",
    categoryData: null,
    updatedAt: null,
  });

  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const body = await response.json();
  assert.equal(body.progress, 50);
  assert.equal(body.status, "in_progress");
});

