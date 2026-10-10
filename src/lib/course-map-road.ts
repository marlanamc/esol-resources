import type {
    CourseMapActivity,
    CourseMapActivityType,
    CourseMapOutlineUnit,
    CourseMapUnit,
} from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import { formatNextUpActivityTitle } from "@/lib/course-map-hero";
import {
    buildMapActivityHref,
    buildMapReturnHref,
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-navigation";
import { withReturnTo } from "@/lib/learner/navigation";

/**
 * The mobile course map draws the year as one road: cycles hold units, units
 * hold weeks. This module turns the course outline, the learner's visible
 * weeks and their progress into that shape, so the component only renders.
 */

// ── Cycles ────────────────────────────────────────────────────────────────────

export interface CourseCycleDef {
    number: number;
    /** Unit months that belong to this cycle, lowercase. */
    months: readonly string[];
    range: string;
}

/** Cycle 1 runs September–January, Cycle 2 February–June. */
export const COURSE_CYCLES: readonly CourseCycleDef[] = [
    {
        number: 1,
        months: ["september", "october", "november", "december", "january"],
        range: "September – January",
    },
    {
        number: 2,
        months: ["february", "march", "april", "may", "june"],
        range: "February – June",
    },
];

/** Units 1–5 are Cycle 1 when a unit has no month to go by. */
const CYCLE_1_LAST_UNIT = 5;

export function cycleForUnit(unit: { unitNumber: number; month: string }): number {
    const month = unit.month.trim().toLowerCase();
    const byMonth = COURSE_CYCLES.find((cycle) => cycle.months.includes(month));
    if (byMonth) return byMonth.number;
    return unit.unitNumber <= CYCLE_1_LAST_UNIT ? 1 : 2;
}

// ── Dates ─────────────────────────────────────────────────────────────────────

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateOnlyToUtc(value: string): Date {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
}

/** Monday–Friday of a teaching week: "Oct 5–9", or "Sep 28 – Oct 2" across months. */
export function formatRoadWeekDates(weekStart: string): string {
    const monday = dateOnlyToUtc(weekStart);
    const friday = new Date(monday);
    friday.setUTCDate(friday.getUTCDate() + 4);
    const startMonth = MONTH_SHORT[monday.getUTCMonth()];
    const endMonth = MONTH_SHORT[friday.getUTCMonth()];
    if (startMonth === endMonth) {
        return `${startMonth} ${monday.getUTCDate()}–${friday.getUTCDate()}`;
    }
    return `${startMonth} ${monday.getUTCDate()} – ${endMonth} ${friday.getUTCDate()}`;
}

// ── Model ─────────────────────────────────────────────────────────────────────

export interface RoadScheduleWeek {
    weekNumber: number;
    /** Monday of the week, YYYY-MM-DD. */
    weekStart: string;
    /** First class day of the week, YYYY-MM-DD. */
    firstClassDate: string | null;
}

export interface RoadActivity {
    id: string;
    title: string;
    activityType: CourseMapActivityType;
    vocabUi?: string;
    /** Course week the activity belongs to; names the vocab set on its row. */
    weekNumber?: number;
    /** Null when the activity cannot be opened yet. */
    href: string | null;
    done: boolean;
    isNext: boolean;
}

/**
 * done / current / past: on or before the class week.
 * upcoming: after the class week but already open (early access).
 * locked: not open to this learner yet.
 */
export type RoadWeekState = "done" | "current" | "past" | "upcoming" | "locked";

export interface RoadWeek {
    weekNumber: number;
    title: string;
    unitNumber: number;
    unitMonth: string;
    cycle: number;
    state: RoadWeekState;
    isCurrent: boolean;
    /** After the class week, open or not. Drives the dashed rail. */
    isFuture: boolean;
    isLocked: boolean;
    /** "Oct 5–9"; null without a school calendar. */
    dates: string | null;
    /** Class-start note for upcoming (early-access) weeks. */
    note: string | null;
    done: number;
    total: number;
    isDone: boolean;
    activities: RoadActivity[];
    extras: RoadActivity[];
    next: RoadActivity | null;
}

export interface RoadUnit {
    unitNumber: number;
    title: string;
    month: string;
    cycle: number;
    weeks: RoadWeek[];
    isPast: boolean;
    isFuture: boolean;
    /** Future and nothing in it is open yet. */
    isLocked: boolean;
    doneWeeks: number;
    summary: string | null;
}

export interface RoadCycle {
    number: number;
    range: string;
    units: RoadUnit[];
    isPast: boolean;
    isCurrent: boolean;
    summary: string | null;
}

export interface CourseMapRoadModel {
    cycles: RoadCycle[];
    /** Every rendered week in order, for the strip and scroll-spy. */
    weeks: RoadWeek[];
    currentWeek: number;
}

export interface BuildCourseMapRoadOptions {
    outline: CourseMapOutlineUnit[];
    /** Weeks this learner can open, with their activities. */
    units: CourseMapUnit[];
    progress: CourseMapProgressState;
    currentWeek: number;
    assignmentIds?: Record<string, { assignmentId: string }>;
    /** Teaching calendar by week number; omit for learners without a class calendar. */
    schedule?: Map<number, RoadScheduleWeek>;
}

function stripVocabPrefix(title: string): string {
    return title.replace(/^Say It & Spell It:\s*/i, "");
}

/** Title for the big Continue button: shortened, without the vocab-set prefix. */
export function formatRoadCtaTitle(title: string): string {
    return stripVocabPrefix(formatNextUpActivityTitle(title));
}

const VOCAB_ROUND_TITLES: Record<string, string> = {
    flashcards: "Flash Cards",
    matching: "Matching",
    "fill-blank": "Fill in the Blank",
};

/**
 * Title and detail line for a road row. The week heading already names the
 * week and its topic, so the row leads with what the learner does: vocab
 * rounds become "Flash Cards" over "Week 4 words", and a "Week 4:" or
 * "Week 4 Quiz —" prefix is dropped. `formatLabel` is the activity format
 * ("Quiz", "Game"); it is left out when the title already says it.
 */
export function formatRoadRowLabels(
    activity: Pick<RoadActivity, "title" | "vocabUi" | "weekNumber">,
    formatLabel: string
): { title: string; detail: string | null } {
    const vocabTitle = activity.vocabUi ? VOCAB_ROUND_TITLES[activity.vocabUi] : undefined;
    if (vocabTitle) {
        const detail = activity.weekNumber ? `Week ${activity.weekNumber} words` : "This week's words";
        return { title: vocabTitle, detail };
    }
    const title =
        activity.title
            .replace(/^Week \d+:\s*/i, "")
            .replace(/^Week \d+ Quiz\s*[—–-]\s*/i, "")
            .trim() || activity.title;
    const saysFormat = title.toLowerCase().includes(formatLabel.toLowerCase());
    return { title, detail: saysFormat ? null : formatLabel };
}

function toRoadActivity(
    activity: CourseMapActivity,
    weekNumber: number,
    progress: CourseMapProgressState,
    assignmentIds: Record<string, { assignmentId: string }>
): RoadActivity {
    let href: string | null = null;
    if (isMapActivityActionable(activity)) {
        const assignmentId = activity.activityId ? assignmentIds[activity.activityId]?.assignmentId : undefined;
        const base = buildMapActivityHref(activity, assignmentId);
        if (base) href = withReturnTo(base, buildMapReturnHref(weekNumber));
    }
    return {
        id: activity.id,
        title: formatNextUpActivityTitle(activity.title),
        activityType: activity.activityType,
        ...(activity.vocabUi ? { vocabUi: activity.vocabUi } : {}),
        weekNumber,
        href,
        done: isMapActivityCompleted(activity, progress),
        isNext: false,
    };
}

export function buildCourseMapRoad(options: BuildCourseMapRoadOptions): CourseMapRoadModel {
    const {
        outline,
        units,
        progress,
        currentWeek,
        assignmentIds = {},
        schedule,
    } = options;

    const visibleLevels = new Map(
        units.flatMap((unit) => unit.levels.map((level) => [level.levelNumber, level] as const))
    );

    const buildWeek = (
        unit: CourseMapOutlineUnit,
        cycle: number,
        outlineWeek: CourseMapOutlineUnit["weeks"][number]
    ): RoadWeek => {
        const { weekNumber } = outlineWeek;
        const level = visibleLevels.get(weekNumber);
        const scheduled = schedule?.get(weekNumber);
        const isCurrent = weekNumber === currentWeek;
        const isFuture = weekNumber > currentWeek;
        const isLocked = !level;

        const activities = (level?.requiredActivities ?? [])
            .filter((activity) => activity.status !== "planned")
            .map((activity) => toRoadActivity(activity, weekNumber, progress, assignmentIds));
        const practiceKey = (activity: CourseMapActivity) => `${activity.activityId ?? activity.href ?? activity.id}:${activity.vocabUi ?? ''}`;
        const requiredKeys = new Set((level?.requiredActivities ?? []).map(practiceKey));
        const extras = (level?.extraPractice ?? [])
            .filter((activity) => activity.status !== "planned" && !activity.vocabUi && !activity.activityId?.startsWith("vocab-") && !requiredKeys.has(practiceKey(activity)))
            .map((activity) => toRoadActivity(activity, weekNumber, progress, assignmentIds));

        const actionable = activities.filter((activity) => activity.href != null);
        const done = actionable.filter((activity) => activity.done).length;
        const total = actionable.length;
        const isDone = total > 0 && done === total;
        const next = actionable.find((activity) => !activity.done) ?? null;
        if (next) next.isNext = true;

        const state: RoadWeekState = isLocked
            ? "locked"
            : isCurrent
              ? "current"
              : isFuture
                ? "upcoming"
                : isDone
                  ? "done"
                  : "past";

        let note: string | null = null;
        if (state === "upcoming" && scheduled?.firstClassDate) {
            const classDay = dateOnlyToUtc(scheduled.firstClassDate);
            note = `Open now · class starts ${WEEKDAY_LONG[classDay.getUTCDay()]}`;
        }

        return {
            weekNumber,
            title: outlineWeek.title,
            unitNumber: unit.unitNumber,
            unitMonth: unit.month,
            cycle,
            state,
            isCurrent,
            isFuture,
            isLocked,
            dates: scheduled ? formatRoadWeekDates(scheduled.weekStart) : null,
            note,
            done,
            total,
            isDone,
            activities,
            extras,
            next,
        };
    };

    const roadUnits: RoadUnit[] = outline
        .filter((unit) => unit.weeks.length > 0)
        .map((unit) => {
            const cycle = cycleForUnit(unit);
            const weeks = unit.weeks.map((week) => buildWeek(unit, cycle, week));
            const first = weeks[0].weekNumber;
            const last = weeks[weeks.length - 1].weekNumber;
            const isPast = last < currentWeek;
            const isFuture = first > currentWeek;
            const isLocked = isFuture && weeks.every((week) => week.isLocked);
            const doneWeeks = weeks.filter((week) => week.isDone).length;

            let summary: string | null = null;
            if (isPast) {
                const all = doneWeeks === weeks.length ? " ✓" : "";
                summary = `Weeks ${first}–${last} · ${doneWeeks} of ${weeks.length} weeks done${all}`;
            } else if (isLocked) {
                summary = `${weeks.length} ${weeks.length === 1 ? "week" : "weeks"}`;
            }

            return {
                unitNumber: unit.unitNumber,
                title: unit.unitTitle,
                month: unit.month,
                cycle,
                weeks,
                isPast,
                isFuture,
                isLocked,
                doneWeeks,
                summary,
            };
        });

    const currentCycle =
        roadUnits.find((unit) => unit.weeks.some((week) => week.weekNumber === currentWeek))?.cycle ??
        roadUnits[0]?.cycle ??
        1;

    // Later cycles stay off the road until they start, so the map only ever
    // shows the stretch of the year the class has reached.
    const cycles: RoadCycle[] = COURSE_CYCLES.filter((def) => def.number <= currentCycle)
        .map((def) => {
            const cycleUnits = roadUnits.filter((unit) => unit.cycle === def.number);
            const weeks = cycleUnits.flatMap((unit) => unit.weeks);
            const isPast = def.number < currentCycle;
            const isCurrent = def.number === currentCycle;
            const doneWeeks = weeks.filter((week) => week.isDone).length;
            return {
                number: def.number,
                range: def.range,
                units: cycleUnits,
                isPast,
                isCurrent,
                summary: isPast ? `${doneWeeks} of ${weeks.length} weeks done` : null,
            };
        })
        .filter((cycle) => cycle.units.length > 0);

    return {
        cycles,
        weeks: cycles.flatMap((cycle) => cycle.units.flatMap((unit) => unit.weeks)),
        currentWeek,
    };
}
