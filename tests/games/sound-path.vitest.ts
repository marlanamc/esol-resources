import { describe, expect, it } from "vitest";
import { ED_VERBS } from "@/lib/ed-pronunciation-data";
import { emptyProgress, checkpointId } from "@/lib/pattern-path/engine";
import { SOUND_PATH_FINAL_ID, SOUND_PATH_LEVELS, SOUND_PATH_WORLDS, TRICKY_SPELLINGS, getSoundWorldLevels } from "@/lib/sound-path/levels";
import { SOUND_MASTER_BADGE, getUpNext, isWorldUnlocked, processRound } from "@/lib/sound-path/progress";
import {
  ROUND_SIZE,
  buildCheckpointRound,
  buildFinalRound,
  buildLevelRound,
  correctAnswer,
  explain,
  findLevelForQuestion,
  getLevelVerbs,
  interleaveByType,
  isCorrect,
  mixCounts,
  type SoundQuestion,
} from "@/lib/sound-path/questions";
import { resolveActivityGameUi } from "@/lib/gamification/gamification";
import { getPronunciationActivityDescriptor } from "@/lib/pronunciation-activity";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const wordsOf = (q: SoundQuestion) => (q.type === "odd" ? q.verbs.map((v) => v.past) : [q.verb.past]);

describe("levels", () => {
  it("has 6 levels in 3 worlds, numbered in order", () => {
    expect(SOUND_PATH_WORLDS).toHaveLength(3);
    expect(SOUND_PATH_LEVELS).toHaveLength(6);
    SOUND_PATH_LEVELS.forEach((l, i) => expect(l.number).toBe(i + 1));
    SOUND_PATH_LEVELS.forEach((l) => expect(l.mix.reduce((s, m) => s + m.share, 0)).toBeCloseTo(1));
  });

  it("every tricky spelling is a real verb, and its note names its team", () => {
    for (const [past, note] of Object.entries(TRICKY_SPELLINGS)) {
      const verb = ED_VERBS.find((v) => v.past === past);
      expect(verb, past).toBeDefined();
      expect(note).toContain(`/${verb!.sound}/`);
    }
  });

  it("the whisper level never uses an extra-clap verb", () => {
    const level = SOUND_PATH_LEVELS.find((l) => l.id === "whisper-or-not")!;
    expect(getLevelVerbs(level, "round2").some((v) => v.sound === "id")).toBe(false);
  });

  it("mix counts add up to the round size", () => {
    for (const level of SOUND_PATH_LEVELS) {
      expect(mixCounts(level, 10).reduce((s, c) => s + c.count, 0)).toBe(10);
    }
  });
});

describe("rounds", () => {
  it.each(SOUND_PATH_LEVELS.map((l) => [l.id, l] as const))("%s fills both rounds with unique words and the right types", (_id, level) => {
    for (const mode of ["round1", "round2"] as const) {
      const round = buildLevelRound(level, mode, { rng: seeded(11) });
      expect(round).toHaveLength(ROUND_SIZE[mode]);
      const words = round.flatMap(wordsOf);
      expect(new Set(words).size).toBe(words.length);
      const allowed = new Set(level.mix.map((m) => m.type));
      round.forEach((q) => expect(allowed.has(q.type)).toBe(true));
      const pool = new Set(getLevelVerbs(level, mode).map((v) => v.past));
      words.forEach((w) => expect(pool.has(w)).toBe(true));
    }
  });

  it("round 1 skips hard verbs except on the tricky level", () => {
    const round = buildLevelRound(SOUND_PATH_LEVELS[3], "round1", { rng: seeded(4) });
    const hard = new Set(ED_VERBS.filter((v) => v.difficulty === "hard").map((v) => v.past));
    round.flatMap(wordsOf).forEach((w) => expect(hard.has(w)).toBe(false));
  });

  it("balances the teams in a sorting round", () => {
    const round = buildLevelRound(SOUND_PATH_LEVELS[3], "round2", { rng: seeded(8) }).filter((q) => q.type === "team");
    const teams = new Set(round.map((q) => correctAnswer(q)));
    expect(teams.size).toBe(3);
  });

  it("odd-one-out has exactly one word from the other group", () => {
    for (let seed = 1; seed < 30; seed++) {
      for (const level of SOUND_PATH_LEVELS) {
        for (const q of buildLevelRound(level, "round2", { rng: seeded(seed) })) {
          if (q.type !== "odd") continue;
          const key = (i: number) => (q.by === "clap" ? q.verbs[i].sound === "id" : q.verbs[i].sound);
          const others = [0, 1, 2].filter((i) => i !== q.oddIndex);
          expect(key(others[0])).toBe(key(others[1]));
          expect(key(q.oddIndex)).not.toBe(key(others[0]));
        }
      }
    }
  });

  it("checkpoints and the final fill up", () => {
    for (const w of SOUND_PATH_WORLDS) expect(buildCheckpointRound(w.id, { rng: seeded(3) })).toHaveLength(ROUND_SIZE.checkpoint);
    const final = buildFinalRound({ rng: seeded(5) });
    expect(final).toHaveLength(ROUND_SIZE.final);
    expect(new Set(final.map((q) => q.type)).size).toBeGreaterThanOrEqual(5);
  });

  it("spreads each question type through the round", () => {
    const round = buildLevelRound(SOUND_PATH_LEVELS[0], "round1", { rng: seeded(2) });
    const odds = round.map((q, i) => (q.type === "odd" ? i : -1)).filter((i) => i >= 0);
    expect(odds.length).toBe(3);
    expect(odds[odds.length - 1] - odds[0]).toBeGreaterThanOrEqual(4);
    const shuffled = interleaveByType(round);
    expect(shuffled).toHaveLength(round.length);
  });
});

