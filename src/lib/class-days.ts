/**
 * Class-day lookups for calendar UI.
 *
 * Evening classes meet Tuesday and Thursday across the term, minus the
 * no-school closures. This module answers "does class meet on this date?"
 * from the static school calendar, so the calendar can outline meeting days
 * without any of them existing as a CalendarEvent row.
 *
 * Everything here is pure and dependency-free so client components can use it.
 */
import {
  CLASS_END_HOUR,
  CLASS_END_MINUTE,
  CLASS_START_HOUR,
  CLASS_TIME_ZONE,
  CLASS_WEEKDAYS,
  SCHOOL_CLOSURES,
  TERM_END,
  TERM_START,
  type SchoolClosure,
} from "@/data/school-calendar-2026-27";

/** YYYY-MM-DD for a Date, read in local time so the day never shifts. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The closure covering a YYYY-MM-DD date, or null when school is open. */
export function findClosure(
  dateKey: string,
  closures: readonly SchoolClosure[] = SCHOOL_CLOSURES
): SchoolClosure | null {
  return closures.find((c) => dateKey >= c.from && dateKey <= c.to) ?? null;
}

export interface ClassDayInfo {
  /** The date this describes, YYYY-MM-DD. */
  dateKey: string;
  /** Inside the term's first/last day. */
  inTerm: boolean;
  /** A Tuesday or Thursday inside the term — class meets unless closed. */
  isScheduledMeeting: boolean;
  /** Class actually meets: a scheduled meeting with no closure over it. */
  meets: boolean;
  /** Set when a holiday or break cancels a scheduled meeting. */
  cancelledBy: SchoolClosure | null;
}

export interface ClassDayOptions {
  termStart?: string;
  termEnd?: string;
  closures?: readonly SchoolClosure[];
  classWeekdays?: readonly number[];
}

/** Full picture for one YYYY-MM-DD date: meeting, cancelled, or neither. */
export function getClassDayInfoForKey(dateKey: string, options: ClassDayOptions = {}): ClassDayInfo {
  const {
    termStart = TERM_START,
    termEnd = TERM_END,
    closures = SCHOOL_CLOSURES,
    classWeekdays = CLASS_WEEKDAYS,
  } = options;

  const [y, m, d] = dateKey.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();

  const inTerm = dateKey >= termStart && dateKey <= termEnd;
  const isScheduledMeeting = inTerm && classWeekdays.includes(weekday);
  const closure = isScheduledMeeting ? findClosure(dateKey, closures) : null;

  return {
    dateKey,
    inTerm,
    isScheduledMeeting,
    meets: isScheduledMeeting && !closure,
    cancelledBy: closure,
  };
}

/** Full picture for one date, read as a local calendar day. */
export function getClassDayInfo(date: Date, options: ClassDayOptions = {}): ClassDayInfo {
  return getClassDayInfoForKey(toDateKey(date), options);
}

/** True when class meets on this date. */
export function isClassDay(date: Date, options: ClassDayOptions = {}): boolean {
  return getClassDayInfo(date, options).meets;
}

/** Wall-clock date and time at an instant, read in the given zone. */
export function zonedNow(
  instant: Date,
  timeZone: string = CLASS_TIME_ZONE
): { dateKey: string; minutesOfDay: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant);

  const at: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") at[part.type] = part.value;
  }

  return {
    dateKey: `${at.year}-${at.month}-${at.day}`,
    // Intl renders midnight as hour 24 in some engines.
    minutesOfDay: (Number(at.hour) % 24) * 60 + Number(at.minute),
  };
}

/** "6PM", or "6:30PM" when the hour is not on the hour. */
function formatClassTime(hour: number, minute: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${display}${suffix}` : `${display}:${`${minute}`.padStart(2, "0")}${suffix}`;
}

export interface ClassDayAnnouncementOptions extends ClassDayOptions {
  timeZone?: string;
  startHour?: number;
  startMinute?: number;
  /** The announcement clears at this wall-clock time — when class lets out. */
  endHour?: number;
  endMinute?: number;
}

/**
 * The banner to show on the dashboard right now, or null.
 *
 * Runs from midnight until class lets out on a day class actually meets, all
 * read in the program's own timezone so a learner travelling or a server in
 * UTC sees the same window.
 */
export function getClassDayAnnouncement(
  now: Date = new Date(),
  options: ClassDayAnnouncementOptions = {}
): string | null {
  const {
    timeZone = CLASS_TIME_ZONE,
    startHour = CLASS_START_HOUR,
    startMinute = 0,
    endHour = CLASS_END_HOUR,
    endMinute = CLASS_END_MINUTE,
    ...dayOptions
  } = options;

  const { dateKey, minutesOfDay } = zonedNow(now, timeZone);
  if (!getClassDayInfoForKey(dateKey, dayOptions).meets) return null;
  if (minutesOfDay >= endHour * 60 + endMinute) return null;

  return `Class tonight at ${formatClassTime(startHour, startMinute)}!`;
}
