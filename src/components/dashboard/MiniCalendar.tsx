
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
        <div className="bg-[#fdfbf8] w-full max-w-sm sm:w-72 sm:max-w-none p-4 sm:p-5 rounded-xl shadow-[0_5px_14px_rgba(52,43,34,0.06)] border border-[#e7dfd3]">
            {/* Month centered on top, arrows centered below (clean reference layout) */}
            <div className="flex flex-col items-center gap-2 mb-3">
                <h3 className="text-base sm:text-lg font-bold text-text font-display">
                    {monthNames[viewMonth]} {viewYear}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className="text-text-muted hover:text-text active:text-text p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-full hover:bg-white/60"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className="text-text-muted hover:text-text active:text-text p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-full hover:bg-white/60"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-[10px] font-bold text-text-muted/60 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                {days.map((day, idx) => {
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const flags = day ? eventsByDay.get(day) : undefined;
                    const hasDue = flags?.due;
                    const hasHoliday = flags?.holiday;
                    const hasOther = flags?.other;
                    const hasQuiz = flags?.quiz;

                    if (!day) return <div key={idx} />;

                    const baseClasses = isToday
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : 'text-text hover:bg-[#f4efe8]';

                    const eventClasses = hasQuiz
                        ? 'bg-[#dfece2] text-[#3f6a49] font-semibold'
                        : hasDue
                            ? 'bg-[#efe8db] text-[#7b6248] font-semibold'
                            : hasHoliday
                                ? 'bg-[#dfe8f3] text-[#4d6680] font-semibold'
                                : hasOther
                                    ? 'bg-[#ece7f4] text-[#685b7f] font-semibold'
                                    : '';

                    return (
                        <div
                            key={idx}
                            className={`
                                text-xs aspect-square w-full flex items-center justify-center rounded-full font-medium transition-colors cursor-default touch-manipulation
                                ${baseClasses}
                                ${!isToday ? eventClasses : ''}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-3 pt-2 border-t border-border/30 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Today</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6b9173] shrink-0" /> Quiz/Test</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#a98966] shrink-0" /> Due</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#738fb0] shrink-0" /> Holiday</span>
            </div>
        </div>
    );
};
