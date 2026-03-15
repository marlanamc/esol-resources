import type { PrismaClient, UserVocabReviewState, VocabCard } from "@prisma/client";
import { isVocabularyContent, parseActivityContent, type VocabularyContent } from "@/types/activity";
import { parseFlashcards, parsePlainVocabulary } from "./parser";
import {
  ALL_VOCAB_SOURCE_KEY,
  getVocabReviewSourceByKey,
  isKnownVocabReviewSourceKey,
  VOCAB_REVIEW_SOURCE_DEFINITIONS,
  type VocabReviewSourceDefinition,
} from "./sources";
import { applyFSRSRating, estimateOptimalDailyLimit } from "./fsrs";
import type {
  VocabReviewCard,
  VocabReviewFilter,
  VocabReviewQueue,
  VocabReviewRating,
  VocabReviewSummary,
} from "@/types/vocab-review";

export const DEFAULT_VOCAB_REVIEW_LIMIT = 6;
const MASTERED_STEP_THRESHOLD = 5;
const MASTERED_DAYS_THRESHOLD = 21;

const LEGACY_REVIEW_STATE_SELECT = {
  vocabCardId: true,
  step: true,
  dueAt: true,
  lastRating: true,
  lastReviewedAt: true,
  totalReviews: true,
  lapses: true,
} as const;

const FSRS_REVIEW_STATE_SELECT = {
  ...LEGACY_REVIEW_STATE_SELECT,
  easeFactor: true,
  difficulty: true,
  stability: true,
  lastInterval: true,
  // Omitted on read to avoid TEXT[] vs Float[] mismatch on some DBs
} as const;

const LEGACY_EXISTING_STATE_SELECT = {
  step: true,
  totalReviews: true,
  lapses: true,
} as const;

const FSRS_EXISTING_STATE_SELECT = {
  ...LEGACY_EXISTING_STATE_SELECT,
  easeFactor: true,
  difficulty: true,
  stability: true,
  lastInterval: true,
  performanceHistory: true,
} as const;

type VocabReviewDbClient = Pick<PrismaClient, "activity" | "vocabCard" | "userVocabReviewState">;

type ActivityCatalogRow = {
  id: string;
  title: string;
  description: string | null;
  content: string;
};

type RawVocabEntry = {
  term: string;
  definition: string;
  example?: string | null;
};

export type VocabReviewStateLike = Pick<
  UserVocabReviewState,
  "vocabCardId" | "step" | "dueAt" | "lastRating" | "lastReviewedAt" | "totalReviews" | "lapses"
>;

type VocabReviewPersistedStateLike = Pick<UserVocabReviewState, "step" | "totalReviews" | "lapses"> &
  Partial<
    Pick<UserVocabReviewState, "easeFactor" | "difficulty" | "stability" | "lastInterval" | "performanceHistory">
  >;

export type VocabReviewCardLike = Pick<
  VocabCard,
  "id" | "term" | "definition" | "example" | "audioPath" | "sourceKeys" | "sourceLabels" | "unitNumbers" | "topics" | "sortOrder"
>;

export type VocabReviewSeedCard = {
  term: string;
  normalizedTerm: string;
  definition: string;
  example: string | null;
  audioPath: string;
  sourceKeys: string[];
  sourceLabels: string[];
  unitNumbers: number[];
  topics: string[];
  sortOrder: number;
};

type MergedSeedCard = VocabReviewSeedCard & {
  sourceSet: Set<string>;
  labelSet: Set<string>;
  unitSet: Set<number>;
  topicSet: Set<string>;
};

function createEmptyArray<T>(): T[] {
  return [];
}

/** Fisher-Yates shuffle; mutates array in place, returns it for chaining */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

function dedupeNumbers(values: number[]): number[] {
  return Array.from(new Set(values));
}

