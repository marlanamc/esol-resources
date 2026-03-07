
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
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [] }) => {
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

    return (
        <section className="w-full" aria-label="Calendar">
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-[1.45rem] font-display font-bold tracking-tight ${
                    resolvedTheme === 'dark' ? 'text-white' : 'text-[#1f2633]'
                }`} style={{ textWrap: 'balance' }}>
                    {monthLabel} {viewYear}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-border touch-manipulation focus-visible:outline-none focus-visible:ring-2 ${
                            resolvedTheme === 'dark'
                                ? 'border-white/10 bg-[#1e3a4d] text-gray-400 hover:text-white focus-visible:ring-primary-light/40'
                                : 'border-border/70 bg-white text-text-muted hover:text-text focus-visible:ring-primary/40'
                        }`}
                    >
                        <span aria-hidden="true">←</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-border touch-manipulation focus-visible:outline-none focus-visible:ring-2 ${
                            resolvedTheme === 'dark'
                                ? 'border-white/10 bg-[#1e3a4d] text-gray-400 hover:text-white focus-visible:ring-primary-light/40'
                                : 'border-border/70 bg-white text-text-muted hover:text-text focus-visible:ring-primary/40'
                        }`}
                    >
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div className={`rounded-xl border p-3 sm:p-4 ${
                resolvedTheme === 'dark'
                    ? 'border-white/10 bg-gradient-to-b from-[#162b3d] to-[#0d1620] shadow-[0_3px_10px_rgba(13,22,32,0.3)]'
                    : 'border-[#d9cec0] bg-gradient-to-b from-white to-[#fcf8f2] shadow-[0_3px_10px_rgba(43,33,24,0.08)]'
            }`}>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={`${day}-${idx}`} className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            resolvedTheme === 'dark' ? 'text-gray-500' : 'text-text-muted/80'
                        }`}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map((day, idx) => {
                        const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                        const flags = day ? eventsByDay.get(day) : undefined;
                        const hasDue = flags?.due;
                        const hasHoliday = flags?.holiday;
                        const hasOther = flags?.other;
                        const hasQuiz = flags?.quiz;

                        if (!day) return <div key={idx} className="min-h-[44px] sm:min-h-[48px]" />;

                        return (
                            <div
                                key={idx}
                                className={`min-h-[44px] sm:min-h-[48px] rounded-lg border transition-colors cursor-default ${
                                    isToday
                                        ? 'text-[color:var(--text-on-accent)] border-primary shadow-sm'
                                        : 'text-text'
                                }`}
                                style={{
                                    backgroundColor: isToday ? 'var(--color-primary)' : 'var(--surface-elevated)',
                                    borderColor: isToday ? 'var(--color-primary)' : 'var(--border-subtle)',
                                }}
                            >
                                <div className="h-full flex flex-col items-center justify-center">
                                    <span className={`text-xs leading-none ${isToday ? 'font-bold' : 'font-medium'}`}>
                                        {day}
                                    </span>
                                    {!isToday && (hasQuiz || hasDue || hasHoliday || hasOther) && (
                                        <span className="mt-1 flex items-center gap-1" aria-hidden="true">
                                            {hasQuiz && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLearnerEventTone('quiz').accent }} />}
                                            {hasDue && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLearnerEventTone('due').accent }} />}
                                            {hasHoliday && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLearnerEventTone('holiday').accent }} />}
                                            {hasOther && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLearnerEventTone('event').accent }} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-color-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Today
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ backgroundColor: getLearnerEventTone('quiz').bg, borderColor: getLearnerEventTone('quiz').border, color: getLearnerEventTone('quiz').text }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getLearnerEventTone('quiz').accent }} /> Quiz/Test
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ backgroundColor: getLearnerEventTone('due').bg, borderColor: getLearnerEventTone('due').border, color: getLearnerEventTone('due').text }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getLearnerEventTone('due').accent }} /> Due
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ backgroundColor: getLearnerEventTone('holiday').bg, borderColor: getLearnerEventTone('holiday').border, color: getLearnerEventTone('holiday').text }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getLearnerEventTone('holiday').accent }} /> Holiday
                </span>
            </div>
        </section>
    );
};
