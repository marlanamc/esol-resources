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