export function normalizeVocabTerm(term: string): string {
  return term
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/[-/]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractStructuredCards(content: VocabularyContent): RawVocabEntry[] {
  const entrySets = [content.wordList, content.flashcards] as const;
  for (const entrySet of entrySets) {
    const cards = entrySet && typeof entrySet === "object" ? (entrySet as { cards?: unknown }).cards : null;
    if (!Array.isArray(cards)) continue;

    const parsed = cards
      .filter((card): card is { term?: unknown; definition?: unknown; example?: unknown } => !!card && typeof card === "object")
      .map((card) => ({
        term: typeof card.term === "string" ? card.term.trim() : "",
        definition: typeof card.definition === "string" ? card.definition.trim() : "",
        example: typeof card.example === "string" ? card.example.trim() : null,
      }))
      .filter((card) => card.term.length > 0 && card.definition.length > 0);

    if (parsed.length > 0) {
      return parsed;
    }
  }

  return createEmptyArray<RawVocabEntry>();
}

function extractEntriesFromActivity(activity: ActivityCatalogRow): RawVocabEntry[] {
  const parsedContent = parseActivityContent(activity.content);
  if (parsedContent && isVocabularyContent(parsedContent)) {
    const structuredEntries = extractStructuredCards(parsedContent);
    if (structuredEntries.length > 0) {
      return structuredEntries;
    }
  }

  // Fallback to text parsing
  const flashcards = parseFlashcards(activity.content);
  if (flashcards.length > 0) {
    return flashcards.map((card) => ({
      term: card.term.trim(),
      definition: card.definition.trim(),
      example: card.example?.trim() || null,
    }));
  }

  // Try plain vocab parsing if flashcards fail (handles simpler lists)
  return parsePlainVocabulary(activity.content).map(item => ({
    term: item.term.trim(),
    definition: item.definition.trim(),
    example: item.example?.trim() || null
  }));
}

function extractTopicFromActivity(activity: ActivityCatalogRow, source: VocabReviewSourceDefinition): string {
  const description = activity.description?.trim() ?? "";

  const weeklyMatch = description.match(/^Unit\s+\d+\s+vocabulary:\s*([^.]*)/i);
  if (weeklyMatch?.[1]) {
    return weeklyMatch[1].trim();
  }

  const flashcardMatch = description.match(/flash cards:\s*(.+)$/i);
  if (flashcardMatch?.[1]) {
    return flashcardMatch[1].trim();
  }

  if (/[\u2014-]/.test(activity.title)) {
    const titleBeforeDash = activity.title.split(/[\u2014-]/)[0]?.trim() ?? "";
    const colonIndex = titleBeforeDash.indexOf(":");
    if (colonIndex >= 0) {
      const extracted = titleBeforeDash.slice(colonIndex + 1).trim();
      if (extracted.length > 0) {
        return extracted;
      }
    }
  }

  return source.shortLabel;
}

function makeAudioPath(term: string): string {
  return `/audio/vocab/${encodeURIComponent(term)}.mp3`;
}

export function buildVocabReviewSeedCards(activities: ActivityCatalogRow[]): VocabReviewSeedCard[] {
  const activityById = new Map(activities.map((activity) => [activity.id, activity]));
  const merged = new Map<string, MergedSeedCard>();

  for (const source of VOCAB_REVIEW_SOURCE_DEFINITIONS) {
    const activity = activityById.get(source.activityId);
    if (!activity) continue;

    const topic = extractTopicFromActivity(activity, source);
    const entries = extractEntriesFromActivity(activity);

    entries.forEach((entry, index) => {
      const normalizedTerm = normalizeVocabTerm(entry.term);
      if (!normalizedTerm) return;

      const sortOrder = source.sortOrder * 1000 + index;
      const existing = merged.get(normalizedTerm);

      if (!existing) {
        merged.set(normalizedTerm, {
          term: entry.term,
          normalizedTerm,
          definition: entry.definition,
          example: entry.example ?? null,
          audioPath: makeAudioPath(entry.term),
          sourceKeys: [source.key],
          sourceLabels: [source.label],
          unitNumbers: [source.unitNumber],
          topics: topic ? [topic] : [],
          sortOrder,
          sourceSet: new Set([source.key]),
          labelSet: new Set([source.label]),
          unitSet: new Set([source.unitNumber]),
          topicSet: new Set(topic ? [topic] : []),
        });
        return;
      }

      if (!existing.sourceSet.has(source.key)) {
        existing.sourceSet.add(source.key);
        existing.sourceKeys.push(source.key);
      }
      if (!existing.labelSet.has(source.label)) {
        existing.labelSet.add(source.label);
        existing.sourceLabels.push(source.label);
      }
      if (!existing.unitSet.has(source.unitNumber)) {
        existing.unitSet.add(source.unitNumber);
        existing.unitNumbers.push(source.unitNumber);
      }
      if (topic && !existing.topicSet.has(topic)) {
        existing.topicSet.add(topic);
        existing.topics.push(topic);
      }
    });
  }

  return Array.from(merged.values())
    .sort((left, right) => left.sortOrder - right.sortOrder || left.term.localeCompare(right.term))
    .map((card) => ({
      term: card.term,
      normalizedTerm: card.normalizedTerm,
      definition: card.definition,
      example: card.example ?? null,
      audioPath: card.audioPath,
      sourceKeys: dedupeStrings(card.sourceKeys),
      sourceLabels: dedupeStrings(card.sourceLabels),
      unitNumbers: dedupeNumbers(card.unitNumbers),
      topics: dedupeStrings(card.topics),
      sortOrder: card.sortOrder,
    }));
}

async function fetchCatalogActivities(db: VocabReviewDbClient): Promise<ActivityCatalogRow[]> {
  return db.activity.findMany({
    where: {
      deletedAt: null,
      id: {
        in: VOCAB_REVIEW_SOURCE_DEFINITIONS.map((source) => source.activityId),
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
    },
  });
}

export async function syncVocabReviewCatalog(db: VocabReviewDbClient): Promise<{
  total: number;
  created: number;
  updated: number;
  deleted: number;
}> {
  const activities = await fetchCatalogActivities(db);
  const seedCards = buildVocabReviewSeedCards(activities);
  const normalizedTerms = seedCards.map((card) => card.normalizedTerm);

  let created = 0;
  let updated = 0;

  for (const card of seedCards) {
    const existing = await db.vocabCard.findUnique({
      where: { normalizedTerm: card.normalizedTerm },
      select: { id: true },
    });

    await db.vocabCard.upsert({
      where: { normalizedTerm: card.normalizedTerm },
      update: {
        term: card.term,
        definition: card.definition,
        example: card.example,
        audioPath: card.audioPath,
        sourceKeys: card.sourceKeys,
        sourceLabels: card.sourceLabels,
        unitNumbers: card.unitNumbers,
        topics: card.topics,
        sortOrder: card.sortOrder,
      },
      create: {
        term: card.term,
        normalizedTerm: card.normalizedTerm,
        definition: card.definition,
        example: card.example,
        audioPath: card.audioPath,
        sourceKeys: card.sourceKeys,
        sourceLabels: card.sourceLabels,
        unitNumbers: card.unitNumbers,
        topics: card.topics,
        sortOrder: card.sortOrder,
      },
    });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  let deleted = 0;
  if (normalizedTerms.length > 0) {
    const result = await db.vocabCard.deleteMany({
      where: {
        normalizedTerm: {
          notIn: normalizedTerms,
        },
      },
    });
    deleted = result.count;
  }

  return {
    total: seedCards.length,
    created,
    updated,
    deleted,
  };
}

function toStateMap(states: VocabReviewStateLike[]): Map<string, VocabReviewStateLike> {
  return new Map(states.map((state) => [state.vocabCardId, state]));
}

function isRating(value: string | null | undefined): value is VocabReviewRating {
  return value === "again" || value === "hard" || value === "good" || value === "easy";
}

function isMissingFsrsColumnError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybePrismaError = error as {
    code?: unknown;
    meta?: { column?: unknown };
  };

  const column = maybePrismaError.meta?.column;
  return (
    maybePrismaError.code === "P2022" &&
    typeof column === "string" &&
    column.startsWith("UserVocabReviewState.") &&
    ["easeFactor", "difficulty", "stability", "lastInterval", "performanceHistory"].includes(
      column.replace("UserVocabReviewState.", "")
    )
  );
}

function isDue(state: VocabReviewStateLike | undefined, now: Date): boolean {
  return !!state && state.dueAt.getTime() <= now.getTime();
}

function isMastered(state: VocabReviewStateLike | undefined, now: Date): boolean {
  if (!state || isDue(state, now)) {
    return false;
  }

  const daysUntilDue = (state.dueAt.getTime() - now.getTime()) / 86_400_000;
  return state.step >= MASTERED_STEP_THRESHOLD || daysUntilDue >= MASTERED_DAYS_THRESHOLD;
}

function toReviewCard(card: VocabReviewCardLike, state: VocabReviewStateLike | undefined, now: Date): VocabReviewCard {
  const due = isDue(state, now);
  const isNew = !state;

  return {
    id: card.id,
    term: card.term,
    definition: card.definition,
    example: card.example ?? null,
    audioPath: card.audioPath ?? null,
    sourceKeys: [...card.sourceKeys],
    sourceLabels: [...card.sourceLabels],
    unitNumbers: [...card.unitNumbers],
    topics: [...card.topics],
    sortOrder: card.sortOrder,
    step: state?.step ?? null,
    dueAt: state?.dueAt?.toISOString() ?? null,
    lastRating: isRating(state?.lastRating) ? state.lastRating : null,
    isNew,
    isDue: due,
  };
}

export function buildVocabReviewSummary(
  cards: VocabReviewCardLike[],
  states: VocabReviewStateLike[],
  now = new Date()
): VocabReviewSummary {
  const stateByCardId = toStateMap(states);

  const dueCount = cards.filter((card) => isDue(stateByCardId.get(card.id), now)).length;
  const newCount = cards.filter((card) => !stateByCardId.has(card.id)).length;
  const masteredCount = cards.filter((card) => isMastered(stateByCardId.get(card.id), now)).length;

  const filters: VocabReviewFilter[] = [
    {
      key: ALL_VOCAB_SOURCE_KEY,
      label: "All vocab",
      shortLabel: "All vocab",
      group: "all",
      unitNumber: null,
      dueCount,
      newCount,
      masteredCount,
      totalCount: cards.length,
    },
    ...VOCAB_REVIEW_SOURCE_DEFINITIONS.map((source) => {
      const matchingCards = cards.filter((card) => card.sourceKeys.includes(source.key));
      const sourceDueCount = matchingCards.filter((card) => isDue(stateByCardId.get(card.id), now)).length;
      const sourceNewCount = matchingCards.filter((card) => !stateByCardId.has(card.id)).length;
      const sourceMasteredCount = matchingCards.filter((card) => isMastered(stateByCardId.get(card.id), now)).length;

      return {
        key: source.key,
        label: source.label,
        shortLabel: source.shortLabel,
        group: source.group,
        unitNumber: source.unitNumber,
        dueCount: sourceDueCount,
        newCount: sourceNewCount,
        masteredCount: sourceMasteredCount,
        totalCount: matchingCards.length,
      };
    }).filter((filter) => filter.totalCount > 0),
  ];

  return {
    dueCount,
    newCount,
    masteredCount,
    totalCount: cards.length,
    filters,
    updatedAt: now.toISOString(),
  };
}

function orderQueueCards(
  cards: VocabReviewCardLike[],
  stateByCardId: Map<string, VocabReviewStateLike>,
  source: string,
  now: Date
) {
  const relevantCards = source === ALL_VOCAB_SOURCE_KEY
    ? cards
    : cards.filter((card) => card.sourceKeys.includes(source));

  // Calculate priorities for all cards
  const cardsWithPriority = relevantCards.map(card => {
    const state = stateByCardId.get(card.id);
    const isDue = state ? state.dueAt.getTime() <= now.getTime() : false;
    const isNew = !state;
    
    let priority = 0;
    if (isDue) {
      const overdueHours = (now.getTime() - state!.dueAt.getTime()) / (1000 * 60 * 60);
      priority = 1000 + overdueHours; // Higher priority for more overdue
    } else if (isNew) {
      priority = 500; // New cards get medium-high priority
    } else {
      priority = 100; // Future cards get lower priority
    }
    
    return { card, state, isDue, isNew, priority };
  });

  // Sort by priority (descending), then by sort order for ties
  cardsWithPriority.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.card.sortOrder - b.card.sortOrder;
  });

  // Separate into categories
  const dueCards = cardsWithPriority
    .filter(item => item.isDue)
    .map(item => item.card);

  const newCards = cardsWithPriority
    .filter(item => item.isNew)
    .map(item => item.card);

  const scheduledCards = cardsWithPriority
    .filter(item => !item.isDue && !item.isNew)
    .map(item => item.card);

  return {
    dueCards: shuffle(dueCards),
    newCards: shuffle(newCards),
    scheduledCards: shuffle(scheduledCards),
    combined: [...dueCards, ...newCards, ...scheduledCards],
  };
}

