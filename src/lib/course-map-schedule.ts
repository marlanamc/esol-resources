import { LEARNER_DAY_TIME_ZONE } from "@/lib/daily-habits";
import {
  CLASS_WEEKDAYS,
  SCHOOL_CLOSURES,
  TERM_END,
  TERM_START,
  WEEK_REVEAL_HOUR,
  WEEK_REVEAL_WEEKDAY,
  type SchoolClosure,
} from "@/data/school-calendar-2026-27";

/** How far a zone is ahead of UTC at a given instant, in milliseconds. */
function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const at: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") at[part.type] = Number(part.value);
  }
  // Intl renders midnight as hour 24 in some engines.
  const hour = at.hour % 24;
  return Date.UTC(at.year, at.month - 1, at.day, hour, at.minute, at.second) - date.getTime();
}

/**
 * Turn a wall-clock time in a timezone into the correct UTC instant.
 * Applied twice so a date sitting near a DST transition settles on the right side.
 */
export function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  timeZone: string = LEARNER_DAY_TIME_ZONE
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, 0, 0);
  const firstPass = new Date(naive - timeZoneOffsetMs(new Date(naive), timeZone));
  const settled = new Date(naive - timeZoneOffsetMs(firstPass, timeZone));
  return settled;
}

function parseDateOnly(value: string): { y: number; m: number; d: number } {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m, d };
}

/** UTC-midnight Date for a YYYY-MM-DD string, used only for calendar walking. */
function dayCursor(value: string): Date {
  const { y, m, d } = parseDateOnly(value);
  return new Date(Date.UTC(y, m - 1, d));
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isClosed(dateOnly: string, closures: SchoolClosure[]): boolean {
  return closures.some((c) => dateOnly >= c.from && dateOnly <= c.to);
}

export interface TeachingWeek {
  /** 1-based position in the teaching year. */
  index: number;
  /** Monday of the week, YYYY-MM-DD. */
  weekStart: string;
  /** Class dates actually held that week, YYYY-MM-DD. */
  classDates: string[];
  /** The instant the week opens to students. */
  revealAt: Date;
}

export interface BuildTeachingWeeksOptions {
  termStart?: string;
  termEnd?: string;
  closures?: SchoolClosure[];
  classWeekdays?: readonly number[];
  revealWeekday?: number;
  revealHour?: number;
  timeZone?: string;
}

/**
 * Walk the term and return every week that holds at least one class session,
 * each paired with the instant it should open to students.
 *
 * Weeks with no sessions — full break weeks — are skipped entirely, so the
 * reveal sequence never advances during a vacation.
 */
export function buildTeachingWeeks(options: BuildTeachingWeeksOptions = {}): TeachingWeek[] {
  const {
    termStart = TERM_START,
    termEnd = TERM_END,
    closures = SCHOOL_CLOSURES,
    classWeekdays = CLASS_WEEKDAYS,
    revealWeekday = WEEK_REVEAL_WEEKDAY,
    revealHour = WEEK_REVEAL_HOUR,
    timeZone = LEARNER_DAY_TIME_ZONE,
  } = options;

  const meets = new Set(classWeekdays);
  const byWeekStart = new Map<string, string[]>();

  const end = dayCursor(termEnd);
  for (const cursor = dayCursor(termStart); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const dateOnly = toDateOnly(cursor);
    if (!meets.has(cursor.getUTCDay())) continue;
    if (isClosed(dateOnly, closures)) continue;

    // Monday-start week key
    const monday = new Date(cursor);
    const shift = (cursor.getUTCDay() + 6) % 7;
    monday.setUTCDate(monday.getUTCDate() - shift);
    const key = toDateOnly(monday);

    byWeekStart.set(key, [...(byWeekStart.get(key) ?? []), dateOnly]);
  }

  return [...byWeekStart.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([weekStart, classDates], i) => {
      // Reveal on the chosen weekday at or before the week's Monday.
      const monday = dayCursor(weekStart);
      const back = (monday.getUTCDay() - revealWeekday + 7) % 7 || 7;
      const revealDay = new Date(monday);
      revealDay.setUTCDate(revealDay.getUTCDate() - back);
      const { y, m, d } = parseDateOnly(toDateOnly(revealDay));

      return {
        index: i + 1,
        weekStart,
        classDates,
        revealAt: zonedWallClockToUtc(y, m, d, revealHour, timeZone),
      };
    });
}
