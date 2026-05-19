import { describe, expect, it } from "vitest";
import {
  buildLevel1FillBlankQuestionOptions,
  generateLevel1FillBlankOptions,
} from "@/lib/level1-fill-blank-options";

const CALENDAR_CARDS = [
  { term: "June", category: "Days and Months" },
  { term: "July", category: "Days and Months" },
  { term: "August", category: "Days and Months" },
  { term: "May", category: "Days and Months" },
  { term: "Appointment", category: "Routines" },
  { term: "Shower", category: "Routines" },
  { term: "Breakfast", category: "Routines" },
];

describe("level1 fill-blank options", () => {
  it("prefers same-category distractors for month questions", () => {
    const useCount = new Map<string, number>();
    const options = generateLevel1FillBlankOptions(
      { term: "June", category: "Days and Months" },
      CALENDAR_CARDS,
      "Summer begins in the month of _____.",
      "test:june",
      useCount
    );

    const distractors = options.filter((o) => o !== "June");
    expect(distractors).toHaveLength(3);
    expect(distractors.every((d) => ["July", "August", "May"].includes(d))).toBe(true);
    expect(distractors).not.toContain("Appointment");
  });

  it("spreads distractors across a multi-question quiz", () => {
    const built = buildLevel1FillBlankQuestionOptions(
      CALENDAR_CARDS,
      "unit-2",
      "calendar-and-time",
      (card) =>
        card.term === "June"
          ? "Summer begins in the month of _____."
          : card.term === "July"
            ? "Independence Day is in _____."
            : card.term === "August"
              ? "Vacation is in _____."
              : undefined
    );

    const allDistractors = built.flatMap((q) =>
      q.options.filter((o) => o !== q.term)
    );
    const unique = new Set(allDistractors);
    expect(unique.size).toBeGreaterThan(2);
  });
});
