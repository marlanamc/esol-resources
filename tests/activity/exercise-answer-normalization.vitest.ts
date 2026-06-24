import { describe, it, expect } from "vitest";
import {
  areExerciseAnswersEquivalent,
  normalizeExerciseAnswer,
} from "@/lib/exercise-answer-normalization";

describe("exercise answer normalization", () => {
  it("do not and don't should be equivalent", () => {
    expect(areExerciseAnswersEquivalent("do not sleep", "don't sleep")).toBe(true);
  });

  it("missing space should not be treated as valid text input", () => {
    expect(areExerciseAnswersEquivalent("do\u2019not sleep", "don't sleep")).toBe(false);
  });

  it("invalid contraction should not be accepted", () => {
    expect(areExerciseAnswersEquivalent("do\u2019t sleep", "don't sleep")).toBe(false);
  });

  it("invalid contraction token should not normalize to don't", () => {
    expect(areExerciseAnswersEquivalent("do\u2019t", "don't")).toBe(false);
  });

  it("curly apostrophes should be normalized", () => {
    expect(areExerciseAnswersEquivalent("don\u2019t sleep", "do not sleep")).toBe(true);
  });

  it("missing apostrophe in negative contractions should still pass", () => {
    expect(areExerciseAnswersEquivalent("doesnt", "doesn't")).toBe(true);
  });

  it("is not and isn't should be equivalent", () => {
    expect(areExerciseAnswersEquivalent("is not", "isn't")).toBe(true);
  });

  it("won't and will not should be equivalent", () => {
    expect(areExerciseAnswersEquivalent("won't attend", "will not attend")).toBe(true);
  });

  it("cannot and can't should be equivalent", () => {
    expect(areExerciseAnswersEquivalent("cannot go", "can't go")).toBe(true);
  });

  it("I'm and I am should be equivalent", () => {
    expect(areExerciseAnswersEquivalent("I am not going", "I'm not going")).toBe(true);
  });

  it("'re contractions should normalize to full form", () => {
    expect(areExerciseAnswersEquivalent("they are working", "they're working")).toBe(true);
  });

  it("'ve contractions should normalize to full form", () => {
    expect(areExerciseAnswersEquivalent("we have finished", "we've finished")).toBe(true);
  });

  it("'ll contractions should normalize to full form", () => {
    expect(areExerciseAnswersEquivalent("she will arrive", "she'll arrive")).toBe(true);
  });

  it("possessives should remain intact while punctuation is normalized", () => {
    expect(
      areExerciseAnswersEquivalent(
        "Could you tell me where the manager's office is?",
        "could you tell me where the manager's office is"
      )
    ).toBe(true);
  });

  it("possessives should not be rewritten as contractions", () => {
    expect(
      areExerciseAnswersEquivalent(
        "Could you tell me where the manager is office is?",
        "Could you tell me where the manager's office is?"
      )
    ).toBe(false);
  });

  it("normalization should still collapse spaces and trailing punctuation", () => {
    expect(normalizeExerciseAnswer("  DON'T   SLEEP!!! ")).toBe("do not sleep");
  });
});
