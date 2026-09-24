export function shouldAwardStreak(points: number): boolean {
  return points > 0;
}

/**
 * Streak days are learner-local days, not UTC days. Eastern is 4-5 hours behind
 * UTC, so bucketing by UTC made any evening work after ~8pm ET count as the next
 * day: a single evening session could advance the streak twice, and the streak
 * disagreed with the Mon-Sun dots on the momentum card (which have always used
 * learner-local days via getLearnerDayKey).
 *
 * Kept local rather than imported from @/lib/daily-habits so this stays a pure
 * module -- daily-habits pulls in Prisma.
 */
const LEARNER_DAY_TIME_ZONE = "America/New_York";

const learnerDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: LEARNER_DAY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Midnight UTC of the learner-local calendar date, for whole-day differences. */
function getLearnerDayStart(date: Date): number {
  const [y, m, d] = learnerDayFormatter.format(date).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function getDaysSinceActivity(lastActivityDate: Date | string | null, now: Date = new Date()): number | null {
  if (!lastActivityDate) return null;
  const last = new Date(lastActivityDate);
  if (Number.isNaN(last.getTime())) return null;
  const diffMs = getLearnerDayStart(now) - getLearnerDayStart(last);
  return Math.floor(diffMs / 86400000);
}

export function getEffectiveStreak(
  currentStreak: number | null | undefined,
  lastActivityDate: Date | string | null,
  now: Date = new Date()
): number {
  const baseStreak = currentStreak ?? 0;
  if (baseStreak <= 0) return 0;
  const daysSince = getDaysSinceActivity(lastActivityDate, now);
  if (daysSince === null) return 0;
  return daysSince <= 1 ? baseStreak : 0;
}

export function getNextStreakState(
  currentStreak: number | null | undefined,
  lastActivityDate: Date | string | null,
  now: Date = new Date()
): { streakUpdated: boolean; newStreak: number } {
  const baseStreak = currentStreak ?? 0;
  const daysSince = getDaysSinceActivity(lastActivityDate, now);

  if (daysSince === null) {
    return { streakUpdated: true, newStreak: 1 };
  }

  if (daysSince === 0) {
    return { streakUpdated: false, newStreak: baseStreak };
  }

  if (daysSince === 1) {
    return { streakUpdated: true, newStreak: baseStreak + 1 };
  }

  return { streakUpdated: true, newStreak: 1 };
}
