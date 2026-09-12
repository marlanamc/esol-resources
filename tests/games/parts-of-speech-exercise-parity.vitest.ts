import { describe, expect, it } from "vitest";
import { getAvailableExerciseTypes } from "@/data/parts-of-speech-exercises";
import { EXERCISE_RENDERERS } from "@/components/games/PartsOfSpeechGame/ExerciseScreen";
import type { POSExerciseType, POSPhase } from "@/types/parts-of-speech";

// Parity between the exercise-type union, the renderers, and the phase/round
// whitelists. pattern-sorting once drifted out of every whitelist while keeping
// a 235-line renderer, and nothing failed — these assertions make that loud.

const ALL_PHASES: POSPhase[] = [
  "foundation",
  "sentence-roles",
  "modifiers",
  "connectors",
  "application-bridge",
];

const ALL_TYPES = Object.keys(EXERCISE_RENDERERS) as POSExerciseType[];

/**
 * Types deliberately held out of normal rotation. Their renderers stay on disk;
 * they are simply not offered to learners right now. Adding a type here is a
 * scope decision that has to be written down — which is the point.
 */
const FROZEN: POSExerciseType[] = [
  // Drag-to-build is the highest-friction interaction in the set, and the
  // application-bridge groups it served are rarely reached.
  "sentence-builder",
];

function everyWhitelistedType(): Set<POSExerciseType> {
  const seen = new Set<POSExerciseType>();
  for (const phase of ALL_PHASES) {
    for (let round = 1; round <= 5; round += 1) {
      for (const type of getAvailableExerciseTypes(phase, round)) {
        seen.add(type);
      }
    }
  }
  return seen;
}

describe("Parts of speech exercise parity", () => {
  it("gives every whitelisted type a renderer", () => {
    for (const type of everyWhitelistedType()) {
      expect(EXERCISE_RENDERERS[type], `${type} is offered to learners but has no renderer`).toBeDefined();
    }
  });

  it("keeps every non-frozen type reachable in at least one phase and round", () => {
    const whitelisted = everyWhitelistedType();
    const frozen = new Set(FROZEN);

    for (const type of ALL_TYPES) {
      if (frozen.has(type)) continue;
      expect(
        whitelisted.has(type),
        `${type} has a renderer but no phase/round offers it — either whitelist it or add it to FROZEN`
      ).toBe(true);
    }
  });

  it("keeps frozen types genuinely out of rotation", () => {
    const whitelisted = everyWhitelistedType();

    for (const type of FROZEN) {
      expect(
        whitelisted.has(type),
        `${type} is listed as frozen but is still offered to learners — remove it from FROZEN`
      ).toBe(false);
    }
  });

  it("only whitelists types that exist in the union", () => {
    const known = new Set(ALL_TYPES);
    for (const type of everyWhitelistedType()) {
      expect(known.has(type), `${type} is whitelisted but is not a known exercise type`).toBe(true);
    }
  });
});
