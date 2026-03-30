import {
  areExerciseAnswersEquivalent,
  normalizeExerciseAnswer,
} from "@/lib/exercise-answer-normalization";
import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
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
  | "mixed-practice"
  | "lab"
  // Challenge modes (unlocked at level 2+)
  | "spot-the-difference"
  | "transformer"
  | "in-context"
  | "fix-it"
  | "story-builder";

export const CHALLENGE_MODES: TimelinePracticeMode[] = [
  "spot-the-difference",
  "transformer",
  "in-context",
  "fix-it",
  "story-builder",
];

export function isChallengeMode(mode: TimelinePracticeMode): boolean {
  return CHALLENGE_MODES.includes(mode);
}

export interface TimelineLabFeedback {
  status: "match" | "none";
  labels: string[];
  primaryLabel?: string;
}

export interface SentenceToTimelineStampGuidance {
  badgeText: string;
  hintText: string;
}

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

/**
 * Derive the single-category key used for progress tracking and difficulty curves.
 * - 0 selected (all) → 'all'
 * - 1 selected       → that category
 * - 2+ selected      → 'all' (use mixed difficulty curve)
 */
export function categoriesToProgressKey(
  categories: TenseCategory[]
): TenseCategory | "all" {
  if (categories.length === 1) return categories[0];
  return "all";
}

export function filterTimelineQuestions(
  questionBank: TimelineTensesQuestion[],
  categories: TenseCategory[],   // empty = all tenses
  practiceMode: TimelinePracticeMode,
  sentenceForm: SentenceForm | "all" = "all"
): TimelineTensesQuestion[] {
  return questionBank.filter((question) => {
    const matchesCategory =
      categories.length === 0 ? true : categories.includes(question.tenseCategory);

    if (!matchesCategory) {
      return false;
    }

    // Challenge modes only filter by category (no sentenceForm concept)
    if (practiceMode === "spot-the-difference") {
      return question.type === "tense-comparison";
    }
    if (practiceMode === "transformer") {
      return question.type === "sentence-transformer";
    }
    if (practiceMode === "in-context") {
      return question.type === "context-tense-picker";
    }
    if (practiceMode === "fix-it") {
      return question.type === "error-correction";
    }
    if (practiceMode === "story-builder") {
      return question.type === "story-builder";
    }

    const matchesSentenceForm =
      sentenceForm === "all" ? true : (question as { sentenceForm?: string }).sentenceForm === sentenceForm;

    if (!matchesSentenceForm) {
      return false;
    }

    if (practiceMode === "mixed-practice") {
      return (
        question.type === "sentence-to-timeline" ||
        question.type === "timeline-to-verb"
      );
    }

    if (practiceMode === "lab") {
      return question.type === "sentence-to-timeline";
    }

    return practiceMode === "read-the-timeline"
      ? question.type === "timeline-to-verb"
      : question.type === "sentence-to-timeline";
  });
}

type CategoryQuotaConfig = {
  category: TenseCategory;
  share: number;
  allowedDifficulties?: Array<1 | 2 | 3>;
};

