import { describe, expect, it } from "vitest";
import { TIMELINE_COMPARISON_QUESTIONS } from "@/data/timeline-comparison-questions";
import { TIMELINE_CONTEXT_QUESTIONS } from "@/data/timeline-context-questions";
import { buildCanonicalTimelineElements } from "@/data/timeline-challenge-stamp-canon";
import { TIMELINE_ERROR_QUESTIONS } from "@/data/timeline-error-questions";
import { TIMELINE_STORY_QUESTIONS } from "@/data/timeline-story-questions";
import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
import { CATEGORIZED_TUTORIAL_QUESTIONS } from "@/data/timeline-tenses-tutorial";
import { TIMELINE_TRANSFORMER_QUESTIONS } from "@/data/timeline-transformer-questions";
import type {
  TimelineElement,
  TimelineTensesQuestion,
  TimelineToVerbQuestion,
} from "@/types/activity";
import {
  buildTimelineRoundQuestions,
  calculateTimelineOverallProgress,
  elementsUseSplitPast,
  inferTimelineLabFeedback,
  getSentenceToTimelineStampGuidance,
  parseTimelineSentenceTemplate,
  resolveTimelineConnectionPartner,
  validateTimelineDrawingElements,
  validateTimelineVerbAnswers,
} from "@/components/games/TimelineTensesGame/timelineTensesUtils";

function getTimelineVerbQuestion(id: string): TimelineToVerbQuestion {
  const question = TIMELINE_TENSES_QUESTIONS.find(
    (candidate) => candidate.type === "timeline-to-verb" && candidate.id === id
  );

  if (!question || question.type !== "timeline-to-verb") {
    throw new Error(`Unable to find timeline-to-verb question: ${id}`);
  }

  return question;
}

function normalizeTimelineElementType(type: TimelineElement["type"]): string {
  switch (type) {
    case "dashed-line":
      return "solid-line";
    case "arc-dashed":
      return "arc";
    case "solid-to-point":
      return "solid-to-now";
    default:
      return type;
  }
}

function buildNormalizedSignature(elements: TimelineElement[]): string {
  const useStrictPast = elements.some(
    (element) =>
      element.zone === "past-earlier" || element.zone === "past-later"
  );

  return elements
    .map((element) => {
      const normalizedZone =
        useStrictPast || element.zone === "present" || element.zone === "future"
          ? element.zone
          : "past";

      return `${normalizeTimelineElementType(element.type)}:${normalizedZone}`;
    })
    .sort()
    .join("|");
}

function collectTimelineElementSets(): Array<{
  id: string;
  label: string;
  elements: TimelineElement[];
}> {
  return [
    ...TIMELINE_CONTEXT_QUESTIONS.flatMap((question) =>
      question.options.map((option, index) => ({
        id: question.id,
        label: `context-option-${index}`,
        elements: option.elements,
      }))
    ),
    ...TIMELINE_COMPARISON_QUESTIONS.flatMap((question) => [
      { id: question.id, label: "comparison-a", elements: question.elementsA },
      { id: question.id, label: "comparison-b", elements: question.elementsB },
    ]),
    ...TIMELINE_TRANSFORMER_QUESTIONS.flatMap((question) => [
      { id: question.id, label: "transformer-source", elements: question.sourceElements },
      { id: question.id, label: "transformer-target", elements: question.targetElements },
    ]),
    ...TIMELINE_ERROR_QUESTIONS.flatMap((question) => [
      { id: question.id, label: "error-incorrect", elements: question.incorrectElements },
      { id: question.id, label: "error-correct", elements: question.correctElements },
    ]),
    ...TIMELINE_STORY_QUESTIONS.flatMap((question) => [
      ...question.sentences.map((sentence, index) => ({
        id: question.id,
        label: `story-sentence-${index}`,
        elements: sentence.elements,
      })),
      { id: question.id, label: "story-full", elements: question.fullTimelineElements },
    ]),
  ];
}

