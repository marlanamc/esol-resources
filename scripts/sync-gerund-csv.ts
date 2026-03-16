/**
 * Sync gerund_inf_sentences.csv → gerund-infinitive-data.generated.ts
 * Run before build so Turbopack doesn't need a CSV loader.
 * Usage: npx tsx scripts/sync-gerund-csv.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.join(__dirname, '../src/gerund_inf_sentences.csv');
const OUT_PATH = path.join(__dirname, '../src/lib/csv/gerund-infinitive-data.generated.ts');

const AMBIGUOUS_VERBS = new Set([
  'like', 'love', 'hate', 'start', 'begin', 'continue', 'prefer'
]);

const VALID_PATTERN_GROUPS = new Set([
  'gerund_after_verb', 'infinitive_after_verb', 'gerund_subject',
  'infinitive_purpose', 'go_gerund', 'preposition_gerund',
  'adjective_infinitive', 'noun_infinitive'
]);

type PatternGroupId = typeof VALID_PATTERN_GROUPS extends Set<infer T> ? T : never;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

interface ParsedRow {
  id: string;
  sentence: string;
  patternGroup: PatternGroupId;
  rule: string;
  verb: string;
  wordToBlank: string;
  otherOption: string;
  category: string;
  difficulty: 'round1' | 'round2';
  tense: string;
  topic: string;
  baseVerbForm?: string;
  thirdPersonSingular?: string;
}

function escapeForTS(s: string): string {
  return JSON.stringify(s);
}

function main() {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = raw.split('\n').filter(line => line.trim());
  const header = parseCSVLine(lines[0]);
  const is12Col = header.includes('BaseVerbForm') && header.includes('ThirdPersonSingular');

  const rows: ParsedRow[] = [];
  let filtered = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    const expectedFields = is12Col ? 12 : 10;
    if (fields.length !== expectedFields) continue;

    const sentence = fields[0];
    const patternGroup = fields[1];
    const verb = fields[3];
    const wordToBlank = is12Col ? fields[6] : fields[4];
    const otherOption = is12Col ? fields[7] : fields[5];
    const category = is12Col ? fields[8] : fields[6];
    const difficulty = is12Col ? fields[9] : fields[7];
    const tense = is12Col ? fields[10] : fields[8];
    const topic = is12Col ? fields[11] : fields[9];
    const baseVerbForm = is12Col ? fields[4] : undefined;
    const thirdPersonSingular = is12Col ? fields[5] : undefined;

    if (!sentence || !wordToBlank) continue;
    if (AMBIGUOUS_VERBS.has(verb.toLowerCase())) {
      filtered++;
      continue;
    }
    if (!VALID_PATTERN_GROUPS.has(patternGroup as PatternGroupId)) continue;

    const normalizedDifficulty = difficulty.toLowerCase() as 'round1' | 'round2';
    const diff: 'round1' | 'round2' =
      normalizedDifficulty === 'round1' || normalizedDifficulty === 'round2'
        ? normalizedDifficulty
        : 'round1';

    rows.push({
      id: `csv-${i}`,
      sentence,
      patternGroup: patternGroup as PatternGroupId,
      rule: fields[2],
      verb: verb.toLowerCase(),
      wordToBlank,
      otherOption,
      category,
      difficulty: diff,
      tense,
      topic,
      ...(baseVerbForm && { baseVerbForm: baseVerbForm.toLowerCase() }),
      ...(thirdPersonSingular && { thirdPersonSingular }),
    });
  }

  const linesOut: string[] = [
    '/**',
    ' * Auto-generated from src/gerund_inf_sentences.csv',
    ' * Do not edit. Run: npx tsx scripts/sync-gerund-csv.ts',
    ' */',
    '',
    'export const GERUND_INFINITIVE_SENTENCES = [',
  ];

  for (const r of rows) {
    const obj: string[] = [
      `  { id: ${escapeForTS(r.id)}, sentence: ${escapeForTS(r.sentence)}, patternGroup: ${escapeForTS(r.patternGroup)}, rule: ${escapeForTS(r.rule)}, verb: ${escapeForTS(r.verb)}, wordToBlank: ${escapeForTS(r.wordToBlank)}, otherOption: ${escapeForTS(r.otherOption)}, category: ${escapeForTS(r.category)}, difficulty: ${escapeForTS(r.difficulty)}, tense: ${escapeForTS(r.tense)}, topic: ${escapeForTS(r.topic)}`,
    ];
    if (r.baseVerbForm) obj[0] += `, baseVerbForm: ${escapeForTS(r.baseVerbForm)}`;
    if (r.thirdPersonSingular) obj[0] += `, thirdPersonSingular: ${escapeForTS(r.thirdPersonSingular)}`;
    obj[0] += ' },';
    linesOut.push(obj[0]);
  }

  linesOut.push('];');
  linesOut.push('');

  fs.writeFileSync(OUT_PATH, linesOut.join('\n'), 'utf-8');
  console.log(`[sync-gerund-csv] Wrote ${rows.length} sentences to ${path.relative(process.cwd(), OUT_PATH)} (filtered ${filtered} ambiguous)`);
}

main();
