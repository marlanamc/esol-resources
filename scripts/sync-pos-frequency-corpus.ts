/**
 * Build a generated frequency map for Parts of Speech gameplay from CSV inputs.
 *
 * Usage:
 *   npx tsx scripts/sync-pos-frequency-corpus.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { vocabImagesGenerated } from '../src/data/vocab-images-generated';

type PosFrequencyRow = {
  pos: string;
  rank: number;
  word: string;
};

const PROJECT_ROOT = process.cwd();
const FREQUENCY_CSV_PATH = join(PROJECT_ROOT, 'src', 'data', 'pos_frequency_list.csv');
const TRICKY_CSV_PATH = join(PROJECT_ROOT, 'src', 'data', 'pos_tricky_verbs.csv');
const OUTPUT_PATH = join(PROJECT_ROOT, 'src', 'data', 'parts-of-speech-frequency.generated.ts');
const IMAGE_HEALTH_COVERAGE_LIMIT = 12;

const POS_ORDER: string[] = [
  'adjective',
  'adverb',
  'article',
  'conjunction',
  'noun',
  'preposition',
  'pronoun',
  'verb',
];

type VocabImageMap = Record<string, string>;

function buildVocabImageLookup(): Set<string> {
  const keys = new Set<string>();
  for (const key of Object.keys(vocabImagesGenerated as VocabImageMap)) {
    keys.add(key.toLowerCase());
  }
  return keys;
}

const VOCAB_IMAGE_LOOKUP = buildVocabImageLookup();

function hasImageForWord(word: string): boolean {
  return VOCAB_IMAGE_LOOKUP.has(word.trim().toLowerCase());
}

function reportImageCoverage(rows: PosFrequencyRow[]): void {
  const missingByPOS = new Map<string, string[]>();
  let missingCount = 0;

  for (const pos of POS_ORDER) {
    const posRows = rows
      .filter(row => row.pos === pos)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, IMAGE_HEALTH_COVERAGE_LIMIT);

    const missing = posRows
      .map(row => row.word)
      .filter(word => !hasImageForWord(word))
      .map(word => word.toLowerCase());

    if (missing.length > 0) {
      missingByPOS.set(pos, missing);
      missingCount += missing.length;
    }
  }

  if (missingCount === 0) {
    console.log('[sync-pos-frequency-corpus] image coverage check: no missing top-frequency words.');
    return;
  }

  console.warn(
    `[sync-pos-frequency-corpus] image coverage check: missing ${missingCount} entries in top ${IMAGE_HEALTH_COVERAGE_LIMIT} words per POS.`,
  );
  for (const [pos, missing] of missingByPOS.entries()) {
    console.warn(`[image coverage] ${pos}: ${missing.join(', ')}`);
  }
}

function parseCSV(path: string): PosFrequencyRow[] {
  const raw = readFileSync(path, 'utf8').trimEnd();
  const lines = raw.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  lines.shift(); // header

  const rows: PosFrequencyRow[] = [];
  for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 3) continue;

    const pos = cols[0]?.trim();
    const rank = Number(cols[1]);
    const word = cols[2]?.trim();

    if (!pos || !word || !Number.isFinite(rank) || rank <= 0) continue;
    rows.push({ pos, rank, word });
  }

  return rows;
}

function escapeValue(value: string): string {
  return JSON.stringify(value);
}

function toGeneratedTS(rows: PosFrequencyRow[], trickyVerbs: string[]): string {
  const grouped: Record<string, string[]> = {};
  const seenByPos = new Map<string, Set<string>>();
  for (const row of rows) {
    const normalizedWord = row.word.toLowerCase();
    const pos = row.pos;
    const seen = seenByPos.get(pos) ?? new Set<string>();

    if (seen.has(normalizedWord)) continue;
    seen.add(normalizedWord);
    seenByPos.set(pos, seen);

    const list = grouped[pos] ?? [];
    list.push(normalizedWord);
    grouped[pos] = list;
  }

  const lines: string[] = [
    '/**',
    ' * Auto-generated from:',
    ` * ${basename(FREQUENCY_CSV_PATH)}`,
    ` * ${basename(TRICKY_CSV_PATH)}`,
    ' * Rebuild with: npx tsx scripts/sync-pos-frequency-corpus.ts',
    ' */',
    '',
    "import type { PartOfSpeech } from '@/types/parts-of-speech';",
    '',
    'export const POS_TRICKY_VERBS: ReadonlyArray<string> = [',
    ...trickyVerbs.map((word) => `  ${escapeValue(word)},`),
    '];',
    '',
    'export const POS_FREQUENCY_WORDS_BY_PART_OF_SPEECH: Record<PartOfSpeech, string[]> = {',
  ];

  for (const pos of POS_ORDER) {
    const words = (grouped[pos] ?? []).map(word => word.toLowerCase());
    lines.push(`  ${escapeValue(pos)}: [`);
    for (const word of words) {
      lines.push(`    ${escapeValue(word)},`);
    }
    lines.push('  ],');
  }

  lines.push('};', '');
  return `${lines.join('\n')}\n`;
}

function main() {
  const rows = parseCSV(FREQUENCY_CSV_PATH);
  const trickyRows = parseCSV(TRICKY_CSV_PATH);
  const trickyVerbs = [...new Set(trickyRows.map(row => row.word.toLowerCase()))].sort((a, b) => a.localeCompare(b));

  const output = toGeneratedTS(rows, trickyVerbs);
  writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`[sync-pos-frequency-corpus] wrote ${OUTPUT_PATH}`);
  reportImageCoverage(rows);
}

main();
