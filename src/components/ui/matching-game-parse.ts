/**
 * Parsing utilities and types for MatchingGame.
 * Extracted to reduce MatchingGame.tsx size.
 */

export interface CountableWord {
  id: number;
  word: string;
  category: "countable" | "uncountable";
  explanation: string;
}

export interface GameState {
  currentWordIndex: number;
  correctCount: number;
  incorrectAttempts: number;
  completedWords: Set<number>;
  showExplanation: boolean;
  explanationText: string;
  isAutoAdvancing: boolean;
  bounceWord: boolean;
}

export interface Round {
  roundNumber: number;
  words: CountableWord[];
}

export interface VocabPair {
  id: number;
  term: string;
  definition: string;
}

export interface TimeIndicatorWord {
  id: number;
  word: string;
  category: "specified" | "unspecified";
  explanation: string;
}

export interface TimeIndicatorRound {
  roundNumber: number;
  difficulty: "easy" | "medium" | "hard";
  words: TimeIndicatorWord[];
}

export const VERB_TENSE_HINTS: Record<
  string,
  { emoji: string; label: string; bgClass: string; textClass: string }
> = {
  "present-simple": { emoji: "👤", label: "Present simple", bgClass: "bg-sky-100", textClass: "text-sky-800" },
  "present-continuous": { emoji: "🔄", label: "Present continuous", bgClass: "bg-teal-100", textClass: "text-teal-800" },
  "present-perfect": { emoji: "✨", label: "Present perfect", bgClass: "bg-violet-100", textClass: "text-violet-800" },
  "present-perfect-continuous": { emoji: "💫", label: "Present perfect continuous", bgClass: "bg-purple-100", textClass: "text-purple-800" },
  "past-simple": { emoji: "⏪", label: "Past simple", bgClass: "bg-amber-100", textClass: "text-amber-800" },
  "past-continuous": { emoji: "📖", label: "Past continuous", bgClass: "bg-orange-100", textClass: "text-orange-800" },
  "past-perfect": { emoji: "⏮️", label: "Past perfect", bgClass: "bg-rose-100", textClass: "text-rose-800" },
  "past-perfect-continuous": { emoji: "📜", label: "Past perfect continuous", bgClass: "bg-red-100", textClass: "text-red-800" },
  "future-simple": { emoji: "🚀", label: "Future simple", bgClass: "bg-indigo-100", textClass: "text-indigo-800" },
  "future-continuous": { emoji: "🌊", label: "Future continuous", bgClass: "bg-cyan-100", textClass: "text-cyan-800" },
  "future-perfect": { emoji: "🎯", label: "Future perfect", bgClass: "bg-emerald-100", textClass: "text-emerald-800" },
};

export interface VerbBlank {
  correctWord: string;
  wrongWord: string;
  explanation: string;
  tense?: string;
}

export interface VerbSoundsRightItem {
  id: number;
  sentence: string;
  blanks: VerbBlank[];
  correctWord?: string;
  wrongWord?: string;
  explanation?: string;
  tense?: string;
}

export interface VerbSoundsRightRound {
  roundNumber: number;
  items: VerbSoundsRightItem[];
}

