/**
 * Vocab-related utilities for ActivityCategories.
 * Extracted to reduce ActivityCategories.tsx size.
 */

import { VOCAB_WEEKLY_UNITS } from "@/data/weekly-vocab-units";
import { stripVocabTypeSuffix } from "@/lib/vocab-display";

export interface ActivityForVocab {
  id: string;
  title: string;
  category: string | null;
}

export const vocabCycle1 = [
  { id: "september", label: "Unit 1: September" },
  { id: "october", label: "Unit 2: October" },
  { id: "november", label: "Unit 3: November" },
  { id: "december", label: "Unit 4: December" },
  { id: "january", label: "Unit 5: January" },
];

export const vocabUnits = [
  {
    unitNum: 6,
    label: "Unit 6: February - Workforce Preparation",
    weeks: VOCAB_WEEKLY_UNITS.filter((u) => u.id.startsWith("feb-")),
  },
  {
    unitNum: 7,
    label: "Unit 7: March - Career Awareness",
    weeks: VOCAB_WEEKLY_UNITS.filter((u) => u.id.startsWith("mar-")),
  },
  {
    unitNum: 8,
    label: "Unit 8: April - Health",
    weeks: VOCAB_WEEKLY_UNITS.filter((u) => u.id.startsWith("apr-")),
  },
  {
    unitNum: 9,
    label: "Unit 9: May - Holistic Wellness",
    weeks: VOCAB_WEEKLY_UNITS.filter((u) => u.id.startsWith("may-")),
  },
  {
    unitNum: 10,
    label: "Unit 10: June - Future Academic Goals",
    weeks: VOCAB_WEEKLY_UNITS.filter((u) => u.id.startsWith("jun-")),
  },
];

export const VOCAB_THEME_BY_UNIT_NUMBER: Record<number, string> = {
  1: "Getting to Know You",
  2: "Daily Life in the Community",
  3: "Community Participation",
  4: "Consumer Smarts",
  5: "Housing",
  6: "Workforce Preparation",
  7: "Career Awareness",
  8: "Health",
  9: "Holistic Wellness",
  10: "Future Academic Goals",
};

const VOCAB_TYPE_ONLY_LABEL_RE =
  /^(word\s*list|flash\s*cards?(?:\s*game)?|matching|fill-?in-?(?:the-?)?blank)$/i;
const MONTH_NAMES_RE =
  "(january|february|march|april|may|june|july|august|september|october|november|december)";
const VOCAB_TITLE_MONTH_WITH_DAY_RE = new RegExp(
  `^${MONTH_NAMES_RE}\\s+\\d{1,2}(?:\\s*[–-]\\s*(?:\\d{1,2}|${MONTH_NAMES_RE}\\s+\\d{1,2}))?\\s*`,
  "i"
);
const VOCAB_TITLE_MONTH_ONLY_RE = new RegExp(`^${MONTH_NAMES_RE}\\s*[-–]\\s*`, "i");

export const displayTitle = (title: string) =>
  stripVocabTypeSuffix(
    title
      .replace(/\s*-\s*Complete Step-by-Step Guide\s*$/i, " Guide")
      .replace(/\s*-\s*Complete Guide\s*$/i, " Guide")
      .trim()
  );

export function getVocabUnitNumberFromActivity(activity: ActivityForVocab): number | null {
  const titleMatch = displayTitle(activity.title).match(/\bunit\s+(\d+)\b/i);
  if (titleMatch?.[1]) {
    const unitNumber = Number.parseInt(titleMatch[1], 10);
    if (Number.isFinite(unitNumber) && unitNumber >= 1 && unitNumber <= 10) {
      return unitNumber;
    }
  }

  const coreId = activity.id
    .toLowerCase()
    .replace(/^vocab-/, "")
    .replace(/-(packet|flashcards|matching|fillblank)$/, "");

  if (coreId.startsWith("september")) return 1;
  if (coreId.startsWith("october")) return 2;
  if (coreId.startsWith("november")) return 3;
  if (coreId.startsWith("december")) return 4;
  if (coreId.startsWith("january")) return 5;
  if (coreId.startsWith("feb")) return 6;
  if (coreId.startsWith("mar")) return 7;
  if (coreId.startsWith("apr")) return 8;
  if (coreId.startsWith("may")) return 9;
  if (coreId.startsWith("jun")) return 10;

  return null;
}

