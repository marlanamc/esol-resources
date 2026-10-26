"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDaysToDayKey, CALENDAR_WEEK_DAY_NAMES } from "@/lib/gamification/calendar-week";
import { getStudyLogKind, STUDY_LOG_KINDS, type TeacherStudyRow } from "@/lib/learner/study-log";

type WeekData = { weekStart: string; isCurrentWeek: boolean; rows: TeacherStudyRow[] };

function formatDay(dayKey: string, options: Intl.DateTimeFormatOptions): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

/** Practice students logged from home (listen, watch, read, write, speak, other), one Mon–Sun week at a time. */
export function StudyLogPanel({ classId }: { classId: string }) {
    const [week, setWeek] = useState<string | null>(null);
    const [data, setData] = useState<WeekData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setData(null);
        setError(null);
        const query = `classId=${encodeURIComponent(classId)}${week ? `&week=${week}` : ""}`;
        fetch(`/api/teacher/study-log?${query}`)
            .then(async (res) => {
                const body = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok || !Array.isArray(body?.rows)) setError("Could not load practice logs.");
                else setData(body);
            })
            .catch(() => !cancelled && setError("Could not load practice logs."));
        return () => {
            cancelled = true;
        };
    }, [classId, week]);

    const weekStart = data?.weekStart ?? week;
    const logged = data?.rows.filter((row) => row.daysPracticed > 0).length ?? 0;

    return (
        <section className="workspace-panel space-y-4" aria-labelledby="study-log-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 id="study-log-heading" className="font-display text-xl font-bold">
                        Practice log
                    </h2>
                    <p className="text-sm text-text-muted">
                        {data == null ? "Loading…" : `${logged} of ${data.rows.length} students logged practice`}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="workspace-button"
                        onClick={() => weekStart && setWeek(addDaysToDayKey(weekStart, -7))}
                        disabled={!weekStart}
                        aria-label="Previous week"
                    >
                        <ChevronLeft size={16} aria-hidden />
                    </button>
                    <span className="min-w-[8.5rem] text-center text-sm font-semibold">
                        {data?.isCurrentWeek ? "This week" : weekStart ? `Week of ${formatDay(weekStart, { month: "short", day: "numeric" })}` : ""}
                    </span>
                    <button
                        type="button"
                        className="workspace-button"
                        onClick={() => weekStart && setWeek(addDaysToDayKey(weekStart, 7))}
                        disabled={!weekStart || data?.isCurrentWeek}
                        aria-label="Next week"
                    >
                        <ChevronRight size={16} aria-hidden />
                    </button>
                </div>
            </div>

            {error ? (
                <p role="alert" className="text-sm font-semibold text-error">
                    {error}
                </p>
            ) : null}

            {data && data.rows.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-text-muted">
                                <th scope="col" className="py-2 pr-3 font-semibold">Student</th>
                                {CALENDAR_WEEK_DAY_NAMES.map((name) => (
                                    <th key={name} scope="col" className="w-10 py-2 text-center font-semibold">
                                        <abbr title={name} className="no-underline">{name.slice(0, 3)}</abbr>
                                    </th>
                                ))}
                                <th scope="col" className="w-16 py-2 text-center font-semibold">Days / goal</th>
                                <th scope="col" className="py-2 pl-3 font-semibold">What they wrote</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row) => (
                                <tr key={row.studentId} className="border-b border-border align-top">
                                    <th scope="row" className="py-2.5 pr-3 text-left font-semibold">{row.studentName}</th>
                                    {row.days.map((kinds, i) => (
                                        <td key={CALENDAR_WEEK_DAY_NAMES[i]} className="py-2 text-center">
                                            <span
                                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                                    kinds.length
                                                        ? "bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600"
                                                        : "border-[1.5px] border-dashed border-border"
                                                }`}
                                                title={kinds.map((kind) => getStudyLogKind(kind).label).join(", ") || undefined}
                                            >
                                                {kinds.length ? getStudyLogKind(kinds[0]).letter : ""}
                                                {kinds.length > 1 ? "+" : ""}
                                                <span className="sr-only">
                                                    {kinds.length ? kinds.map((kind) => getStudyLogKind(kind).label).join(", ") : "none"}
                                                </span>
                                            </span>
                                        </td>
                                    ))}
                                    <td className="py-2.5 text-center whitespace-nowrap" title={`Goal: ${row.goalDays} days a week`}>
                                        <b>{row.daysPracticed}</b>
                                        <span className="text-text-muted"> / {row.goalDays}</span>
                                    </td>
                                    <td className="py-2.5 pl-3">
                                        {row.entries.length === 0 ? (
                                            <span className="italic text-text-muted">No practice logged</span>
                                        ) : row.entries.length === 1 ? (
                                            <span className="break-words">{row.entries[0].text}</span>
                                        ) : (
                                            <details>
                                                <summary className="cursor-pointer break-words">
                                                    {row.entries[0].text}{" "}
                                                    <span className="text-text-muted">+{row.entries.length - 1} more</span>
                                                </summary>
                                                <ul className="m-0 mt-1.5 list-none space-y-1 p-0">
                                                    {row.entries.slice(1).map((entry) => (
                                                        <li key={entry.id} className="break-words">
                                                            <span className="text-text-muted">
                                                                {formatDay(entry.dayKey, { weekday: "short" })} · {getStudyLogKind(entry.kind).label}:
                                                            </span>{" "}
                                                            {entry.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-xs text-text-muted">
                        {STUDY_LOG_KINDS.map((kind) => `${kind.letter} ${kind.label}`).join(" · ")} · + more than one that day
                    </p>
                </div>
            ) : data ? (
                <p className="text-sm text-text-muted">No students in this class yet.</p>
            ) : null}
        </section>
    );
}
