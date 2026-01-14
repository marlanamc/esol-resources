import assert from "node:assert/strict";
import { POINTS } from "@/lib/gamification/constants";
import { getActivityPoints, resolveActivityGameUi } from "@/lib/gamification/activity-points";
import { shouldAwardStreak } from "@/lib/gamification/streak-utils";
import { determineGrammarCompletionPoints } from "@/lib/gamification/grammar-points";

console.log("Running lightweight gamification sanity checks...");

// 1. Daily streak only counts when points > 0
assert.strictEqual(shouldAwardStreak(0), false, "Streak should not count for zero-point actions");
assert.strictEqual(shouldAwardStreak(4), true, "Streak should count when points were earned");

// 2. Grammar completion always uses the defined constant
assert.strictEqual(determineGrammarCompletionPoints(0), POINTS.GRAMMAR_GUIDE, "Grammar points cannot be overridden");
assert.strictEqual(determineGrammarCompletionPoints(999), POINTS.GRAMMAR_GUIDE, "Grammar override should be ignored");

// 3. Matching games rely on the explicit UI flag
assert.strictEqual(
  getActivityPoints("game", { ui: "matching" }),
  POINTS.MATCHING_GAME,
  "Matching UI should map to matching points"
);
assert.strictEqual(
  resolveActivityGameUi({ content: "word :: countable" }),
  "matching",
  "Content-based fallback should still detect matching games"
);

console.log("✅ Gamification helper checks passed.");
