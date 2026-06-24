import { describe, expect, it } from "vitest";
import { findStandaloneHighlightMatch } from "@/components/games/PartsOfSpeechGame/exercises/highlight-match";

describe("findStandaloneHighlightMatch", () => {
  it("does not match embedded substrings inside larger words", () => {
    const result = findStandaloneHighlightMatch("The teacher helped her.", "her");

    expect(result).not.toBeNull();
    expect(result).toEqual({
      before: "The teacher helped ",
      match: "her",
      after: ".",
    });
  });

  it("matches standalone words with punctuation around them", () => {
    const result = findStandaloneHighlightMatch("I called the doctor, and the doctor called back.", "doctor");

    expect(result).not.toBeNull();
    expect(result).toEqual({
      before: "I called the ",
      match: "doctor",
      after: ", and the doctor called back.",
    });
  });

  it("matches multi-word phrases as a standalone span", () => {
    const result = findStandaloneHighlightMatch("We live in East Boston now.", "East Boston");

    expect(result).not.toBeNull();
    expect(result).toEqual({
      before: "We live in ",
      match: "East Boston",
      after: " now.",
    });
  });
});
