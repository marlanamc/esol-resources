import { buildTeachingWeeks, zonedWallClockToUtc } from '@/lib/course-map-schedule';
import { CLASS_TIME_ZONE } from '@/data/school-calendar-2026-27';

const teachingWeeks = buildTeachingWeeks();

/** Course weeks skip full school breaks. Due dates are always the next calendar Tuesday. */
export function getWeeklyQuizSchedule(weekNumber: number): { opensAt: Date; dueAt: Date } | null {
  const week = teachingWeeks.find(week => week.index === weekNumber);
  if (!week) return null;
  const at = (daysAfterMonday: number) => {
    const day = new Date(`${week.weekStart}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() + daysAfterMonday);
    return zonedWallClockToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), 18, CLASS_TIME_ZONE);
  };
  return { opensAt: at(3), dueAt: at(8) };
}

/**
 * A weekly quiz counts for a student only if it opened after they started
 * (`since` = their enrollment, or the class start if later). Someone who joins
 * mid-week is not handed the quiz that was already running when they arrived;
 * their first quiz is the next one to open.
 */
export function quizCountsSince(schedule: { opensAt: Date }, since: Date): boolean {
  return schedule.opensAt >= since;
}

export function readWeeklyQuizSchedule(content?: string | null) {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    return parsed?.type === 'weekly-quiz' ? getWeeklyQuizSchedule(parsed.weekNumber) : null;
  } catch { return null; }
}

export function formatQuizScheduleDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: CLASS_TIME_ZONE, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(date);
}
