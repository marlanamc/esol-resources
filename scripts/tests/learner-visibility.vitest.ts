import { describe, expect, it } from "vitest";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";

describe("learner visibility — isReleased gate", () => {
  it("shows a released quiz", () => {
    expect(isLearnerVisibleActivity({ type: "quiz", category: "quizzes", isReleased: true })).toBe(true);
  });

  it("hides an unreleased quiz", () => {
    expect(isLearnerVisibleActivity({ type: "quiz", category: "quizzes", isReleased: false })).toBe(false);
  });

  it("hides a quiz with no isReleased field", () => {
    expect(isLearnerVisibleActivity({ type: "quiz", category: "quizzes" })).toBe(false);
  });

  it("shows a released grammar guide", () => {
    expect(isLearnerVisibleActivity({ type: "guide", category: "grammar", isReleased: true })).toBe(true);
  });

  it("hides an unreleased grammar guide", () => {
    expect(isLearnerVisibleActivity({ type: "guide", category: "grammar", isReleased: false })).toBe(false);
  });

  it("always hides speaking activities from student browse", () => {
    expect(isLearnerVisibleActivity({ type: "speaking", category: "speaking", isReleased: true })).toBe(false);
  });

  it("hides deleted activities", () => {
    expect(isLearnerVisibleActivity({ type: "game", category: "games", deletedAt: new Date() })).toBe(false);
  });

  it("shows non-gated practice activities without isReleased", () => {
    expect(isLearnerVisibleActivity({ type: "game", category: "games" })).toBe(true);
  });
});
