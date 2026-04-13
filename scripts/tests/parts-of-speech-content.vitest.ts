import { describe, expect, it } from "vitest";
import { ALL_POS_GROUPS, getPOSGroup } from "@/data/parts-of-speech-groups";
import {
  generateCheckpointExercises,
  generateRound1Exercises,
} from "@/data/parts-of-speech-exercises";
import type { POSExercise, POSGroup } from "@/types/parts-of-speech";

const HIGH_VARIETY_GROUP_IDS = new Set([
  "pos-1-verbs",
  "pos-2-nouns",
  "pos-3-pronouns",
  "pos-4-articles",
  "pos-9-adjective",
  "pos-11-adverb",
  "pos-13-preposition",
]);

function sentenceFromExercise(exercise: POSExercise): string | null {
  switch (exercise.type) {
    case "pattern-choice":
    case "sentence-completion":
      return exercise.prompt;
    case "function-match":
      return exercise.functionMatch?.sentence ?? null;
    case "minimal-pair":
      return exercise.minimalPair?.sentence1 ?? null;
    case "mad-libs":
      return exercise.madLibsData?.sentenceParts.map((part) => part.correctWord ?? part.text).join("") ?? null;
    default:
      return null;
  }
}

function groupOrThrow(id: string): POSGroup {
  const group = getPOSGroup(id);
  if (!group) {
    throw new Error(`Missing group ${id}`);
  }
  return group;
}

describe("Parts of speech content expansion", () => {
  it("gives each non-checkpoint pattern at least the target number of examples", () => {
    for (const group of ALL_POS_GROUPS.filter((entry) => !entry.isCheckpoint)) {
      const minExamples = HIGH_VARIETY_GROUP_IDS.has(group.id) ? 5 : 4;
      for (const pattern of group.patterns) {
        expect(pattern.examples.length, `${group.id}/${pattern.id}`).toBeGreaterThanOrEqual(minExamples);
      }
    }
  });

  it("keeps authored targets visible in every example sentence", () => {
    for (const group of ALL_POS_GROUPS.filter((entry) => !entry.isCheckpoint)) {
      for (const pattern of group.patterns) {
        for (const example of pattern.examples) {
          if (example.blank) {
            expect(example.sentence, `${pattern.id} blank sentence`).toContain("___");
          } else {
            expect(
              example.sentence.toLowerCase(),
              `${pattern.id} highlight sentence`
            ).toContain(example.highlightWord.toLowerCase());
          }
        }
      }
    }
  });

  it("avoids unnatural frequency adverbs on origin sentences", () => {
    const beGroup = groupOrThrow("pos-1-verbs");
    const bePattern = beGroup.patterns.find((pattern) => pattern.id === "verb-state-be");

    expect(bePattern).toBeDefined();
    if (!bePattern) {
      throw new Error("Expected verb-state-be pattern");
    }

    const originExamples = bePattern.examples.filter((example) =>
      /from el salvador/i.test(example.sentence)
    );

    expect(originExamples.length).toBeGreaterThan(0);
    for (const example of originExamples) {
      expect(example.sentence).not.toMatch(/^(Usually|Most days|In daily life),/);
    }
  });
});

describe("Parts of speech exercise selection", () => {
  it("avoids reusing the same sentence immediately for the same pattern in round 1", () => {
    const group = groupOrThrow("pos-1-verbs");
    const exercises = generateRound1Exercises(group);

    for (const pattern of group.patterns) {
      const prompts = exercises
        .filter((exercise) => exercise.patternId === pattern.id)
        .map((exercise) => sentenceFromExercise(exercise))
        .filter((sentence): sentence is string => Boolean(sentence));

      expect(new Set(prompts).size, `duplicate prompt reuse for ${pattern.id}`).toBe(prompts.length);
    }
  });

  it("keeps checkpoint content varied across review groups", () => {
    const checkpoint = groupOrThrow("pos-checkpoint-1");
    const exercises = generateCheckpointExercises(checkpoint);
    const prompts = exercises
      .map((exercise) => sentenceFromExercise(exercise))
      .filter((sentence): sentence is string => Boolean(sentence));

    expect(new Set(prompts).size).toBeGreaterThanOrEqual(Math.min(6, prompts.length));
  });
});
