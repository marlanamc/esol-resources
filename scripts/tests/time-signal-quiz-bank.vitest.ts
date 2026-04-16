import { describe, expect, it } from "vitest";
import { TIME_SIGNAL_GROUPS } from "@/data/timeline-time-expressions";
import {
  getTimeSignalContextQuizExamples,
  getTimeSignalQuizExamples,
} from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalQuizBank";
import { getTimeSignalTimelineFamily } from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalTimelineCanon";

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

  it("prefers exact past-habit timelines over mixed used-to timelines", () => {
    const group = getGroup("past-habits");
    const entry = getEntry("past-habits", "used to");
    const examples = getTimeSignalQuizExamples(group, entry);

    expect(examples.some((example) => example.sentence === "I used to walk to school every day.")).toBe(true);
    expect(
      examples.some((example) => example.sentence.includes("but now"))
    ).toBe(false);
    expect(examples.every((example) => !example.verbPhrase2)).toBe(true);
  });

  it("includes contextual past-continuous-plus-past-habit practice for frequency markers", () => {
    const entry = getEntry("frequency", "often");
    const usage = entry.contextualUsages?.find(
      (candidate) => candidate.context === "Past habit (during a past period)"
    );

    expect(usage).toBeDefined();

    const examples = getTimeSignalContextQuizExamples(entry, usage!);
    expect(examples.length).toBeGreaterThan(0);
    expect(
      examples.some((example) =>
        example.sentence.toLowerCase().includes("while i was")
      )
    ).toBe(true);
  });

  it("maps past-framed production frequency sentences to a past-habit timeline", () => {
    const group = getGroup("frequency");
    const entry = getEntry("frequency", "rarely / hardly ever");
    const example = getTimeSignalQuizExamples(group, entry).find((candidate) =>
      candidate.sentence.includes("During my first winter in Boston")
    );

    expect(example).toBeDefined();
    expect(getTimeSignalTimelineFamily(example?.timelineElements ?? [])).toBe(
      "past-habit"
    );
  });
});
