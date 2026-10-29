"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Pencil, ThumbsUp, Undo2 } from "lucide-react";
import { addDaysToDayKey, CALENDAR_WEEK_DAY_NAMES } from "@/lib/gamification/calendar-week";
import {
    diffRecastWords,
    getStudyLogKind,
    MAX_STUDY_LOG_LENGTH,
    STUDY_LOG_KINDS,
    type StudyLogEntry,
    type StudyLogKind,
    type TeacherStudyRow,
} from "@/lib/learner/study-log";

type WeekData = { weekStart: string; isCurrentWeek: boolean; rows: TeacherStudyRow[] };
type ReplyBody = { kind: "recast"; text: string } | { kind: "praise" } | { kind: "clear" };

/** Entries shown before "Show N more". */
const VISIBLE_ENTRIES = 2;

function formatDay(dayKey: string, options: Intl.DateTimeFormatOptions): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

/** Practice students logged from home (listen, watch, read, write, speak, other), one Mon–Sun week at a time, with a reply on each sentence. */
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

    function replaceEntry(updated: StudyLogEntry) {
        setData((current) =>
            current && {
                ...current,
                rows: current.rows.map((row) => ({
                    ...row,
                    entries: row.entries.map((entry) => (entry.id === updated.id ? updated : entry)),
                })),
            }
        );
    }

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
                <>
                    <p className="text-xs text-text-muted">
                        Correct: rewrite the sentence the right way. The student sees it under theirs with the changed words in bold. Points don&apos;t change.
                    </p>

                    {/* Phones: one card per student. */}
                    <ul className="m-0 list-none space-y-0 p-0 md:hidden">
                        {data.rows.map((row) => (
                            <li key={row.studentId} className="space-y-2 border-b border-border py-3">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="font-semibold">{row.studentName}</span>
                                    <span className="whitespace-nowrap text-sm" title={`Goal: ${row.goalDays} days a week`}>
                                        <b>{row.daysPracticed}</b>
                                        <span className="text-text-muted"> / {row.goalDays} days</span>
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {row.days.map((kinds, i) => (
                                        <DayDot key={CALENDAR_WEEK_DAY_NAMES[i]} kinds={kinds} dayName={CALENDAR_WEEK_DAY_NAMES[i]} size="sm" />
                                    ))}
                                </div>
                                <EntryList entries={row.entries} onUpdate={replaceEntry} />
                            </li>
                        ))}
                    </ul>

                    {/* Wider screens: the week as a table. */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full border-collapse text-sm">
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
                                                <DayDot kinds={kinds} dayName={CALENDAR_WEEK_DAY_NAMES[i]} />
                                            </td>
                                        ))}
                                        <td className="py-2.5 text-center whitespace-nowrap" title={`Goal: ${row.goalDays} days a week`}>
                                            <b>{row.daysPracticed}</b>
                                            <span className="text-text-muted"> / {row.goalDays}</span>
                                        </td>
                                        <td className="min-w-[20rem] py-2.5 pl-3">
                                            <EntryList entries={row.entries} onUpdate={replaceEntry} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-text-muted">
                        {STUDY_LOG_KINDS.map((kind) => `${kind.letter} ${kind.label}`).join(" · ")} · + more than one that day
                    </p>
                </>
            ) : data ? (
                <p className="text-sm text-text-muted">No students in this class yet.</p>
            ) : null}
        </section>
    );
}

function DayDot({ kinds, dayName, size = "md" }: { kinds: StudyLogKind[]; dayName: string; size?: "sm" | "md" }) {
    const labels = kinds.map((kind) => getStudyLogKind(kind).label).join(", ");
    return (
        <span
            className={`mx-auto flex items-center justify-center rounded-full font-bold ${size === "sm" ? "h-6 w-6 text-[0.625rem]" : "h-8 w-8 text-xs"} ${
                kinds.length ? "bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600" : "border-[1.5px] border-dashed border-border"
            }`}
            title={`${dayName}: ${labels || "none"}`}
        >
            {kinds.length ? getStudyLogKind(kinds[0]).letter : ""}
            {kinds.length > 1 ? "+" : ""}
            <span className="sr-only">
                {dayName}: {labels || "none"}
            </span>
        </span>
    );
}