describe("answers and feedback", () => {
  const walked = ED_VERBS.find((v) => v.past === "walked")!;
  const wanted = ED_VERBS.find((v) => v.past === "wanted")!;
  const laughed = ED_VERBS.find((v) => v.past === "laughed")!;

  it("checks each question type", () => {
    expect(isCorrect({ id: "a", type: "clap", verb: wanted }, "clap")).toBe(true);
    expect(isCorrect({ id: "b", type: "clap", verb: walked }, "clap")).toBe(false);
    expect(isCorrect({ id: "c", type: "now-or-past", verb: walked, target: "base" }, "base")).toBe(true);
    expect(isCorrect({ id: "d", type: "team", verb: walked }, "t")).toBe(true);
    expect(isCorrect({ id: "e", type: "odd", verbs: [walked, wanted, laughed], oddIndex: 1, by: "clap" }, "1")).toBe(true);
  });

  it("explains in claps + whisper words, never voiced / voiceless", () => {
    expect(explain({ id: "a", type: "team", verb: laughed })).toContain("gh sounds like f");
    expect(explain({ id: "b", type: "clap", verb: wanted })).toContain("T sound");
    for (const v of ED_VERBS) expect(explain({ id: v.past, type: "team", verb: v })).not.toMatch(/voic/i);
  });

  it("points checkpoint reminders at a sensible level", () => {
    expect(findLevelForQuestion({ id: "a", type: "clap", verb: walked })?.id).toBe("extra-clap");
    expect(findLevelForQuestion({ id: "b", type: "team", verb: laughed })?.id).toBe("tricky-spellings");
    expect(findLevelForQuestion({ id: "c", type: "team", verb: wanted })?.id).toBe("three-teams");
  });
});

describe("progress", () => {
  it("walks levels, then checkpoints, and opens the next world", () => {
    let p = emptyProgress();
    expect(getUpNext(p)).toEqual({ kind: "level", levelId: "extra-clap", mode: "round1" });
    const ids = Array.from({ length: 10 }, (_, i) => ({ questionId: `q${i}`, correct: true }));
    p = processRound(p, "extra-clap", "round1", ids).progress;
    expect(getUpNext(p)).toEqual({ kind: "level", levelId: "extra-clap", mode: "round2" });
    for (const l of getSoundWorldLevels("hear-it")) {
      p = processRound(p, l.id, "round1", ids).progress;
      p = processRound(p, l.id, "round2", ids).progress;
    }
    expect(getUpNext(p)).toEqual({ kind: "checkpoint", world: "hear-it" });
    expect(isWorldUnlocked(p, "sort-it")).toBe(false);
    p = processRound(p, checkpointId("hear-it"), "checkpoint", ids).progress;
    expect(isWorldUnlocked(p, "sort-it")).toBe(true);
  });

  it("gives the Sound Master badge once", () => {
    const ids = Array.from({ length: 20 }, (_, i) => ({ questionId: `f${i}`, correct: true }));
    const first = processRound(emptyProgress(), SOUND_PATH_FINAL_ID, "final", ids);
    expect(first.earnedBadge).toBe(true);
    expect(first.progress.badges[SOUND_MASTER_BADGE]).toBe(true);
    expect(processRound(first.progress, SOUND_PATH_FINAL_ID, "final", ids).earnedBadge).toBe(false);
  });
});

describe("wiring", () => {
  it("routes to the sound-path game and shows in Pronunciation", () => {
    expect(resolveActivityGameUi({ content: JSON.stringify({ type: "sound-path" }) })).toBe("sound-path");
    expect(resolveActivityGameUi({ ui: "sound-path" })).toBe("sound-path");
    const d = getPronunciationActivityDescriptor({ id: "sound-path", title: "Sound Path: -ed Endings", ui: "sound-path", content: "{}" });
    expect(d.friendlyTitle).toBe("Sound Path: -ed endings");
  });
});

describe("course map goal", () => {
  it("counts Sound Path as done on the map after passing Level 1, Round 1", async () => {
    const { isMapGoalMet } = await import("@/lib/sound-path/progress");
    const ids = (n: number) => Array.from({ length: n }, (_, i) => ({ questionId: `m${i}`, correct: true }));
    let p = emptyProgress();
    expect(isMapGoalMet(p)).toBe(false);
    p = processRound(p, "now-or-past", "round1", ids(10)).progress;
    expect(isMapGoalMet(p)).toBe(false); // another level does not count
    const fail = processRound(p, "extra-clap", "round1", ids(10).map((a, i) => ({ ...a, correct: i < 7 })));
    expect(isMapGoalMet(fail.progress)).toBe(false); // 7/10 is not a pass
    p = processRound(p, "extra-clap", "round1", ids(10)).progress;
    expect(isMapGoalMet(p)).toBe(true);
  });
});
