
"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { getLearnerEventTone } from '@/lib/learner/theme';
import { getClassDayInfo } from '@/lib/class-days';

export type CalendarEvent = {
    id?: string;
    date: Date | string;
    endDate?: Date | string | null;
    type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
    title?: string | null;
    description?: string | null;
};

export const CALENDAR_VIEW_DATE_STORAGE_KEY = "dashboard-mini-calendar-view-date-v1";

export function startOfCalendarMonth(date: Date) {
    const next = new Date(date);
    next.setDate(1);
    next.setHours(0, 0, 0, 0);
    return next;
}

export function readStoredCalendarViewDate(): Date {
    if (typeof window !== "undefined") {
        const raw = window.sessionStorage.getItem(CALENDAR_VIEW_DATE_STORAGE_KEY);
        if (raw) {
            const saved = new Date(raw);
            if (!Number.isNaN(saved.getTime())) {
                return startOfCalendarMonth(saved);
            }
        }
    }
    return startOfCalendarMonth(new Date());
}

export function useCalendarViewDate() {
    const [viewDate, setViewDateState] = useState(() => startOfCalendarMonth(new Date()));
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setViewDateState(readStoredCalendarViewDate());
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        if (!hasHydrated) return;
        window.sessionStorage.setItem(CALENDAR_VIEW_DATE_STORAGE_KEY, viewDate.toISOString());
    }, [hasHydrated, viewDate]);

    const setViewDate = (next: Date) => setViewDateState(startOfCalendarMonth(next));
    return [viewDate, setViewDate] as const;
}