function getAllModeCategoryPlan(level: number): CategoryQuotaConfig[] {
  const normalizedLevel = Math.min(Math.max(level, 1), 5);

  if (normalizedLevel === 1) {
    return [
      { category: "simple", share: 0.75, allowedDifficulties: [1] },
      { category: "continuous", share: 0.25, allowedDifficulties: [1] },
    ];
  }

  if (normalizedLevel === 2) {
    return [
      { category: "simple", share: 0.55, allowedDifficulties: [1, 2] },
      { category: "continuous", share: 0.25, allowedDifficulties: [1, 2] },
      { category: "perfect", share: 0.2, allowedDifficulties: [2] },
    ];
  }

  if (normalizedLevel === 3) {
    return [
      { category: "simple", share: 0.4, allowedDifficulties: [1, 2] },
      { category: "continuous", share: 0.25, allowedDifficulties: [1, 2] },
      { category: "perfect", share: 0.2, allowedDifficulties: [2, 3] },
      { category: "mixed", share: 0.15, allowedDifficulties: [2] },
    ];
  }

  if (normalizedLevel === 4) {
    return [
      { category: "simple", share: 0.3, allowedDifficulties: [1, 2] },
      { category: "continuous", share: 0.2, allowedDifficulties: [1, 2] },
      { category: "perfect", share: 0.25, allowedDifficulties: [2, 3] },
      { category: "mixed", share: 0.15, allowedDifficulties: [2, 3] },
      { category: "perfect-continuous", share: 0.1, allowedDifficulties: [2] },
    ];
  }

  return [
    { category: "simple", share: 0.2, allowedDifficulties: [1, 2] },
    { category: "continuous", share: 0.2, allowedDifficulties: [1, 2] },
    { category: "perfect", share: 0.25, allowedDifficulties: [2, 3] },
    { category: "mixed", share: 0.15, allowedDifficulties: [2, 3] },
    { category: "perfect-continuous", share: 0.2, allowedDifficulties: [2, 3] },
  ];
}

function buildStandardDifficultyBalancedRound(
  filteredQuestions: TimelineTensesQuestion[],
  roundSize: number,
  level: number
): TimelineTensesQuestion[] {
  const diff1 = shuffleArray(filteredQuestions.filter((q) => q.difficulty === 1));
  const diff2 = shuffleArray(filteredQuestions.filter((q) => q.difficulty === 2));
  const diff3 = shuffleArray(filteredQuestions.filter((q) => q.difficulty === 3));

  const result: TimelineTensesQuestion[] = [];

  const ratios = [
    { 1: 0.7, 2: 0.3, 3: 0.0 },
    { 1: 0.4, 2: 0.4, 3: 0.2 },
    { 1: 0.2, 2: 0.4, 3: 0.4 },
    { 1: 0.1, 2: 0.3, 3: 0.6 },
    { 1: 0.1, 2: 0.2, 3: 0.7 },
  ];

  const activeRatio = ratios[Math.min(level, 5) - 1];

  const counts = {
    1: Math.round(roundSize * activeRatio[1]),
    2: Math.round(roundSize * activeRatio[2]),
    3: Math.round(roundSize * activeRatio[3]),
  };

  const diff1Pick = Math.min(counts[1], diff1.length);
  const diff2Pick = Math.min(counts[2], diff2.length);
  const diff3Pick = Math.min(counts[3], diff3.length);

  result.push(...diff1.slice(0, diff1Pick));
  result.push(...diff2.slice(0, diff2Pick));
  result.push(...diff3.slice(0, diff3Pick));

  if (result.length < roundSize) {
    const remaining = [
      ...diff1.slice(diff1Pick),
      ...diff2.slice(diff2Pick),
      ...diff3.slice(diff3Pick),
    ];
    result.push(...shuffleArray(remaining).slice(0, roundSize - result.length));
  }

  return shuffleArray(result);
}

function buildCommonFirstAllRound(
  filteredQuestions: TimelineTensesQuestion[],
  roundSize: number,
  level: number
): TimelineTensesQuestion[] {
  const plan = getAllModeCategoryPlan(level);
  const selectedIds = new Set<string>();
  const result: TimelineTensesQuestion[] = [];

  for (const quota of plan) {
    const targetCount = Math.round(roundSize * quota.share);
    const eligibleQuestions = filteredQuestions.filter((question) => {
      if (selectedIds.has(question.id)) {
        return false;
      }

      if (question.tenseCategory !== quota.category) {
        return false;
      }

      return quota.allowedDifficulties
        ? quota.allowedDifficulties.includes(question.difficulty)
        : true;
    });

    if (eligibleQuestions.length === 0) {
      continue;
    }

    const pickedQuestions = buildStandardDifficultyBalancedRound(
      eligibleQuestions,
      Math.min(targetCount, eligibleQuestions.length),
      level
    );

    for (const question of pickedQuestions) {
      if (selectedIds.has(question.id)) {
        continue;
      }
      selectedIds.add(question.id);
      result.push(question);
    }
  }

  if (result.length < roundSize) {
    const fallbackOrder = plan.map((quota) => quota.category);
    const remainingQuestions = filteredQuestions.filter(
      (question) => !selectedIds.has(question.id)
    );

    const orderedFallback = [
      ...fallbackOrder.flatMap((category) =>
        remainingQuestions.filter((question) => question.tenseCategory === category)
      ),
      ...remainingQuestions.filter(
        (question) => !fallbackOrder.includes(question.tenseCategory)
      ),
    ];

    for (const question of orderedFallback) {
      if (result.length >= roundSize) {
        break;
      }
      if (selectedIds.has(question.id)) {
        continue;
      }
      selectedIds.add(question.id);
      result.push(question);
    }
  }

  return shuffleArray(result.slice(0, roundSize));
}

