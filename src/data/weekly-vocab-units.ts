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

/** Cycle 2: February – June (Units 6–10) */
export const VOCAB_WEEKLY_UNITS_CYCLE2: WeeklyVocabUnit[] = [
  { id: "feb-3-5", label: "February 3–5" },
  { id: "feb-10-12", label: "February 10–12" },
  { id: "feb-24-26", label: "February 24–26" },
  { id: "mar-3-5", label: "March 3–5" },
  { id: "mar-10-12", label: "March 10–12" },
  { id: "mar-17-19", label: "March 17–19" },
  { id: "mar-24-26", label: "March 24–26" },
  { id: "mar-31-apr-2", label: "March 31 – April 2" },
  { id: "apr-7-9", label: "April 7–9" },
  { id: "apr-14-16", label: "April 14–16" },
  { id: "apr-28-30", label: "April 28–30" },
  { id: "may-5-7", label: "May 5–7" },
  { id: "may-12-14", label: "May 12–14" },
  { id: "may-19-21", label: "May 19–21" },
  { id: "may-26-28", label: "May 26–28" },
  { id: "jun-2-4", label: "June 2–4" },
];

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