export function normalizeVerbOption(word: string): string {
  return word.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isSupportedVerbTense(value: string | undefined): boolean {
  return !!(value && VERB_TENSE_HINTS[value]);
}

export function buildVerbOptions(blank: VerbBlank, shouldSwap: boolean): string[] {
  const ordered = shouldSwap
    ? [blank.wrongWord, blank.correctWord]
    : [blank.correctWord, blank.wrongWord];
  const options: string[] = [];
  const seen = new Set<string>();

  for (const rawOption of ordered) {
    const option = rawOption.trim();
    const normalized = normalizeVerbOption(option);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    options.push(option);
  }

  if (options.length > 0) return options;
  const fallback = blank.correctWord.trim();
  return fallback ? [fallback] : [];
}

export type MatchingGameMode = "vocab" | "countable" | "time-indicators" | "verb-sounds-right";

export function detectMatchingGameMode(content: string): MatchingGameMode {
  const hasRoundMarkers = /\[ROUND\s*\d+/.test(content);
  const lines = content.split("\n");
  let hasCountableUncountableLine = false;
  let hasTimeIndicatorLine = false;
  let hasVerbSoundsRightLine = false;

  for (const line of lines) {
    if (!line.includes("::")) continue;
    const parts = line.split("::").map((s) => s.trim());
    const first = parts[0] ?? "";
    const afterColon = parts[1] ?? "";
    const lower = afterColon.toLowerCase();
    if (lower.startsWith("countable") || lower.startsWith("uncountable")) {
      hasCountableUncountableLine = true;
    }
    if (lower.startsWith("specified") || lower.startsWith("unspecified")) {
      hasTimeIndicatorLine = true;
    }
    if (first.includes("_____") && parts.length >= 3 && !lower.startsWith("countable") && !lower.startsWith("uncountable") && !lower.startsWith("specified") && !lower.startsWith("unspecified")) {
      hasVerbSoundsRightLine = true;
    }
  }

  if (hasRoundMarkers && hasVerbSoundsRightLine) return "verb-sounds-right";
  if (hasRoundMarkers && hasTimeIndicatorLine) return "time-indicators";
  if (hasRoundMarkers && hasCountableUncountableLine) return "countable";
  return "vocab";
}

export function parseVocabPairs(content: string): VocabPair[] {
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "pairs" in parsed && Array.isArray(parsed.pairs)) {
      return parsed.pairs
        .filter(
          (pair: unknown): pair is { term: unknown; definition: unknown } =>
            !!pair &&
            typeof pair === "object" &&
            "term" in pair &&
            "definition" in pair
        )
        .map((pair: { term: unknown; definition: unknown }, index: number) => ({
          id: index + 1,
          term: String(pair.term).trim(),
          definition: String(pair.definition).trim(),
        }));
    }
  } catch {
    // Not JSON, fall through to plain text parsing
  }

  const pairs: VocabPair[] = [];
  let id = 1;
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    let term = "";
    let definition = "";

    if (line.includes("::")) {
      const idx = line.indexOf("::");
      term = line.slice(0, idx).trim();
      definition = line.slice(idx + 2).trim();
    } else if (line.includes("—")) {
      const cleanLine = line.replace(/^\d+\)\s*/, "");
      const parts = cleanLine.split("—");
      if (parts.length >= 2) {
        term = parts[0].trim();
        definition = parts.slice(1).join("—").trim();
      }
    } else if (line.match(/^\d+\)\s*.+\s+-\s+.+$/)) {
      const cleanLine = line.replace(/^\d+\)\s*/, "");
      const firstDash = cleanLine.indexOf("-");
      if (firstDash > 0) {
        term = cleanLine.substring(0, firstDash).trim();
        definition = cleanLine.substring(firstDash + 1).trim();
      }
    }

    if (!term || !definition) continue;

    const lower = definition.toLowerCase();
    if (lower.startsWith("countable") || lower.startsWith("uncountable")) continue;

    term = term.replace(/\s*\([^)]+\)$/, "").trim();

    pairs.push({ id: id++, term, definition });
  }
  return pairs;
}

export function parseRounds(content: string): Round[] {
  const rounds: Round[] = [];
  const roundBlocks = content.split(/\[ROUND \d+\]/).filter((b) => b.trim());

  let roundNumber = 1;
  let globalId = 1;

  for (const block of roundBlocks) {
    const words: CountableWord[] = [];
    const lines = block.trim().split("\n").filter((l) => l.trim());

    for (const line of lines) {
      if (line.includes("::")) {
        const [word, definition] = line.split("::").map((s) => s.trim());
        if (!word || !definition) continue;

        const isCountable = definition.toLowerCase().startsWith("countable");
        const category = isCountable ? "countable" : "uncountable";

        const explanationMatch = definition.match(
          /(?:Countable|Uncountable)\s*-\s*(.+)/i
        );
        const explanation = explanationMatch ? explanationMatch[1] : definition;

        words.push({
          id: globalId++,
          word,
          category,
          explanation,
        });
      }
    }

    if (words.length > 0) {
      rounds.push({ roundNumber, words });
      roundNumber++;
    }
  }

  return rounds;
}