export function getOptimalDailyLimit(
  cards: VocabReviewCardLike[],
  states: VocabReviewStateLike[],
  now = new Date()
): number {
  const stateByCardId = toStateMap(states);
  
  const cardAnalysis = cards.map(card => {
    const state = stateByCardId.get(card.id);
    const isDue = state ? state.dueAt.getTime() <= now.getTime() : false;
    const isNew = !state;
    const difficulty = (state as { difficulty?: number })?.difficulty ?? 0.0;
    
    return {
      difficulty,
      isDue,
      isNew,
    };
  });

  return estimateOptimalDailyLimit(cardAnalysis);
}

export function buildVocabReviewQueue(
  cards: VocabReviewCardLike[],
  states: VocabReviewStateLike[],
  source: string,
  limit?: number,
  now = new Date()
): VocabReviewQueue {
  const stateByCardId = toStateMap(states);
  
  // Use optimal limit if none provided, otherwise use provided limit
  const optimalLimit = limit ?? getOptimalDailyLimit(cards, states, now);
  const safeLimit = Number.isFinite(optimalLimit) ? Math.max(1, Math.min(50, Math.floor(optimalLimit))) : DEFAULT_VOCAB_REVIEW_LIMIT;
  
  const { dueCards, newCards, combined } = orderQueueCards(cards, stateByCardId, source, now);
  const selectedCards = combined.slice(0, safeLimit);
  const sourceLabel = source === ALL_VOCAB_SOURCE_KEY
    ? "All vocab"
    : getVocabReviewSourceByKey(source)?.label ?? "Selected set";

  return {
    source,
    sourceLabel,
    cards: selectedCards.map((card) => toReviewCard(card, stateByCardId.get(card.id), now)),
    hasMore: combined.length > selectedCards.length,
    totalCount: combined.length,
    dueCount: dueCards.length,
    newCount: newCards.length,
    limit: safeLimit,
  };
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function addHours(date: Date, hours: number): Date {
  const next = new Date(date);
  next.setUTCHours(next.getUTCHours() + hours);
  return next;
}

export function applyVocabReviewRating(
  currentState: VocabReviewPersistedStateLike | null,
  rating: VocabReviewRating,
  now = new Date()
): {
  step: number;
  dueAt: Date;
  totalReviews: number;
  lapses: number;
  lastRating: VocabReviewRating;
  lastReviewedAt: Date;
  shouldRepeatInSession: boolean;
  easeFactor: number;
  difficulty: number;
  stability: number;
  lastInterval: number;
  performanceHistory: number[];
} {
  const fsrsResult = applyFSRSRating(currentState, rating, now);
  
  return {
    step: fsrsResult.step,
    dueAt: fsrsResult.dueAt,
    totalReviews: fsrsResult.totalReviews,
    lapses: fsrsResult.lapses,
    lastRating: fsrsResult.lastRating,
    lastReviewedAt: fsrsResult.lastReviewedAt,
    shouldRepeatInSession: fsrsResult.shouldRepeatInSession,
    easeFactor: fsrsResult.easeFactor,
    difficulty: fsrsResult.difficulty,
    stability: fsrsResult.stability,
    lastInterval: fsrsResult.lastInterval,
    performanceHistory: fsrsResult.performanceHistory,
  };
}

async function loadReviewStates(db: VocabReviewDbClient, userId: string): Promise<VocabReviewStateLike[]> {
  try {
    return await db.userVocabReviewState.findMany({
      where: { userId },
      select: FSRS_REVIEW_STATE_SELECT,
    });
  } catch (error) {
    if (!isMissingFsrsColumnError(error)) {
      throw error;
    }

    return db.userVocabReviewState.findMany({
      where: { userId },
      select: LEGACY_REVIEW_STATE_SELECT,
    });
  }
}

async function loadExistingReviewState(
  db: VocabReviewDbClient,
  userId: string,
  cardId: string
): Promise<{ state: VocabReviewPersistedStateLike | null; hasFsrsColumns: boolean }> {
  try {
    const state = await db.userVocabReviewState.findUnique({
      where: {
        userId_vocabCardId: {
          userId,
          vocabCardId: cardId,
        },
      },
      select: FSRS_EXISTING_STATE_SELECT,
    });

    return {
      state,
      hasFsrsColumns: true,
    };
  } catch (error) {
    if (!isMissingFsrsColumnError(error)) {
      throw error;
    }

    const state = await db.userVocabReviewState.findUnique({
      where: {
        userId_vocabCardId: {
          userId,
          vocabCardId: cardId,
        },
      },
      select: LEGACY_EXISTING_STATE_SELECT,
    });

    return {
      state,
      hasFsrsColumns: false,
    };
  }
}

async function persistReviewState(
  db: VocabReviewDbClient,
  userId: string,
  cardId: string,
  nextState: ReturnType<typeof applyVocabReviewRating>,
  hasFsrsColumns: boolean
) {
  if (!hasFsrsColumns) {
    return db.userVocabReviewState.upsert({
      where: {
        userId_vocabCardId: {
          userId,
          vocabCardId: cardId,
        },
      },
      update: {
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
      },
      create: {
        userId,
        vocabCardId: cardId,
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
      },
      select: {
        step: true,
        dueAt: true,
      },
    });
  }

  try {
    return await db.userVocabReviewState.upsert({
      where: {
        userId_vocabCardId: {
          userId,
          vocabCardId: cardId,
        },
      },
      update: {
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
        easeFactor: nextState.easeFactor,
        difficulty: nextState.difficulty,
        stability: nextState.stability,
        lastInterval: nextState.lastInterval,
        performanceHistory: nextState.performanceHistory,
      },
      create: {
        userId,
        vocabCardId: cardId,
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
        easeFactor: nextState.easeFactor,
        difficulty: nextState.difficulty,
        stability: nextState.stability,
        lastInterval: nextState.lastInterval,
        performanceHistory: nextState.performanceHistory,
      },
      select: {
        step: true,
        dueAt: true,
      },
    });
  } catch (error) {
    if (!isMissingFsrsColumnError(error)) {
      throw error;
    }

    return db.userVocabReviewState.upsert({
      where: {
        userId_vocabCardId: {
          userId,
          vocabCardId: cardId,
        },
      },
      update: {
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
      },
      create: {
        userId,
        vocabCardId: cardId,
        step: nextState.step,
        dueAt: nextState.dueAt,
        lastRating: nextState.lastRating,
        lastReviewedAt: nextState.lastReviewedAt,
        totalReviews: nextState.totalReviews,
        lapses: nextState.lapses,
      },
      select: {
        step: true,
        dueAt: true,
      },
    });
  }
}

async function loadCardsAndStates(db: VocabReviewDbClient, userId: string) {
  const cardsCount = await db.vocabCard.count();
  if (cardsCount === 0) {
    console.log("Vocab catalog empty, triggering sync...");
    await syncVocabReviewCatalog(db);
  }

  const [cards, states] = await Promise.all([
    db.vocabCard.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        term: true,
        definition: true,
        example: true,
        audioPath: true,
        sourceKeys: true,
        sourceLabels: true,
        unitNumbers: true,
        topics: true,
        sortOrder: true,
      },
    }),
    loadReviewStates(db, userId),
  ]);

  return { cards, states };
}

