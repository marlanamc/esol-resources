import { describe, expect, it } from "vitest";
import { ALL_POS_GROUPS, getPOSGroup, getNextGroup } from "@/data/parts-of-speech-groups";
import { resolveResumeGroup } from "@/hooks/usePartsOfSpeechGameState";
import type { POSGroup, POSGroupProgress } from "@/types/parts-of-speech";
import { partsOfSpeechDiscoveryContent } from "../../scripts/import/guided-course-map-content";

// Guards the group sequence and the resume resolver — the machinery that lets
// one Course Map activity carry a learner through all 24 groups instead of
// re-pinning them to verbs on every visit. Pure functions, no rendering.

function mastered(): POSGroupProgress {
  return { completed: true, accuracy: 100, attempts: 1, stage: "mastered", highestRoundPassed: 5 };
}

function inProgress(): POSGroupProgress {
  return { completed: false, accuracy: 70, attempts: 1, stage: "in-progress", highestRoundPassed: 1 };
}

describe("Parts of speech group graph", () => {
  it("resolves every prerequisite to a real group", () => {
    const ids = new Set(ALL_POS_GROUPS.map((group) => group.id));
    for (const group of ALL_POS_GROUPS) {
      if (group.prerequisite === null) continue;
      expect(ids.has(group.prerequisite), `${group.id} has dangling prerequisite ${group.prerequisite}`).toBe(true);
    }
  });

  it("has exactly one entry point", () => {
    const roots = ALL_POS_GROUPS.filter((group) => group.prerequisite === null);
    expect(roots.map((group) => group.id)).toEqual(["pos-1-verbs"]);
  });

  it("chains from the first group to the last without cycling", () => {
    const seen = new Set<string>();
    let current: POSGroup | null | undefined = getPOSGroup("pos-1-verbs");

    while (current) {
      expect(seen.has(current.id), `cycle detected at ${current.id}`).toBe(false);
      seen.add(current.id);
      current = getNextGroup(current.id);
    }

    expect(seen.size).toBe(ALL_POS_GROUPS.length);
    expect(seen.has("pos-checkpoint-5")).toBe(true);
  });
});

describe("resolveResumeGroup", () => {
  const floor = partsOfSpeechDiscoveryContent.groupId!;

  it("starts a learner with no progress at the floor group", () => {
    expect(resolveResumeGroup({}, floor)?.id).toBe(floor);
  });

  it("skips past groups the learner has mastered", () => {
    const progress = { "pos-1-verbs": mastered(), "pos-2-nouns": mastered() };
    expect(resolveResumeGroup(progress, floor)?.id).toBe(ALL_POS_GROUPS[2].id);
  });

  it("stays on a group that is started but not yet mastered", () => {
    const progress = { "pos-1-verbs": inProgress() };
    expect(resolveResumeGroup(progress, floor)?.id).toBe("pos-1-verbs");
  });

  it("never returns a group before the floor", () => {
    const laterFloor = "pos-9-adjective";
    const progress = { "pos-1-verbs": inProgress() };
    const resolved = resolveResumeGroup(progress, laterFloor);

    const floorIndex = ALL_POS_GROUPS.findIndex((group) => group.id === laterFloor);
    const resolvedIndex = ALL_POS_GROUPS.findIndex((group) => group.id === resolved?.id);
    expect(resolvedIndex).toBeGreaterThanOrEqual(floorIndex);
  });

  it("holds on the last group once everything is mastered rather than stranding the learner", () => {
    const progress = Object.fromEntries(ALL_POS_GROUPS.map((group) => [group.id, mastered()]));
    const resolved = resolveResumeGroup(progress, floor);
    expect(resolved?.id).toBe(ALL_POS_GROUPS[ALL_POS_GROUPS.length - 1].id);
  });

  it("returns null for a floor group that does not exist", () => {
    expect(resolveResumeGroup({}, "pos-does-not-exist")).toBeNull();
  });
});
