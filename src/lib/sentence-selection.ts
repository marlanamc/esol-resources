/**
 * Sentence Selection Algorithm for Gerund & Infinitive Game
 * Prevents repetition and ensures variety in verb, tense, and topic
 */

import type { CSVSentence, PatternGroupId } from '@/lib/csv/gerund-infinitive-csv';
import {
  getSentencesByPatternGroup,
  getSentencesByGroupAndDifficulty,
} from '@/lib/csv/gerund-infinitive-csv';

/**
 * Selection context tracks what has been used in the current session
 * to prevent repetition and ensure variety
 */
export interface SelectionContext {
  usedSentenceIds: Set<string>;
  recentVerbs: string[];      // Last N verbs used (for variety)
  recentTopics: string[];     // Last N topics used (for variety)
  recentTenses: string[];     // Last N tenses used (for variety)
}

/**
 * Create a fresh selection context
 */
export function createSelectionContext(): SelectionContext {
  return {
    usedSentenceIds: new Set(),
    recentVerbs: [],
    recentTopics: [],
    recentTenses: [],
  };
}

/**
 * Configuration for sentence selection
 */
export interface SelectionConfig {
  maxRecentVerbs: number;     // How many recent verbs to track
  maxRecentTopics: number;    // How many recent topics to track
  maxRecentTenses: number;    // How many recent tenses to track
  preferUnusedVerbs: boolean; // Prefer verbs not recently used
  preferUnusedTopics: boolean;// Prefer topics not recently used
  allowReuse: boolean;        // Allow reusing sentences when pool exhausted
}

const DEFAULT_CONFIG: SelectionConfig = {
  maxRecentVerbs: 3,
  maxRecentTopics: 3,
  maxRecentTenses: 3,
  preferUnusedVerbs: true,
  preferUnusedTopics: true,
  allowReuse: true,
};

/**
 * Select a sentence from the available pool with anti-repetition logic
 */
export function selectSentence(
  patternGroup: PatternGroupId,
  context: SelectionContext,
  difficulty?: 'round1' | 'round2',
  config: Partial<SelectionConfig> = {}
): { sentence: CSVSentence | null; updatedContext: SelectionContext } {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Get sentences for this pattern group
  const pool = difficulty
    ? getSentencesByGroupAndDifficulty(patternGroup, difficulty)
    : getSentencesByPatternGroup(patternGroup);

  if (pool.length === 0) {
    return { sentence: null, updatedContext: context };
  }

  // Filter out already-used sentences
  let available = pool.filter(s => !context.usedSentenceIds.has(s.id));

  // If all sentences used, reset if allowed
  if (available.length === 0) {
    if (cfg.allowReuse) {
      // Reset used sentences for this pattern group
      available = pool;
    } else {
      return { sentence: null, updatedContext: context };
    }
  }

  // Score each sentence for variety
  const scored = available.map(sentence => {
    let score = 0;

    // Prefer verbs not recently used
    if (cfg.preferUnusedVerbs && !context.recentVerbs.includes(sentence.verb)) {
      score += 3;
    }

    // Prefer topics not recently used
    if (cfg.preferUnusedTopics && !context.recentTopics.includes(sentence.topic)) {
      score += 2;
    }

    // Prefer tenses not recently used
    if (!context.recentTenses.includes(sentence.tense)) {
      score += 1;
    }

    // Add small random factor for variety
    score += Math.random() * 0.5;

    return { sentence, score };
  });

  // Sort by score (highest first) and pick the best
  scored.sort((a, b) => b.score - a.score);
  const selected = scored[0].sentence;

  // Update context
  const updatedContext: SelectionContext = {
    usedSentenceIds: new Set([...context.usedSentenceIds, selected.id]),
    recentVerbs: updateRecent(context.recentVerbs, selected.verb, cfg.maxRecentVerbs),
    recentTopics: updateRecent(context.recentTopics, selected.topic, cfg.maxRecentTopics),
    recentTenses: updateRecent(context.recentTenses, selected.tense, cfg.maxRecentTenses),
  };

  return { sentence: selected, updatedContext };
}

/**
 * Select multiple sentences with variety
 */
