import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TIMELINE_COMPARISON_QUESTIONS } from "@/data/timeline-comparison-questions";
import {
  getTenseComparisonOptionOrder,
  getTenseComparisonPromptLabel,
  isTenseComparisonSelectionCorrect,
  TenseComparisonExercise,
} from "@/components/games/TimelineTensesGame/exercises/TenseComparisonExercise";

const baseQuestion =
  TIMELINE_COMPARISON_QUESTIONS.find(
    (question) => question.id === "comp-fs-fc-02"
  ) ?? TIMELINE_COMPARISON_QUESTIONS[0];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TenseComparisonExercise", () => {
  it("randomizes timeline card order from the question data", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const html = renderToStaticMarkup(
      React.createElement(TenseComparisonExercise, {
        question: baseQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: false,
        lastAnswerCorrect: null,
      })
    );

    expect(getTenseComparisonOptionOrder(0.9)).toEqual(["B", "A"]);
    expect(html.indexOf("Timeline B")).toBeGreaterThan(-1);
    expect(html.indexOf("Timeline A")).toBeGreaterThan(-1);
    expect(html.indexOf("Timeline B")).toBeLessThan(html.indexOf("Timeline A"));
  });

  it("grades against the declared correct option instead of assuming A", () => {
    expect(baseQuestion.correctOption).toBe("B");
    expect(isTenseComparisonSelectionCorrect("B", baseQuestion.correctOption)).toBe(true);
    expect(isTenseComparisonSelectionCorrect("A", baseQuestion.correctOption)).toBe(false);
  });

  it("reveals both alternative sentences and the contrast explanation in feedback", () => {
    const html = renderToStaticMarkup(
      React.createElement(TenseComparisonExercise, {
        question: baseQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: true,
        lastAnswerCorrect: false,
      })
    );

    expect(html).toContain(baseQuestion.optionA.sentence);
    expect(html).toContain(baseQuestion.optionB.sentence);
    expect(html).toContain("Key Difference");
    expect(html).toContain(
      baseQuestion.keyDifference.replaceAll('"', "&quot;")
    );
    expect(html).toContain(`Correct match: Timeline ${baseQuestion.correctOption}`);
  });

  it("uses the prompt type to label the task", () => {
    expect(getTenseComparisonPromptLabel("sentence-to-timeline")).toBe(
      "Which timeline matches this sentence?"
    );
    expect(getTenseComparisonPromptLabel("clue-to-timeline")).toBe(
      "Which timeline matches this meaning clue?"
    );
  });
});