export function parseVerbSoundsRightRounds(content: string): VerbSoundsRightRound[] {
  const rounds: VerbSoundsRightRound[] = [];
  const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*[^\]]+)?\]/).filter((b) => b.trim());

  let roundNumber = 1;
  let globalId = 1;

  for (const block of roundBlocks) {
    const items: VerbSoundsRightItem[] = [];
    const lines = block.trim().split("\n").filter((l) => l.trim());

    for (const line of lines) {
      if (!line.includes("_____") || !line.includes("::")) continue;
      const parts = line.split("::").map((s) => s.trim());
      if (parts.length < 3) continue;

      const sentence = parts[0];
      const blankCount = (sentence.match(/_____/g) || []).length;

      if (blankCount === 1) {
        const correctWord = parts[1];
        const wrongWord = parts[2];
        const tense = parts[3] ?? "";
        const explanation = parts[4] ?? "";
        if (!correctWord || !wrongWord) continue;
        if (normalizeVerbOption(correctWord) === normalizeVerbOption(wrongWord)) continue;

        items.push({
          id: globalId++,
          sentence,
          blanks: [
            {
              correctWord,
              wrongWord,
              tense: tense && VERB_TENSE_HINTS[tense] ? tense : undefined,
              explanation,
            },
          ],
        });
      } else if (blankCount === 2 && parts.length >= 7) {
        let correct1 = "";
        let wrong1 = "";
        let tense1 = "";
        let explain1 = "";
        let correct2 = "";
        let wrong2 = "";
        let tense2 = "";
        let explain2 = "";

        if (parts.length >= 9) {
          correct1 = parts[1] ?? "";
          wrong1 = parts[2] ?? "";
          tense1 = parts[3] ?? "";
          explain1 = parts[4] ?? "";
          correct2 = parts[5] ?? "";
          wrong2 = parts[6] ?? "";
          tense2 = parts[7] ?? "";
          explain2 = parts[8] ?? "";
        } else if (parts.length >= 8 && !isSupportedVerbTense(parts[3]) && isSupportedVerbTense(parts[5])) {
          correct1 = parts[1] ?? "";
          wrong1 = parts[2] ?? "";
          correct2 = parts[3] ?? "";
          wrong2 = parts[4] ?? "";
          tense1 = parts[5] ?? "";
          tense2 = parts[6] ?? "";
          explain1 = parts[7] ?? "";
          explain2 = parts[7] ?? "";
        } else {
          correct1 = parts[1] ?? "";
          wrong1 = parts[2] ?? "";
          tense1 = parts[3] ?? "";
          explain1 = parts[4] ?? "";
          correct2 = parts[5] ?? "";
          wrong2 = parts[6] ?? "";
          tense2 = parts[7] ?? "";
          explain2 = parts[8] ?? "";
        }

        if (!correct1 || !wrong1 || !correct2 || !wrong2) continue;
        if (normalizeVerbOption(correct1) === normalizeVerbOption(wrong1)) continue;
        if (normalizeVerbOption(correct2) === normalizeVerbOption(wrong2)) continue;

        items.push({
          id: globalId++,
          sentence,
          blanks: [
            {
              correctWord: correct1,
              wrongWord: wrong1,
              tense: tense1 && VERB_TENSE_HINTS[tense1] ? tense1 : undefined,
              explanation: explain1,
            },
            {
              correctWord: correct2,
              wrongWord: wrong2,
              tense: tense2 && VERB_TENSE_HINTS[tense2] ? tense2 : undefined,
              explanation: explain2,
            },
          ],
        });
      }
    }

    if (items.length > 0) {
      rounds.push({ roundNumber, items });
      roundNumber++;
    }
  }

  return rounds;
}

export function parseTimeIndicatorRounds(content: string): TimeIndicatorRound[] {
  const rounds: TimeIndicatorRound[] = [];
  const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*\w+)?\]/).filter((b) => b.trim());

  let roundNumber = 1;
  let globalId = 1;

  for (const block of roundBlocks) {
    const words: TimeIndicatorWord[] = [];
    const lines = block.trim().split("\n").filter((l) => l.trim());

    const difficulty: "easy" | "medium" | "hard" =
      roundNumber <= 2 ? "easy" : roundNumber <= 4 ? "medium" : "hard";

    for (const line of lines) {
      if (line.includes("::")) {
        const [word, definition] = line.split("::").map((s) => s.trim());
        if (!word || !definition) continue;

        const isSpecified = definition.toLowerCase().startsWith("specified");
        const category: "specified" | "unspecified" = isSpecified ? "specified" : "unspecified";

        const explanationMatch = definition.match(
          /(?:Specified|Unspecified)\s*-\s*(.+)/i
        );
        const explanation = explanationMatch ? explanationMatch[1] : definition;

        words.push({
          id: globalId++,
          word,
          category,
          explanation,
        });
      }
    }

    if (words.length > 0) {
      rounds.push({
        roundNumber,
        difficulty,
        words,
      });
      roundNumber++;
    }
  }

  return rounds;
}

export function deriveShuffleSeed(roundNumber: number, activityId?: string): number {
  let seed = roundNumber;
  if (activityId) {
    for (let i = 0; i < activityId.length; i++) {
      seed = (seed * 31 + activityId.charCodeAt(i)) >>> 0;
    }
  }
  return seed;
}

export function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let value = seed >>> 0;
  const random = () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled;
}
