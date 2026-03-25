import {
  areExerciseAnswersEquivalent,
  normalizeExerciseAnswer,
} from "@/lib/exercise-answer-normalization";
import type {
  SentenceForm,
  TenseCategory,
  TimelineElement,
  TimelineElementType,
  TimelineTensesQuestion,
  TimelineToVerbQuestion,
  TimelineZone,
  ValidVerbAnswer,
} from "@/types/activity";

/** SVG layout width (matches TimelineCanvas viewBox). */
export const TIMELINE_WIDTH = 400;
export const TIMELINE_NOW_X = 200;

/** Past stamping ends here so a neutral strip sits before NOW (past ≠ “up to now”). */
export const PAST_TIMELINE_END = 168;
export const PAST_TIMELINE_START = 20;
/** Inner split: earlier past (further from NOW). */
export const PAST_EARLIER_END_SPLIT = 88;
/** Inner split: later past (closer to NOW, still not touching NOW). */
export const PAST_LATER_START_SPLIT = 96;
/** Future band begins after NOW + small margin. */
export const TIMELINE_FUTURE_START = 206;

export type PastTimelineLayout = "single" | "split";

export function elementsUseSplitPast(
  items: Pick<TimelineElement, "zone">[]
): boolean {
  return items.some(
    (el) => el.zone === "past-earlier" || el.zone === "past-later"
  );
}

export function isPastTimelineZone(zone: TimelineZone): boolean {
  return (
    zone === "past" ||
    zone === "past-earlier" ||
    zone === "past-later"
  );
}

/**
 * Horizontal center (x) for an element; must stay in sync with TimelineCanvas.
 */
export function getTimelineElementX(
  element: Pick<TimelineElement, "zone" | "position">,
  pastLayout: PastTimelineLayout
): number {
  const NOW_X = TIMELINE_NOW_X;
  const pastEnd = PAST_TIMELINE_END;
  if (element.zone === "present") {
    return NOW_X;
  }
  if (element.zone === "future") {
    const zStart = TIMELINE_FUTURE_START;
    const zEnd = TIMELINE_WIDTH - 20;
    return zStart + (element.position / 100) * (zEnd - zStart);
  }
  if (element.zone === "past") {
    return (
      PAST_TIMELINE_START +
      (element.position / 100) * (pastEnd - PAST_TIMELINE_START)
    );
  }
  if (element.zone === "past-earlier") {
    if (pastLayout === "split") {
      return (
        PAST_TIMELINE_START +
        (element.position / 100) *
          (PAST_EARLIER_END_SPLIT - PAST_TIMELINE_START)
      );
    }
    return (
      PAST_TIMELINE_START +
      (element.position / 100) * (pastEnd - PAST_TIMELINE_START)
    );
  }
  if (element.zone === "past-later") {
    if (pastLayout === "split") {
      return (
        PAST_LATER_START_SPLIT +
        (element.position / 100) * (pastEnd - PAST_LATER_START_SPLIT)
      );
    }
    const mid = PAST_TIMELINE_START + (pastEnd - PAST_TIMELINE_START) / 2;
    return mid + (element.position / 100) * (pastEnd - mid);
  }
  return NOW_X;
}

export const REAL_TENSE_CATEGORIES: TenseCategory[] = [
  "simple",
  "continuous",
  "perfect",
  "perfect-continuous",
  "mixed",
];

export type TimelinePracticeMode =
  | "read-the-timeline"
  | "build-the-timeline"
  | "mixed-practice";

export const DEFAULT_TIMELINE_PRACTICE_MODE: TimelinePracticeMode =
  "read-the-timeline";

const SENTENCE_TEMPLATE_REGEX = /___\[([^\]]+)\]___/g;

type TimelineBlankDefinition = TimelineToVerbQuestion["blanks"][number];

export interface TimelineSentenceTextPart {
  type: "text";
  content: string;
}

export interface TimelineSentenceBlankPart {
  type: "blank";
  content: string;
  blankId: string;
  blankIndex: number;
  blank: TimelineBlankDefinition | null;
}

export type TimelineSentencePart =
  | TimelineSentenceTextPart
  | TimelineSentenceBlankPart;

export interface TimelineVerbBlankResult {
  blankId: string;
  blankIndex: number;
  promptLabel: string;
  userAnswer: string;
  matchedAnswer: ValidVerbAnswer | null;
  validAnswers: ValidVerbAnswer[];
  isCorrect: boolean;
}