/** A student's sentences for the week, newest first; past VISIBLE_ENTRIES they fold under "Show N more". */
function EntryList({ entries, onUpdate }: { entries: StudyLogEntry[]; onUpdate: (entry: StudyLogEntry) => void }) {
    if (entries.length === 0) return <span className="text-sm italic text-text-muted">No practice logged</span>;
    const shown = entries.slice(0, VISIBLE_ENTRIES);
    const rest = entries.slice(VISIBLE_ENTRIES);
    return (
        <div className="space-y-2.5">
            <ul className="m-0 list-none space-y-2.5 p-0">
                {shown.map((entry) => (
                    <EntryItem key={entry.id} entry={entry} onUpdate={onUpdate} />
                ))}
            </ul>
            {rest.length > 0 ? (
                <details>
                    <summary className="cursor-pointer text-sm font-semibold text-primary">Show {rest.length} more</summary>
                    <ul className="m-0 mt-2.5 list-none space-y-2.5 p-0">
                        {rest.map((entry) => (
                            <EntryItem key={entry.id} entry={entry} onUpdate={onUpdate} />
                        ))}
                    </ul>
                </details>
            ) : null}
        </div>
    );
}

/** One sentence with its reply, or Correct / thumbs-up buttons when there is none. */
function EntryItem({ entry, onUpdate }: { entry: StudyLogEntry; onUpdate: (entry: StudyLogEntry) => void }) {
    const inputId = useId();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(entry.text);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function send(body: ReplyBody) {
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/teacher/study-log/reply", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logId: entry.id, ...body }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.entry) {
                setError(typeof data?.error === "string" ? data.error : "Could not save. Try again.");
                return;
            }
            onUpdate(data.entry);
            setEditing(false);
        } catch {
            setError("Could not save. Try again.");
        } finally {
            setBusy(false);
        }
    }

    function startEditing() {
        setDraft(entry.reply?.kind === "recast" && entry.reply.text ? entry.reply.text : entry.text);
        setError(null);
        setEditing(true);
    }

    function submit(event: FormEvent) {
        event.preventDefault();
        send({ kind: "recast", text: draft });
    }

    const reply = entry.reply;
    const smallButton = "inline-flex min-h-9 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-semibold disabled:opacity-50";
    return (
        <li className="space-y-1.5">
            <p className="m-0 break-words">
                <span className="text-text-muted">
                    {formatDay(entry.dayKey, { weekday: "short" })} · {getStudyLogKind(entry.kind).label}:
                </span>{" "}
                {entry.text}
            </p>

            {editing ? (
                <form onSubmit={submit} className="space-y-1.5">
                    <label htmlFor={inputId} className="sr-only">
                        Corrected sentence
                    </label>
                    <textarea
                        id={inputId}
                        rows={2}
                        value={draft}
                        maxLength={MAX_STUDY_LOG_LENGTH}
                        onChange={(event) => setDraft(event.target.value)}
                        className="w-full resize-y rounded-lg border-2 border-border bg-surface-elevated p-2 text-sm"
                        autoFocus
                    />
                    <div className="flex flex-wrap gap-1.5">
                        <button type="submit" disabled={busy || !draft.trim()} className="workspace-button workspace-button-primary">
                            {busy ? "Sending…" : "Send correction"}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} disabled={busy} className="workspace-button">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : reply ? (
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-950/40">
                    <p className="m-0 min-w-0 flex-1 break-words">
                        {reply.kind === "recast" && reply.text ? (
                            <>
                                <span className="font-semibold text-emerald-900 dark:text-emerald-200">You: </span>
                                {diffRecastWords(entry.text, reply.text).map((part, i) => (
                                    <span key={i}>
                                        {part.space ? " " : ""}
                                        {part.changed ? <b>{part.word}</b> : part.word}
                                    </span>
                                ))}
                            </>
                        ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-900 dark:text-emerald-200">
                                <ThumbsUp size={14} aria-hidden /> You: Great sentence!
                            </span>
                        )}
                        <span className="ml-1.5 whitespace-nowrap text-xs text-text-muted">
                            {reply.seen ? (
                                <>
                                    <Check size={12} className="inline" aria-hidden /> Read
                                </>
                            ) : (
                                "Not read yet"
                            )}
                        </span>
                    </p>
                    <span className="flex gap-1">
                        <button type="button" onClick={startEditing} disabled={busy} className={smallButton} aria-label="Edit reply">
                            <Pencil size={13} aria-hidden />
                        </button>
                        <button type="button" onClick={() => send({ kind: "clear" })} disabled={busy} className={smallButton} aria-label="Remove reply">
                            <Undo2 size={13} aria-hidden />
                        </button>
                    </span>
                </div>
            ) : (
                <div className="flex flex-wrap gap-1.5">
                    <button type="button" onClick={startEditing} disabled={busy} className={smallButton}>
                        <Pencil size={13} aria-hidden /> Correct
                    </button>
                    <button type="button" onClick={() => send({ kind: "praise" })} disabled={busy} className={smallButton}>
                        <ThumbsUp size={13} aria-hidden /> Great sentence
                    </button>
                </div>
            )}

            {error ? (
                <p role="alert" className="m-0 text-xs font-semibold text-error">
                    {error}
                </p>
            ) : null}
        </li>
    );
}
