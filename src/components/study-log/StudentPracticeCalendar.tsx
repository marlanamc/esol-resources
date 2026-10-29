"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CalendarMonthSplit } from "@/components/dashboard/CalendarMonthPanel";
import { toCalendarDayKey, type CalendarEvent } from "@/components/dashboard/MiniCalendar";
import { getClassDayInfoForKey } from "@/lib/class-days";
import { getLearnerEventTone } from "@/lib/learner/theme";
import type { StudyLogEntry } from "@/lib/learner/study-log";
import { StudyLogList } from "./StudyLogList";
import { STUDY_LOG_HREF } from "./StudyWeekCard";

function formatDay(dayKey: string, options: Intl.DateTimeFormatOptions): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

function localDayKey(value: Date | string): string {
    const date = new Date(value);
    return toCalendarDayKey(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Events that fall on this day, read the same way the calendar grid places them. */
function eventsOnDay(events: CalendarEvent[], dayKey: string): CalendarEvent[] {
    return events.filter((event) => {
        if (Number.isNaN(new Date(event.date).getTime())) return false;
        const start = localDayKey(event.date);
        const end = event.endDate ? localDayKey(event.endDate) : start;
        return dayKey >= start && dayKey <= (end >= start ? end : start);
    });
}

/** The learner's calendar with a check on every day they logged practice; tap a day to see its class info, dates, what they wrote and their teacher's replies. */
export function StudentPracticeCalendar({
    events,
    entries,
    todayKey,
    initialDayKey,
}: {
    events: CalendarEvent[];
    entries: StudyLogEntry[];
    todayKey: string;
    /** Day to open on, e.g. from a day tapped on the Home calendar. */
    initialDayKey?: string;
}) {
    const [selected, setSelected] = useState(initialDayKey ?? todayKey);
    const byDay = useMemo(() => {
        const map = new Map<string, StudyLogEntry[]>();
        for (const entry of entries) map.set(entry.dayKey, [...(map.get(entry.dayKey) ?? []), entry]);
        return map;
    }, [entries]);
    const practiceDays = useMemo(() => Object.fromEntries([...byDay].map(([dayKey, list]) => [dayKey, list.length])), [byDay]);

    const dayEntries = byDay.get(selected) ?? [];
    const dayEvents = eventsOnDay(events, selected);
    const classDay = getClassDayInfoForKey(selected);
    const isToday = selected === todayKey;

    return (
        <CalendarMonthSplit
            events={events}
            practice={{ practiceDays, practiceBadge: "check", onSelectDay: setSelected, selectedDayKey: selected }}
            renderDayPanel={() => (
                <section aria-labelledby="practice-day-heading" aria-live="polite" className="space-y-3">
                    <div>
                        <p className="m-0 text-xs font-bold uppercase tracking-wide text-text-muted">
                            {isToday ? `Today · ${formatDay(selected, { weekday: "long" })}` : formatDay(selected, { weekday: "long" })}
                        </p>
                        <h2 id="practice-day-heading" className="m-0 font-display text-xl font-bold text-text">
                            {formatDay(selected, { month: "long", day: "numeric" })}
                        </h2>
                    </div>

                    {classDay.meets || classDay.cancelledBy || dayEvents.length > 0 ? (
                        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                            {classDay.meets ? (
                                <li
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                                    style={{ borderColor: "var(--tone-class-day-accent)", color: "var(--tone-class-day-text)" }}
                                >
                                    <span className="h-2.5 w-2.5 rounded-[3px] border-2" style={{ borderColor: "var(--tone-class-day-accent)" }} aria-hidden />
                                    Class day
                                </li>
                            ) : classDay.cancelledBy ? (
                                <li className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-text-muted">
                                    No class: {classDay.cancelledBy.label}
                                </li>
                            ) : null}
                            {dayEvents.map((event, idx) => {
                                const tone = getLearnerEventTone(event.type || "due");
                                return (
                                    <li
                                        key={event.id ?? `${event.title}-${idx}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                                        style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}
                                    >
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tone.accent }} aria-hidden />
                                        {event.title}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}

                    <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                        <h3 className="m-0 text-sm font-bold text-emerald-800 dark:text-emerald-300">My practice</h3>
                        {dayEntries.length > 0 ? (
                            <StudyLogList entries={dayEntries} />
                        ) : (
                            <p className="m-0 text-base text-text-muted">
                                {selected > todayKey ? "This day hasn't happened yet." : isToday ? "Nothing logged yet today." : "No practice logged this day."}
                            </p>
                        )}
                        {isToday ? (
                            <Link
                                href={STUDY_LOG_HREF}
                                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-base font-bold text-[#fffdfa] no-underline"
                            >
                                <Plus size={17} strokeWidth={2.6} aria-hidden />
                                {dayEntries.length > 0 ? "Log more practice" : "Log my practice"}
                            </Link>
                        ) : null}
                    </div>
                </section>
            )}
        />
    );
}
