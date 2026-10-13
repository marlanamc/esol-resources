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

/**
 * A single sortable card in the "Action or Description?" game. The learner decides
 * whether the word needs a main verb ("action") or needs BE ("description"), then
 * sees the finished sentence.
 */
export interface ActionDescriptionCard {
  id: number;
  word: string;
  category: "action" | "description";
  explanation: string;
  /** Finished sentence shown after sorting. `*...*` marks the verb or BE form. */
  sentence: string;
}

export interface ActionDescriptionRound {
  roundNumber: number;
  /** Optional banner for the round, from a leading `NOTE:` line. */
  note?: string;
  words: ActionDescriptionCard[];
}

/**
 * A helper-verb family the "Be or Do?" game can ask about. Adding a family here
 * (e.g. HAVE: have / has for "Have you ever…?") is all the UI needs: the boxes
 * and form buttons are built from the families the content actually uses.
 */
export interface BeOrDoGroup {
  id: string;
  /** Box title in the BE-or-DO rounds. */
  label: string;
  /** One-line rule under the box title. */
  rule: string;
  /** Picture cue for the rule, shown on the box and the answer card. */
  icon: string;
  /** Exact forms, capitalized as they start a question. */
  forms: string[];
  /** The subset of `forms` that are past tense. */
  pastForms: string[];
  /** Shown when the learner picks the right family and tense but the wrong form. */
  agreementHint: string;
  pastAgreementHint: string;
}

export const BE_OR_DO_GROUPS: BeOrDoGroup[] = [
  {
    id: "be",
    label: "The verb is BE",
    rule: "BE jumps to the front",
    icon: "🦘",
    forms: ["Am", "Is", "Are", "Was", "Were"],
    pastForms: ["Was", "Were"],
    agreementHint: "BE is right! Now match the subject: I → am · he / she / it → is · you / we / they → are.",
    pastAgreementHint: "BE is right! Now match the subject: I / he / she / it → was · you / we / they → were.",
  },
  {
    id: "do",
    label: "Another verb",
    rule: "DO comes to help",
    icon: "🤝",
    forms: ["Do", "Does", "Did"],
    pastForms: ["Did"],
    agreementHint: "DO is right! Now match the subject: he / she / it → does · I / you / we / they → do.",
    pastAgreementHint: "DO is right! In the past, use did with every subject.",
  },
];

/** Shown when the learner picks the right family but the wrong time. */
export const BE_OR_DO_TENSE_HINT =
  "Right verb, wrong time! Look for the time words. Past (yesterday, last night) → was / were / did. Now or every day → am / is / are / do / does.";

export type BeOrDoTense = "present" | "past";

export function beOrDoTense(form: string): BeOrDoTense {
  const lower = form.trim().toLowerCase();
  const isPast = BE_OR_DO_GROUPS.some((g) => g.pastForms.some((f) => f.toLowerCase() === lower));
  return isPast ? "past" : "present";
}

export function findBeOrDoGroup(form: string): BeOrDoGroup | undefined {
  const lower = form.trim().toLowerCase();
  return BE_OR_DO_GROUPS.find((group) => group.forms.some((f) => f.toLowerCase() === lower));
}

/**
 * One question card in the "Be or Do?" game. The question holds a `___` blank
 * where the helper verb goes.
 */
export interface BeOrDoCard {
  id: number;
  question: string;
  /** The exact helper form that fills the blank, as written in the content. */
  answer: string;
  groupId: string;
  /** The main verb to underline in the finished question (DO and -ing cards). */
  verb?: string;
  /** Short answer shown after a correct pick, e.g. "Yes, I do." */
  reply?: string;
  /** Why the answer is right, shown after a correct pick. */
  why?: string;
  /** Nudge shown after a wrong pick. */
  hint?: string;
  /** Small scene line above the question. */
  context?: string;
  /** The same-meaning question with the other helper, for twin cards. */
  twin?: string;
}

export interface BeOrDoRound {
  roundNumber: number;
  /** "group": pick BE or DO. "form": pick the exact word (am / is / are / was / were / do / does / did). */
  mode: "group" | "form";
  note?: string;
  cards: BeOrDoCard[];
}

const BE_OR_DO_MARKER = /^\s*GAME:\s*be-or-do\s*$/im;
const BE_OR_DO_FIELDS = new Set(["verb", "reply", "why", "hint", "context", "twin"]);

/**
 * Parses "Be or Do?" content. The content must start with a `GAME: be-or-do`
 * line so it can never be mistaken for another sorting game. Card lines:
 *
 *   ___ you feel tired? :: Do :: verb: feel :: reply: Yes, I do. :: twin: Are you tired?
 *
 * Fields after the answer are `key: value` pairs in any order. A round with a
 * `MODE: form` line asks for the exact form instead of BE vs DO.
 */
