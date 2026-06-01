import { getLearnerDayKey, LEARNER_DAY_TIME_ZONE } from "@/lib/daily-habits";

/** Mon–Sun labels; index 0 = Monday, index 6 = Sunday. */
export const CALENDAR_WEEK_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

const LEARNER_WEEKDAY_INDEX: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
};

function getLearnerWeekdayIndex(referenceDate: Date): number {
    const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone: LEARNER_DAY_TIME_ZONE,
        weekday: "long",
    }).format(referenceDate);

    return LEARNER_WEEKDAY_INDEX[weekday] ?? 0;
}

function addDaysToDayKey(dayKey: string, delta: number): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + delta));
    return next.toISOString().slice(0, 10);
}

/** YYYY-MM-DD for the Monday starting the current learner calendar week. */
export function getCalendarWeekStartDayKey(referenceDate: Date = new Date()): string {
    const todayKey = getLearnerDayKey(referenceDate);
    const weekdayIndex = getLearnerWeekdayIndex(referenceDate);
    return addDaysToDayKey(todayKey, -weekdayIndex);
}

/** UTC instant for 00:00 on `dayKey` in the learner timezone. */
export function getInstantForLearnerDayStart(dayKey: string): Date {
    const [y, m, d] = dayKey.split("-").map(Number);
    let candidate = Date.UTC(y, m - 1, d, 4, 0, 0);

    while (candidate < Date.UTC(y, m - 1, d + 2, 12, 0, 0)) {
        if (getLearnerDayKey(new Date(candidate)) === dayKey) {
            while (candidate > 0 && getLearnerDayKey(new Date(candidate - 1)) === dayKey) {
                candidate -= 1;
            }
            return new Date(candidate);
        }
        candidate += 60 * 60 * 1000;
    }

    return new Date(Date.UTC(y, m - 1, d, 4, 0, 0));
}

/** Calendar week runs Monday through Sunday in the learner timezone. */
export function getCalendarWeekStart(referenceDate: Date = new Date()): Date {
    return getInstantForLearnerDayStart(getCalendarWeekStartDayKey(referenceDate));
}

/** 0 on Monday … 6 on Sunday within the current calendar week. */
export function getCalendarWeekTodayIndex(referenceDate: Date = new Date()): number {
    return getLearnerWeekdayIndex(referenceDate);
}

export function getCalendarWeekDayLabel(dayIndex: number): string {
    return CALENDAR_WEEK_DAY_LABELS[dayIndex] ?? "?";
}

/** Seven booleans for Mon–Sun of the current calendar week (index 0 = Monday). */
export function buildCalendarWeekActivity(
    ledgerEntries: Array<{ createdAt: Date }>,
    referenceDate: Date = new Date()
): boolean[] {
    const weekStartKey = getCalendarWeekStartDayKey(referenceDate);
    const activeDates = new Set(
        ledgerEntries.map((entry) => getLearnerDayKey(new Date(entry.createdAt)))
    );

    return Array.from({ length: 7 }, (_, i) => activeDates.has(addDaysToDayKey(weekStartKey, i)));
}

/** Re-export for callers that bucket ledger rows by learner day. */
export { getLearnerDayKey };
