import { describe, expect, it } from "vitest";
import { getPOSGroup } from "@/data/parts-of-speech-groups";
import { generateRound1Exercises } from "@/data/parts-of-speech-exercises";
import { isPartsOfSpeechContent, type POSGroup } from "@/types/parts-of-speech";
import {
  partsOfSpeechDiscoveryContent,
  partsOfSpeechWordSortNounsContent,
  partsOfSpeechWordSortVerbsContent,
} from "../../scripts/import/guided-course-map-content";
import type { PartsOfSpeechContent } from "@/types/parts-of-speech";

// Guards the round configuration the guided Course Map wrapper actually ships,
// not the engine. The wrapper's exerciseTypes were silently ignored for
// foundation-phase groups because generateRound1Exercises returned from its
// foundation branch before consulting the whitelist — so photo-sort and
// swipe-sort never rendered for a single student.

function groupOrThrow(id: string): POSGroup {
  const group = getPOSGroup(id);
  if (!group) {
    throw new Error(`Missing group ${id}`);
  }
  return group;
}

describe("Guided Course Map preset: Parts of Speech Discovery", () => {
  const options = { phaseOverrides: partsOfSpeechDiscoveryContent.roundOverrides };
  const configuredTypes = partsOfSpeechDiscoveryContent.roundOverrides?.foundation?.rounds?.round1?.exerciseTypes;
  const configuredSize = partsOfSpeechDiscoveryContent.roundOverrides?.foundation?.rounds?.round1?.roundSize;

  it("pins the wrapper to a foundation-phase group (the branch that ignored overrides)", () => {
    const group = groupOrThrow(partsOfSpeechDiscoveryContent.groupId!);
    expect(group.phase).toBe("foundation");
  });

  it("ships a round1 exercise-type override", () => {
    expect(configuredTypes).toBeDefined();
    expect(configuredTypes?.length).toBeGreaterThan(0);
  });

  it("only generates exercise types the wrapper configured", () => {
    const group = groupOrThrow(partsOfSpeechDiscoveryContent.groupId!);
    const allowed = new Set(configuredTypes);

    // Generation shuffles, so sample repeatedly rather than trusting one draw.
    for (let i = 0; i < 30; i += 1) {
      const exercises = generateRound1Exercises(group, options);
      for (const exercise of exercises) {
        expect(
          allowed.has(exercise.type),
          `generated ${exercise.type}, which the guided wrapper did not configure`
        ).toBe(true);
      }
    }
  });

  it("surfaces the photo-sort and swipe-sort exercises the wrapper asked for", () => {
    const group = groupOrThrow(partsOfSpeechDiscoveryContent.groupId!);
    const seen = new Set<string>();

    for (let i = 0; i < 30; i += 1) {
      for (const exercise of generateRound1Exercises(group, options)) {
        seen.add(exercise.type);
      }
    }

    for (const type of configuredTypes ?? []) {
      expect(seen.has(type), `${type} never appeared across 30 generated rounds`).toBe(true);
    }
  });

  it("respects the configured round size", () => {
    const group = groupOrThrow(partsOfSpeechDiscoveryContent.groupId!);

    for (let i = 0; i < 10; i += 1) {
      const exercises = generateRound1Exercises(group, options);
      expect(exercises.length).toBeLessThanOrEqual(configuredSize!);
    }
  });
});

