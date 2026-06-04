
"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { getLearnerEventTone } from '@/lib/learner-theme';

export type CalendarEvent = {
    id?: string;
    date: Date | string;
    endDate?: Date | string | null;
    type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
    title?: string | null;
    description?: string | null;
};

interface MiniCalendarProps {
    events?: CalendarEvent[];
    /** Tighter layout for dashboard sidebar */
    compact?: boolean;
    /** No inner card border (sidebar week rail) */
    flat?: boolean;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [], compact = false, flat = false }) => {
    const { resolvedTheme } = useTheme();
    const VIEW_DATE_STORAGE_KEY = 'dashboard-mini-calendar-view-date-v1';
    // Calculate today fresh on every render to avoid caching issues
    const today = new Date();

    const [viewDate, setViewDate] = useState(() => {
        if (typeof window !== 'undefined') {
            const raw = window.sessionStorage.getItem(VIEW_DATE_STORAGE_KEY);
            if (raw) {
                const saved = new Date(raw);
                if (!Number.isNaN(saved.getTime())) {
                    saved.setDate(1);
                    return saved;
                }
            }
        }
        const d = new Date();
        d.setDate(1);
        return d;
    });

    useEffect(() => {
        window.sessionStorage.setItem(VIEW_DATE_STORAGE_KEY, viewDate.toISOString());
    }, [viewDate]);

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
                            ? "text-sm font-semibold text-text tracking-tight"
                            : `text-[1.45rem] font-display font-bold tracking-tight ${
                                  resolvedTheme === "dark" ? "text-white" : "text-[#1f2633]"
                              }`
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
                            color: resolvedTheme === 'dark' ? 'rgba(226, 232, 240, 0.76)' : 'var(--text-color-muted)',
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
                            color: resolvedTheme === 'dark' ? 'rgba(226, 232, 240, 0.76)' : 'var(--text-color-muted)',
                        }}
                    >
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div
                className={
                    flat && compact
                        ? "p-0"
                        : compact
                            ? "rounded-xl border p-2.5"
                            : "dashboard-panel rounded-2xl p-4"
                }
                style={
                    flat && compact
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
                                ? "text-[9px] tracking-wide text-text-muted"
                                : `text-[10px] tracking-[0.16em] ${resolvedTheme === "dark" ? "text-gray-500" : "text-text-muted/80"}`
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

                        return (
                            <div
                                key={idx}
                                className={`${dayCellMinH} ${compact ? "rounded-md" : "rounded-lg"} border transition-colors cursor-default ${
                                    isToday
                                        ? 'text-[color:var(--text-on-accent)] border-primary shadow-sm'
                                        : 'text-text'
                                }`}
                                style={{
                                    background: isToday
                                        ? 'linear-gradient(180deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 88%, #000) 100%)'
                                        : 'linear-gradient(180deg, color-mix(in srgb, var(--dashboard-surface-start) 96%, var(--dashboard-shell-bg)) 0%, var(--dashboard-surface-end) 100%)',
                                    borderColor: isToday ? 'var(--color-primary)' : 'var(--dashboard-divider)',
                                }}
                            >
                                <div className="h-full flex flex-col items-center justify-center">
                                    <span className={`leading-none ${compact ? "text-[11px]" : "text-xs"} ${isToday ? "font-bold" : "font-medium"}`}>
                                        {day}
                                    </span>
                                    {!isToday && (hasQuiz || hasDue || hasHoliday || hasOther) && (
                                        <span className="mt-1 flex items-center gap-0.5" aria-hidden="true">
                                            {hasQuiz && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('quiz').accent }} />}
                                            {hasDue && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('due').accent }} />}
                                            {hasHoliday && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('holiday').accent }} />}
                                            {hasOther && <span className="w-2 h-2 rounded-full ring-1 ring-white/50 shadow-sm" style={{ backgroundColor: getLearnerEventTone('event').accent }} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                className={`flex flex-wrap items-center ${compact ? "mt-2 gap-1 text-[9px]" : "mt-4 gap-2 text-[11px]"}`}
                aria-hidden="true"
            >
                {(() => {
                    const chipClass = `inline-flex items-center rounded-full border ${compact ? "gap-1 px-1.5 py-0.5" : "gap-1.5 px-2 py-1"}`;
                    const dotClass = `${compact ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full ring-1 ring-white/50 shadow-sm shrink-0`;
                    const quizTone = getLearnerEventTone("quiz");
                    const dueTone = getLearnerEventTone("due");
                    const holidayTone = getLearnerEventTone("holiday");

                    return (
                        <>
                            <span
                                className={chipClass}
                                style={{
                                    backgroundColor: "color-mix(in srgb, var(--dashboard-shell-bg) 52%, var(--dashboard-surface-start))",
                                    borderColor: "var(--dashboard-divider)",
                                    color: "var(--text-color-muted)",
                                }}
                            >
                                <span className={`${dotClass} bg-primary`} />
                                Today
                            </span>
                            <span
                                className={chipClass}
                                style={{ backgroundColor: quizTone.bg, borderColor: quizTone.border, color: quizTone.text }}
                            >
                                <span className={dotClass} style={{ backgroundColor: quizTone.accent }} />
                                {compact ? "Quiz" : "Quiz/Test"}
                            </span>
                            <span
                                className={chipClass}
                                style={{ backgroundColor: dueTone.bg, borderColor: dueTone.border, color: dueTone.text }}
                            >
                                <span className={dotClass} style={{ backgroundColor: dueTone.accent }} />
                                Due
                            </span>
                            {!compact && (
                                <span
                                    className={chipClass}
                                    style={{ backgroundColor: holidayTone.bg, borderColor: holidayTone.border, color: holidayTone.text }}
                                >
                                    <span className={dotClass} style={{ backgroundColor: holidayTone.accent }} />
                                    Holiday
                                </span>
                            )}
                        </>
                    );
                })()}
            </div>
        </section>
    );
};