export async function getVocabReviewSummaryForUser(
  db: VocabReviewDbClient,
  userId: string,
  now = new Date()
): Promise<VocabReviewSummary> {
  const { cards, states } = await loadCardsAndStates(db, userId);
  return buildVocabReviewSummary(cards, states, now);
}

export async function getVocabReviewQueueForUser(
  db: VocabReviewDbClient,
  userId: string,
  source = ALL_VOCAB_SOURCE_KEY,
  limit = DEFAULT_VOCAB_REVIEW_LIMIT,
  now = new Date()
): Promise<VocabReviewQueue> {
  const sourceKey =
    source === ALL_VOCAB_SOURCE_KEY || isKnownVocabReviewSourceKey(source)
      ? source
      : ALL_VOCAB_SOURCE_KEY;
  const { cards, states } = await loadCardsAndStates(db, userId);
  return buildVocabReviewQueue(cards, states, sourceKey, limit, now);
}

export async function saveVocabReviewRating(
  db: VocabReviewDbClient,
  userId: string,
  cardId: string,
  rating: VocabReviewRating,
  now = new Date()
) {
  const card = await db.vocabCard.findUnique({
    where: { id: cardId },
    select: { id: true },
  });

  if (!card) {
    return null;
  }

  const { state: existing, hasFsrsColumns } = await loadExistingReviewState(db, userId, cardId);

  const nextState = applyVocabReviewRating(existing, rating, now);

  const saved = await persistReviewState(db, userId, cardId, nextState, hasFsrsColumns);

  return {
    step: saved.step,
    dueAt: saved.dueAt,
    shouldRepeatInSession: nextState.shouldRepeatInSession,
  };
}
