"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { getStudyLogKind, MAX_STUDY_LOG_LENGTH, STUDY_LOG_KINDS, type StudyLogKind } from "@/lib/learner/study-log";
import type { StudentStudyWeek } from "@/lib/learner/study-log-data";
import { refreshPracticeViews } from "@/app/dashboard/practice/actions";
import { StudyLogKindIcon } from "./StudyLogKindIcon";
import { StudyLogList } from "./StudyLogList";
import { StudyWeekDots } from "./StudyWeekDots";

type Saved = { text: string; pointsAwarded: number; goalBonus: number };

async function readError(res: Response): Promise<string> {
    const data = await res.json().catch(() => null);
    return typeof data?.error === "string" ? data.error : "Something went wrong. Try again.";
}

/** Pick what you did, write one sentence about it, save. */
export function StudyLogForm({ initial }: { initial: StudentStudyWeek }) {
    const inputId = useId();
    const [studyWeek, setStudyWeek] = useState(initial);
    const [kind, setKind] = useState<StudyLogKind>("watch");
    const [text, setText] = useState<string>(getStudyLogKind("watch").starter);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState<Saved | null>(null);

    // A fresh starter replaces the sentence only while the learner hasn't written past it.
    function pick(next: StudyLogKind) {
        const untouched = STUDY_LOG_KINDS.some((k) => text.trim() === k.starter.trim()) || !text.trim();
        setKind(next);
        if (untouched) setText(getStudyLogKind(next).starter);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (busy) return;
        if (text.trim() === getStudyLogKind(kind).starter.trim()) {
            setError("Finish the sentence. What did you do?");
            return;
        }
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/study-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kind, text }),
            });
            if (!res.ok) {
                setError(await readError(res));
                return;
            }
            const data = (await res.json()) as StudentStudyWeek & { pointsAwarded: number; goalBonus?: number };
            setStudyWeek({ week: data.week, entries: data.entries, goalDays: data.goalDays });
            setSaved({ text: text.trim(), pointsAwarded: data.pointsAwarded, goalBonus: data.goalBonus ?? 0 });
            // The log is saved; a failed refresh only means home shows it after a reload.
            refreshPracticeViews().catch(() => {});
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setBusy(false);
        }
    }

    function logAnother() {
        setSaved(null);
        setKind("listen");
        setText(getStudyLogKind("listen").starter);
    }

    if (saved) {
        const days = studyWeek.week.daysPracticed;
        const goal = studyWeek.goalDays;
        return (
            <div className="space-y-5">
                <div role="status" className="flex flex-col items-center gap-3 pt-6 text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600">
                        <Check size={42} strokeWidth={3} aria-hidden />
                    </span>
                    <h1 className="m-0 font-display text-3xl font-bold text-text">Nice work!</h1>
                    <p className="m-0 text-[1.0625rem] text-text">
                        {days >= goal ? (
                            <>
                                You reached your goal: <b>{goal} days</b> this week!
                            </>
                        ) : (
                            <>
                                <b>{days} of {goal} days</b> this week.
                            </>
                        )}
                    </p>
                    <p className="m-0 max-w-xs break-words text-base italic text-text-muted">&ldquo;{saved.text}&rdquo;</p>
                    <p className="m-0 max-w-xs text-sm text-text-muted">
                        {saved.goalBonus > 0
                            ? `+${saved.pointsAwarded} points, with a ${saved.goalBonus}-point bonus for reaching your goal!`
                            : `+${saved.pointsAwarded} points. Your streak keeps going.`}{" "}
                        Your teacher can see what you wrote.
                    </p>
                </div>
                <StudyWeekDots week={studyWeek.week} />
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={logAnother}
                        className="min-h-12 rounded-xl border-2! border-primary! bg-transparent! text-base font-bold text-primary-dark dark:text-primary-light"
                    >
                        Log something else
                    </button>
                    <Link href="/dashboard" className="flex min-h-12 items-center justify-center text-base font-bold text-text-muted">
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    const current = getStudyLogKind(kind);
    return (
        <div className="space-y-6">
            <form onSubmit={submit} className="space-y-5">
                <fieldset className="m-0 border-0 p-0">
                    <legend className="mb-1 font-display text-3xl font-bold text-text">What did you do?</legend>
                    <p className="m-0 mb-3 text-[0.9375rem] text-text-muted">Pick one. Any English practice counts!</p>
                    <div className="grid grid-cols-3 gap-2">
                        {STUDY_LOG_KINDS.map((k) => {
                            const on = k.id === kind;
                            return (
                                <button
                                    key={k.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => pick(k.id)}
                                    className={`flex min-h-[92px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-2 text-center ${
                                        on
                                            ? "border-[2.5px]! border-emerald-700! bg-emerald-50! dark:border-emerald-500! dark:bg-emerald-950/50!"
                                            : "border-[1.5px]! border-border! bg-surface-elevated!"
                                    }`}
                                >
                                    <StudyLogKindIcon kind={k.id} size={22} strokeWidth={2.2} className="text-emerald-800 dark:text-emerald-300" />
                                    <span className="text-base font-bold text-text">{k.label}</span>
                                    <span className="text-xs leading-tight text-text-muted">{k.example}</span>
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                <div className="space-y-1.5">
                    <label htmlFor={inputId} className="block text-base font-bold text-text">
                        Tell me in one sentence
                    </label>
                    <textarea
                        id={inputId}
                        rows={2}
                        value={text}
                        maxLength={MAX_STUDY_LOG_LENGTH}
                        onChange={(event) => setText(event.target.value)}
                        className="w-full resize-none rounded-xl border-2 border-border bg-surface-elevated p-3 text-[1.0625rem] text-text"
                    />
                    <p className="m-0 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                        Use V2: <b>{current.v2}</b>
                    </p>
                </div>

                <p role="status" aria-live="polite" className="m-0 text-sm font-semibold" style={{ color: "var(--error-color)" }}>
                    {error}
                </p>

                <button
                    type="submit"
                    disabled={busy || !text.trim()}
                    className="min-h-[52px] w-full rounded-xl bg-primary! text-[1.0625rem] font-bold text-[#fffdfa] disabled:opacity-50"
                >
                    {busy ? "Saving…" : "Save"}
                </button>
            </form>

            <section aria-labelledby="study-week-log-heading" className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                    <h2 id="study-week-log-heading" className="m-0 text-base font-bold text-text">
                        This week: {studyWeek.week.daysPracticed} of {studyWeek.goalDays} days
                    </h2>
                    <Link href="/dashboard/profile#practice-goal" className="shrink-0 text-sm font-bold text-primary-dark dark:text-primary-light">
                        Change goal
                    </Link>
                </div>
                <StudyWeekDots week={studyWeek.week} />
                <StudyLogList entries={studyWeek.entries} />
            </section>
        </div>
    );
}
