/** Parse and validate POS phase/round override rows used by the importer. */

export type ParseSeverity = "error" | "warning";

export type OverrideRowType = "phase" | "round";

export interface OverrideRowIssue {
  line: number;
  code: string;
  field: string;
  message: string;
  severity: ParseSeverity;
}

export interface ParsedOverrideRow {
  rowType: OverrideRowType;
  phase: string;
  round?: number;
  roundSize?: number;
  exerciseTypes?: string[];
}

export interface PosPhaseOverrideConfig {
  roundSize?: number;
  exerciseTypes?: string[];
  rounds?: Record<string, { roundSize?: number; exerciseTypes?: string[] }>;
}

export type PosPhaseOverrideMap = Record<string, PosPhaseOverrideConfig>;

export interface ParsedOverrideResult {
  phaseOverrides: PosPhaseOverrideMap;
  rows: ParsedOverrideRow[];
  errors: OverrideRowIssue[];
  warnings: OverrideRowIssue[];
}

const VALID_PHASES = ["foundation", "sentence-roles", "modifiers", "connectors", "application-bridge"] as const;
const VALID_ROUND_KEYS = ["round1", "round2", "round3", "round4", "round5"] as const;
const VALID_EXERCISE_TYPES = [
  "pattern-choice",
  "pattern-sorting",
  "sentence-completion",
  "error-correction",
  "odd-one-out",
  "contrast-pair",
  "word-family",
  "mad-libs",
  "pos-tagging",
  "sentence-builder",
  "word-transform",
  "function-match",
  "minimal-pair",
  "photo-sort",
] as const;

const VALID_PHASE_SET = new Set<string>(VALID_PHASES);
const VALID_EXERCISE_SET = new Set<string>(VALID_EXERCISE_TYPES);

