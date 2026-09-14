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

/** Full picture for one date: meeting, cancelled by a holiday, or neither. */
export function getClassDayInfo(date: Date, options: ClassDayOptions = {}): ClassDayInfo {
  const {
    termStart = TERM_START,
    termEnd = TERM_END,
    closures = SCHOOL_CLOSURES,
    classWeekdays = CLASS_WEEKDAYS,
  } = options;

  const dateKey = toDateKey(date);
  const inTerm = dateKey >= termStart && dateKey <= termEnd;
  const isScheduledMeeting = inTerm && classWeekdays.includes(date.getDay());
  const closure = isScheduledMeeting ? findClosure(dateKey, closures) : null;

  return {
    dateKey,
    inTerm,
    isScheduledMeeting,
    meets: isScheduledMeeting && !closure,
    cancelledBy: closure,
  };
}

/** True when class meets on this date. */
export function isClassDay(date: Date, options: ClassDayOptions = {}): boolean {
  return getClassDayInfo(date, options).meets;
}
