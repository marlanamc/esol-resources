import { describe, expect, it } from "vitest";
import {
  createLearnerContentMetadataCache,
  getLearnerContentMetadata,
  isLearnerVisibleActivity,
} from "@/lib/learner/visibility";

describe("learner visibility legacy release handling", () => {
  it("treats legacy content without a released flag as visible", () => {
    const cache = createLearnerContentMetadataCache();
    const content = JSON.stringify({
      type: "quiz",
      prompt: "Describe your neighborhood.",
    });

    expect(getLearnerContentMetadata(content, cache)).toEqual({
      type: "quiz",
      releasedInContent: true,
      hasExplicitReleasedField: false,
    });

    expect(
      isLearnerVisibleActivity(
        {
          type: "quiz",
          category: "quizzes",
          content,
        },
        cache
      )
    ).toBe(true);
  });

  it("keeps explicitly unreleased content hidden", () => {
    const content = JSON.stringify({
      type: "quiz",
      released: false,
      questions: [],
    });

    expect(
      isLearnerVisibleActivity({
        type: "quiz",
        category: "quizzes",
        content,
      })
    ).toBe(false);
  });

  it("uses cached isReleasedInContent when available", () => {
    const content = JSON.stringify({
      type: "speaking",
      prompt: "Introduce yourself.",
    });

    expect(
      isLearnerVisibleActivity({
        type: "speaking",
        category: "speaking",
        content,
        isReleasedInContent: false,
      })
    ).toBe(false);
  });
});