function pushIssue(
  issues: OverrideRowIssue[],
  line: number,
  severity: ParseSeverity,
  field: string,
  code: string,
  message: string,
): void {
  issues.push({ line, severity, field, code, message });
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function parseExerciseTypes(raw?: string): string[] {
  if (!raw) return [];
  const tokens = raw
    .split(/[;,|]/g)
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
  const dedup = new Set<string>();
  for (const token of tokens) {
    dedup.add(token);
  }
  return [...dedup];
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseIssueRowsFromCSV(
  lines: string[],
  errors: OverrideRowIssue[],
  warnings: OverrideRowIssue[],
): ParsedOverrideResult {
  if (!lines.length) {
    return { phaseOverrides: {}, rows: [], errors, warnings };
  }

  const headers = parseCSVLine(lines[0]).map(normalizeHeader);
  const headerIndex = new Map<string, number>();
  headers.forEach((header, index) => headerIndex.set(header, index));

  function getHeaderValue(values: string[], key: string): string {
    const idx = headerIndex.get(key);
    if (idx === undefined) return "";
    return values[idx]?.trim() ?? "";
  }

  const requireHeader = (name: string) => {
    if (!headerIndex.has(name)) {
      pushIssue(errors, 1, "error", "header", "missing-header", `Missing required header: ${name}`);
      return false;
    }
    return true;
  };

  requireHeader("row_type");
  requireHeader("phase");

  const result: ParsedOverrideRow[] = [];
  const phaseOverrides: PosPhaseOverrideMap = {};

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(lines[i]);
    const rowType = getHeaderValue(fields, "row_type").toLowerCase();
    const phase = getHeaderValue(fields, "phase").toLowerCase();
    const roundRaw = getHeaderValue(fields, "round");
    const roundSizeRaw = getHeaderValue(fields, "round_size");
    const exerciseTypesRaw = getHeaderValue(fields, "exercise_types");

    if (!rowType) {
      pushIssue(errors, i + 1, "error", "row_type", "missing-row-type", "Each row must include row_type");
      continue;
    }

    if (rowType !== "phase" && rowType !== "round") {
      pushIssue(errors, i + 1, "error", "row_type", "invalid-row-type", `Unknown row_type "${rowType}"`);
      continue;
    }

    const row: ParsedOverrideRow = { rowType, phase };
    const phaseIssues = errors;

    if (!phase) {
      pushIssue(phaseIssues, i + 1, "error", "phase", "missing-phase", "Each row must include a phase");
      continue;
    }

    if (!VALID_PHASE_SET.has(phase)) {
      pushIssue(phaseIssues, i + 1, "error", "phase", "invalid-phase", `Unknown phase "${phase}"`);
      continue;
    }

    const roundSize = parseRoundSize(roundSizeRaw);
    if (!roundSizeRaw.trim()) {
      // no-op
    } else if (roundSize === null) {
      pushIssue(
        phaseIssues,
        i + 1,
        "error",
        "round_size",
        "invalid-round-size",
        `Invalid round_size "${roundSizeRaw}" for ${rowType} row`,
      );
    } else {
      row.roundSize = roundSize;
    }

    const exerciseTypes = parseExerciseTypes(exerciseTypesRaw);
    if (exerciseTypesRaw.trim() && exerciseTypes.length === 0) {
      pushIssue(
        phaseIssues,
        i + 1,
        "error",
        "exercise_types",
        "invalid-exercise-types",
        `No valid exercise types found in "${exerciseTypesRaw}"`,
      );
    }

    const invalidExerciseType = exerciseTypes.find(item => !VALID_EXERCISE_SET.has(item));
    if (invalidExerciseType) {
      pushIssue(
        phaseIssues,
        i + 1,
        "error",
        "exercise_types",
        "invalid-exercise-types",
        `Unknown exercise type "${invalidExerciseType}"`,
      );
    }

    const hasAnyOverride = typeof roundSize === "number" || exerciseTypes.length > 0;
    if (!hasAnyOverride) {
      pushIssue(
        phaseIssues,
        i + 1,
        "error",
        "round_size|exercise_types",
        "missing-overrides",
        `${rowType} row for phase "${phase}" must include round_size and/or exercise_types`,
      );
      continue;
    }

    if (rowType === "phase") {
      if (roundRaw) {
        pushIssue(warnings, i + 1, "warning", "round", "unexpected-round", "Phase rows ignore round and apply to all rounds");
      }

      row.exerciseTypes = exerciseTypes;
      const existing = phaseOverrides[phase];
      if (existing && (existing.exerciseTypes || existing.roundSize !== undefined)) {
        pushIssue(
          warnings,
          i + 1,
          "warning",
          "phase",
          "duplicate-phase-row",
          `Duplicate phase row for "${phase}" will overwrite earlier values`,
        );
      }
      phaseOverrides[phase] = {
        ...existing,
        ...((row.roundSize !== undefined) ? { roundSize: row.roundSize } : {}),
        ...((row.exerciseTypes && row.exerciseTypes.length) ? { exerciseTypes: row.exerciseTypes } : {}),
      };
      result.push(row);
      continue;
    }

    // round row
    const roundNumber = parseRound(roundRaw);
    if (!roundRaw.trim()) {
      pushIssue(phaseIssues, i + 1, "error", "round", "missing-round", `Round rows for phase "${phase}" must include round`);
      continue;
    }
    if (roundNumber === null) {
      pushIssue(phaseIssues, i + 1, "error", "round", "invalid-round", `Invalid round "${roundRaw}"`);
      continue;
    }
    const roundKey = `round${roundNumber}`;
    if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 5 || !VALID_ROUND_KEYS.includes(roundKey as typeof VALID_ROUND_KEYS[number])) {
      pushIssue(phaseIssues, i + 1, "error", "round", "invalid-round", `Unsupported round "${roundRaw}"`);
      continue;
    }
    row.round = roundNumber;
    const existing = phaseOverrides[phase] ?? {};
    const existingRoundOverrides = existing.rounds ?? {};
    const priorRoundOverride = existingRoundOverrides[roundKey];
    if (priorRoundOverride) {
      pushIssue(
        warnings,
        i + 1,
        "warning",
        "round",
        "duplicate-round-row",
        `Duplicate override for ${phase}:${roundKey} will overwrite earlier values`,
      );
    }

    existing.rounds = {
      ...existing.rounds,
      [roundKey]: {
        ...(priorRoundOverride || {}),
        ...((row.roundSize !== undefined) ? { roundSize: row.roundSize } : {}),
        ...((row.exerciseTypes && row.exerciseTypes.length) ? { exerciseTypes: row.exerciseTypes } : {}),
      },
    };
    phaseOverrides[phase] = existing;
    result.push(row);
  }

  return { phaseOverrides, rows: result, errors, warnings };
}

function parseRound(raw: string): number | null {
  if (!raw.trim()) return null;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

function parseRoundSize(raw: string): number | null {
  if (!raw.trim()) return null;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

export function parsePartsOfSpeechOverrideCSV(raw: string): ParsedOverrideResult {
  const errors: OverrideRowIssue[] = [];
  const warnings: OverrideRowIssue[] = [];
  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
  return parseIssueRowsFromCSV(lines, errors, warnings);
}
