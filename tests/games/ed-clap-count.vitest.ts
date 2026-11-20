import { describe, expect, it } from "vitest";
import { ED_VERBS, getClapRound, getEndingTD, hasExtraClap } from "@/lib/ed-pronunciation-data";

describe("-ed Clap Count mode data", () => {
  it("builds a round that is half extra-clap verbs and has no hard verbs by default", () => {
    for (let i = 0; i < 20; i++) {
      const round = getClapRound(12);
      expect(round).toHaveLength(12);
      expect(round.filter(hasExtraClap)).toHaveLength(6);
      expect(round.some((v) => v.sound === "t")).toBe(true);
      expect(round.some((v) => v.sound === "d")).toBe(true);
      expect(round.every((v) => v.difficulty !== "hard")).toBe(true);
      expect(new Set(round.map((v) => v.past)).size).toBe(12);
    }
  });

  it("only gives an extra clap to /id/ verbs", () => {
    expect(hasExtraClap({ base: "want", past: "wanted", sound: "id", example: "", difficulty: "easy" })).toBe(true);
    expect(hasExtraClap({ base: "walk", past: "walked", sound: "t", example: "", difficulty: "easy" })).toBe(false);
    expect(hasExtraClap({ base: "play", past: "played", sound: "d", example: "", difficulty: "easy" })).toBe(false);
  });

  it("finds the T or D sound for every /id/ verb, skipping a silent e", () => {
    expect(getEndingTD("decide")).toBe("D");
    expect(getEndingTD("hate")).toBe("T");
    for (const verb of ED_VERBS.filter((v) => v.sound === "id")) {
      expect(getEndingTD(verb.base), verb.base).not.toBeNull();
    }
  });
});
