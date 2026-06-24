import { describe, expect, it } from "vitest";
import {
  TIME_SIGNAL_GROUPS,
  type TimeSignalEntry,
  type TimeSignalGroup,
} from "@/data/timeline-time-expressions";
import {
  getTimeSignalTimelineFamily,
  getTimeSignalTimelineLabel,
} from "@/components/games/TimelineTensesGame/TimeSignalsMode/timeSignalTimelineCanon";

function getGroup(id: string): TimeSignalGroup {
  const group = TIME_SIGNAL_GROUPS.find((candidate) => candidate.id === id);
  if (!group) {
    throw new Error(`Missing time-signal group: ${id}`);
  }
  return group;
}

function getEntry(groupId: string, word: string): TimeSignalEntry {
  const entry = getGroup(groupId).expressions.find(
    (candidate) => candidate.word === word
  );
  if (!entry) {
    throw new Error(`Missing time-signal entry: ${groupId}:${word}`);
  }
  return entry;
}

describe("time signals canon", () => {
  it("maps planned future markers to the planned-future family", () => {
    const plannedWords = [
      "next week / next month / next year",
      "going to",
      "tonight / this evening",
    ] as const;

    for (const word of plannedWords) {
      const entry = getEntry("future-reference", word);
      expect(getTimeSignalTimelineFamily(entry.timelineElements)).toBe(
        "planned-future"
      );
      expect(getTimeSignalTimelineLabel(entry.timelineElements)).toBe(
        "Planned future"
      );
    }
  });

  it("keeps will-based this evening uses as future points when they are modeled contextually", () => {
    const eveningEntry = getEntry("future-reference", "tonight / this evening");
    const futureSimpleUsage = eveningEntry.contextualUsages?.find(
      (usage) => usage.exampleSentence === "I will call you this evening."
    );

    expect(futureSimpleUsage).toBeDefined();
    expect(
      getTimeSignalTimelineFamily(futureSimpleUsage?.timelineElements ?? [])
    ).toBe("future-point");
  });

  it("keeps plain future markers as future points", () => {
    const futurePointWords = [
      "tomorrow",
      "soon / later",
      "in [X] days / in two weeks",
    ] as const;

    for (const word of futurePointWords) {
      const entry = getEntry("future-reference", word);
      expect(getTimeSignalTimelineFamily(entry.timelineElements)).toBe(
        "future-point"
      );
    }
  });

  it("keeps future-perfect deadlines in the future-perfect family", () => {
    const entry = getEntry("future-reference", "by [deadline]");
    expect(getTimeSignalTimelineFamily(entry.timelineElements)).toBe(
      "future-perfect"
    );
    expect(getTimeSignalTimelineLabel(entry.timelineElements)).toBe(
      "Future perfect"
    );
  });

  it("uses duration-to-now visuals for open duration markers", () => {
    const durationWords = ["since", "lately"] as const;

    for (const word of durationWords) {
      const groupId = word === "lately" ? "completion" : "duration";
      const entry = getEntry(groupId, word);
      expect(getTimeSignalTimelineFamily(entry.timelineElements)).toBe(
        "duration-to-now"
      );
    }
  });

  it("keeps used-to, would, and past-framed frequency patterns in the past-habit family", () => {
    expect(
      getTimeSignalTimelineFamily(
        getEntry("past-habits", "used to").timelineElements
      )
    ).toBe("past-habit");
    expect(
      getTimeSignalTimelineFamily(
        getEntry("past-habits", "would").timelineElements
      )
    ).toBe("past-habit");

    const alwaysPastContext = getEntry("frequency", "always").contextualUsages?.find(
      (usage) => usage.context === "Past habit (time frame established)"
    );
    expect(alwaysPastContext).toBeDefined();
    expect(
      getTimeSignalTimelineFamily(alwaysPastContext?.timelineElements ?? [])
    ).toBe("past-habit");
  });

  it("keeps notes aligned with the corrected future and duration canon", () => {
    expect(getEntry("future-reference", "going to").notes).toContain(
      "planned-future timeline pattern"
    );
    expect(getEntry("future-reference", "next week / next month / next year").notes).toContain(
      "planned future pattern"
    );
    expect(getEntry("duration", "since").notes).toContain("reaches NOW");
    expect(getEntry("completion", "lately").notes).toContain("up to NOW");
  });
});
