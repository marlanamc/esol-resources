
"use client";

import React, { useState } from 'react';

export type CalendarEvent = {
    id?: string;
    date: Date | string;
    endDate?: Date | string | null;
    type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
    title?: string | null;
};

interface MiniCalendarProps {
    events?: CalendarEvent[];
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [] }) => {
    // Calculate today fresh on every render to avoid caching issues
    const today = new Date();

    const [viewDate, setViewDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

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

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
                <h3 className="text-[1.45rem] font-display font-bold tracking-tight text-text">
                    {monthNames[viewMonth]} {viewYear}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-white text-text-muted transition-colors hover:text-text hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <span aria-hidden="true">←</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-white text-text-muted transition-colors hover:text-text hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-white/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(28,35,44,0.06)]">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={`${day}-${idx}`} className="text-[10px] font-semibold text-text-muted/80 uppercase tracking-[0.16em]">
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

                        if (!day) return <div key={idx} className="h-10 sm:h-11" />;

                        return (
                            <div
                                key={idx}
                                className={`h-10 sm:h-11 rounded-lg border transition-colors cursor-default ${
                                    isToday
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-white border-transparent text-text hover:bg-bg-light/70'
                                }`}
                            >
                                <div className="h-full flex flex-col items-center justify-center">
                                    <span className={`text-xs leading-none ${isToday ? 'font-bold' : 'font-medium'}`}>
                                        {day}
                                    </span>
                                    {!isToday && (hasQuiz || hasDue || hasHoliday || hasOther) && (
                                        <span className="mt-1 flex items-center gap-1">
                                            {hasQuiz && <span className="w-1.5 h-1.5 rounded-full bg-[#5f8267]" />}
                                            {hasDue && <span className="w-1.5 h-1.5 rounded-full bg-[#a98966]" />}
                                            {hasHoliday && <span className="w-1.5 h-1.5 rounded-full bg-[#6d89ac]" />}
                                            {hasOther && <span className="w-1.5 h-1.5 rounded-full bg-[#7c6c98]" />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-border/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Today
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-border/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5f8267] shrink-0" /> Quiz/Test
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-border/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a98966] shrink-0" /> Due
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-border/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6d89ac] shrink-0" /> Holiday
                </span>
            </div>
        </section>
    );
};