export function parseBeOrDoRounds(content: string): BeOrDoRound[] {
  if (!BE_OR_DO_MARKER.test(content)) return [];
  const rounds: BeOrDoRound[] = [];
  const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*[^\]]+)?\]/).slice(1);

  let roundNumber = 1;
  let globalId = 1;

  for (const block of roundBlocks) {
    const cards: BeOrDoCard[] = [];
    let note: string | undefined;
    let mode: BeOrDoRound["mode"] = "group";

    for (const rawLine of block.split("\n")) {
      const line = rawLine.trim();
      if (!line) continue;

      if (!line.includes("::")) {
        const noteMatch = line.match(/^NOTE:\s*(.+)$/i);
        if (noteMatch && !note) note = noteMatch[1].trim();
        if (/^MODE:\s*form\s*$/i.test(line)) mode = "form";
        continue;
      }

      const [question = "", answer = "", ...rest] = line.split("::").map((s) => s.trim());
      if (!question.includes("___") || !answer) continue;
      const group = findBeOrDoGroup(answer);
      if (!group) continue;

      const card: BeOrDoCard = { id: globalId++, question, answer, groupId: group.id };
      for (const field of rest) {
        const colon = field.indexOf(":");
        if (colon <= 0) continue;
        const key = field.slice(0, colon).trim().toLowerCase();
        const value = field.slice(colon + 1).trim();
        if (value && BE_OR_DO_FIELDS.has(key)) {
          card[key as "verb" | "reply" | "why" | "hint" | "context" | "twin"] = value;
        }
      }
      cards.push(card);
    }

    if (cards.length > 0) {
      rounds.push({ roundNumber, mode, ...(note ? { note } : {}), cards });
      roundNumber++;
    }
  }

  return rounds;
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

export type MatchingGameMode =
  | "vocab"
  | "countable"
  | "time-indicators"
  | "verb-sounds-right"
  | "action-description"
  | "be-or-do";

export function detectMatchingGameMode(content: string): MatchingGameMode {
  if (BE_OR_DO_MARKER.test(content)) return "be-or-do";
  const hasRoundMarkers = /\[ROUND\s*\d+/.test(content);
  const lines = content.split("\n");
  let hasCountableUncountableLine = false;
  let hasTimeIndicatorLine = false;
  let hasVerbSoundsRightLine = false;
  let hasActionDescriptionLine = false;

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
    if (lower.startsWith("action") || lower.startsWith("description")) {
      hasActionDescriptionLine = true;
    }
    if (first.includes("_____") && parts.length >= 3 && !lower.startsWith("countable") && !lower.startsWith("uncountable") && !lower.startsWith("specified") && !lower.startsWith("unspecified") && !lower.startsWith("action") && !lower.startsWith("description")) {
      hasVerbSoundsRightLine = true;
    }
  }

  if (hasRoundMarkers && hasVerbSoundsRightLine) return "verb-sounds-right";
  if (hasRoundMarkers && hasActionDescriptionLine) return "action-description";
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
    if (lower.startsWith("action") || lower.startsWith("description")) continue;

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

export function parseActionDescriptionRounds(content: string): ActionDescriptionRound[] {
  const rounds: ActionDescriptionRound[] = [];
  const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*[^\]]+)?\]/).filter((b) => b.trim());

  let roundNumber = 1;
  let globalId = 1;

  for (const block of roundBlocks) {
    const words: ActionDescriptionCard[] = [];
    const lines = block.trim().split("\n").filter((l) => l.trim());
    let note: string | undefined;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed.includes("::")) {
        const noteMatch = trimmed.match(/^NOTE:\s*(.+)$/i);
        if (noteMatch && !note) note = noteMatch[1].trim();
        continue;
      }

      // Three fields: word :: Category - explanation :: finished sentence.
      // Indexed rather than destructured so the sentence is not dropped.
      const parts = trimmed.split("::").map((s) => s.trim());
      const word = parts[0] ?? "";
      const definition = parts[1] ?? "";
      const sentence = parts[2] ?? "";
      if (!word || !definition) continue;

      const isAction = definition.toLowerCase().startsWith("action");
      const category: "action" | "description" = isAction ? "action" : "description";

      const explanationMatch = definition.match(/(?:Action|Description)\s*-\s*(.+)/i);
      const explanation = explanationMatch ? explanationMatch[1] : definition;

      words.push({
        id: globalId++,
        word,
        category,
        explanation,
        sentence,
      });
    }

    if (words.length > 0) {
      rounds.push({ roundNumber, ...(note ? { note } : {}), words });
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
