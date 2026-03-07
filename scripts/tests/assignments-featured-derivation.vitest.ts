import { describe, it, expect } from "vitest";
import {
  buildActivitySubmissionMap,
  buildFeaturedAssignmentsWhere,
  deriveFeaturedAssignmentProgress,
  isWithinNewReleaseWindow,
} from "@/app/api/assignments/featured/route";

describe("assignments featured derivation", () => {
  it("buildFeaturedAssignmentsWhere excludes archived activities", () => {
    const where = buildFeaturedAssignmentsWhere(["class_1"]);
    expect(where.activity).toEqual({ deletedAt: null });
    expect(where.classId).toEqual({ in: ["class_1"] });
    expect(where.isFeatured).toBe(true);
  });

  it("buildActivitySubmissionMap indexes by activity ID and normalized title", () => {
    const map = buildActivitySubmissionMap([
      {
        activityId: "activity-a",
        score: 84,
        activity: { title: "Present Perfect Family" },
      },
    ]);

    expect(map.get("activity-a")).toEqual([84]);
    expect(map.get("title:present perfect family")).toEqual([84]);
  });

  it("deriveFeaturedAssignmentProgress marks grammar guide complete via title fallback", () => {
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

    expect(result.progress).toBe(100);
    expect(result.progressStatus).toBe("completed");
    expect(result.isNewRelease).toBe(true);
  });

  it("new release window is true within 24h and false afterward", () => {
    expect(isWithinNewReleaseWindow(new Date(Date.now() - 23 * 60 * 60 * 1000))).toBe(true);
    expect(isWithinNewReleaseWindow(new Date(Date.now() - 25 * 60 * 60 * 1000))).toBe(false);
  });
});
