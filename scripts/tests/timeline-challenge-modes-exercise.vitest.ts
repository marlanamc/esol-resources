import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TIMELINE_CONTEXT_QUESTIONS } from "@/data/timeline-context-questions";
import { TIMELINE_ERROR_QUESTIONS } from "@/data/timeline-error-questions";
import { TIMELINE_STORY_QUESTIONS } from "@/data/timeline-story-questions";
import { ContextTenseExercise } from "@/components/games/TimelineTensesGame/exercises/ContextTenseExercise";
import {
  isErrorCorrectionAnswerCorrect,
} from "@/components/games/TimelineTensesGame/exercises/ErrorCorrectionExercise";
import {
  extractStoryBlankHint,
  buildStorySentenceReviewText,
  StoryBuilderExercise,
} from "@/components/games/TimelineTensesGame/exercises/StoryBuilderExercise";

const contextQuestion =
  TIMELINE_CONTEXT_QUESTIONS.find((question) => question.id === "ctx-06") ??
  TIMELINE_CONTEXT_QUESTIONS[0];
const errorQuestion =
  TIMELINE_ERROR_QUESTIONS.find((question) => question.id === "err-s-04") ??
  TIMELINE_ERROR_QUESTIONS[0];
const storyQuestion =
  TIMELINE_STORY_QUESTIONS.find((question) => question.id === "story-02") ??
  TIMELINE_STORY_QUESTIONS[0];

describe("Timeline challenge exercise behavior", () => {
  it("does not reveal context clue chips before submission", () => {
    const html = renderToStaticMarkup(
      React.createElement(ContextTenseExercise, {
        question: contextQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: false,
        lastAnswerCorrect: null,
      })
    );

    expect(html).not.toContain("clue:");
    expect(html).not.toContain("<mark");
  });

  it("reveals highlighted clue text after submission", () => {
    const html = renderToStaticMarkup(
      React.createElement(ContextTenseExercise, {
        question: contextQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: true,
        lastAnswerCorrect: true,
      })
    );

    expect(html).toContain("<mark");
  });

  it("rejects a bare tense label for sentence-level error correction", () => {
    expect(isErrorCorrectionAnswerCorrect(errorQuestion, errorQuestion.correctTense)).toBe(
      false
    );
    expect(
      isErrorCorrectionAnswerCorrect(errorQuestion, errorQuestion.correctSentence)
    ).toBe(true);
    expect(isErrorCorrectionAnswerCorrect(errorQuestion, "was working")).toBe(true);
  });

  it("renders multi-blank story review text with each authored answer", () => {
    const sentence = storyQuestion.sentences[2];
    const reviewText = buildStorySentenceReviewText(sentence.template, sentence.blanks);

    expect(reviewText).toContain("was waiting");
    expect(reviewText).toContain("was feeling");
  });

  it("shows the base verb hint above story-builder blanks", () => {
    const firstSentence = TIMELINE_STORY_QUESTIONS.find(
      (question) => question.id === "story-03"
    )?.sentences[0];

    expect(firstSentence).toBeDefined();
    if (!firstSentence) {
      throw new Error("Expected story-03 first sentence");
    }

    const templateWords = firstSentence.template.split(/\s+/);
    expect(extractStoryBlankHint(templateWords, firstSentence.blanks[0]?.index ?? -1)).toBe(
      "visit"
    );

    const html = renderToStaticMarkup(
      React.createElement(StoryBuilderExercise, {
        question: TIMELINE_STORY_QUESTIONS.find((question) => question.id === "story-03") ?? storyQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: false,
        lastAnswerCorrect: null,
      })
    );

    expect(html).toContain(">visit<");
    expect(html).toContain("Use the base verb visit");
  });

  it("shows the completed story review in feedback", () => {
    const html = renderToStaticMarkup(
      React.createElement(StoryBuilderExercise, {
        question: storyQuestion,
        onSubmit: () => {},
        onNext: () => {},
        showFeedback: true,
        lastAnswerCorrect: true,
      })
    );

    expect(html).toContain("Story Complete!");
    expect(html).toContain("had already started");
    expect(html).toContain("was waiting");
    expect(html).toContain("was feeling");
  });
});
