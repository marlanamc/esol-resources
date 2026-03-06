/**
 * Maps each month to its associated content: vocab slugs, grammar guide IDs, and game IDs.
 * Used by the DashboardV2 MonthlyUnitBoard to show all relevant content for the current month.
 *
 * Month numbers: 0 = January, 1 = February, ..., 11 = December
 */

export interface MonthlyContentConfig {
  /** Unit number for display (e.g., "Unit 7") */
  unitNumber: number;
  /** Month name for display */
  monthLabel: string;
  /** Theme for the unit */
  theme: string;
  /** Vocab week slug prefixes (e.g., "mar-" matches "vocab-mar-3-5-packet") */
  vocabPrefixes: string[];
  /** Grammar guide activity IDs */
  grammarGuides: string[];
  /** Game activity IDs */
  games: string[];
}

export const MONTHLY_CONTENT_MAP: Record<number, MonthlyContentConfig> = {
  // January - Unit 5: Housing
  0: {
    unitNumber: 5,
    monthLabel: "January",
    theme: "Housing",
    vocabPrefixes: ["january"],
    grammarGuides: [
      "prepositions-time-place",
      "articles-community-resources",
    ],
    games: [],
  },

  // February - Unit 6: Workforce Preparation
  1: {
    unitNumber: 6,
    monthLabel: "February",
    theme: "Workforce Preparation",
    vocabPrefixes: ["feb-"],
    grammarGuides: [
      "present-simple",
      "present-continuous",
      "information-questions",
    ],
    games: [
      "verb-forms-challenge",
    ],
  },

  // March - Unit 7: Career Awareness
  2: {
    unitNumber: 7,
    monthLabel: "March",
    theme: "Career Awareness",
    vocabPrefixes: ["mar-"],
    grammarGuides: [
      "past-simple",
      "past-continuous",
      "present-perfect",
      "present-perfect-family",
    ],
    games: [
      "irregular-verbs-game",
      "ed-pronunciation",
    ],
  },

  // April - Unit 8: Health
  3: {
    unitNumber: 8,
    monthLabel: "April",
    theme: "Health",
    vocabPrefixes: ["apr-"],
    grammarGuides: [
      "modals-obligation-permission",
      "modals-health-advice-caution-consent",
      "imperatives-declaratives",
      "medical-instructions-complete",
    ],
    games: [],
  },

  // May - Unit 9: Holistic Wellness
  4: {
    unitNumber: 9,
    monthLabel: "May",
    theme: "Holistic Wellness",
    vocabPrefixes: ["may-"],
    grammarGuides: [
      "future-simple",
      "future-continuous",
      "future-perfect",
      "future-perfect-family",
      "conditionals-zero-first",
    ],
    games: [],
  },

  // June - Unit 10: Future Academic Goals
  5: {
    unitNumber: 10,
    monthLabel: "June",
    theme: "Future Academic Goals",
    vocabPrefixes: ["jun-"],
    grammarGuides: [
      "conditionals-second-third",
      "reported-speech",
      "all-verb-tenses-overview",
    ],
    games: [],
  },

  // September - Unit 1: Getting to Know You
  8: {
    unitNumber: 1,
    monthLabel: "September",
    theme: "Getting to Know You",
    vocabPrefixes: ["september"],
    grammarGuides: [
      "parts-of-speech",
      "punctuation-capitalization",
    ],
    games: [
      "numbers-game",
    ],
  },

  // October - Unit 2: Daily Life in the Community
  9: {
    unitNumber: 2,
    monthLabel: "October",
    theme: "Daily Life in the Community",
    vocabPrefixes: ["october"],
    grammarGuides: [
      "present-simple",
      "present-continuous",
    ],
    games: [
      "countable-uncountable-nouns",
    ],
  },

  // November - Unit 3: Community Participation
  10: {
    unitNumber: 3,
    monthLabel: "November",
    theme: "Community Participation",
    vocabPrefixes: ["november"],
    grammarGuides: [
      "past-simple",
      "past-continuous",
      "superlatives-quantifiers",
    ],
    games: [],
  },

  // December - Unit 4: Consumer Smarts
  11: {
    unitNumber: 4,
    monthLabel: "December",
    theme: "Consumer Smarts",
    vocabPrefixes: ["december"],
    grammarGuides: [
      "gerunds-infinitives",
      "used-to-would-rather",
    ],
    games: [],
  },
};

/**
 * Get the content config for the current month.
 */
export function getCurrentMonthContent(): MonthlyContentConfig | null {
  const currentMonth = new Date().getMonth();
  return MONTHLY_CONTENT_MAP[currentMonth] ?? null;
}

/**
 * Get the content config for a specific month.
 */
export function getMonthContent(month: number): MonthlyContentConfig | null {
  return MONTHLY_CONTENT_MAP[month] ?? null;
}
