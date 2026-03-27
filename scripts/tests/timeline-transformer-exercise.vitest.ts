import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TIMELINE_TRANSFORMER_QUESTIONS } from "@/data/timeline-transformer-questions";
import { SentenceTransformerExercise } from "@/components/games/TimelineTensesGame/exercises/SentenceTransformerExercise";

const transformerQuestion =
  TIMELINE_TRANSFORMER_QUESTIONS.find(
    (question) => question.id === "trans-ps-pc-01"
  ) ?? TIMELINE_TRANSFORMER_QUESTIONS[0];

describe("SentenceTransformerExercise", () => {
  it("renders natural rewrite guidance and a blanked target sentence with added context", () => {
    const html = renderToStaticMarkup(
      React.createElement(SentenceTransformerExercise, {
        question: transformerQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: false,
        lastAnswerCorrect: null,
      })
    );

    expect(html).toContain("Rewrite naturally in");
    expect(html).toContain(transformerQuestion.targetTense);
    expect(html).toContain("<span>when</span>");
    expect(html).toContain("<span>I</span>");
    expect(html).toContain("<span>called.</span>");
    expect(html).toContain("placeholder=\"___ (2 words)\"");
  });

  it("shows the full corrected target sentence in feedback", () => {
    const html = renderToStaticMarkup(
      React.createElement(SentenceTransformerExercise, {
        question: transformerQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: true,
        lastAnswerCorrect: true,
      })
    );

    expect(html).toContain("Correct Transformation:");
    expect(html).toContain(transformerQuestion.targetSentence);
    expect(html).toContain(transformerQuestion.explanation);
  });
});
