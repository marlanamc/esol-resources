import { describe, expect, it } from "vitest";
import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
import type { TimelineElement, TimelineToVerbQuestion } from "@/types/activity";
import {
  buildTimelineRoundQuestions,
  calculateTimelineOverallProgress,
  elementsUseSplitPast,
  parseTimelineSentenceTemplate,
  resolvePastConnectionPartner,
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

  it("builds rounds without mutating the full question bank and keeps easier items first", () => {
    const originalLength = TIMELINE_TENSES_QUESTIONS.length;
    const round = buildTimelineRoundQuestions(
      TIMELINE_TENSES_QUESTIONS,
      "all",
      "read-the-timeline",
      12
    );

    expect(TIMELINE_TENSES_QUESTIONS).toHaveLength(originalLength);
    expect(round).toHaveLength(12);

    for (let index = 1; index < round.length; index += 1) {
      expect(round[index - 1].difficulty).toBeLessThanOrEqual(
        round[index].difficulty
      );
    }
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
      resolvePastConnectionPartner(arcLeft, [arcLeft, dotRight])?.id
    ).toBe("dot");

    expect(
      resolvePastConnectionPartner(dotRight, [arcLeft, dotRight])
    ).toBeNull();

    const dotLeft = { ...dotRight, id: "dot2", position: 20 };
    const arcRight = { ...arcLeft, id: "arc2", position: 80 };
    expect(
      resolvePastConnectionPartner(arcRight, [dotLeft, arcRight])?.id
    ).toBe("dot2");

    const dotMid = { id: "d", type: "single-dot" as const, zone: "past" as const, position: 50 };
    const arcMid = { id: "a", type: "arc" as const, zone: "past" as const, position: 50 };
    expect(
      resolvePastConnectionPartner(arcMid, [arcMid, dotMid])?.id
    ).toBe("d");
    expect(
      resolvePastConnectionPartner(arcMid, [dotMid, arcMid])?.id
    ).toBe("d");

    const solid = {
      id: "s",
      type: "solid-to-now" as const,
      zone: "past" as const,
      position: 20,
    };
    expect(resolvePastConnectionPartner(solid, [solid, dotRight])?.id).toBe(
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
      resolvePastConnectionPartner(arcEarlier, [arcEarlier, dotLater], "split")
        ?.id
    ).toBe("dl");
  });
});
