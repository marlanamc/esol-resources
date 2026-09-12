import { describe, expect, it } from "vitest";
import { getPOSGroup } from "@/data/parts-of-speech-groups";
import { generateRound1Exercises } from "@/data/parts-of-speech-exercises";
import { isPartsOfSpeechContent, type POSGroup } from "@/types/parts-of-speech";
import { partsOfSpeechDiscoveryContent } from "../../scripts/import/guided-course-map-content";

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

describe("isPartsOfSpeechContent", () => {
  it("accepts the content the guided wrapper ships", () => {
    expect(isPartsOfSpeechContent(partsOfSpeechDiscoveryContent)).toBe(true);
  });

  it("rejects payloads the renderer can legitimately be handed", () => {
    expect(isPartsOfSpeechContent(null)).toBe(false);
    expect(isPartsOfSpeechContent(undefined)).toBe(false);
    expect(isPartsOfSpeechContent("Q: what is a verb?")).toBe(false);
    expect(isPartsOfSpeechContent({ type: "grammar-hospital", cases: [] })).toBe(false);
    expect(isPartsOfSpeechContent({})).toBe(false);
  });
});
