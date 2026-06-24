import { describe, expect, it } from "vitest";
import { TIME_SIGNAL_GROUPS } from "@/data/timeline-time-expressions";
import {
  getTimeSignalContextQuizExamples,
  getTimeSignalQuizExamples,
} from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalQuizBank";
import {
  getTimeSignalTimelineFamily,
  type TimeSignalTimelineFamily,
} from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalTimelineCanon";

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function collectExploreSentences(entry: (typeof TIME_SIGNAL_GROUPS)[number]["expressions"][number]) {
  const sentences = new Set<string>([normalizeText(entry.exampleSentence)]);

  for (const example of entry.commonExamples ?? []) {
    sentences.add(normalizeText(example.sentence));
  }

  for (const usage of entry.contextualUsages ?? []) {
    sentences.add(normalizeText(usage.exampleSentence));
  }

  return sentences;
}

describe("time signals audit", () => {
  it("keeps generated base quiz examples within the entry or contextual timeline canon", () => {
    const mismatches: string[] = [];

    for (const group of TIME_SIGNAL_GROUPS) {
      for (const entry of group.expressions) {
        const baseFamily = getTimeSignalTimelineFamily(entry.timelineElements);
        const contextualFamilies = new Set<TimeSignalTimelineFamily>(
          (entry.contextualUsages ?? []).map((usage) =>
            getTimeSignalTimelineFamily(usage.timelineElements)
          )
        );
        const allowedFamilies = new Set<TimeSignalTimelineFamily>([
          baseFamily,
          ...contextualFamilies,
        ]);

        const examples = getTimeSignalQuizExamples(group, entry);
        if (examples.length === 0) {
          mismatches.push(`${group.id}:${entry.word} produced no quiz examples`);
          continue;
        }

        for (const example of examples) {
          const family = getTimeSignalTimelineFamily(example.timelineElements);
          if (!allowedFamilies.has(family)) {
            mismatches.push(
              `${group.id}:${entry.word} -> "${example.sentence}" mapped to ${family}, allowed=${[...allowedFamilies].join(",")}`
            );
          }
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("keeps contextual quiz examples on the contextual timeline family", () => {
    const mismatches: string[] = [];

    for (const group of TIME_SIGNAL_GROUPS) {
      for (const entry of group.expressions) {
        for (const usage of entry.contextualUsages ?? []) {
          const expectedFamily = getTimeSignalTimelineFamily(usage.timelineElements);
          const examples = getTimeSignalContextQuizExamples(entry, usage);

          if (examples.length === 0) {
            mismatches.push(`${group.id}:${entry.word}:${usage.context} produced no contextual quiz examples`);
            continue;
          }

          for (const example of examples) {
            const family = getTimeSignalTimelineFamily(example.timelineElements);
            if (family !== expectedFamily) {
              mismatches.push(
                `${group.id}:${entry.word}:${usage.context} -> "${example.sentence}" mapped to ${family}, expected=${expectedFamily}`
              );
            }
          }
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("avoids explore-sentence repetition when alternate quiz prompts exist", () => {
    const offenders: string[] = [];

    for (const group of TIME_SIGNAL_GROUPS) {
      for (const entry of group.expressions) {
        const exploreSentences = collectExploreSentences(entry);
        const examples = getTimeSignalQuizExamples(group, entry);

        if (examples.length <= 1) {
          continue;
        }

        for (const example of examples) {
          if (exploreSentences.has(normalizeText(example.sentence))) {
            offenders.push(`${group.id}:${entry.word} repeats explore sentence "${example.sentence}"`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
