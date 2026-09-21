import { LEARNER_DAY_TIME_ZONE } from "@/lib/daily-habits";
import { buildTeachingWeeks, zonedWallClockToUtc } from "@/lib/course-map-schedule";
import type { LearnerMode } from "@/lib/learner-mode";
import type { CourseMapUnit } from "@/lib/course-map";

/**
 * The weekday a class week becomes "this week" for students, and the hour it
 * turns over. Content opens earlier — Sunday 8pm, see WEEK_REVEAL_* — so there
 * is a deliberate early-access window before the week is the one being taught.
 */
export const WEEK_SWITCH_WEEKDAY = 2; // Tuesday
export const WEEK_SWITCH_HOUR = 0; // midnight

/**
 * The instant a teaching week becomes the scheduled week: the first
 * WEEK_SWITCH_WEEKDAY at or after the week's Monday, at WEEK_SWITCH_HOUR local.
 *
 * Computed as a wall-clock time in the learner timezone, so a week never
 * switches an hour early or late across a daylight-saving change.
 */
export function weekSwitchAt(
    weekStart: string,
    timeZone: string = LEARNER_DAY_TIME_ZONE
): Date {
    const [y, m, d] = weekStart.split("-").map(Number);
    const monday = new Date(Date.UTC(y, m - 1, d));
    const forward = (WEEK_SWITCH_WEEKDAY - monday.getUTCDay() + 7) % 7;
    monday.setUTCDate(monday.getUTCDate() + forward);
    return zonedWallClockToUtc(
        monday.getUTCFullYear(),
        monday.getUTCMonth() + 1,
        monday.getUTCDate(),
        WEEK_SWITCH_HOUR,
        timeZone
    );
}

export interface ScheduledWeek {
    /** 1-based teaching-week index, matching CourseWeek.number. */
    weekNumber: number;
    /** Monday of the week, YYYY-MM-DD. */
    weekStart: string;
    /** When this week became (or becomes) the scheduled week. */
    switchAt: Date;
}

/**
 * The week the calendar says the class is on right now, ignoring visibility
 * and progress. Before the first switch this is the first teaching week; after
 * the term it stays on the last one.
 */
export function resolveScheduledTeachingWeek(now: Date = new Date()): ScheduledWeek | null {
    const teaching = buildTeachingWeeks();
    if (teaching.length === 0) return null;

    let current = teaching[0];
    for (const week of teaching) {
        if (weekSwitchAt(week.weekStart) <= now) current = week;
        else break;
    }

    return {
        weekNumber: current.index,
        weekStart: current.weekStart,
        switchAt: weekSwitchAt(current.weekStart),
    };
}

/** Week numbers a learner can actually open, in ascending order. */
export function visibleWeekNumbers(units: CourseMapUnit[]): number[] {
    return units
        .flatMap((unit) => unit.levels.map((level) => level.levelNumber))
        .sort((a, b) => a - b);
}

export interface CurrentWeekResolution {
    /** The week to treat as "this week" — what headings and buttons follow. */
    weekNumber: number;
    /**
     * How it was chosen:
     *   "calendar"  — the scheduled week, and it is visible
     *   "fallback"  — scheduled week not visible; latest visible earlier week
     *   "progress"  — independent learner; driven by progress, not the calendar
     */
    source: "calendar" | "fallback" | "progress";
    /** The calendar's week, even when `weekNumber` fell back to another. */
    scheduledWeekNumber: number | null;
}

export interface ResolveCurrentWeekOptions {
    /** Classroom follows the calendar; independent stays progress-driven. */
    mode: LearnerMode;
    /** Weeks the learner can open. */
    visibleWeeks: number[];
    /** Where progress alone would put the learner — used by independent mode. */
    progressWeek?: number | null;
    /** Injectable for tests. */
    now?: Date;
}

/**
 * The one place that decides which week is "current".
 *
 * Classroom learners follow the school calendar: the scheduled week stands
 * whether or not earlier work is finished, so a student who is behind still
 * sees what the class is doing. Independent learners keep their progress-based
 * behavior, since no class calendar applies to them.
 *
 * When the scheduled week is not visible yet — not released, or past the end of
 * what is published — the latest visible earlier week is used instead, so the
 * learner always lands on something they can open.
 */
export function resolveCurrentWeek(options: ResolveCurrentWeekOptions): CurrentWeekResolution | null {
    const { mode, visibleWeeks, progressWeek = null, now = new Date() } = options;

    if (mode === "independent") {
        const weekNumber = progressWeek ?? visibleWeeks[0] ?? null;
        if (weekNumber == null) return null;
        return { weekNumber, source: "progress", scheduledWeekNumber: null };
    }

    const scheduled = resolveScheduledTeachingWeek(now);
    if (!scheduled) {
        const weekNumber = progressWeek ?? visibleWeeks[0] ?? null;
        if (weekNumber == null) return null;
        return { weekNumber, source: "progress", scheduledWeekNumber: null };
    }

    if (visibleWeeks.includes(scheduled.weekNumber)) {
        return {
            weekNumber: scheduled.weekNumber,
            source: "calendar",
            scheduledWeekNumber: scheduled.weekNumber,
        };
    }

    // Scheduled week is not open to this learner — hold at the latest week
    // before it that is, rather than jumping ahead to something unrelated.
    const earlier = visibleWeeks.filter((week) => week < scheduled.weekNumber);
    const fallback = earlier.length > 0 ? earlier[earlier.length - 1] : visibleWeeks[0];
    if (fallback == null) return null;

    return {
        weekNumber: fallback,
        source: "fallback",
        scheduledWeekNumber: scheduled.weekNumber,
    };
}