export function eventOverlapsMonth(event: CalendarEvent, viewDate: Date): boolean {
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : new Date(event.date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

    const rangeStart = start.getTime() <= end.getTime() ? start : end;
    const rangeEnd = start.getTime() <= end.getTime() ? end : start;
    const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    return rangeStart.getTime() <= monthEnd.getTime() && rangeEnd.getTime() >= monthStart.getTime();
}

interface MiniCalendarProps {
    events?: CalendarEvent[];
    /** Tighter layout for dashboard sidebar */
    compact?: boolean;
    /** No inner card around the grid, for when the calendar already sits in a card */
    flat?: boolean;
    viewDate?: Date;
    onViewDateChange?: (date: Date) => void;
    /** Practice log marks by day key (YYYY-MM-DD): how many logs (student) or students (teacher) that day. */
    practiceDays?: Record<string, number>;
    /** "check" for a learner's own days, "count" for how many students practiced. */
    practiceBadge?: 'check' | 'count';
    /** With this set, days are buttons that pick a day. */
    onSelectDay?: (dayKey: string) => void;
    selectedDayKey?: string | null;
}

export function toCalendarDayKey(year: number, monthIndex: number, day: number): string {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
    events = [],
    compact = false,
    flat = false,
    viewDate: viewDateProp,
    onViewDateChange,
    practiceDays,
    practiceBadge = 'check',
    onSelectDay,
    selectedDayKey,
}) => {
    const isControlled = viewDateProp !== undefined;
    // Calculate today fresh on every render to avoid caching issues
    const today = new Date();

    const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => startOfCalendarMonth(new Date()));
    const hasHydratedUncontrolled = React.useRef(false);

    useEffect(() => {
        if (isControlled) return;
        if (!hasHydratedUncontrolled.current) {
            hasHydratedUncontrolled.current = true;
            setUncontrolledViewDate(readStoredCalendarViewDate());
            return;
        }
        window.sessionStorage.setItem(CALENDAR_VIEW_DATE_STORAGE_KEY, uncontrolledViewDate.toISOString());
    }, [isControlled, uncontrolledViewDate]);

    const viewDate = isControlled ? startOfCalendarMonth(viewDateProp) : uncontrolledViewDate;
    const setViewDate = (next: Date) => {
        const normalized = startOfCalendarMonth(next);
        if (!isControlled) setUncontrolledViewDate(normalized);
        onViewDateChange?.(normalized);
    };

    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();

    // Get days in month
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null); // Empty slots
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate);

    const eventsByDay = new Map<number, { due: boolean; holiday: boolean; other: boolean; quiz: boolean }>();

    events.forEach((event) => {
        const start = new Date(event.date);
        const end = event.endDate ? new Date(event.endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

        const effectiveEnd = end.getTime() >= start.getTime() ? end : start;

        // mark every day in range within current month/year
        const cursor = new Date(start);
        while (cursor.getTime() <= effectiveEnd.getTime()) {
            if (cursor.getMonth() === viewMonth && cursor.getFullYear() === viewYear) {
                const day = cursor.getDate();
                const existing = eventsByDay.get(day) || { due: false, holiday: false, other: false, quiz: false };
                if (event.type === 'holiday') existing.holiday = true;
                else if (event.type === 'quiz') existing.quiz = true;
                else if (event.type === 'due' || event.type === 'reminder') existing.due = true;
                else existing.other = true;
                eventsByDay.set(day, existing);
            }
            cursor.setDate(cursor.getDate() + 1);
        }
    });

    const dayCellMinH = compact ? "min-h-[34px]" : "min-h-[44px] sm:min-h-[48px]";
    const emptyCellMinH = compact ? "min-h-[34px]" : "min-h-[44px] sm:min-h-[48px]";

    return (
        <section className="w-full" aria-label="Calendar">
            <div className={`flex items-center justify-between ${compact ? "mb-2.5" : "mb-4"}`}>
                <h3
                    className={
                        compact
                            ? "font-display text-sm font-bold text-text tracking-tight"
                            : "text-[1.45rem] font-display font-bold tracking-tight text-text"
                    }
                    style={{ textWrap: "balance" }}
                >
                    {monthLabel} {viewYear}
                </h3>
                <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className={`dashboard-soft-button inline-flex items-center justify-center rounded-xl border touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            compact ? "h-7 w-7 text-xs" : "h-9 w-9 rounded-2xl"
                        }`}
                        style={{
                            borderColor: 'color-mix(in srgb, var(--dashboard-divider) 82%, transparent)',
                            background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)',
                            color: 'var(--text-color-muted)',
                        }}
                    >
                        <span aria-hidden="true">←</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className={`dashboard-soft-button inline-flex items-center justify-center rounded-xl border touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            compact ? "h-7 w-7 text-xs" : "h-9 w-9 rounded-2xl"
                        }`}
                        style={{
                            borderColor: 'color-mix(in srgb, var(--dashboard-divider) 82%, transparent)',
                            background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)',
                            color: 'var(--text-color-muted)',
                        }}
                    >
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div
                className={
                    flat
                        ? "p-0"
                        : compact
                            ? "rounded-xl border p-2.5"
                            : "dashboard-panel rounded-2xl p-4"
                }
                style={
                    flat
                        ? undefined
                        : {
                              borderColor: "var(--dashboard-divider)",
                              background: compact
                                  ? "color-mix(in srgb, var(--dashboard-surface-start) 88%, var(--dashboard-shell-bg))"
                                  : "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
                          }
                }
            >
                <div className={`grid grid-cols-7 gap-0.5 text-center ${compact ? "mb-1.5" : "gap-1 mb-2"}`}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={`${day}-${idx}`} className={`font-semibold uppercase ${
                            compact
                                ? "text-[0.5625rem] tracking-wide text-text-muted"
                                : "text-[0.625rem] tracking-[0.16em] text-text-muted/80"
                        }`}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className={`grid grid-cols-7 text-center ${compact ? "gap-0.5" : "gap-1"}`}>
                    {days.map((day, idx) => {
                        const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                        const flags = day ? eventsByDay.get(day) : undefined;
                        const hasDue = flags?.due;
                        const hasHoliday = flags?.holiday;
                        const hasOther = flags?.other;
                        const hasQuiz = flags?.quiz;

                        if (!day) return <div key={idx} className={emptyCellMinH} />;

                        // Class days are drawn, not stored: Tue/Thu inside the term,
                        // minus the no-school closures, get a colored outline.
                        const classDay = getClassDayInfo(new Date(viewYear, viewMonth, day));
                        const isClassDay = classDay.meets;
                        const cancelledLabel = classDay.cancelledBy?.label;
                        const dayLabel = isClassDay
                            ? 'Class day'
                            : cancelledLabel
                                ? `No class — ${cancelledLabel}`
                                : undefined;

                        const dayKey = toCalendarDayKey(viewYear, viewMonth, day);
                        const practiced = practiceDays?.[dayKey] ?? 0;
                        const isSelected = selectedDayKey === dayKey;
                        const practiceLabel = practiced
                            ? practiceBadge === 'count'
                                ? `${practiced} ${practiced === 1 ? 'student' : 'students'} practiced`
                                : 'Practiced'
                            : undefined;
                        const Cell = onSelectDay ? 'button' : 'div';

                        return (
                            <Cell
                                key={idx}
                                {...(onSelectDay
                                    ? { type: 'button' as const, onClick: () => onSelectDay(dayKey), 'aria-pressed': isSelected }
                                    : {})}
                                title={[dayLabel, practiceLabel].filter(Boolean).join(' · ') || undefined}
                                className={`relative w-full p-0 ${dayCellMinH} ${compact ? "rounded-md" : "rounded-lg"} border transition-colors ${
                                    onSelectDay ? 'cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary' : 'cursor-default'
                                } ${isSelected ? 'ring-2 ring-primary/70 ring-offset-2 ring-offset-[color:var(--surface-elevated)]' : ''} ${
                                    isToday
                                        ? 'text-[color:var(--text-on-accent)] border-primary shadow-sm'
                                        : 'text-text'
                                }`}
                                style={{
                                    background: isToday
                                        ? 'linear-gradient(180deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 88%, #000) 100%)'
                                        : isClassDay
                                            ? 'linear-gradient(180deg, color-mix(in srgb, var(--tone-class-day-accent) 12%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-class-day-accent) 7%, var(--dashboard-surface-end)) 100%)'
                                            : 'linear-gradient(180deg, color-mix(in srgb, var(--dashboard-surface-start) 96%, var(--dashboard-shell-bg)) 0%, var(--dashboard-surface-end) 100%)',
                                    borderColor: isToday
                                        ? 'var(--color-primary)'
                                        : isClassDay
                                            ? 'var(--tone-class-day-accent)'
                                            : 'var(--dashboard-divider)',
                                    borderWidth: !isToday && isClassDay ? '2px' : undefined,
                                    boxShadow: isToday && isClassDay
                                        ? '0 0 0 2px color-mix(in srgb, var(--tone-class-day-accent) 70%, transparent)'
                                        : undefined,
                                }}
                            >
                                <div className="h-full flex flex-col items-center justify-center">
                                    <span className={`leading-none ${compact ? "text-[0.6875rem]" : "text-sm"} ${isToday || isClassDay ? "font-bold" : "font-medium"}`}>
                                        {day}
                                    </span>
                                    {onSelectDay && <span className="sr-only">{new Date(viewYear, viewMonth, day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>}
                                    {dayLabel && <span className="sr-only">{dayLabel}</span>}
                                    {practiceLabel && <span className="sr-only">{practiceLabel}</span>}
                                    {(practiced > 0 || (!isToday && (hasQuiz || hasDue || hasHoliday || hasOther))) && (
                                        <span className={`flex items-center gap-0.5 ${compact ? "mt-0.5" : "mt-1"}`} aria-hidden="true">
                                            {practiced > 0 && (
                                                <span
                                                    className={`flex items-center justify-center rounded-full font-bold leading-none ${
                                                        compact ? 'h-3 min-w-3 text-[0.5rem]' : 'h-4 min-w-4 px-0.5 text-[0.625rem]'
                                                    } ${isToday ? 'bg-[#fffdfa] text-emerald-800' : 'bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600'}`}
                                                >
                                                    {practiceBadge === 'count' ? practiced : <Check size={compact ? 8 : 11} strokeWidth={3.5} />}
                                                </span>
                                            )}
                                            {!isToday && hasQuiz && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('quiz').accent }} />}
                                            {!isToday && hasDue && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('due').accent }} />}
                                            {!isToday && hasHoliday && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('holiday').accent }} />}
                                            {!isToday && hasOther && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('event').accent }} />}
                                        </span>
                                    )}
                                </div>
                            </Cell>
                        );
                    })}
                </div>
            </div>

            {(() => {
                // Only the marks this month uses, so the key stays one short line.
                const monthFlags = [...eventsByDay.values()];
                const monthPrefix = toCalendarDayKey(viewYear, viewMonth, 1).slice(0, 8);
                const practicedThisMonth = Object.entries(practiceDays ?? {}).filter(([key, n]) => n > 0 && key.startsWith(monthPrefix)).length;
                const itemClass = "inline-flex items-center gap-1.5";
                const dotClass = `${compact ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full shrink-0`;
                const eventKeys = [
                    { show: monthFlags.some((f) => f.quiz), label: compact ? "Quiz" : "Quiz/Test", tone: getLearnerEventTone("quiz") },
                    { show: monthFlags.some((f) => f.due), label: "Due", tone: getLearnerEventTone("due") },
                    { show: monthFlags.some((f) => f.holiday), label: "Holiday", tone: getLearnerEventTone("holiday") },
                    { show: monthFlags.some((f) => f.other), label: "Event", tone: getLearnerEventTone("event") },
                ];

                return (
                    <div
                        className={`flex flex-wrap items-center text-text-muted ${compact ? "mt-2 gap-x-2.5 gap-y-1 text-[0.625rem]" : "mt-3 gap-x-4 gap-y-1.5 text-xs"}`}
                        aria-hidden="true"
                    >
                        <span className={itemClass}>
                            <span className={`${dotClass} bg-primary`} />
                            Today
                        </span>
                        <span className={itemClass}>
                            <span
                                className={`${compact ? "w-2 h-2" : "w-2.5 h-2.5"} rounded-[3px] border-2 shrink-0`}
                                style={{ borderColor: "var(--tone-class-day-accent)" }}
                            />
                            Class day
                        </span>
                        {practiceDays && (
                            <span className={`${itemClass} font-semibold text-emerald-800 dark:text-emerald-300`}>
                                <span className={`flex items-center justify-center rounded-full bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600 ${compact ? "h-3 w-3" : "h-4 w-4"}`}>
                                    <Check size={compact ? 8 : 11} strokeWidth={3.5} />
                                </span>
                                {practiceBadge === 'count'
                                    ? 'Students practiced'
                                    : practicedThisMonth > 0
                                        ? `I practiced: ${practicedThisMonth} ${practicedThisMonth === 1 ? 'day' : 'days'}`
                                        : 'I practiced'}
                            </span>
                        )}
                        {eventKeys.filter((key) => key.show).map((key) => (
                            <span key={key.label} className={itemClass}>
                                <span className={dotClass} style={{ backgroundColor: key.tone.accent }} />
                                {key.label}
                            </span>
                        ))}
                    </div>
                );
            })()}
        </section>
    );
};