export function buildTimelineRoundQuestions(
  questionBank: TimelineTensesQuestion[],
  categories: TenseCategory[],   // empty = all tenses
  practiceMode: TimelinePracticeMode,
  roundSize: number,
  sentenceForm: SentenceForm | "all" = "all",
  level: number = 1,
  recentlySeenQuestionIds: string[] = []
): TimelineTensesQuestion[] {
  const allFilteredQuestions = filterTimelineQuestions(
    questionBank,
    categories,
    practiceMode,
    sentenceForm
  );

  if (allFilteredQuestions.length === 0) return [];

  // Prefer unseen questions for freshness; only fall back to recent items if needed.
  const recentIdSet = new Set(recentlySeenQuestionIds);
  const unseenQuestions = allFilteredQuestions.filter(
    (question) => !recentIdSet.has(question.id)
  );
  const filteredQuestions =
    unseenQuestions.length >= roundSize
      ? unseenQuestions
      : [...unseenQuestions, ...allFilteredQuestions.filter((question) => recentIdSet.has(question.id))];

  // Use the common-first ordering when 'all' or 2+ categories — otherwise difficulty-balanced
  if (categories.length !== 1) {
    return buildCommonFirstAllRound(filteredQuestions, roundSize, level);
  }

  return buildStandardDifficultyBalancedRound(filteredQuestions, roundSize, level);
}

export function getTimelineQuestionCount(
  questionBank: TimelineTensesQuestion[],
  categories: TenseCategory[],
  practiceMode: TimelinePracticeMode
): number {
  return filterTimelineQuestions(questionBank, categories, practiceMode).length;
}

export function calculateTimelineOverallProgress(
  categoryProgress: Record<string, CategoryProgressLike>
): number {
  // Count completed individual categories, but also treat the 'all' key as
  // a proxy for overall progress when students play in All Tenses mode.
  const categoryKeys = [...REAL_TENSE_CATEGORIES, 'all'] as string[];
  const completedCount = categoryKeys.filter(
    (key) => categoryProgress[key]?.completed
  ).length;

  // Normalise against the number of real categories so 100% is still achievable
  // by mastering individual categories; 'all' completion counts as one bonus credit
  // capped at the total.
  return Math.min(100, Math.round((completedCount / REAL_TENSE_CATEGORIES.length) * 100));
}

const PAST_CONNECTING_TYPES: TimelineElementType[] = [
  "arc",
  "solid-to-point",
  "solid-to-now",
];

/**
 * Pick which "Moment" (single-dot) a connection or duration stamp should
 * visually link to. Handles default 50%/50% placement and dot-before-arc order.
 * Works across all timeline zones (Past, Present, Future).
 */