export function extractThemeFromVocabTitle(title: string): string | null {
  const normalized = displayTitle(title).trim();
  if (!/^unit\s+\d+\s*:/i.test(normalized)) return null;

  let candidate = normalized.replace(/^unit\s+\d+\s*:\s*/i, "").trim();

  const secondColonIndex = candidate.indexOf(":");
  if (secondColonIndex >= 0) {
    candidate = candidate.slice(secondColonIndex + 1).trim();
  }

  candidate = candidate.replace(VOCAB_TITLE_MONTH_WITH_DAY_RE, "").trim();
  candidate = candidate.replace(VOCAB_TITLE_MONTH_ONLY_RE, "").trim();

  if (!candidate || VOCAB_TYPE_ONLY_LABEL_RE.test(candidate)) {
    return null;
  }

  return candidate;
}

export function getVocabThemeChip(activity: ActivityForVocab): string | null {
  const isVocabActivity =
    activity.id.startsWith("vocab-") || activity.category?.toLowerCase() === "vocabulary";
  if (!isVocabActivity) return null;

  const themeFromTitle = extractThemeFromVocabTitle(activity.title);
  if (themeFromTitle) return themeFromTitle;

  const unitNumber = getVocabUnitNumberFromActivity(activity);
  if (!unitNumber) return null;

  return VOCAB_THEME_BY_UNIT_NUMBER[unitNumber] ?? null;
}

export function cleanVocabTerm(value: string): string {
  return value
    .replace(/^[\s"'`""'']+|[\s"'`""'']+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupeVocabTerms(terms: string[]): string[] {
  const seen = new Set<string>();
  const uniqueTerms: string[] = [];

  for (const rawTerm of terms) {
    const normalizedTerm = cleanVocabTerm(rawTerm);
    if (!normalizedTerm) continue;

    const key = normalizedTerm.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    uniqueTerms.push(normalizedTerm);
  }

  return uniqueTerms;
}

function extractTermsFromCards(cards: unknown): string[] {
  if (!Array.isArray(cards)) return [];
  return cards
    .map((card) => {
      if (!card || typeof card !== "object") return null;
      const term = (card as { term?: unknown }).term;
      return typeof term === "string" ? term : null;
    })
    .filter((term): term is string => Boolean(term));
}

function extractTermsFromPairs(pairs: unknown): string[] {
  if (!Array.isArray(pairs)) return [];
  return pairs
    .map((pair) => {
      if (!pair || typeof pair !== "object") return null;
      const term = (pair as { term?: unknown }).term;
      return typeof term === "string" ? term : null;
    })
    .filter((term): term is string => Boolean(term));
}

function extractTermsFromWordArray(words: unknown): string[] {
  if (!Array.isArray(words)) return [];
  return words
    .map((word) => {
      if (typeof word === "string") return word;
      if (!word || typeof word !== "object") return null;
      const term =
        (word as { term?: unknown; word?: unknown }).term ??
        (word as { word?: unknown }).word;
      return typeof term === "string" ? term : null;
    })
    .filter((term): term is string => Boolean(term));
}

function extractTermsFromFillInBlank(fillInBlank: unknown): string[] {
  if (!fillInBlank || typeof fillInBlank !== "object") return [];
  const sentences = (fillInBlank as { sentences?: unknown }).sentences;
  if (!Array.isArray(sentences)) return [];

  const terms: string[] = [];
  for (const sentence of sentences) {
    if (!sentence || typeof sentence !== "object") continue;
    const blanks = (sentence as { blanks?: unknown }).blanks;
    if (Array.isArray(blanks)) {
      for (const blank of blanks) {
        if (typeof blank === "string") terms.push(blank);
      }
    }
    const answers = (sentence as { correctAnswers?: unknown }).correctAnswers;
    if (Array.isArray(answers)) {
      for (const answer of answers) {
        if (typeof answer === "string") terms.push(answer);
      }
    }
  }

  return terms;
}

export function extractVocabTermsFromJsonContent(content: string): string[] {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!parsed || typeof parsed !== "object") return [];

    const obj = parsed as {
      cards?: unknown;
      pairs?: unknown;
      words?: unknown;
      wordList?: { cards?: unknown };
      flashcards?: { cards?: unknown };
      matching?: { pairs?: unknown };
      fillInBlank?: unknown;
    };

    const orderedTerms = [
      ...extractTermsFromCards(obj.cards),
      ...extractTermsFromCards(obj.wordList?.cards),
      ...extractTermsFromCards(obj.flashcards?.cards),
      ...extractTermsFromPairs(obj.pairs),
      ...extractTermsFromPairs(obj.matching?.pairs),
      ...extractTermsFromWordArray(obj.words),
      ...extractTermsFromFillInBlank(obj.fillInBlank),
    ];

    return dedupeVocabTerms(orderedTerms);
  } catch {
    return [];
  }
}
