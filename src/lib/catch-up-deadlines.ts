/**
 * Make-up deadline helpers for the absent-student catch-up plan.
 * Default policy: Monday 6:00 PM local time after the week containing the due date.
 */

export type DueDisplayTone = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'makeup';

export interface DueDisplayMeta {
    label: string;
    tone: DueDisplayTone;
}

const MAKE_UP_HOUR = 18;
const MAKE_UP_MINUTE = 0;

function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function withMakeUpTime(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(MAKE_UP_HOUR, MAKE_UP_MINUTE, 0, 0);
    return copy;
}

/** Monday 6pm on or after the week that contains `dueDate`. */
export function getMakeUpDeadlineForDueDate(dueDate: Date): Date {
    const anchor = startOfDay(dueDate instanceof Date ? dueDate : new Date(dueDate));
    const day = anchor.getDay();
    const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
    const target = new Date(anchor);
    target.setDate(anchor.getDate() + daysUntilMonday);
    return withMakeUpTime(target);
}

/** Upcoming Monday 6pm used for the current catch-up window. */
export function getCurrentMakeUpDeadline(now = new Date()): Date {
    const today = startOfDay(now);
    const mondayThisWeek = withMakeUpTime(today);
    const day = today.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    mondayThisWeek.setDate(today.getDate() - daysFromMonday);

    if (now.getTime() <= mondayThisWeek.getTime()) {
        return mondayThisWeek;
    }

    const nextMonday = new Date(mondayThisWeek);
    nextMonday.setDate(mondayThisWeek.getDate() + 7);
    return nextMonday;
}

export function isWithinMakeUpWindow(dueDate: Date | string | null | undefined, now = new Date()): boolean {
    if (!dueDate) {
        return now.getTime() <= getCurrentMakeUpDeadline(now).getTime();
    }

    const parsed = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
        return now.getTime() <= getCurrentMakeUpDeadline(now).getTime();
    }

    return now.getTime() <= getMakeUpDeadlineForDueDate(parsed).getTime();
}

export function formatMakeUpDeadlineLabel(deadline: Date): string {
    const formatted = deadline.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    return `Make-up due ${formatted}`;
}

function formatDueDate(date: Date): string | null {
    const formatted = date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    return formatted || null;
}

export function getAssignmentDueDisplay(
    dueDate: string | Date | null | undefined,
    now = new Date()
): DueDisplayMeta | null {
    const makeupDeadline = dueDate
        ? getMakeUpDeadlineForDueDate(dueDate instanceof Date ? dueDate : new Date(dueDate))
        : getCurrentMakeUpDeadline(now);
    const makeupLabel = formatMakeUpDeadlineLabel(makeupDeadline);

    if (!dueDate) {
        if (now.getTime() <= makeupDeadline.getTime()) {
            return { label: makeupLabel, tone: 'makeup' };
        }
        return { label: 'Past make-up window', tone: 'overdue' };
    }

    const date = dueDate instanceof Date ? new Date(dueDate) : new Date(dueDate);
    if (Number.isNaN(date.getTime())) {
        return { label: makeupLabel, tone: 'makeup' };
    }

    const today = startOfDay(now);
    const dueDay = startOfDay(date);
    const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86_400_000);
    const formatted = formatDueDate(date);

    if (diffDays < 0) {
        if (isWithinMakeUpWindow(date, now)) {
            return { label: makeupLabel, tone: 'makeup' };
        }
        return { label: formatted ? `Overdue · ${formatted}` : 'Overdue', tone: 'overdue' };
    }

    if (diffDays === 0) {
        return { label: 'Due today', tone: 'today' };
    }

    if (diffDays === 1) {
        return { label: 'Due tomorrow', tone: 'tomorrow' };
    }

    if (formatted) {
        return { label: formatted, tone: 'upcoming' };
    }

    return { label: makeupLabel, tone: 'makeup' };
}

export function isAssignmentRequired(isRequired: boolean | undefined | null): boolean {
    return isRequired === true;
}

/** Student dashboard catch-up card — enable in September via NEXT_PUBLIC_ENABLE_CATCH_UP_CARD=true */
export const isCatchUpCardEnabled = process.env.NEXT_PUBLIC_ENABLE_CATCH_UP_CARD === 'true';