export function resolveTimelineConnectionPartner(
  element: Pick<TimelineElement, "id" | "type" | "zone" | "position">,
  elements: Pick<TimelineElement, "id" | "type" | "zone" | "position">[],
  pastLayout: PastTimelineLayout = "single"
): Pick<TimelineElement, "id" | "type" | "zone" | "position"> | null {
  if (!PAST_CONNECTING_TYPES.includes(element.type)) {
    return null;
  }

  const isElementPast = isPastTimelineZone(element.zone);
  const zoneDots = elements.filter(
    (el) =>
      el.id !== element.id &&
      (isElementPast ? isPastTimelineZone(el.zone) : el.zone === element.zone) &&
      el.type === "single-dot"
  );
  if (zoneDots.length === 0) {
    return null;
  }

  const elIndex = elements.findIndex((e) => e.id === element.id);
  const x0 = getTimelineElementX(element, pastLayout);

  const toRight = zoneDots.filter(
    (d) => getTimelineElementX(d, pastLayout) > x0 + 0.5
  );
  if (toRight.length > 0) {
    return toRight.reduce((a, b) =>
      getTimelineElementX(a, pastLayout) <= getTimelineElementX(b, pastLayout)
        ? a
        : b
    );
  }

  const toLeft = zoneDots.filter(
    (d) => getTimelineElementX(d, pastLayout) < x0 - 0.5
  );
  if (toLeft.length > 0) {
    return toLeft.reduce((a, b) =>
      getTimelineElementX(a, pastLayout) >= getTimelineElementX(b, pastLayout)
        ? a
        : b
    );
  }

  const samePos = zoneDots.filter(
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

function canonicalizeLabTenseName(tenseName: string): string {
  return tenseName.replace(/\s+\((Negative|Question)\)$/u, "").trim();
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

function buildTimelinePatternSignature(
  elements: Pick<TimelineElement, "type" | "zone">[],
  strictPastSubzones?: boolean
): string {
  const shouldUseStrictPastSubzones =
    strictPastSubzones ??
    elements.some((el) => el.zone === "past-earlier" || el.zone === "past-later");
  const counts = new Map<string, number>();

  for (const element of elements) {
    const key = buildDrawingMatchKey(element, shouldUseStrictPastSubzones);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `${key}#${count}`)
    .join("|");
}

const TIMELINE_LAB_GUIDE_LABELS = new Map<string, string>([
  ["multiple-dots:present#1", "Present Simple"],
  ["single-dot:past#1", "Past Simple"],
  ["single-dot:past-earlier#1", "Past Simple"],
  ["single-dot:past-later#1", "Past Simple"],
  ["single-dot:future#1", "Future Simple"],
  ["solid-line:present#1", "Present Continuous"],
  ["single-dot:past#1|solid-line:past#1", "Past Continuous + Past Simple"],
  ["solid-line:past#1", "Past Continuous"],
  ["solid-line:past-earlier#1", "Past Continuous"],
  ["solid-line:past-later#1", "Past Continuous"],
  ["single-dot:past-earlier#1|solid-line:past-later#1", "Past Continuous + Past Simple"],
  ["single-dot:past-later#1|solid-line:past-earlier#1", "Past Continuous + Past Simple"],
  ["single-dot:past-earlier#1|solid-line:past-earlier#1", "Past Continuous + Past Simple"],
  ["single-dot:past-later#1|solid-line:past-later#1", "Past Continuous + Past Simple"],
  ["solid-line:future#1", "Future Continuous"],
  ["arc:past#1", "Present Perfect"],
  ["arc:past-earlier#1", "Past Perfect"],
  ["arc:past-later#1", "Present Perfect"],
  ["arc:past-earlier#1|single-dot:past-later#1", "Past Perfect"],
  ["arc:past-later#1|single-dot:past-earlier#1", "Past Perfect"],
  ["arc:future#1", "Future Perfect"],
  ["solid-to-now:past#1", "Present Perfect Continuous"],
  ["solid-to-now:past-earlier#1", "Past Perfect Continuous"],
  ["solid-to-now:past-later#1", "Present Perfect Continuous"],
  ["single-dot:past-later#1|solid-to-now:past-earlier#1", "Past Perfect Continuous"],
  ["single-dot:past-earlier#1|solid-to-now:past-later#1", "Past Perfect Continuous"],
  ["solid-to-now:future#1", "Future Perfect Continuous"],
  ["arc:past#1|multiple-dots:present#1", "Present Perfect + Present Simple"],
  ["arc:past#1|single-dot:future#1", "Present Perfect + Future Simple"],
  ["multiple-dots:present#1|solid-line:past#1", "Past Continuous + Present Simple"],
  ["single-dot:future#2", "Future Simple + Present Simple"],
  ["single-dot:past#2", "Past Simple Sequence"],
  ["solid-line:past#2", "Past Continuous"],
  ["arc:future#1|single-dot:future#1", "Future Perfect + Future Simple"],
]);

const TIMELINE_LAB_PATTERN_MAP = (() => {
  const patternMap = new Map<string, string>();

  for (const question of TIMELINE_TENSES_QUESTIONS) {
    if (question.type !== "sentence-to-timeline") {
      continue;
    }

    const signature = buildTimelinePatternSignature(question.correctElements);
    const canonicalTenseName =
      TIMELINE_LAB_GUIDE_LABELS.get(signature) ??
      canonicalizeLabTenseName(question.tenseName);

    if (!patternMap.has(signature)) {
      patternMap.set(signature, canonicalTenseName);
    }
  }

  for (const [signature, label] of TIMELINE_LAB_GUIDE_LABELS.entries()) {
    patternMap.set(signature, label);
  }

  return patternMap;
})();

export function inferTimelineLabFeedback(
  placedElements: Pick<TimelineElement, "type" | "zone">[]
): TimelineLabFeedback {
  if (placedElements.length === 0) {
    return { status: "none", labels: [] };
  }

  const splitPastArc = placedElements.find(
    (element) =>
      normalizeElementType(element.type) === "arc" &&
      (element.zone === "past-earlier" || element.zone === "past-later")
  );
  const splitPastOngoingLink = placedElements.find(
    (element) =>
      normalizeElementType(element.type) === "solid-to-now" &&
      (element.zone === "past-earlier" || element.zone === "past-later")
  );
  const pastReferencePoints = placedElements.filter(
    (element) =>
      normalizeElementType(element.type) === "single-dot" &&
      isPastTimelineZone(element.zone)
  );

  if (splitPastArc && pastReferencePoints.length > 0) {
    return {
      status: "match",
      labels: ["Past Perfect"],
      primaryLabel: "Past Perfect",
    };
  }

  if (
    splitPastOngoingLink &&
    pastReferencePoints.some((element) => element.zone !== splitPastOngoingLink.zone)
  ) {
    return {
      status: "match",
      labels: ["Past Perfect Continuous"],
      primaryLabel: "Past Perfect Continuous",
    };
  }

  const signature = buildTimelinePatternSignature(placedElements);
  const label = TIMELINE_LAB_PATTERN_MAP.get(signature);

  if (!label) {
    return { status: "none", labels: [] };
  }

  return {
    status: "match",
    labels: [label],
    primaryLabel: label,
  };
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

  return (
    buildTimelinePatternSignature(correctElements, strictPastSubzones) ===
    buildTimelinePatternSignature(placedElements, strictPastSubzones)
  );
}

export function getSentenceToTimelineStampGuidance(
  correctElements: Pick<TimelineElement, "type" | "zone">[]
): SentenceToTimelineStampGuidance | null {
  if (correctElements.length <= 1) {
    return null;
  }

  const hasPastPerfectContinuousReferencePoint =
    correctElements.length === 2 &&
    correctElements.some(
      (element) =>
        element.type === "solid-to-point" && element.zone === "past-earlier"
    ) &&
    correctElements.some(
      (element) => element.type === "single-dot" && element.zone === "past-later"
    );

  if (hasPastPerfectContinuousReferencePoint) {
    return {
      badgeText: "2 stamps: action + past reference point",
      hintText:
        "Place the long action in the earlier past, then add one recent-past dot for the reference moment.",
    };
  }

  return {
    badgeText: `${correctElements.length} stamps required`,
    hintText: "",
  };
}
