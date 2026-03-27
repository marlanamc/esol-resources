import { describe, expect, it } from "vitest";
import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
import { CATEGORIZED_TUTORIAL_QUESTIONS } from "@/data/timeline-tenses-tutorial";
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

  it("builds rounds without mutating the full question bank and returns the requested size", () => {
    const originalLength = TIMELINE_TENSES_QUESTIONS.length;
    const round = buildTimelineRoundQuestions(
      TIMELINE_TENSES_QUESTIONS,
      "all",
      "read-the-timeline",
      12
    );

    expect(TIMELINE_TENSES_QUESTIONS).toHaveLength(originalLength);
    expect(round).toHaveLength(12);
  });

  it("keeps early all-tenses rounds focused on common simple and basic continuous forms", () => {
    const round = buildTimelineRoundQuestions(
      TIMELINE_TENSES_QUESTIONS,
      "all",
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
      "all",
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
});
