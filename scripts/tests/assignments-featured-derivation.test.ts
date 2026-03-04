import test from "node:test";
import assert from "node:assert/strict";
import {
  buildActivitySubmissionMap,
  buildFeaturedAssignmentsWhere,
  deriveFeaturedAssignmentProgress,
  isWithinNewReleaseWindow,
} from "@/app/api/assignments/featured/route";

test("buildFeaturedAssignmentsWhere excludes archived activities", () => {
  const where = buildFeaturedAssignmentsWhere(["class_1"]);
  assert.deepEqual(where.activity, { deletedAt: null });
  assert.deepEqual(where.classId, { in: ["class_1"] });
  assert.equal(where.isFeatured, true);
});

test("buildActivitySubmissionMap indexes by activity ID and normalized title", () => {
  const map = buildActivitySubmissionMap([
    {
      activityId: "activity-a",
      score: 84,
      activity: { title: "Present Perfect Family" },
    },
  ]);

  assert.deepEqual(map.get("activity-a"), [84]);
  assert.deepEqual(map.get("title:present perfect family"), [84]);
});

test("deriveFeaturedAssignmentProgress marks grammar guide complete via title fallback", () => {
  const assignment = {
    activityId: "assigned-id",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
    activity: {
      type: "guide",
      category: "grammar",
      title: "Present Perfect Family",
    },
  };

  const map = buildActivitySubmissionMap([
    {
      activityId: "canonical-id",
      score: 75,
      activity: { title: "Present Perfect Family" },
    },
  ]);

  const result = deriveFeaturedAssignmentProgress({
    assignment,
    progress: { progress: 0, status: "in_progress", categoryData: null },
    activitySubmissionMap: map,
  });

  assert.equal(result.progress, 100);
  assert.equal(result.progressStatus, "completed");
  assert.equal(result.isNewRelease, true);
});

test("new release window is true within 24h and false afterward", () => {
  assert.equal(
    isWithinNewReleaseWindow(new Date(Date.now() - 23 * 60 * 60 * 1000)),
    true
  );
  assert.equal(
    isWithinNewReleaseWindow(new Date(Date.now() - 25 * 60 * 60 * 1000)),
    false
  );
});

