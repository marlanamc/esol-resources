import { buildTeachingWeeks } from '@/lib/course-map-schedule';
import { addDaysToDayKey, getCalendarWeekStartDayKey, getInstantForLearnerDayStart } from './calendar-week';

export type LeaderboardRange = 'day' | 'week' | 'last-week' | 'month' | 'all';

/** Half-open windows keep Sunday effort in last week and Monday effort in this week. */
export function getLeaderboardPeriod(range: LeaderboardRange, now = new Date()) {
  const monday = getCalendarWeekStartDayKey(now);
  const startKey = range === 'last-week' ? addDaysToDayKey(monday, -7) : monday;
  const endKey = range === 'last-week' ? monday : addDaysToDayKey(monday, 7);
  if (range === 'week' || range === 'last-week') {
    return {
      start: getInstantForLearnerDayStart(startKey),
      end: getInstantForLearnerDayStart(endKey),
      label: `${formatDay(startKey)} – ${formatDay(addDaysToDayKey(endKey, -1))}`,
    };
  }
  return {
    start: range === 'all' ? null : range === 'day'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : new Date(now.getFullYear(), now.getMonth(), 1),
    end: null,
    label: range === 'all' ? 'All points earned' : range === 'day' ? 'Today' : 'This month',
  };
}

function formatDay(key: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${key}T12:00:00Z`));
}

/** Match the scoring week exactly; breaks must not reuse the previous course week. */
export function getLeaderboardWeekNumber(now = new Date(), previous = false): number | null {
  const monday = getCalendarWeekStartDayKey(now);
  const startKey = previous ? addDaysToDayKey(monday, -7) : monday;
  return buildTeachingWeeks().find((week) => week.weekStart === startKey)?.index ?? null;
}

export function getLeaderboardWeekLabel(now = new Date(), previous = false): string {
  const weekNumber = getLeaderboardWeekNumber(now, previous);
  return weekNumber ? `Week ${weekNumber}` : previous ? 'Last week' : 'This week';
}
