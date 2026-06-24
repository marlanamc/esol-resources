import { describe, expect, it } from "vitest";
import { VOCAB_WEEKLY_UNITS, VOCAB_WEEKLY_UNITS_CYCLE2 } from "@/data/weekly-vocab-units";
import { getVocabLevelBadgeLabel } from "@/components/dashboard/activity-categories-vocab-utils";

describe("VOCAB_WEEKLY_UNITS_CYCLE2 labels", () => {
  it("uses month + week numbering like cycle 1", () => {
    expect(VOCAB_WEEKLY_UNITS_CYCLE2.find((u) => u.id === "feb-3-5")?.label).toBe("February Week 1");
    expect(VOCAB_WEEKLY_UNITS_CYCLE2.find((u) => u.id === "feb-10-12")?.label).toBe("February Week 2");
    expect(VOCAB_WEEKLY_UNITS_CYCLE2.find((u) => u.id === "mar-31-apr-2")?.label).toBe("March Week 5");
    expect(VOCAB_WEEKLY_UNITS_CYCLE2.find((u) => u.id === "apr-7-9")?.label).toBe("April Week 1");
    expect(VOCAB_WEEKLY_UNITS_CYCLE2.find((u) => u.id === "jun-2-4")?.label).toBe("June Week 1");
  });

  it("keeps cycle 1 labels unchanged", () => {
    expect(VOCAB_WEEKLY_UNITS.find((u) => u.id === "sep-w1")?.label).toBe("September Week 1");
    expect(VOCAB_WEEKLY_UNITS.find((u) => u.id === "jan-w4")?.label).toBe("January Week 4");
  });
});

describe("getVocabLevelBadgeLabel", () => {
  it("uses global course-map level numbers, not week index within the vocab unit", () => {
    expect(getVocabLevelBadgeLabel({ id: "vocab-sep-w1", title: "Unit 1: Topic", category: "vocabulary" })).toBe(
      "Level 1"
    );
    expect(getVocabLevelBadgeLabel({ id: "vocab-oct-w1", title: "Unit 2: Topic", category: "vocabulary" })).toBe(
      "Level 5"
    );
    expect(getVocabLevelBadgeLabel({ id: "vocab-jan-w1", title: "Unit 5: Topic", category: "vocabulary" })).toBe(
      "Level 16"
    );
    expect(getVocabLevelBadgeLabel({ id: "vocab-feb-3-5", title: "Unit 6: Topic", category: "vocabulary" })).toBe(
      "Level 20"
    );
    expect(getVocabLevelBadgeLabel({ id: "vocab-daily-review", title: "Daily", category: "vocabulary" })).toBe("Daily");
  });
});
