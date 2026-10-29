"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalendarMonthSplit } from "@/components/dashboard/CalendarMonthPanel";
import type { CalendarEvent } from "@/components/dashboard/MiniCalendar";
import type { StudyLogEntry, TeacherStudyRow } from "@/lib/learner/study-log";
import { EntryList } from "./StudyLogPanel";

function formatDay(dayKey: string): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });
}

/** The class calendar with how many students logged practice each day; tap a day to read and reply to what they wrote. */
export function TeacherPracticeCalendar({
    classId,
    events,
    practiceDays,
    todayKey,
    extraColumn,
}: {
    classId: string;
    events: CalendarEvent[];
    practiceDays: Record<string, number>;
    todayKey: string;
    extraColumn?: ReactNode;
}) {
    const [selected, setSelected] = useState(todayKey);
    const [rows, setRows] = useState<TeacherStudyRow[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setRows(null);
        setError(null);
        fetch(`/api/teacher/study-log?classId=${encodeURIComponent(classId)}&day=${selected}`)
            .then(async (res) => {
                const body = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok || !Array.isArray(body?.rows)) setError("Could not load practice logs.");
                else setRows(body.rows);
            })
            .catch(() => !cancelled && setError("Could not load practice logs."));
        return () => {
            cancelled = true;
        };
    }, [classId, selected]);

    function replaceEntry(updated: StudyLogEntry) {
        setRows((current) =>
            current?.map((row) => ({ ...row, entries: row.entries.map((entry) => (entry.id === updated.id ? updated : entry)) })) ?? null
        );
    }

    return (
        <CalendarMonthSplit
            events={events}
            allowDelete
            showSyncedLabel
            extraColumn={extraColumn}
            practice={{ practiceDays, practiceBadge: "count", onSelectDay: setSelected, selectedDayKey: selected }}
            renderDayPanel={(viewDate) => {
                const monthPrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-`;
                const monthDays = Object.keys(practiceDays).filter((dayKey) => dayKey.startsWith(monthPrefix)).length;
                const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });
                return (
                    <section aria-labelledby="practice-day-heading" aria-live="polite" className="space-y-3 text-sm">
                        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-text-muted">
                            Practice log · {monthName}: {monthDays} {monthDays === 1 ? "day" : "days"} with practice
                        </p>
                        <h2 id="practice-day-heading" className="m-0 font-display text-lg font-bold text-text">
                            {formatDay(selected)}
                        </h2>
                        {error ? (
                            <p role="alert" className="m-0 font-semibold text-error">{error}</p>
                        ) : rows == null ? (
                            <p className="m-0 text-text-muted">Loading…</p>
                        ) : rows.length === 0 ? (
                            <p className="m-0 text-text-muted">No one logged practice this day.</p>
                        ) : (
                            <ul className="m-0 list-none space-y-0 p-0">
                                {rows.map((row) => (
                                    <li key={row.studentId} className="space-y-1.5 border-b border-border py-2.5 last:border-b-0">
                                        <p className="m-0 font-semibold">{row.studentName}</p>
                                        <EntryList entries={row.entries} onUpdate={replaceEntry} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                );
            }}
        />
    );
}