// Week 2's Word Sort games. Week 2 meets once and Marlana is out for it, so
// these run unsupervised: a card that asks for a part of speech the learner has
// no way to reason about is a dead end with nobody to ask.
describe.each([
  ["Word Sort: Verbs", partsOfSpeechWordSortVerbsContent, "verb"],
  ["Word Sort: Nouns", partsOfSpeechWordSortNounsContent, "noun"],
] as const)("Guided Course Map preset: %s", (_label, content: PartsOfSpeechContent, targetPOS) => {
  const options = { phaseOverrides: content.roundOverrides };
  const roundConfig = content.roundOverrides?.foundation?.rounds?.round1;

  it("pins a foundation group and the beginner round", () => {
    const group = groupOrThrow(content.groupId!);
    expect(group.phase).toBe("foundation");
    expect(content.roundMode).toBe("round1");
  });

  it("pins the group rather than resuming into harder ones", () => {
    // resumeFromProgress would turn groupId into a floor, so a learner who has
    // played Discovery would land somewhere past the simple sort.
    expect(content.resumeFromProgress).toBeUndefined();
  });

  it("generates nothing but sort cards", () => {
    const group = groupOrThrow(content.groupId!);

    // Guards the foundation branch, which used to push a pattern-choice per
    // pattern before it ever consulted the whitelist.
    for (let i = 0; i < 30; i += 1) {
      const exercises = generateRound1Exercises(group, options);
      expect(exercises.length).toBeGreaterThan(0);
      for (const exercise of exercises) {
        expect(exercise.type, `generated ${exercise.type} in a sort-only round`).toBe("swipe-sort");
      }
    }
  });

  it("fills the configured round size rather than capping sorts at one", () => {
    const group = groupOrThrow(content.groupId!);

    for (let i = 0; i < 10; i += 1) {
      expect(generateRound1Exercises(group, options)).toHaveLength(roundConfig!.roundSize!);
    }
  });

  it("sorts into exactly two buckets, one of them the pinned part of speech", () => {
    const group = groupOrThrow(content.groupId!);

    for (let i = 0; i < 30; i += 1) {
      for (const exercise of generateRound1Exercises(group, options)) {
        const data = exercise.swipeSortData;
        expect(data, "swipe-sort exercise carried no swipeSortData").toBeDefined();
        expect(data!.leftBucket).not.toBe(data!.rightBucket);
        expect([data!.leftBucket, data!.rightBucket]).toContain(targetPOS);
        expect(data!.cards.length).toBeGreaterThanOrEqual(4);
        // Every card has to belong to one of the two buckets on screen —
        // otherwise it is unanswerable whichever way the learner swipes.
        for (const card of data!.cards) {
          expect([data!.leftBucket, data!.rightBucket]).toContain(card.correctBucket);
        }
        // Both buckets have to be reachable, or the card is a trick question.
        const buckets = new Set(data!.cards.map(card => card.correctBucket));
        expect(buckets.size).toBe(2);
      }
    }
  });

  it("only shows single words, never form labels like \"be (am / is / are)\"", () => {
    const group = groupOrThrow(content.groupId!);

    for (let i = 0; i < 30; i += 1) {
      for (const exercise of generateRound1Exercises(group, options)) {
        for (const card of exercise.swipeSortData?.cards ?? []) {
          expect(card.word, `card "${card.word}" is not a single plain word`).toMatch(/^[a-z][a-z'-]*$/i);
        }
      }
    }
  });

  it("draws from common words, not the tricky-verb cloze corpus", () => {
    // POS_TRICKY_VERBS exists to make advanced cloze distractors hard. On a
    // bare sort card it just asks a Week 2 beginner whether "loathe" is a verb.
    const group = groupOrThrow(content.groupId!);
    const tricky = new Set(["loathe", "entail", "contemplate", "recollect", "defer", "postpone"]);
    const seen = new Set<string>();

    for (let i = 0; i < 100; i += 1) {
      for (const exercise of generateRound1Exercises(group, options)) {
        for (const card of exercise.swipeSortData?.cards ?? []) {
          seen.add(card.word.toLowerCase());
        }
      }
    }

    const leaked = [...seen].filter(word => tricky.has(word));
    expect(leaked, `advanced cloze verbs reached a beginner sort: ${leaked.join(", ")}`).toEqual([]);
  });

  it("keeps the two buckets roughly balanced across many rounds", () => {
    // The cloze bank gave 75 verbs against 14 nouns, so one side repeated every
    // round while the other almost never did.
    const group = groupOrThrow(content.groupId!);
    const perBucket = new Map<string, Set<string>>();

    for (let i = 0; i < 100; i += 1) {
      for (const exercise of generateRound1Exercises(group, options)) {
        for (const card of exercise.swipeSortData?.cards ?? []) {
          if (!perBucket.has(card.correctBucket)) perBucket.set(card.correctBucket, new Set());
          perBucket.get(card.correctBucket)!.add(card.word.toLowerCase());
        }
      }
    }

    const sizes = [...perBucket.values()].map(words => words.size);
    expect(sizes).toHaveLength(2);
    expect(Math.max(...sizes) / Math.min(...sizes)).toBeLessThanOrEqual(2);
  });
});

describe("isPartsOfSpeechContent", () => {
  it("accepts the content the guided wrappers ship", () => {
    expect(isPartsOfSpeechContent(partsOfSpeechDiscoveryContent)).toBe(true);
    expect(isPartsOfSpeechContent(partsOfSpeechWordSortVerbsContent)).toBe(true);
    expect(isPartsOfSpeechContent(partsOfSpeechWordSortNounsContent)).toBe(true);
  });

  it("rejects payloads the renderer can legitimately be handed", () => {
    expect(isPartsOfSpeechContent(null)).toBe(false);
    expect(isPartsOfSpeechContent(undefined)).toBe(false);
    expect(isPartsOfSpeechContent("Q: what is a verb?")).toBe(false);
    expect(isPartsOfSpeechContent({ type: "grammar-hospital", cases: [] })).toBe(false);
    expect(isPartsOfSpeechContent({})).toBe(false);
  });
});
