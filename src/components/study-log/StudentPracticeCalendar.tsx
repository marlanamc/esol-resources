"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CalendarMonthSplit } from "@/components/dashboard/CalendarMonthPanel";
import type { CalendarEvent } from "@/components/dashboard/MiniCalendar";
import type { StudyLogEntry } from "@/lib/learner/study-log";
import { StudyLogList } from "./StudyLogList";
import { STUDY_LOG_HREF } from "./StudyWeekCard";

function formatDay(dayKey: string): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });
}

/** The learner's calendar with a check on every day they logged practice; tap a day to read what they wrote and their teacher's replies. */
export function StudentPracticeCalendar({ events, entries, todayKey }: { events: CalendarEvent[]; entries: StudyLogEntry[]; todayKey: string }) {
    const [selected, setSelected] = useState(todayKey);
    const byDay = useMemo(() => {
        const map = new Map<string, StudyLogEntry[]>();
        for (const entry of entries) map.set(entry.dayKey, [...(map.get(entry.dayKey) ?? []), entry]);
        return map;
    }, [entries]);
    const practiceDays = useMemo(() => Object.fromEntries([...byDay].map(([dayKey, list]) => [dayKey, list.length])), [byDay]);

    return (
        <CalendarMonthSplit
            events={events}
            practice={{ practiceDays, practiceBadge: "check", onSelectDay: setSelected, selectedDayKey: selected }}
            renderDayPanel={(viewDate) => {
                const monthPrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-`;
                const monthDays = [...byDay.keys()].filter((dayKey) => dayKey.startsWith(monthPrefix)).length;
                const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });
                const dayEntries = byDay.get(selected) ?? [];
                return (
                    <section aria-labelledby="practice-day-heading" aria-live="polite" className="space-y-3">
                        <p className="m-0 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                            {monthDays === 0
                                ? `${monthName}: no practice logged yet`
                                : `${monthName}: you practiced ${monthDays} ${monthDays === 1 ? "day" : "days"}`}
                        </p>
                        <h2 id="practice-day-heading" className="m-0 font-display text-lg font-bold text-text">
                            {selected === todayKey ? `Today, ${formatDay(selected).split(", ")[1]}` : formatDay(selected)}
                        </h2>
                        {dayEntries.length > 0 ? (
                            <StudyLogList entries={dayEntries} />
                        ) : (
                            <p className="m-0 text-base text-text-muted">
                                {selected > todayKey ? "This day hasn't happened yet." : selected === todayKey ? "Nothing logged yet today." : "No practice logged this day."}
                            </p>
                        )}
                        {selected === todayKey ? (
                            <Link
                                href={STUDY_LOG_HREF}
                                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-base font-bold text-[#fffdfa] no-underline"
                            >
                                <Plus size={17} strokeWidth={2.6} aria-hidden />
                                Log my practice
                            </Link>
                        ) : null}
                    </section>
                );
            }}
        />
    );
}
