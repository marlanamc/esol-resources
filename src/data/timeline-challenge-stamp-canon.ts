import type { TimelineElement } from "@/types/activity";

export type TimelineStampCanonName =
  | "presentSimpleHabit"
  | "presentContinuous"
  | "pastSimple"
  | "futureSimple"
  | "presentPerfect"
  | "pastPerfect"
  | "futurePerfect"
  | "pastContinuous"
  | "futureContinuous"
  | "presentPerfectContinuous"
  | "pastPerfectContinuous"
  | "futurePerfectContinuous"
  | "futurePerfectContinuousPoint";

type TimelineElementOverride = Partial<
  Omit<TimelineElement, "id" | "connectedTo">
>;

const CANONICAL_TIMELINE_PATTERNS: Record<
  TimelineStampCanonName,
  TimelineElement[]
> = {
  presentSimpleHabit: [
    { id: "base-1", type: "multiple-dots", zone: "present", position: 50 },
  ],
  presentContinuous: [
    { id: "base-1", type: "solid-line", zone: "present", position: 50 },
  ],
  pastSimple: [
    { id: "base-1", type: "single-dot", zone: "past", position: 40 },
  ],
  futureSimple: [
    { id: "base-1", type: "single-dot", zone: "future", position: 50 },
  ],
  presentPerfect: [
    { id: "base-1", type: "arc", zone: "past", position: 50 },
  ],
  pastPerfect: [
    { id: "base-1", type: "arc", zone: "past-earlier", position: 30 },
    { id: "base-2", type: "single-dot", zone: "past-later", position: 70 },
  ],
  futurePerfect: [
    { id: "base-1", type: "arc-dashed", zone: "future", position: 60 },
  ],
  pastContinuous: [
    { id: "base-1", type: "solid-line", zone: "past", position: 50 },
  ],
  futureContinuous: [
    { id: "base-1", type: "solid-line", zone: "future", position: 60 },
  ],
  presentPerfectContinuous: [
    { id: "base-1", type: "solid-to-now", zone: "past", position: 30 },
  ],
  pastPerfectContinuous: [
    { id: "base-1", type: "solid-to-point", zone: "past-earlier", position: 20 },
    { id: "base-2", type: "single-dot", zone: "past-later", position: 60 },
  ],
  futurePerfectContinuous: [
    { id: "base-1", type: "solid-to-now", zone: "future", position: 50 },
  ],
  futurePerfectContinuousPoint: [
    { id: "base-1", type: "solid-to-point", zone: "future", position: 50 },
  ],
};

export function buildCanonicalTimelineElements(
  name: TimelineStampCanonName,
  prefix: string,
  overrides: TimelineElementOverride[] = []
): TimelineElement[] {
  const pattern = CANONICAL_TIMELINE_PATTERNS[name];
  const idMap = new Map<string, string>();

  pattern.forEach((element, index) => {
    idMap.set(element.id, `${prefix}-${index + 1}`);
  });

  return pattern.map((element, index) => {
    const override = overrides[index] ?? {};
    const nextId = idMap.get(element.id) ?? `${prefix}-${index + 1}`;

    return {
      ...element,
      ...override,
      id: nextId,
      connectedTo: element.connectedTo
        ? (idMap.get(element.connectedTo) ?? element.connectedTo)
        : undefined,
    };
  });
}