function getTransformerQuestion(id: string) {
  const question = TIMELINE_TRANSFORMER_QUESTIONS.find(
    (candidate) => candidate.id === id
  );

  if (!question) {
    throw new Error(`Unable to find transformer question: ${id}`);
  }

  return question;
}

function extractStoryCharacterTokens(story: string): string[] {
  return [...story.matchAll(/\b[A-Z][a-z]+\b/g)].map((match) => match[0]);
}

describe("timeline tenses utils", () => {
  it("avoids duplicate noun labels inside slash-style blank prompts", () => {
    const suspiciousPrefixes = new Set([
      "not",
      "already",
      "still",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "what",
      "when",
      "where",
      "why",
      "how",
    ]);

    const offenders = TIMELINE_TENSES_QUESTIONS
      .filter(
        (question): question is TimelineToVerbQuestion =>
          question.type === "timeline-to-verb"
      )
      .flatMap((question) =>
        [...question.sentenceTemplate.matchAll(/___\[([^\]]+)\]___/g)]
          .map((match) => match[1])
          .filter((token) => token.includes("/"))
          .map((token) => {
            const prefix = token.split("/")[0]?.toLowerCase().trim();
            if (!prefix || suspiciousPrefixes.has(prefix)) {
              return null;
            }

            const duplicateNounPattern = new RegExp(
              `\\b(?:a|an|the)\\s+${prefix}\\s+___\\[${token.replace("/", "\\/")}\\]___`,
              "i"
            );

            return duplicateNounPattern.test(question.sentenceTemplate)
              ? `${question.id}:${token}`
              : null;
          })
          .filter((value): value is string => value !== null)
      );

    expect(offenders).toEqual([]);
  });

  it("parses duplicate base-verb blanks with stable blank ids", () => {
    const question = getTimelineVerbQuestion("ps-verb-1");
    const parts = parseTimelineSentenceTemplate(question);
    const blankParts = parts.filter((part) => part.type === "blank");

    expect(blankParts).toHaveLength(2);
    expect(blankParts.map((part) => part.blankId)).toEqual(["b1", "b2"]);
    expect(blankParts.map((part) => part.content)).toEqual(["move", "move"]);
  });

  it("grades duplicate base-verb blanks independently", () => {
    const question = getTimelineVerbQuestion("mixed-future-1");
    const correct = validateTimelineVerbAnswers(question, {
      b1: "live",
      b2: "will live",
    });
    const incorrect = validateTimelineVerbAnswers(question, {
      b1: "live",
      b2: "live",
    });

    expect(correct.allCorrect).toBe(true);
    expect(correct.blankResults.map((result) => result.isCorrect)).toEqual([
      true,
      true,
    ]);
    expect(incorrect.allCorrect).toBe(false);
    expect(incorrect.blankResults.map((result) => result.isCorrect)).toEqual([
      true,
      false,
    ]);
  });

  it("rejects answers that shift the intended tense focus", () => {
    const presentPerfect = getTimelineVerbQuestion("pp-verb-1");
    const presentPerfectContinuous = getTimelineVerbQuestion("ppc-verb-1");

    expect(
      validateTimelineVerbAnswers(presentPerfect, { b1: "have lived" }).allCorrect
    ).toBe(true);
    expect(
      validateTimelineVerbAnswers(presentPerfect, { b1: "have been living" })
        .allCorrect
    ).toBe(false);

    expect(
      validateTimelineVerbAnswers(presentPerfectContinuous, {
        b1: "have been living",
      }).allCorrect
    ).toBe(true);
    expect(
      validateTimelineVerbAnswers(presentPerfectContinuous, { b1: "have lived" })
        .allCorrect
    ).toBe(false);
  });

  it("treats repeated present continuous as a present continuous timeline", () => {
    const repeatedPresentContinuous = TIMELINE_TENSES_QUESTIONS.find(
      (question) => question.type === "sentence-to-timeline" && question.id === "pc-temp-1"
    );

    expect(repeatedPresentContinuous).toBeDefined();
    expect(repeatedPresentContinuous?.type).toBe("sentence-to-timeline");

    if (!repeatedPresentContinuous || repeatedPresentContinuous.type !== "sentence-to-timeline") {
      throw new Error("Expected pc-temp-1 sentence-to-timeline question");
    }

    expect(
      validateTimelineDrawingElements(repeatedPresentContinuous.correctElements, [
        { type: "solid-line", zone: "present" },
      ])
    ).toBe(true);

    expect(
      validateTimelineDrawingElements(repeatedPresentContinuous.correctElements, [
        { type: "multiple-dots", zone: "present" },
      ])
    ).toBe(false);
  });

  it("describes past perfect continuous extra stamps as a reference point pattern", () => {
    const pastPerfectContinuous = TIMELINE_TENSES_QUESTIONS.find(
      (question) => question.type === "sentence-to-timeline" && question.id === "ppfc-1"
    );

    expect(pastPerfectContinuous).toBeDefined();
    expect(pastPerfectContinuous?.type).toBe("sentence-to-timeline");

    if (!pastPerfectContinuous || pastPerfectContinuous.type !== "sentence-to-timeline") {
      throw new Error("Expected ppfc-1 sentence-to-timeline question");
    }

    expect(
      getSentenceToTimelineStampGuidance(pastPerfectContinuous.correctElements)
    ).toEqual({
      badgeText: "2 stamps: action + past reference point",
      hintText:
        "Place the long action in the earlier past, then add one recent-past dot for the reference moment.",
    });
  });

  it("builds rounds without mutating the full question bank and returns the requested size", () => {
    const originalLength = TIMELINE_TENSES_QUESTIONS.length;
    const round = buildTimelineRoundQuestions(
      TIMELINE_TENSES_QUESTIONS,
      [],
      "read-the-timeline",
      12
    );

    expect(TIMELINE_TENSES_QUESTIONS).toHaveLength(originalLength);
    expect(round).toHaveLength(12);
  });

  it("gives spot-the-difference questions explicit prompt metadata and balanced correct sides", () => {
    expect(TIMELINE_COMPARISON_QUESTIONS.length).toBeGreaterThanOrEqual(24);

    const correctA = TIMELINE_COMPARISON_QUESTIONS.filter(
      (question) => question.correctOption === "A"
    );
    const correctB = TIMELINE_COMPARISON_QUESTIONS.filter(
      (question) => question.correctOption === "B"
    );

    expect(correctA.length).toBeGreaterThan(0);
    expect(correctB.length).toBeGreaterThan(0);

    for (const question of TIMELINE_COMPARISON_QUESTIONS) {
      expect(question.promptText.trim().length).toBeGreaterThan(0);
      expect(question.promptType).toBeTruthy();
      expect(question.optionA.sentence.trim().length).toBeGreaterThan(0);
      expect(question.optionB.sentence.trim().length).toBeGreaterThan(0);
      expect(
        question.correctOption === "A"
          ? question.promptText
          : question.correctOption === "B"
            ? question.promptText
            : ""
      ).toBe(
        question.correctOption === "A"
          ? question.optionA.sentence
          : question.optionB.sentence
      );
    }
  });

  it("builds spot-the-difference rounds from tense-comparison questions only", () => {
    const allChallengeQuestions = [
      ...TIMELINE_TENSES_QUESTIONS,
      ...TIMELINE_COMPARISON_QUESTIONS,
      ...TIMELINE_TRANSFORMER_QUESTIONS,
      ...TIMELINE_CONTEXT_QUESTIONS,
      ...TIMELINE_ERROR_QUESTIONS,
      ...TIMELINE_STORY_QUESTIONS,
    ];

    const round = buildTimelineRoundQuestions(
      allChallengeQuestions,
      [],
      "spot-the-difference",
      5
    );

    expect(round).toHaveLength(5);
    expect(round.every((question) => question.type === "tense-comparison")).toBe(true);
  });

  it("uses natural framing for transformer targets that need added context", () => {
    const weakPairs = TIMELINE_TRANSFORMER_QUESTIONS.flatMap((question) => {
      const target = question.targetSentence.toLowerCase();

      if (question.targetTense === "Past Continuous") {
        const hasPastFrame =
          target.includes("when ") ||
          target.includes("while ") ||
          target.includes("at that moment") ||
          target.includes("for ");
        return hasPastFrame ? [] : [question.id];
      }

      if (question.targetTense === "Future Continuous") {
        const hasFutureViewpoint =
          target.includes("at this time") ||
          target.includes("at ") ||
          target.includes("tomorrow") ||
          target.includes("next ");
        return hasFutureViewpoint ? [] : [question.id];
      }

      if (question.targetTense === "Present Perfect Continuous") {
        const hasDurationCue =
          target.includes("for ") ||
          target.includes("since ") ||
          target.includes("all ");
        return hasDurationCue ? [] : [question.id];
      }

      if (question.targetTense === "Past Perfect Continuous") {
        const hasLeadUpCue =
          target.includes("for ") ||
          target.includes("since ") ||
          target.includes("because ");
        return hasLeadUpCue ? [] : [question.id];
      }

      return [];
    });

    expect(weakPairs).toEqual([]);
  });

  it("keeps transformer blank indices aligned after context is added", () => {
    for (const question of TIMELINE_TRANSFORMER_QUESTIONS) {
      const targetWords = question.targetSentence.split(/\s+/);

      for (const blank of question.verbBlanks) {
        const sampleAnswer = blank.validAnswers[0];
        const spanLength = sampleAnswer.split(" ").length;
        const targetSlice = targetWords
          .slice(blank.index, blank.index + spanLength)
          .join(" ")
          .replace(/[.,!?;:]+$/g, "");

        expect(sampleAnswer.replace(/[.,!?;:]+$/g, "")).toBe(targetSlice);
      }
    }
  });

  it("accepts only the authored target tense form for the rewritten transformer prompts", () => {
    const pastContinuous = getTransformerQuestion("trans-ps-pc-01");
    const presentPerfect = getTransformerQuestion("trans-ps-pp-02");

    expect(pastContinuous.verbBlanks[0]?.validAnswers).toEqual(["was cooking"]);
    expect(presentPerfect.verbBlanks[0]?.validAnswers).toEqual(["has finished"]);
  });

  it("keeps each in-context question to exactly one correct option", () => {
    for (const question of TIMELINE_CONTEXT_QUESTIONS) {
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
    }
  });

  it("ensures every sentence-level fix-it item contains a real error", () => {
    const sentenceItems = TIMELINE_ERROR_QUESTIONS.filter(
      (question) => question.errorLocation === "sentence"
    );

    for (const question of sentenceItems) {
      expect(question.incorrectSentence).not.toBe(question.correctSentence);
    }
  });

  it("keeps story-builder blank indices aligned for every sentence", () => {
    for (const question of TIMELINE_STORY_QUESTIONS) {
      for (const sentence of question.sentences) {
        const words = sentence.template.split(/\s+/);

        for (const blank of sentence.blanks) {
          expect(words[blank.index]).toBe("___");
        }
      }
    }
  });

  it("uses explicit time-shift cues in mixed-time story sentences", () => {
    const cuePattern = /\b(now|right now|at |before|when|while|by |so far today|every saturday|at that moment)\b/i;
    const missingCues = TIMELINE_STORY_QUESTIONS.flatMap((question) =>
      question.sentences
        .filter((sentence) => !cuePattern.test(sentence.template))
        .map((sentence) => `${question.id}:${sentence.template}`)
    );

    expect(missingCues).toEqual([]);
  });

  it("uses a wider variety of names and roles in story-builder prompts", () => {
    const storyText = TIMELINE_STORY_QUESTIONS.flatMap((question) => [
      question.storyTitle,
      question.storyPrompt,
      ...question.sentences.map((sentence) => sentence.template),
    ]).join(" ");

    const tokens = extractStoryCharacterTokens(storyText);
    const repeatedDefaultNames = tokens.filter((token) =>
      ["Maria", "Carlos", "Ana"].includes(token)
    );
    const uniqueNames = new Set(
      tokens.filter((token) => ["Nina", "Jordan", "Tasha"].includes(token))
    );

    expect(repeatedDefaultNames).toEqual([]);
    expect(uniqueNames.size).toBeGreaterThanOrEqual(3);
  });

  it("keeps early all-tenses rounds focused on common simple and basic continuous forms", () => {
    const round = buildTimelineRoundQuestions(
      TIMELINE_TENSES_QUESTIONS,
      [],
      "build-the-timeline",
      12,
      "affirmative",
      1
    );

    expect(round).toHaveLength(12);
    expect(round.every((question) => question.difficulty === 1)).toBe(true);
    expect(
      round.every(
        (question) =>
          question.tenseCategory === "simple" ||
          question.tenseCategory === "continuous"
      )
    ).toBe(true);

    const simpleCount = round.filter(
      (question) => question.tenseCategory === "simple"
    ).length;
    const continuousCount = round.filter(
      (question) => question.tenseCategory === "continuous"
    ).length;

    expect(simpleCount).toBeGreaterThan(continuousCount);
    expect(
      round.some(
        (question) =>
          question.type === "sentence-to-timeline" &&
          question.tenseName.includes("Past Perfect")
      )
    ).toBe(false);
    expect(
      round.some(
        (question) =>
          question.type === "sentence-to-timeline" &&
          question.tenseName.includes("Future Perfect")
      )
    ).toBe(false);
  });

  it("fills all-tenses rounds from the next category when early quotas run short", () => {
    const customBank: TimelineTensesQuestion[] = [
      {
        type: "sentence-to-timeline",
        id: "custom-simple-1",
        sentence: "I cook every day.",
        correctElements: [{ id: "e1", type: "multiple-dots", zone: "present", position: 50 }],
        tenseName: "Present Simple",
        explanation: "Routine action",
        difficulty: 1,
        tenseCategory: "simple",
        sentenceForm: "affirmative",
      },
      {
        type: "sentence-to-timeline",
        id: "custom-simple-2",
        sentence: "I cleaned yesterday.",
        correctElements: [{ id: "e1", type: "single-dot", zone: "past", position: 50 }],
        tenseName: "Past Simple",
        explanation: "Finished action",
        difficulty: 1,
        tenseCategory: "simple",
        sentenceForm: "affirmative",
      },
      {
        type: "sentence-to-timeline",
        id: "custom-simple-3",
        sentence: "I will rest tonight.",
        correctElements: [{ id: "e1", type: "single-dot", zone: "future", position: 50 }],
        tenseName: "Future Simple",
        explanation: "Future plan",
        difficulty: 1,
        tenseCategory: "simple",
        sentenceForm: "affirmative",
      },
      {
        type: "sentence-to-timeline",
        id: "custom-cont-1",
        sentence: "I am cooking now.",
        correctElements: [{ id: "e1", type: "solid-line", zone: "present", position: 50 }],
        tenseName: "Present Continuous",
        explanation: "Action in progress",
        difficulty: 1,
        tenseCategory: "continuous",
        sentenceForm: "affirmative",
      },
      {
        type: "sentence-to-timeline",
        id: "custom-perfect-1",
        sentence: "I have lived here since 2020.",
        correctElements: [{ id: "e1", type: "arc", zone: "past", position: 50 }],
        tenseName: "Present Perfect",
        explanation: "Past linked to now",
        difficulty: 2,
        tenseCategory: "perfect",
        sentenceForm: "affirmative",
      },
    ];

    const round = buildTimelineRoundQuestions(
      customBank,
      [],
      "build-the-timeline",
      5,
      "affirmative",
      1
    );

    expect(round).toHaveLength(5);
    expect(round.some((question) => question.tenseCategory === "perfect")).toBe(true);
  });

  it("ignores the synthetic all category when calculating overall progress", () => {
    const progress = calculateTimelineOverallProgress({
      all: { completed: true },
      simple: { completed: true },
      continuous: { completed: false },
      perfect: { completed: false },
      "perfect-continuous": { completed: false },
      mixed: { completed: false },
    });

    expect(progress).toBe(20);
  });

  it("keeps the all-category tutorial focused on common introductory patterns", () => {
    const tutorialItems = CATEGORIZED_TUTORIAL_QUESTIONS.all;

    expect(tutorialItems).toHaveLength(4);
    expect(tutorialItems.every((question) => question.difficulty === 1)).toBe(true);
    expect(
      tutorialItems.every(
        (question) =>
          question.tenseCategory === "simple" ||
          question.tenseCategory === "continuous"
      )
    ).toBe(true);
    expect(
      tutorialItems.some((question) => question.tenseName.includes("Past Perfect"))
    ).toBe(false);
  });

  it("requires exact type-and-zone counts for drawing answers", () => {
    const correctElements: Array<Pick<TimelineElement, "type" | "zone">> = [
      { type: "single-dot", zone: "past" },
      { type: "solid-line", zone: "future" },
    ];

    expect(
      validateTimelineDrawingElements(correctElements, [
        { type: "single-dot", zone: "past" },
        { type: "solid-line", zone: "future" },
      ])
    ).toBe(true);

    expect(
      validateTimelineDrawingElements(correctElements, [
        { type: "single-dot", zone: "past" },
      ])
    ).toBe(false);

    expect(
      validateTimelineDrawingElements(correctElements, [
        { type: "single-dot", zone: "past" },
        { type: "single-dot", zone: "past" },
      ])
    ).toBe(false);

    expect(
      validateTimelineDrawingElements(
        [
          { type: "arc", zone: "past-earlier" },
          { type: "single-dot", zone: "past-later" },
        ],
        [
          { type: "arc", zone: "past-earlier" },
          { type: "single-dot", zone: "past-later" },
        ]
      )
    ).toBe(true);

    expect(
      validateTimelineDrawingElements(
        [
          { type: "arc", zone: "past-earlier" },
          { type: "single-dot", zone: "past-later" },
        ],
        [
          { type: "arc", zone: "past-later" },
          { type: "single-dot", zone: "past-earlier" },
        ]
      )
    ).toBe(false);

    expect(
      validateTimelineDrawingElements(
        [{ type: "single-dot", zone: "past" }],
        [{ type: "single-dot", zone: "past-later" }]
      )
    ).toBe(true);
  });

  it("detects when a question uses split past zones", () => {
    expect(
      elementsUseSplitPast([
        { zone: "past" },
        { zone: "future" },
      ])
    ).toBe(false);
    expect(
      elementsUseSplitPast([
        { zone: "past-earlier" },
        { zone: "past-later" },
      ])
    ).toBe(true);
  });

  it("resolves past connection partners for arcs and duration stamps", () => {
    const dotRight = {
      id: "dot",
      type: "single-dot" as const,
      zone: "past" as const,
      position: 70,
    };
    const arcLeft = {
      id: "arc",
      type: "arc" as const,
      zone: "past" as const,
      position: 30,
    };

    expect(
      resolveTimelineConnectionPartner(arcLeft, [arcLeft, dotRight])?.id
    ).toBe("dot");

    expect(
      resolveTimelineConnectionPartner(dotRight, [arcLeft, dotRight])
    ).toBeNull();

    const dotLeft = { ...dotRight, id: "dot2", position: 20 };
    const arcRight = { ...arcLeft, id: "arc2", position: 80 };
    expect(
      resolveTimelineConnectionPartner(arcRight, [dotLeft, arcRight])?.id
    ).toBe("dot2");

    const dotMid = { id: "d", type: "single-dot" as const, zone: "past" as const, position: 50 };
    const arcMid = { id: "a", type: "arc" as const, zone: "past" as const, position: 50 };
    expect(
      resolveTimelineConnectionPartner(arcMid, [arcMid, dotMid])?.id
    ).toBe("d");
    expect(
      resolveTimelineConnectionPartner(arcMid, [dotMid, arcMid])?.id
    ).toBe("d");

    const solid = {
      id: "s",
      type: "solid-to-now" as const,
      zone: "past" as const,
      position: 20,
    };
    expect(resolveTimelineConnectionPartner(solid, [solid, dotRight])?.id).toBe(
      "dot"
    );

    const dotLater = {
      id: "dl",
      type: "single-dot" as const,
      zone: "past-later" as const,
      position: 50,
    };
    const arcEarlier = {
      id: "ae",
      type: "arc" as const,
      zone: "past-earlier" as const,
      position: 50,
    };
    expect(
      resolveTimelineConnectionPartner(arcEarlier, [arcEarlier, dotLater], "split")
        ?.id
    ).toBe("dl");
  });

  it("infers a unique canonical tense label for matching lab patterns", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "solid-to-now", zone: "past" },
    ]);

    expect(feedback.status).toBe("match");
    expect(feedback.primaryLabel).toBe("Present Perfect Continuous");
    expect(feedback.labels).toEqual(["Present Perfect Continuous"]);
  });

  it("collapses negative and question sentence forms to the same lab tense label", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "arc", zone: "past" },
    ]);

    expect(feedback.status).toBe("match");
    expect(feedback.labels).toContain("Present Perfect");
    expect(feedback.labels).not.toContain("Present Perfect (Negative)");
    expect(feedback.labels).not.toContain("Present Perfect (Question)");
  });

  it("returns the guide-based exact label for known lab patterns", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "single-dot", zone: "future" },
    ]);

    expect(feedback.status).toBe("match");
    expect(feedback.labels).toEqual(["Future Simple"]);
    expect(feedback.primaryLabel).toBe("Future Simple");
  });

  it("treats solid-to-now in past-earlier as past perfect continuous", () => {
    const earlierFeedback = inferTimelineLabFeedback([
      { type: "solid-to-now", zone: "past-earlier" },
    ]);

    expect(earlierFeedback.status).toBe("match");
    expect(earlierFeedback.primaryLabel).toBe("Past Perfect Continuous");
  });

  it("treats solid-to-now in past-later as present perfect continuous", () => {
    const laterFeedback = inferTimelineLabFeedback([
      { type: "solid-to-now", zone: "past-later" },
    ]);

    expect(laterFeedback.status).toBe("match");
    expect(laterFeedback.primaryLabel).toBe("Present Perfect Continuous");
  });

  it("treats lone arc in past-earlier as past perfect", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "arc", zone: "past-earlier" },
    ]);

    expect(feedback.status).toBe("match");
    expect(feedback.primaryLabel).toBe("Past Perfect");
  });

  it("treats split-past durations as past continuous patterns", () => {
    const standaloneEarlier = inferTimelineLabFeedback([
      { type: "solid-line", zone: "past-earlier" },
    ]);
    const standaloneLater = inferTimelineLabFeedback([
      { type: "solid-line", zone: "past-later" },
    ]);
    const combo = inferTimelineLabFeedback([
      { type: "solid-line", zone: "past-earlier" },
      { type: "single-dot", zone: "past-later" },
    ]);

    expect(standaloneEarlier.status).toBe("match");
    expect(standaloneEarlier.primaryLabel).toBe("Past Continuous");
    expect(standaloneLater.status).toBe("match");
    expect(standaloneLater.primaryLabel).toBe("Past Continuous");
    expect(combo.status).toBe("match");
    expect(combo.primaryLabel).toBe("Past Continuous + Past Simple");
  });

  it("treats earlier-to-later past arcs as past perfect", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "arc", zone: "past-earlier" },
      { type: "single-dot", zone: "past-later" },
    ]);

    expect(feedback.status).toBe("match");
    expect(feedback.primaryLabel).toBe("Past Perfect");
  });

  it("returns no lab match for unknown stamp combinations", () => {
    const feedback = inferTimelineLabFeedback([
      { type: "multiple-dots", zone: "present" },
      { type: "solid-to-now", zone: "future" },
    ]);

    expect(feedback.status).toBe("none");
    expect(feedback.labels).toEqual([]);
    expect(feedback.primaryLabel).toBeUndefined();
  });

  it("keeps context challenge present simple on the build-mode habit stamp", () => {
    const question = TIMELINE_CONTEXT_QUESTIONS.find((entry) => entry.id === "ctx-02");
    const option = question?.options.find(
      (entry) => entry.tenseName === "Present Simple"
    );

    expect(question).toBeDefined();
    expect(option).toBeDefined();
    expect(buildNormalizedSignature(option?.elements ?? [])).toBe(
      buildNormalizedSignature(
        buildCanonicalTimelineElements("presentSimpleHabit", "test-present-simple")
      )
    );
  });

  it("keeps comparison challenge future perfect on the build-mode completion stamp", () => {
    const question = TIMELINE_COMPARISON_QUESTIONS.find(
      (entry) => entry.id === "comp-fpf-fs-01"
    );

    expect(question).toBeDefined();
    expect(buildNormalizedSignature(question?.elementsA ?? [])).toBe(
      buildNormalizedSignature(
        buildCanonicalTimelineElements("futurePerfect", "test-future-perfect", [
          { position: 70 },
        ])
      )
    );
  });

  it("keeps transformer challenge present perfect aligned with the build-mode pattern", () => {
    const question = TIMELINE_TRANSFORMER_QUESTIONS.find(
      (entry) => entry.id === "trans-ps-pp-01"
    );

    expect(question).toBeDefined();
    expect(buildNormalizedSignature(question?.targetElements ?? [])).toBe(
      buildNormalizedSignature(
        buildCanonicalTimelineElements("presentPerfect", "test-present-perfect")
      )
    );
  });

  it("keeps error correction future perfect aligned with the build-mode pattern", () => {
    const question = TIMELINE_ERROR_QUESTIONS.find((entry) => entry.id === "err-s-05");

    expect(question).toBeDefined();
    expect(buildNormalizedSignature(question?.correctElements ?? [])).toBe(
      buildNormalizedSignature(
        buildCanonicalTimelineElements("futurePerfect", "test-error-future-perfect", [
          { position: 70 },
        ])
      )
    );
  });

  it("keeps story builder split-past duration aligned with the build-mode pattern", () => {
    const question = TIMELINE_STORY_QUESTIONS.find((entry) => entry.id === "story-02");
    const sentence = question?.sentences[0];

    expect(question).toBeDefined();
    expect(sentence).toBeDefined();
    expect(elementsUseSplitPast(sentence?.elements ?? [])).toBe(true);
    expect(buildNormalizedSignature(sentence?.elements ?? [])).toBe(
      buildNormalizedSignature(
        buildCanonicalTimelineElements(
          "pastPerfectContinuous",
          "test-story-past-perfect-continuous",
          [{ position: 50 }, { position: 35 }]
        )
      )
    );
  });

  it("does not create duplicate timeline element ids within any challenge dataset entry", () => {
    const duplicateOwners = collectTimelineElementSets()
      .map(({ id, label, elements }) => {
        const seen = new Set<string>();
        const duplicates = elements
          .map((element) => element.id)
          .filter((elementId) => {
            if (seen.has(elementId)) {
              return true;
            }
            seen.add(elementId);
            return false;
          });

        return duplicates.length > 0 ? `${id}:${label}` : null;
      })
      .filter((value): value is string => value !== null);

    expect(duplicateOwners).toEqual([]);
  });
});
