/**
 * Weekly vocabulary units (Feb–Jun) replacing the former monthly Units 6–9.
 * Unit number is the same for the whole month: Feb = 6, Mar = 7, Apr = 8, May = 9, Jun = 10.
 * Each unit has 4 activities: word list (packet), flashcards, matching, fill-in-the-blank.
 */

export interface WeeklyVocabUnit {
  id: string;
  label: string;
}

export const VOCAB_WEEKLY_UNITS: WeeklyVocabUnit[] = [
  { id: "feb-3-5", label: "Unit 6: February 3–5 Jobs: Foundations" },
  { id: "feb-10-12", label: "Unit 6: February 10–12 Jobs: Real Workplace English" },
  { id: "feb-24-26", label: "Unit 6: February 24–26 Jobs: Experience & Timelines" },
  { id: "mar-3-5", label: "Unit 7: March 3–5 Jobs: Skills & Qualifications" },
  { id: "mar-10-12", label: "Unit 7: March 10–12 Jobs: Goals & Planning" },
  { id: "mar-17-19", label: "Unit 7: March 17–19 Jobs: Communication & Feedback" },
  { id: "mar-24-26", label: "Unit 7: March 24–26 Jobs: Rights, Rules & Advocacy" },
  { id: "mar-31-apr-2", label: "Unit 7: March 31 – April 2 Jobs: Advice, Risk & Reflection" },
  { id: "apr-7-9", label: "Unit 8: April 7–9 Jobs: Rules & Expectations" },
  { id: "apr-14-16", label: "Unit 8: April 14–16 Health: Symptoms & Care" },
  { id: "apr-28-30", label: "Unit 8: April 28–30 Health: Results & Duration" },
  { id: "may-5-7", label: "Unit 9: May 5–7 Health: Change & Adjustment" },
  { id: "may-12-14", label: "Unit 9: May 12–14 Holistic Health: Daily Care" },
  { id: "may-19-21", label: "Unit 9: May 19–21 Holistic Health: Life Skills" },
  { id: "may-26-28", label: "Unit 9: May 26–28 Holistic Health: Review" },
  { id: "jun-2-4", label: "Unit 10: June 2–4 Wrap-Up & Next Steps" },
];

/** Map slug id -> unit number (6 = Feb, 7 = Mar, 8 = Apr, 9 = May, 10 = Jun) */
export const VOCAB_WEEKLY_UNIT_NUMBER: Record<string, number> = Object.fromEntries(
  VOCAB_WEEKLY_UNITS.map((u) => {
    const unitNum = u.id.startsWith("feb-") ? 6 : u.id.startsWith("mar-") ? 7 : u.id.startsWith("apr-") ? 8 : u.id.startsWith("may-") ? 9 : 10;
    return [u.id, unitNum];
  })
);