export interface CategoryProgressLike {
  completed: boolean;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function parseTimelineSentenceTemplate(
  question: TimelineToVerbQuestion
): TimelineSentencePart[] {
  const parts: TimelineSentencePart[] = [];
  let lastIndex = 0;
  let blankIndex = 0;
  let match: RegExpExecArray | null;

  SENTENCE_TEMPLATE_REGEX.lastIndex = 0;

  while ((match = SENTENCE_TEMPLATE_REGEX.exec(question.sentenceTemplate)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: question.sentenceTemplate.slice(lastIndex, match.index),
      });
    }

    const blank = question.blanks[blankIndex] ?? null;

    parts.push({
      type: "blank",
      content: blank?.baseVerb ?? match[1],
      blankId: blank?.id ?? `blank-${blankIndex + 1}`,
      blankIndex,
      blank,
    });

    lastIndex = SENTENCE_TEMPLATE_REGEX.lastIndex;
    blankIndex += 1;
  }

  if (lastIndex < question.sentenceTemplate.length) {
    parts.push({
      type: "text",
      content: question.sentenceTemplate.slice(lastIndex),
    });
  }

  return parts;
}

export function findTimelineBlankMatch(
  userAnswer: string,
  validAnswers: ValidVerbAnswer[]
): ValidVerbAnswer | null {
  if (userAnswer.trim().length === 0) {
    return null;
  }

  for (const validAnswer of validAnswers) {
    if (areExerciseAnswersEquivalent(userAnswer, validAnswer.answer)) {
      return validAnswer;
    }
  }

  return null;
}

export function validateTimelineVerbAnswers(
  question: TimelineToVerbQuestion,
  answersByBlankId: Record<string, string>
): {
  allCorrect: boolean;
  blankResults: TimelineVerbBlankResult[];
  firstCorrectTense?: string;
} {
  const sentenceParts = parseTimelineSentenceTemplate(question);
  const promptLabels = new Map<string, string>();

  for (const part of sentenceParts) {
    if (part.type === "blank") {
      promptLabels.set(part.blankId, part.content);
    }
  }

  const blankResults = question.blanks.map((blank, blankIndex) => {
    const userAnswer = answersByBlankId[blank.id] ?? "";
    const matchedAnswer = findTimelineBlankMatch(userAnswer, blank.validAnswers);

    return {
      blankId: blank.id,
      blankIndex,
      promptLabel: promptLabels.get(blank.id) ?? blank.baseVerb,
      userAnswer,
      matchedAnswer,
      validAnswers: blank.validAnswers,
      isCorrect: matchedAnswer !== null,
    };
  });

  const firstCorrectMatch = blankResults.find((result) => result.matchedAnswer);

  return {
    allCorrect: blankResults.every((result) => result.isCorrect),
    blankResults,
    firstCorrectTense: firstCorrectMatch?.matchedAnswer?.tenseName,
  };
}

export function getDistinctTimelineValidAnswers(
  validAnswers: ValidVerbAnswer[]
): ValidVerbAnswer[] {
  const seen = new Set<string>();
  const distinct: ValidVerbAnswer[] = [];

  for (const validAnswer of validAnswers) {
    const normalized = normalizeExerciseAnswer(validAnswer.answer);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    distinct.push(validAnswer);
  }

  return distinct;
}

export function buildTimelineVerbFeedbackTenseName(
  blankResults: TimelineVerbBlankResult[]
): string {
  const tenseNames: string[] = [];

  for (const result of blankResults) {
    const tenseName =
      result.matchedAnswer?.tenseName ?? result.validAnswers[0]?.tenseName;

    if (tenseName && !tenseNames.includes(tenseName)) {
      tenseNames.push(tenseName);
    }
  }

  return tenseNames.join(" + ");
}

export function filterTimelineQuestions(
  questionBank: TimelineTensesQuestion[],
  category: TenseCategory | "all",
  practiceMode: TimelinePracticeMode,
  sentenceForm: SentenceForm | "all" = "all"
): TimelineTensesQuestion[] {
  return questionBank.filter((question) => {
    const matchesCategory =
      category === "all" ? true : question.tenseCategory === category;

    if (!matchesCategory) {
      return false;
    }

    const matchesSentenceForm =
      sentenceForm === "all" ? true : question.sentenceForm === sentenceForm;

    if (!matchesSentenceForm) {
      return false;
    }

    if (practiceMode === "mixed-practice") {
      return true;
    }

    return practiceMode === "read-the-timeline"
      ? question.type === "timeline-to-verb"
      : question.type === "sentence-to-timeline";
  });
}

