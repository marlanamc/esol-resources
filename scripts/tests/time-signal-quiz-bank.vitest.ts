import { describe, expect, it } from "vitest";
import { TIME_SIGNAL_GROUPS } from "@/data/timeline-time-expressions";
import { getTimeSignalQuizExamples } from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalQuizBank";

function getGroup(id: string) {
  const group = TIME_SIGNAL_GROUPS.find((candidate) => candidate.id === id);
  if (!group) {
    throw new Error(`Missing time-signal group: ${id}`);
  }
  return group;
}

function getEntry(groupId: string, word: string) {
  const entry = getGroup(groupId).expressions.find(
    (candidate) => candidate.word === word
  );
  if (!entry) {
    throw new Error(`Missing entry ${groupId}:${word}`);
  }
  return entry;
}

describe("time signal quiz bank", () => {
  it("avoids reusing the exact explore sentences for future evening prompts", () => {
    const group = getGroup("future-reference");
    const entry = getEntry("future-reference", "tonight / this evening");
    const sentences = getTimeSignalQuizExamples(group, entry).map(
      (example) => example.sentence
    );

    expect(sentences).not.toContain("We are meeting tonight.");
    expect(sentences).not.toContain("They are coming over tonight.");
    expect(sentences).not.toContain("I will call you this evening.");
    expect(sentences.length).toBeGreaterThan(0);
  });

  it("pulls alternate quiz prompts from the main game for common future markers", () => {
    const group = getGroup("future-reference");
    const entry = getEntry("future-reference", "tomorrow");
    const sentences = getTimeSignalQuizExamples(group, entry).map(
      (example) => example.sentence
    );

    expect(sentences).not.toContain("I will call you tomorrow.");
    expect(
      sentences.some((sentence) => sentence.toLowerCase().includes("tomorrow"))
    ).toBe(true);
  });

  it("builds separate quiz practice for frequency markers without copying explore examples", () => {
    const group = getGroup("frequency");
    const entry = getEntry("frequency", "always");
    const sentences = getTimeSignalQuizExamples(group, entry).map(
      (example) => example.sentence
    );

    expect(sentences).not.toContain(
      "She always packs her lunch before the morning shift."
    );
    expect(sentences.length).toBeGreaterThan(0);
  });
});
