import { describe, it, expect } from "vitest";
import { POINTS } from "@/lib/gamification/constants";
import { getActivityPoints, resolveActivityGameUi } from "@/lib/gamification/activity-points";
import { shouldAwardStreak, getEffectiveStreak, getNextStreakState } from "@/lib/gamification/streak-utils";
import { determineGrammarCompletionPoints } from "@/lib/gamification/grammar-points";

describe("gamification helpers", () => {
  it("streak should not count for zero-point actions", () => {
    expect(shouldAwardStreak(0)).toBe(false);
  });

  it("streak should count when points were earned", () => {
    expect(shouldAwardStreak(4)).toBe(true);
  });

  it("streak should remain active when last activity was yesterday", () => {
    expect(
      getEffectiveStreak(5, new Date("2026-02-09T12:00:00.000Z"), new Date("2026-02-10T12:00:00.000Z"))
    ).toBe(5);
  });

  it("streak should display as 0 after more than one missed day", () => {
    expect(
      getEffectiveStreak(5, new Date("2026-02-09T12:00:00.000Z"), new Date("2026-02-12T12:00:00.000Z"))
    ).toBe(0);
  });

  it("next streak state should increment when last activity was yesterday", () => {
    expect(
      getNextStreakState(5, new Date("2026-02-09T12:00:00.000Z"), new Date("2026-02-10T12:00:00.000Z"))
    ).toEqual({ streakUpdated: true, newStreak: 6 });
  });

  it("next streak state should reset when more than one day was missed", () => {
    expect(
      getNextStreakState(5, new Date("2026-02-09T12:00:00.000Z"), new Date("2026-02-12T12:00:00.000Z"))
    ).toEqual({ streakUpdated: true, newStreak: 1 });
  });

  it("grammar points cannot be overridden", () => {
    expect(determineGrammarCompletionPoints(0)).toBe(POINTS.GRAMMAR_GUIDE);
    expect(determineGrammarCompletionPoints(999)).toBe(POINTS.GRAMMAR_GUIDE);
  });

  it("matching UI should map to matching points", () => {
    expect(getActivityPoints("game", { ui: "matching" })).toBe(POINTS.MATCHING_GAME);
  });

  it("content-based fallback should detect matching games", () => {
    expect(resolveActivityGameUi({ content: "word :: countable" })).toBe("matching");
  });
});
