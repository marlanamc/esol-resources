"use client";

import { useState } from "react";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { getCalendarWeekStartDayKey } from "@/lib/gamification/calendar-week";
import { getStudyLogKind, type StudyJournal } from "@/lib/learner/study-log";

const VISIBLE_WEEKS = 3;

function formatDay(dayKey: string, options: Intl.DateTimeFormatOptions): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

/** Every sentence the learner wrote in the practice log, a week at a time, newest first. */
export function ProfileStudyJournal({ journal }: { journal: StudyJournal }) {
    const [showAll, setShowAll] = useState(false);
    const thisWeek = getCalendarWeekStartDayKey();
    const weeks = showAll ? journal.weeks : journal.weeks.slice(0, VISIBLE_WEEKS);

    return (
        <section aria-labelledby="profile-journal-heading" className="space-y-4 rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-800 dark:text-emerald-300">
                    <NotebookPen size={22} aria-hidden />
                </span>
                <h2 id="profile-journal-heading" className="text-xl font-extrabold text-text">My practice journal</h2>
            </div>

            {journal.weeks.length === 0 ? (
                <p className="text-base text-text-muted">
                    Nothing yet.{" "}
                    <Link href="/dashboard/practice" className="font-bold text-primary-dark dark:text-primary-light">
                        Log your first practice
                    </Link>
                </p>
            ) : (
                <div className="space-y-5">
                    {weeks.map((week) => (
                        <div key={week.weekStart} className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                                {week.weekStart === thisWeek ? "This week" : `Week of ${formatDay(week.weekStart, { month: "short", day: "numeric" })}`}
                            </h3>
                            <ul className="m-0 list-none space-y-2 p-0">
                                {week.entries.map((entry) => (
                                    <li key={entry.id} className="flex items-start gap-2.5">
                                        <span className="min-w-[3.5rem] shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-center text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                            {getStudyLogKind(entry.kind).label}
                                        </span>
                                        <span className="min-w-0 break-words text-base leading-snug text-text">
                                            {entry.text}{" "}
                                            <span className="text-sm text-text-muted">· {formatDay(entry.dayKey, { weekday: "short" })}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {journal.weeks.length > VISIBLE_WEEKS && (
                        <button
                            type="button"
                            onClick={() => setShowAll((value) => !value)}
                            className="min-h-11 w-full rounded-xl text-base font-bold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            {showAll ? "Show less" : `Show all ${journal.weeks.length} weeks`}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
