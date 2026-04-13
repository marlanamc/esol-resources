import { describe, expect, it } from "vitest";
import { ALL_POS_GROUPS, getPOSGroup } from "@/data/parts-of-speech-groups";
import {
  generateCheckpointExercises,
  generateRound1Exercises,
  generateRound4Exercises,
} from "@/data/parts-of-speech-exercises";
import type { POSExercise, POSGroup } from "@/types/parts-of-speech";

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

describe("Parts of speech content integrity", () => {
  it("does not include synthetic sentence extensions in authored examples", () => {
    const bannedFragments = [
      "Before the appointment, ",
      "At the clinic, ",
      "At urgent care, ",
      "During care visits, ",
      "Most days, ",
      "In daily life, ",
      "As a reminder, ",
      "Over time, ",
      "before I call the nurse back",
      "while I wait for results",
      "during follow-up care",
      "to sound more natural",
    ];

    for (const group of ALL_POS_GROUPS.filter((entry) => !entry.isCheckpoint)) {
      for (const pattern of group.patterns) {
        for (const example of pattern.examples) {
          for (const fragment of bannedFragments) {
            expect(example.sentence, `${pattern.id} includes synthetic fragment: ${fragment}`).not.toContain(fragment);
          }
        }
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

  it("keeps the original be-verb introduction sentence intact", () => {
    const beGroup = groupOrThrow("pos-1-verbs");
    const bePattern = beGroup.patterns.find((pattern) => pattern.id === "verb-state-be");

    expect(bePattern).toBeDefined();
    if (!bePattern) {
      throw new Error("Expected verb-state-be pattern");
    }

    const originExamples = bePattern.examples.filter((example) =>
      /^I ___ from El Salvador\.$/i.test(example.sentence)
    );

    expect(originExamples.length).toBeGreaterThan(0);
    for (const example of originExamples) {
      expect(example.sentence).toBe("I ___ from El Salvador.");
    }
  });

  it('keeps grouped verb forms intact in round 4 choices', () => {
    const beGroup = groupOrThrow("pos-1-verbs");
    const malformedChoices = new Set<string>();
    const groupedChoices = new Set<string>();

    for (let i = 0; i < 30; i += 1) {
      const exercises = generateRound4Exercises(beGroup);
      for (const exercise of exercises) {
        const pool = [
          ...(exercise.options ?? []),
          ...(exercise.errorCorrection?.wrongWords ?? []),
        ];

        for (const choice of pool) {
          if (choice === "be (am" || choice === "are)") {
            malformedChoices.add(choice);
          }
          if (choice === "am" || choice === "is" || choice === "are") {
            groupedChoices.add(choice);
          }
        }
      }
    }

    expect(malformedChoices.size).toBe(0);
    expect([...groupedChoices]).toEqual(
      expect.arrayContaining(["am", "is", "are"])
    );
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
