import { describe, expect, it } from "vitest";
import {
  TENSE_PATH_CHECKPOINTS,
  TENSE_PATH_FINAL_ID,
  TENSE_PATH_LEVELS,
  TENSE_PATH_WORLDS,
  getWorldLevels,
} from "@/lib/tense-path/levels";
import {
  ALL_TENSE_PATH_QUESTIONS,
  ROUND_SIZE,
  buildCheckpointRound,
  buildFinalRound,
  buildLevelRound,
  findLevelForQuestion,
  getLevelPool,
  getQuestionTenses,
  interleaveByType,
  isChallengeQuestion,
  normalizeTenseName,
  questionFitsLevel,
} from "@/lib/tense-path/questions";
import {
  calculateTensePathRoundPoints,
  checkpointId,
  emptyProgress,
  getUpNext,
  isCheckpointUnlocked,
  isFinalUnlocked,
  isTensePathServerRoundPassed,
  isWorldUnlocked,
  normalizeProgress,
  processRound,
  toServerRoundMode,
  type TensePathProgress,
} from "@/lib/tense-path/progress";
import { resolveActivityGameUi } from "@/lib/gamification/gamification";

/** Small seeded RNG so round tests are repeatable. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function answers(ids: string[], correct: number) {
  return ids.map((questionId, i) => ({ questionId, correct: i < correct }));
}

function pass(progress: TensePathProgress, stepId: string, mode: "round1" | "round2" | "checkpoint" | "final") {
  const n = mode === "final" ? 20 : mode === "checkpoint" ? 12 : 10;
  return processRound(progress, stepId, mode, answers(Array.from({ length: n }, (_, i) => `${stepId}-${i}`), n)).progress;
}

describe("tense names", () => {
  it("strips form labels and keeps meaning-changing ones", () => {
    expect(normalizeTenseName("Past Simple (Negative)")).toBe("Past Simple");
    expect(normalizeTenseName("2 x Past Continuous")).toBe("Past Continuous");
    expect(normalizeTenseName("Used to (Past Habit)")).toBe("Used to");
    expect(normalizeTenseName("Present Continuous (Future Arrangement)")).toBe("Present Continuous (Future Arrangement)");
    expect(normalizeTenseName("Context")).toBeNull();
  });

  it("splits two-verb labels", () => {
    const q = ALL_TENSE_PATH_QUESTIONS.find(
      (x) => x.type === "sentence-to-timeline" && x.tenseName === "Past Continuous + Past Simple"
    );
    expect(q).toBeDefined();
    expect(getQuestionTenses(q!).sort()).toEqual(["Past Continuous", "Past Simple"]);
  });

  it("never uses present tenses with a future meaning in the present world", () => {
    const present = getWorldLevels("present");
    for (const level of present) {
      for (const q of getLevelPool(level)) {
        expect(getQuestionTenses(q).some((t) => t.includes("Future"))).toBe(false);
      }
    }
  });

  it("keeps present tenses drawn in the FUTURE zone out of the present levels", () => {
    const meet = ALL_TENSE_PATH_QUESTIONS.find((q) => q.id === "pc-verb-meet-future-1")!;
    expect(getQuestionTenses(meet)).toEqual(["Present Continuous (Future Arrangement)"]);
    for (const level of getWorldLevels("present")) {
      for (const q of getLevelPool(level)) {
        const els =
          q.type === "sentence-to-timeline" ? q.correctElements
          : q.type === "timeline-to-verb" ? q.timelineElements
          : q.type === "sentence-transformer" ? q.targetElements
          : q.type === "error-correction" ? q.correctElements
          : [];
        expect(els.length === 0 || els.some((e) => e.zone !== "future"), q.id).toBe(true);
      }
    }
  });
});

describe("level pools and rounds", () => {
  it("has 13 levels in 5 worlds with unique ids", () => {
    expect(TENSE_PATH_LEVELS).toHaveLength(13);
    expect(TENSE_PATH_WORLDS).toHaveLength(5);
    expect(new Set(TENSE_PATH_LEVELS.map((l) => l.id)).size).toBe(13);
    TENSE_PATH_LEVELS.forEach((l, i) => expect(l.number).toBe(i + 1));
  });

  it.each(TENSE_PATH_LEVELS.map((l) => [l.id, l] as const))("%s fills both rounds with fitting, unique questions", (_id, level) => {
    for (const mode of ["round1", "round2"] as const) {
      const round = buildLevelRound(level, mode, { rng: seeded(7) });
      expect(round).toHaveLength(ROUND_SIZE[mode]);
      expect(new Set(round.map((q) => q.id)).size).toBe(round.length);
      round.forEach((q) => expect(questionFitsLevel(q, level)).toBe(true));
      expect(round.some(isChallengeQuestion)).toBe(true);
    }
  });

  it("puts recently seen questions at the back of the line", () => {
    const level = TENSE_PATH_LEVELS[0];
    const first = buildLevelRound(level, "round1", { rng: seeded(1) });
    const second = buildLevelRound(level, "round1", { rng: seeded(2), recentIds: first.map((q) => q.id) });
    const overlap = second.filter((q) => first.some((f) => f.id === q.id));
    expect(overlap.length).toBeLessThanOrEqual(2);
  });

  it("contrast levels lead with questions that use both tenses", () => {
    const level = TENSE_PATH_LEVELS.find((l) => l.id === "finished-or-still-true")!;
    const round = buildLevelRound(level, "round1", { rng: seeded(3) });
    const both = round.filter((q) => getQuestionTenses(q).length >= 2);
    expect(both.length).toBeGreaterThanOrEqual(3);
  });

  it("interleaves question types", () => {
    const full = getLevelPool(TENSE_PATH_LEVELS[2]);
    const byType = (t: string) => full.filter((q) => q.type === t).slice(0, 4);
    // Grouped by type on purpose: AAAA BBBB CCCC.
    const pool = [...byType("sentence-to-timeline"), ...byType("error-correction"), ...byType("context-tense-picker")];
    expect(pool).toHaveLength(12);
    const mixed = interleaveByType(pool);
    expect(mixed).toHaveLength(12);
    expect(new Set(mixed.map((q) => q.id)).size).toBe(12);
    const repeats = mixed.filter((q, i) => i > 0 && mixed[i - 1].type === q.type).length;
    expect(repeats).toBe(0);
  });

  it("checkpoints mix this world with a few earlier tenses", () => {
    const round = buildCheckpointRound("past", { rng: seeded(5) });
    expect(round).toHaveLength(ROUND_SIZE.checkpoint);
    expect(new Set(round.map((q) => q.id)).size).toBe(round.length);
    const pastLevels = getWorldLevels("past");
    const fromPast = round.filter((q) => pastLevels.some((l) => questionFitsLevel(q, l)));
    expect(fromPast.length).toBeGreaterThanOrEqual(8);
    expect(fromPast.length).toBeLessThan(round.length);
  });

  it("the final covers many levels", () => {
    const round = buildFinalRound({ rng: seeded(9) });
    expect(round).toHaveLength(ROUND_SIZE.final);
    const levels = new Set(round.map((q) => findLevelForQuestion(q)?.world));
    expect(levels.size).toBe(5);
  });
});

describe("progress", () => {
  it("opens world 1 only, then each world after its checkpoint", () => {
    let p = emptyProgress();
    expect(isWorldUnlocked(p, "present")).toBe(true);
    expect(isWorldUnlocked(p, "past")).toBe(false);
    expect(isCheckpointUnlocked(p, "present")).toBe(false);
    for (const l of getWorldLevels("present")) p = pass(p, l.id, "round1");
    expect(isCheckpointUnlocked(p, "present")).toBe(true);
    p = pass(p, checkpointId("present"), "checkpoint");
    expect(isWorldUnlocked(p, "past")).toBe(true);
  });

  it("up next walks levels, then the checkpoint, then the next world", () => {
    let p = emptyProgress();
    expect(getUpNext(p)).toEqual({ kind: "level", levelId: "always-true", mode: "round1" });
    for (const l of getWorldLevels("present")) p = pass(p, l.id, "round1");
    expect(getUpNext(p)).toEqual({ kind: "checkpoint", world: "present" });
    p = pass(p, checkpointId("present"), "checkpoint");
    expect(getUpNext(p)).toEqual({ kind: "level", levelId: "finished-past", mode: "round1" });
  });

  it("offers the final after all checkpoints, then Round 2s still to master", () => {
    let p = emptyProgress();
    for (const l of TENSE_PATH_LEVELS) p = pass(p, l.id, "round1");
    for (const c of TENSE_PATH_CHECKPOINTS) p = pass(p, c.id, "checkpoint");
    expect(isFinalUnlocked(p)).toBe(true);
    expect(getUpNext(p)).toEqual({ kind: "final" });
    p = pass(p, TENSE_PATH_FINAL_ID, "final");
    expect(getUpNext(p)).toEqual({ kind: "level", levelId: "always-true", mode: "round2" });
  });

  it("Round 1 needs 8/10, Round 2 needs 9/10 to master", () => {
    const ids = Array.from({ length: 10 }, (_, i) => `q${i}`);
    const r1 = processRound(emptyProgress(), "always-true", "round1", answers(ids, 8));
    expect(r1.passed).toBe(true);
    expect(r1.newlyPassed).toBe(true);
    const r2fail = processRound(r1.progress, "always-true", "round2", answers(ids, 8));
    expect(r2fail.passed).toBe(false);
    expect(r2fail.progress.steps["always-true"].mastered).toBe(false);
    const r2 = processRound(r1.progress, "always-true", "round2", answers(ids, 9));
    expect(r2.newlyMastered).toBe(true);
  });

  it("awards the Tense Master badge only the first time", () => {
    const ids = Array.from({ length: 20 }, (_, i) => `f${i}`);
    const first = processRound(emptyProgress(), TENSE_PATH_FINAL_ID, "final", answers(ids, 18));
    expect(first.earnedBadge).toBe(true);
    const again = processRound(first.progress, TENSE_PATH_FINAL_ID, "final", answers(ids, 20));
    expect(again.earnedBadge).toBe(false);
  });

  it("remembers recent question ids, newest first", () => {
    const r = processRound(emptyProgress(), "always-true", "round1", answers(["a", "b"], 2));
    const r2 = processRound(r.progress, "always-true", "round1", answers(["c", "a"], 2));
    expect(r2.progress.steps["always-true"].recentIds).toEqual(["c", "a", "b"]);
  });

  it("normalizes stored data and ignores sync fields", () => {
    const stored = JSON.stringify({
      steps: { "always-true": { passed: true, attempts: 2, bestAccuracy: 90, recentIds: ["x", 3] } },
      badges: { tenseMaster: true },
      pwaLastProgressIdempotencyKey: "k",
    });
    const p = normalizeProgress(stored);
    expect(p.steps["always-true"]).toEqual({ passed: true, mastered: false, attempts: 2, bestAccuracy: 90, recentIds: ["x"] });
    expect(p.badges.tenseMaster).toBe(true);
    expect(normalizeProgress("not json")).toEqual(emptyProgress());
    expect(normalizeProgress(null)).toEqual(emptyProgress());
  });
});

describe("server rules", () => {
  it("routes the activity to the tense-path game", () => {
    expect(resolveActivityGameUi({ content: JSON.stringify({ type: "tense-path" }) })).toBe("tense-path");
    expect(resolveActivityGameUi({ ui: "tense-path" })).toBe("tense-path");
  });

  it("uses the same pass lines as the game", () => {
    expect(toServerRoundMode("checkpoint")).toBe("review");
    expect(isTensePathServerRoundPassed("round1", 80)).toBe(true);
    expect(isTensePathServerRoundPassed("round2", 85)).toBe(false);
    expect(isTensePathServerRoundPassed("round2", 90)).toBe(true);
    expect(isTensePathServerRoundPassed("review", 79)).toBe(false);
  });

  it("gives 5 points for a passed round, 3 for a finished one, 0 for none", () => {
    expect(calculateTensePathRoundPoints(10, true)).toBe(5);
    expect(calculateTensePathRoundPoints(10, false)).toBe(3);
    expect(calculateTensePathRoundPoints(0, true)).toBe(0);
  });
});
