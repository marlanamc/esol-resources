/**
 * CSV Loader for Gerund & Infinitive Sentences
 * Source of truth: src/gerund_inf_sentences.csv
 * Run `npx tsx scripts/sync-gerund-csv.ts` after editing the CSV, then build.
 */

import { GERUND_INFINITIVE_SENTENCES } from './gerund-infinitive-data.generated';

// CSV column structure (12-column format with BaseVerbForm & ThirdPersonSingular)
export interface CSVSentence {
  id: string;                    // Generated unique ID
  sentence: string;              // Full sentence with blank
  patternGroup: PatternGroupId;  // gerund_after_verb, infinitive_after_verb, etc.
  rule: string;                  // Human-readable rule label
  verb: string;                  // The verb being practiced (trigger verb)
  wordToBlank: string;           // Correct answer for the blank
  otherOption: string;           // Primary distractor from CSV
  category: string;              // Category label from CSV
  difficulty: 'round1' | 'round2';
  tense: string;
  topic: string;
  /** Base form of the verb in the blank (from CSV - avoids derivation/misspellings) */
  baseVerbForm?: string;
  /** 3rd person singular of the verb (from CSV - e.g. sightsees, birdwatches) */
  thirdPersonSingular?: string;
}

// Valid pattern groups from CSV
export type PatternGroupId =
  | 'gerund_after_verb'
  | 'infinitive_after_verb'
  | 'gerund_subject'
  | 'infinitive_purpose'
  | 'go_gerund'
  | 'preposition_gerund'
  | 'adjective_infinitive'
  | 'noun_infinitive';

// Valid pattern groups (used for validation and parsing)
const VALID_PATTERN_GROUPS = new Set<PatternGroupId>([
  'gerund_after_verb',
  'infinitive_after_verb',
  'gerund_subject',
  'infinitive_purpose',
  'go_gerund',
  'preposition_gerund',
  'adjective_infinitive',
  'noun_infinitive'
]);

/** Student-friendly labels for pattern groups (used in "Patterns to review") */
export const PATTERN_GROUP_LABELS: Record<PatternGroupId, string> = {
  gerund_after_verb: 'Gerund after verb',
  infinitive_after_verb: 'Infinitive after verb',
  gerund_subject: 'Gerund as subject',
  infinitive_purpose: 'Infinitive of purpose',
  go_gerund: 'Go + gerund',
  preposition_gerund: 'Preposition + gerund',
  adjective_infinitive: 'Adjective + infinitive',
  noun_infinitive: 'Noun + infinitive',
};

/**
 * Parse a pattern ID (e.g. "csv-infinitive_after_verb-manage") into { patternGroup, verb }.
 * Returns null for non-CSV pattern IDs.
 */
export function parseCSVPatternId(id: string): { patternGroup: PatternGroupId; verb: string } | null {
  const match = id.match(/^csv-(.+?)-(.+)$/);
  if (!match) return null;
  const [, patternGroup, verb] = match;
  if (!VALID_PATTERN_GROUPS.has(patternGroup as PatternGroupId)) return null;
  return { patternGroup: patternGroup as PatternGroupId, verb };
}

/**
 * Convert missed pattern IDs into student-friendly display items.
 * Groups by pattern (e.g. "Infinitive after verb: manage, attempt, decide").
 * Non-CSV IDs (e.g. "gerund-subject") are returned as single-item entries with a humanized label.
 */
export function formatMissedPatternsForDisplay(ids: string[]): { label: string; verbs: string[] }[] {
  const byPattern = new Map<PatternGroupId, string[]>();
  const nonCsvLabels = new Set<string>();

  for (const id of ids) {
    const parsed = parseCSVPatternId(id);
    if (parsed) {
      const list = byPattern.get(parsed.patternGroup) ?? [];
      if (!list.includes(parsed.verb)) list.push(parsed.verb);
      byPattern.set(parsed.patternGroup, list);
    } else {
      const humanized = id.replace(/^special-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      nonCsvLabels.add(humanized);
    }
  }

  const result = Array.from(byPattern.entries()).map(([group, verbs]) => ({
    label: PATTERN_GROUP_LABELS[group],
    verbs,
  }));
  for (const label of nonCsvLabels) {
    if (!result.some(r => r.label === label)) {
      result.push({ label, verbs: [] });
    }
  }
  return result;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  filteredCount: number;
  totalCount: number;
}

// Sentences loaded from generated file (synced from CSV at build time)
const SENTENCES: CSVSentence[] = GERUND_INFINITIVE_SENTENCES as CSVSentence[];

/**
 * Load sentences (from pre-synced generated data)
 */
export function loadSentences(): CSVSentence[] {
  return SENTENCES;
}

/**
 * Get validation result (call after loadSentences)
 * @deprecated Validation happens at sync time; returns null at runtime
 */
export function getValidationResult(): ValidationResult | null {
  return null;
}

/**
 * Get sentences by pattern group
 */
export function getSentencesByPatternGroup(group: PatternGroupId): CSVSentence[] {
  return loadSentences().filter(s => s.patternGroup === group);
}

/**
 * Get sentences by difficulty
 */
export function getSentencesByDifficulty(difficulty: 'round1' | 'round2'): CSVSentence[] {
  return loadSentences().filter(s => s.difficulty === difficulty);
}

/**
 * Get sentences by pattern group and difficulty
 */
export function getSentencesByGroupAndDifficulty(
  group: PatternGroupId,
  difficulty: 'round1' | 'round2'
): CSVSentence[] {
  return loadSentences().filter(
    s => s.patternGroup === group && s.difficulty === difficulty
  );
}

/**
 * Get unique verbs for a pattern group
 */
export function getVerbsForPatternGroup(group: PatternGroupId): string[] {
  const sentences = getSentencesByPatternGroup(group);
  return [...new Set(sentences.map(s => s.verb))];
}

/**
 * Get unique topics for a pattern group
 */
export function getTopicsForPatternGroup(group: PatternGroupId): string[] {
  const sentences = getSentencesByPatternGroup(group);
  return [...new Set(sentences.map(s => s.topic))];
}

/**
 * Get sentence count by pattern group
 */
export function getSentenceCountByGroup(): Record<PatternGroupId, number> {
  const sentences = loadSentences();
  const counts = {} as Record<PatternGroupId, number>;

  for (const group of VALID_PATTERN_GROUPS) {
    counts[group] = sentences.filter(s => s.patternGroup === group).length;
  }

  return counts;
}

/**
 * Check if a sentence is subject-position (blank at start)
 */
export function isSubjectPositionSentence(sentence: CSVSentence): boolean {
  return sentence.patternGroup === 'gerund_subject' ||
    sentence.sentence.trimStart().startsWith(sentence.wordToBlank);
}
