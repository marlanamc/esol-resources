import type { TimelineElement } from "@/types/activity";

export type TimeSignalTimelineFamily =
  | "future-point"
  | "planned-future"
  | "future-perfect"
  | "future-sequence"
  | "repeated-moments"
  | "past-habit"
  | "connection-to-now"
  | "duration-to-now"
  | "current-duration"
  | "past-duration"
  | "past-sequence"
  | "past-point"
  | "current-point"
  | "single-point";

function hasType(elements: TimelineElement[], ...types: TimelineElement["type"][]) {
  return elements.some((element) => types.includes(element.type));
}

function hasZone(elements: TimelineElement[], ...zones: TimelineElement["zone"][]) {
  return elements.some((element) => zones.includes(element.zone));
}

export function getTimeSignalTimelineFamily(
  elements: TimelineElement[]
): TimeSignalTimelineFamily {
  const hasFuture = hasZone(elements, "future");
  const hasPresent = hasZone(elements, "present");
  const hasPast = hasZone(elements, "past", "past-earlier", "past-later");
  const hasArc = hasType(elements, "arc", "arc-dashed");
  const hasDurationToNow = hasType(elements, "solid-to-now", "solid-to-point");
  const hasDuration = hasType(elements, "solid-line", "dashed-line");
  const hasRepeats = hasType(elements, "multiple-dots");
  const hasPoints = hasType(elements, "single-dot");
  const futurePoints = elements.filter(
    (element) => element.zone === "future" && element.type === "single-dot"
  ).length;
  const hasSplitPast = hasZone(elements, "past-earlier", "past-later");

  if (hasArc && hasFuture) {
    return "future-perfect";
  }
  if (hasDurationToNow && hasFuture) {
    return "planned-future";
  }
  if (hasRepeats && hasPast) {
    return "past-habit";
  }
  if (hasRepeats) {
    return "repeated-moments";
  }
  if (hasDurationToNow) {
    return "duration-to-now";
  }
  if (hasDuration && hasFuture) {
    return "planned-future";
  }
  if (hasArc && hasSplitPast) {
    return "past-sequence";
  }
  if (hasArc) {
    return "connection-to-now";
  }
  if (hasDuration && hasPresent) {
    return "current-duration";
  }
  if (hasDuration && hasPast) {
    return "past-duration";
  }
  if (hasFuture && futurePoints > 1) {
    return "future-sequence";
  }
  if (hasFuture && hasPoints) {
    return "future-point";
  }
  if (hasPresent && hasPoints) {
    return "current-point";
  }
  if (hasPast && hasPoints) {
    return "past-point";
  }
  return "single-point";
}

export function getTimeSignalTimelineLabel(elements: TimelineElement[]): string {
  switch (getTimeSignalTimelineFamily(elements)) {
    case "future-point":
      return "Future point";
    case "planned-future":
      return "Planned future";
    case "future-perfect":
      return "Future perfect";
    case "future-sequence":
      return "Future sequence";
    case "repeated-moments":
      return "Repeated moments";
    case "past-habit":
      return "Past habit";
    case "connection-to-now":
      return "Connection to now";
    case "duration-to-now":
      return "Duration to now";
    case "current-duration":
      return "Current duration";
    case "past-duration":
      return "Past duration";
    case "past-sequence":
      return "Past sequence";
    case "past-point":
      return "Past point";
    case "current-point":
      return "Current point";
    default:
      return "Single point";
  }
}
