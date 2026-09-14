/**
 * The 2026-27 evening-class calendar, transcribed from the program's
 * "School Calendar & Important Dates" sheet.
 *
 * Evening classes meet Tuesday and Thursday, Sept 14 2026 through June 10 2027.
 * Family Literacy runs a different calendar and is not represented here.
 */

export const SCHOOL_YEAR_LABEL = "2026-27";

/** First and last day of the evening-class year. */
export const TERM_START = "2026-09-14";
export const TERM_END = "2027-06-10";

/** Evening classes meet on these weekdays (0 = Sunday). */
export const CLASS_WEEKDAYS = [2, 4] as const; // Tuesday, Thursday

export interface SchoolClosure {
  /** Inclusive start date, YYYY-MM-DD. */
  from: string;
  /** Inclusive end date, YYYY-MM-DD. Same as `from` for single days. */
  to: string;
  label: string;
}

export const SCHOOL_CLOSURES: SchoolClosure[] = [
  { from: "2026-09-24", to: "2026-09-24", label: "No Class" },
  { from: "2026-10-12", to: "2026-10-12", label: "Indigenous Peoples' Day" },
  { from: "2026-11-11", to: "2026-11-11", label: "Veterans Day" },
  { from: "2026-11-25", to: "2026-11-28", label: "Thanksgiving Break" },
  { from: "2026-12-23", to: "2027-01-01", label: "Winter Break" },
  { from: "2027-01-18", to: "2027-01-18", label: "Martin Luther King Jr. Day" },
  { from: "2027-02-15", to: "2027-02-19", label: "February Break" },
  { from: "2027-04-19", to: "2027-04-23", label: "Spring Break" },
  { from: "2027-05-31", to: "2027-05-31", label: "Memorial Day" },
];

/** Local time a week opens to students, in the learner timezone. */
export const WEEK_REVEAL_WEEKDAY = 0; // Sunday
export const WEEK_REVEAL_HOUR = 20; // 8pm
