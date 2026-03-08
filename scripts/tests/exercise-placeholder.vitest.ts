import { describe, expect, it } from "vitest";
import { getSafeExercisePlaceholder } from "@/utils/exercisePlaceholder";

describe("exercise placeholder sanitization", () => {
  it("falls back when the placeholder matches the expected answer", () => {
    expect(
      getSafeExercisePlaceholder({
        placeholder: "had been waiting",
        expectedAnswer: "had been waiting",
      })
    ).toBe("Type your answer...");
  });

  it("falls back when the placeholder matches one accepted answer variant", () => {
    expect(
      getSafeExercisePlaceholder({
        placeholder: "Haven't finished",
        expectedAnswers: ["have not finished", "haven't finished"],
      }, "Type your answer…")
    ).toBe("Type your answer…");
  });

  it("preserves non-answer instructional placeholders", () => {
    expect(
      getSafeExercisePlaceholder({
        placeholder: "Use the negative form",
        expectedAnswer: "haven't finished",
      })
    ).toBe("Use the negative form");
  });
});