export function selectSentences(
  patternGroup: PatternGroupId,
  count: number,
  context: SelectionContext,
  difficulty?: 'round1' | 'round2',
  config: Partial<SelectionConfig> = {}
): { sentences: CSVSentence[]; updatedContext: SelectionContext } {
  const sentences: CSVSentence[] = [];
  let currentContext = context;

  for (let i = 0; i < count; i++) {
    const result = selectSentence(patternGroup, currentContext, difficulty, config);
    if (result.sentence) {
      sentences.push(result.sentence);
      currentContext = result.updatedContext;
    } else {
      break; // No more sentences available
    }
  }

  return { sentences, updatedContext: currentContext };
}

/**
 * Select sentences from multiple pattern groups (for mixed review)
 */
export function selectMixedSentences(
  patternGroups: PatternGroupId[],
  countPerGroup: number,
  context: SelectionContext,
  config: Partial<SelectionConfig> = {}
): { sentences: CSVSentence[]; updatedContext: SelectionContext } {
  const allSentences: CSVSentence[] = [];
  let currentContext = context;

  for (const group of patternGroups) {
    const result = selectSentences(group, countPerGroup, currentContext, undefined, config);
    allSentences.push(...result.sentences);
    currentContext = result.updatedContext;
  }

  // Shuffle the combined result
  const shuffled = shuffleArray(allSentences);

  return { sentences: shuffled, updatedContext: currentContext };
}

/**
 * Select sentences prioritizing ones where the student struggled
 * (for Round 2 targeted practice)
 */
export function selectTargetedSentences(
  patternGroup: PatternGroupId,
  count: number,
  context: SelectionContext,
  missedVerbsOrPatterns: string[] = [],
  config: Partial<SelectionConfig> = {}
): { sentences: CSVSentence[]; updatedContext: SelectionContext } {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Get all sentences for this group (both difficulties for Round 2)
  const pool = getSentencesByPatternGroup(patternGroup);

  if (pool.length === 0) {
    return { sentences: [], updatedContext: context };
  }

  // Filter out already-used sentences
  let available = pool.filter(s => !context.usedSentenceIds.has(s.id));

  if (available.length === 0 && cfg.allowReuse) {
    available = pool;
  }

  // Score sentences, prioritizing missed verbs/patterns
  const scored = available.map(sentence => {
    let score = 0;

    // Strongly prefer verbs the student missed
    if (missedVerbsOrPatterns.includes(sentence.verb)) {
      score += 10;
    }

    // Prefer Round 2 difficulty for targeted practice
    if (sentence.difficulty === 'round2') {
      score += 2;
    }

    // Prefer verbs not recently used (but less weight than missed)
    if (cfg.preferUnusedVerbs && !context.recentVerbs.includes(sentence.verb)) {
      score += 1;
    }

    // Add small random factor
    score += Math.random() * 0.5;

    return { sentence, score };
  });

  // Sort by score and select top N
  scored.sort((a, b) => b.score - a.score);

  const sentences: CSVSentence[] = [];
  let currentContext = context;

  for (let i = 0; i < count && i < scored.length; i++) {
    const selected = scored[i].sentence;
    sentences.push(selected);

    // Update context
    currentContext = {
      usedSentenceIds: new Set([...currentContext.usedSentenceIds, selected.id]),
      recentVerbs: updateRecent(currentContext.recentVerbs, selected.verb, cfg.maxRecentVerbs),
      recentTopics: updateRecent(currentContext.recentTopics, selected.topic, cfg.maxRecentTopics),
      recentTenses: updateRecent(currentContext.recentTenses, selected.tense, cfg.maxRecentTenses),
    };
  }

  return { sentences, updatedContext: currentContext };
}

/**
 * Update a "recent" list, adding new item and removing oldest if needed
 */
function updateRecent(list: string[], item: string, maxSize: number): string[] {
  const updated = [item, ...list.filter(i => i !== item)];
  return updated.slice(0, maxSize);
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Reset selection context (e.g., when starting a new game session)
 */
export function resetSelectionContext(_context: SelectionContext): SelectionContext {
  return createSelectionContext();
}

/**
 * Partially reset context (keep some recent items to maintain variety)
 */
export function softResetSelectionContext(context: SelectionContext): SelectionContext {
  return {
    usedSentenceIds: new Set(), // Clear used sentences
    recentVerbs: context.recentVerbs.slice(0, 1), // Keep 1 recent verb
    recentTopics: context.recentTopics.slice(0, 1),
    recentTenses: [],
  };
}