export function buildTimelineRoundQuestions(
  questionBank: TimelineTensesQuestion[],
  category: TenseCategory | "all",
  practiceMode: TimelinePracticeMode,
  roundSize: number,
  sentenceForm: SentenceForm | "all" = "all",
  level: number = 1
): TimelineTensesQuestion[] {
  const filteredQuestions = filterTimelineQuestions(
    questionBank,
    category,
    practiceMode,
    sentenceForm
  );

  if (filteredQuestions.length === 0) return [];

  // For a better mix, we group by difficulty but shuffle the final selection
  // across those difficulties to avoid "Difficulty 1 only" rounds.
  const diff1 = shuffleArray(filteredQuestions.filter(q => q.difficulty === 1));
  const diff2 = shuffleArray(filteredQuestions.filter(q => q.difficulty === 2));
  const diff3 = shuffleArray(filteredQuestions.filter(q => q.difficulty === 3));

  const result: TimelineTensesQuestion[] = [];
  
  // Attempt to build a balanced round based on level
  // Level 1: 70% Easy, 30% Medium
  // Level 2: 40% Easy, 40% Medium, 20% Hard
  // Level 3: 20% Easy, 40% Medium, 40% Hard
  // Level 4: 10% Easy, 30% Medium, 60% Hard
  // Level 5: 10% Easy, 20% Medium, 70% Hard
  
  const ratios = [
    { 1: 0.7, 2: 0.3, 3: 0.0 }, // Lvl 1
    { 1: 0.4, 2: 0.4, 3: 0.2 }, // Lvl 2
    { 1: 0.2, 2: 0.4, 3: 0.4 }, // Lvl 3
    { 1: 0.1, 2: 0.3, 3: 0.6 }, // Lvl 4
    { 1: 0.1, 2: 0.2, 3: 0.7 }, // Lvl 5
  ];
  
  const activeRatio = ratios[Math.min(level, 5) - 1];

  const counts = {
    1: Math.round(roundSize * activeRatio[1]),
    2: Math.round(roundSize * activeRatio[2]),
    3: Math.round(roundSize * activeRatio[3])
  };

  // Adjust counts if some buckets are empty
  const diff1Pick = Math.min(counts[1], diff1.length);
  const diff2Pick = Math.min(counts[2], diff2.length);
  const diff3Pick = Math.min(counts[3], diff3.length);

  result.push(...diff1.slice(0, diff1Pick));
  result.push(...diff2.slice(0, diff2Pick));
  result.push(...diff3.slice(0, diff3Pick));

  // Fill remaining slots from any available pool if we haven't reached roundSize
  if (result.length < roundSize) {
    const remaining = [
      ...diff1.slice(diff1Pick),
      ...diff2.slice(diff2Pick),
      ...diff3.slice(diff3Pick)
    ];
    result.push(...shuffleArray(remaining).slice(0, roundSize - result.length));
  }

  // Final shuffle so the round doesn't always go Easy -> Hard
  return shuffleArray(result);
}

export function getTimelineQuestionCount(
  questionBank: TimelineTensesQuestion[],
  category: TenseCategory | "all",
  practiceMode: TimelinePracticeMode
): number {
  return filterTimelineQuestions(questionBank, category, practiceMode).length;
}

export function calculateTimelineOverallProgress(
  categoryProgress: Record<string, CategoryProgressLike>
): number {
  const completedCount = REAL_TENSE_CATEGORIES.filter(
    (category) => categoryProgress[category]?.completed
  ).length;

  return Math.round((completedCount / REAL_TENSE_CATEGORIES.length) * 100);
}

const PAST_CONNECTING_TYPES: TimelineElementType[] = [
  "arc",
  "solid-to-point",
  "solid-to-now",
];

/**
 * Pick which past "Moment" (single-dot) a connection or duration stamp should
 * visually link to. Handles default 50%/50% placement and dot-before-arc order.
 */
