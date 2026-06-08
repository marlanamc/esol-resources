/**
 * Weekly vocabulary units covering the full academic year.
 * Cycle 1 (Sep–Jan) = Units 1–5; Cycle 2 (Feb–Jun) = Units 6–10.
 * Each unit has activities: word list (packet), flashcards, matching, fill-in-the-blank.
 */

export interface WeeklyVocabUnit {
  id: string;
  label: string;
}

/** Cycle 1: September – January (Units 1–5) */
export const VOCAB_WEEKLY_UNITS_CYCLE1: WeeklyVocabUnit[] = [
  { id: "sep-w1", label: "September Week 1" },
  { id: "sep-w2", label: "September Week 2" },
  { id: "sep-w3", label: "September Week 3" },
  { id: "sep-w4", label: "September Week 4" },
  { id: "oct-w1", label: "October Week 1" },
  { id: "oct-w2", label: "October Week 2" },
  { id: "oct-w3", label: "October Week 3" },
  { id: "oct-w4", label: "October Week 4" },
  { id: "nov-w1", label: "November Week 1" },
  { id: "nov-w2", label: "November Week 2" },
  { id: "nov-w3", label: "November Week 3" },
  { id: "nov-w4", label: "November Week 4" },
  { id: "dec-w1", label: "December Week 1" },
  { id: "dec-w2", label: "December Week 2" },
  { id: "jan-w1", label: "January Week 1" },
  { id: "jan-w2", label: "January Week 2" },
  { id: "jan-w3", label: "January Week 3" },
  { id: "jan-w4", label: "January Week 4" },
];

const CYCLE2_WEEK_IDS = [
  "feb-3-5",
  "feb-10-12",
  "feb-24-26",
  "mar-3-5",
  "mar-10-12",
  "mar-17-19",
  "mar-24-26",
  "mar-31-apr-2",
  "apr-7-9",
  "apr-14-16",
  "apr-28-30",
  "may-5-7",
  "may-12-14",
  "may-19-21",
  "may-26-28",
  "jun-2-4",
] as const;

const CYCLE2_MONTH_NAMES: Record<string, string> = {
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
};

function buildCycle2WeekLabel(id: string, orderedIds: readonly string[]): string {
  const monthKey = id.split("-")[0] ?? id;
  const monthName = CYCLE2_MONTH_NAMES[monthKey] ?? monthKey;
  const weekNumber =
    orderedIds.filter((candidate) => candidate.startsWith(`${monthKey}-`)).indexOf(id) + 1;
  return `${monthName} Week ${weekNumber}`;
}

/** Cycle 2: February – June (Units 6–10) */
export const VOCAB_WEEKLY_UNITS_CYCLE2: WeeklyVocabUnit[] = CYCLE2_WEEK_IDS.map((id) => ({
  id,
  label: buildCycle2WeekLabel(id, CYCLE2_WEEK_IDS),
}));

/** All weekly vocab units in calendar order */
export const VOCAB_WEEKLY_UNITS: WeeklyVocabUnit[] = [
  ...VOCAB_WEEKLY_UNITS_CYCLE1,
  ...VOCAB_WEEKLY_UNITS_CYCLE2,
];

/** Map slug id -> unit number (1–10) */
export const VOCAB_WEEKLY_UNIT_NUMBER: Record<string, number> = Object.fromEntries(
  VOCAB_WEEKLY_UNITS.map((u) => {
    let unitNum: number;
    if (u.id.startsWith("sep-")) unitNum = 1;
    else if (u.id.startsWith("oct-")) unitNum = 2;
    else if (u.id.startsWith("nov-")) unitNum = 3;
    else if (u.id.startsWith("dec-")) unitNum = 4;
    else if (u.id.startsWith("jan-")) unitNum = 5;
    else if (u.id.startsWith("feb-")) unitNum = 6;
    else if (u.id.startsWith("mar-")) unitNum = 7;
    else if (u.id.startsWith("apr-")) unitNum = 8;
    else if (u.id.startsWith("may-")) unitNum = 9;
    else unitNum = 10; // jun
    return [u.id, unitNum];
  })
);
