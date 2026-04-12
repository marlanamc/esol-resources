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
  it("shows timeline A before timeline B in the question view (fixed order)", () => {
    const html = renderToStaticMarkup(
      React.createElement(TenseComparisonExercise, {
        question: baseQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: false,
        lastAnswerCorrect: null,
      })
    );

    expect(getTenseComparisonOptionOrder()).toEqual(["A", "B"]);
    expect(html.indexOf("Timeline B")).toBeGreaterThan(-1);
    expect(html.indexOf("Timeline A")).toBeGreaterThan(-1);
    expect(html.indexOf("Timeline A")).toBeLessThan(html.indexOf("Timeline B"));
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

    // Feedback uses highlightTimeClues(); sentences may be split across spans.
    expect(html).toMatch(/I will call you/);
    expect(html).toMatch(/will be working at 8/);
    expect(html).toContain("Key Difference");
    expect(html).toContain(
      baseQuestion.keyDifference.replaceAll('"', "&quot;")
    );
    const correctTense =
      baseQuestion.correctOption === "A" ? baseQuestion.tenseA : baseQuestion.tenseB;
    expect(html).toContain(
      `Correct match: Timeline ${baseQuestion.correctOption} = ${correctTense}`
    );
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