export function resolvePastConnectionPartner(
  element: Pick<TimelineElement, "id" | "type" | "zone" | "position">,
  elements: Pick<TimelineElement, "id" | "type" | "zone" | "position">[],
  pastLayout: PastTimelineLayout = "single"
): Pick<TimelineElement, "id" | "type" | "zone" | "position"> | null {
  if (!isPastTimelineZone(element.zone)) {
    return null;
  }
  if (!PAST_CONNECTING_TYPES.includes(element.type)) {
    return null;
  }

  const pastDots = elements.filter(
    (el) =>
      el.id !== element.id &&
      isPastTimelineZone(el.zone) &&
      el.type === "single-dot"
  );
  if (pastDots.length === 0) {
    return null;
  }

  const elIndex = elements.findIndex((e) => e.id === element.id);
  const x0 = getTimelineElementX(element, pastLayout);

  const toRight = pastDots.filter(
    (d) => getTimelineElementX(d, pastLayout) > x0 + 0.5
  );
  if (toRight.length > 0) {
    return toRight.reduce((a, b) =>
      getTimelineElementX(a, pastLayout) <= getTimelineElementX(b, pastLayout)
        ? a
        : b
    );
  }

  const toLeft = pastDots.filter(
    (d) => getTimelineElementX(d, pastLayout) < x0 - 0.5
  );
  if (toLeft.length > 0) {
    return toLeft.reduce((a, b) =>
      getTimelineElementX(a, pastLayout) >= getTimelineElementX(b, pastLayout)
        ? a
        : b
    );
  }

  const samePos = pastDots.filter(
    (d) => Math.abs(getTimelineElementX(d, pastLayout) - x0) <= 0.5
  );
  if (samePos.length === 0) {
    return null;
  }

  const indexOf = (id: string) => elements.findIndex((e) => e.id === id);

  const dotsAfter = samePos.filter((d) => indexOf(d.id) > elIndex);
  if (dotsAfter.length > 0) {
    return dotsAfter.reduce((a, b) =>
      indexOf(a.id) <= indexOf(b.id) ? a : b
    );
  }

  const dotsBefore = samePos.filter((d) => indexOf(d.id) < elIndex);
  if (dotsBefore.length > 0) {
    return dotsBefore.reduce((a, b) =>
      indexOf(a.id) >= indexOf(b.id) ? a : b
    );
  }

  return samePos[0] ?? null;
}

/**
 * Normalize element types to core types for validation.
 * Legacy types map to their simplified equivalents:
 * - dashed-line → solid-line (Duration)
 * - arc-dashed → arc (Connection)
 * - solid-to-point → solid-to-now (Duration + Connection)
 */
function normalizeElementType(type: TimelineElement['type']): string {
  switch (type) {
    case 'dashed-line':
      return 'solid-line';
    case 'arc-dashed':
      return 'arc';
    case 'solid-to-point':
      return 'solid-to-now';
    default:
      return type;
  }
}

function drawingZoneForMatch(
  zone: TimelineZone,
  strictPastSubzones: boolean
): string {
  if (strictPastSubzones || !isPastTimelineZone(zone)) {
    return zone;
  }
  return "past";
}

function buildDrawingMatchKey(
  element: Pick<TimelineElement, "type" | "zone">,
  strictPastSubzones: boolean
): string {
  const normalizedType = normalizeElementType(element.type);
  const z = drawingZoneForMatch(element.zone, strictPastSubzones);
  return `${normalizedType}:${z}`;
}



export function validateTimelineDrawingElements(
  correctElements: Pick<TimelineElement, "type" | "zone">[],
  placedElements: Pick<TimelineElement, "type" | "zone">[]
): boolean {
  if (correctElements.length !== placedElements.length) {
    return false;
  }

  const strictPastSubzones = correctElements.some(
    (el) => el.zone === "past-earlier" || el.zone === "past-later"
  );

  const expectedCounts = new Map<string, number>();

  for (const correctElement of correctElements) {
    const key = buildDrawingMatchKey(correctElement, strictPastSubzones);
    expectedCounts.set(key, (expectedCounts.get(key) ?? 0) + 1);
  }

  for (const placedElement of placedElements) {
    const key = buildDrawingMatchKey(placedElement, strictPastSubzones);
    const remaining = expectedCounts.get(key);

    if (!remaining) {
      return false;
    }

    if (remaining === 1) {
      expectedCounts.delete(key);
    } else {
      expectedCounts.set(key, remaining - 1);
    }
  }

  return expectedCounts.size === 0;
}
