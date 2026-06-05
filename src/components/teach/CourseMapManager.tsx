"use client";

import { useState, useTransition } from "react";
import { ChevronRight, ChevronLeft, MapPin, Lock, CheckCircle2 } from "lucide-react";

export interface MapWeek {
    id: string;
    number: number;
    title: string;
    goal: string | null;
    itemCount: number;
    unitTitle: string;
}

interface Props {
    classId: string;
    className: string;
    allWeeks: MapWeek[];
    revealedWeekIds: string[];
}

export function CourseMapManager({ classId, className, allWeeks, revealedWeekIds: initialRevealed }: Props) {
    const [revealedIds, setRevealedIds] = useState(new Set(initialRevealed));
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const revealedCount = revealedIds.size;
    const currentWeek = [...allWeeks].reverse().find((w) => revealedIds.has(w.id)) ?? null;
    const nextWeek = allWeeks.find((w) => !revealedIds.has(w.id)) ?? null;
    const lastRevealedWeek = [...allWeeks].reverse().find((w) => revealedIds.has(w.id)) ?? null;

    async function revealNext() {
        if (!nextWeek) return;
        setError(null);
        startTransition(async () => {
            const res = await fetch(`/api/classes/${classId}/reveal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weekId: nextWeek.id }),
            });
            if (res.ok) {
                setRevealedIds((prev) => new Set([...prev, nextWeek.id]));
            } else {
                setError("Failed to reveal week. Try again.");
            }
        });
    }

    async function undoLast() {
        if (!lastRevealedWeek) return;
        setError(null);
        startTransition(async () => {
            const res = await fetch(`/api/classes/${classId}/reveal`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weekId: lastRevealedWeek.id }),
            });
            if (res.ok) {
                setRevealedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(lastRevealedWeek.id);
                    return next;
                });
            } else {
                setError("Failed to hide week. Try again.");
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Current status card */}
            <div
                className="rounded-2xl border bg-white px-6 py-5"
                style={{ borderColor: "var(--border-subtle)" }}
            >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
                            {className} — Current Level
                        </p>
                        {currentWeek ? (
                            <>
                                <h2 className="font-display font-bold text-xl text-text">
                                    Week {currentWeek.number} — {currentWeek.title}
                                </h2>
                                {currentWeek.goal && (
                                    <p className="text-sm text-text-muted mt-0.5">{currentWeek.goal}</p>
                                )}
                                <p className="text-xs text-text-muted mt-1">
                                    {revealedCount} of {allWeeks.length} weeks visible to students
                                </p>
                            </>
                        ) : (
                            <p className="text-base font-semibold text-text-muted italic">No weeks revealed yet</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {lastRevealedWeek && (
                            <button
                                onClick={undoLast}
                                disabled={isPending}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors hover:bg-[var(--surface-subtle)] disabled:opacity-50"
                                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Hide Week {lastRevealedWeek.number}
                            </button>
                        )}
                        {nextWeek ? (
                            <button
                                onClick={revealNext}
                                disabled={isPending}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                                style={{ background: "var(--secondary)" }}
                            >
                                Reveal Week {nextWeek.number}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <span className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--surface-subtle)", color: "var(--text-muted)" }}>
                                All weeks revealed
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
            </div>

            {/* Next up preview */}
            {nextWeek && (
                <div
                    className="rounded-xl border px-4 py-3 flex items-center gap-3"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-subtle)" }}
                >
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Up next</p>
                        <p className="text-sm font-semibold text-text">
                            Week {nextWeek.number} — {nextWeek.title}
                        </p>
                        {nextWeek.goal && (
                            <p className="text-xs text-text-muted">{nextWeek.goal}</p>
                        )}
                    </div>
                    <span className="text-xs text-text-muted shrink-0">
                        {nextWeek.itemCount} {nextWeek.itemCount === 1 ? "activity" : "activities"}
                    </span>
                </div>
            )}

            {/* Week list */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">All weeks</p>
                <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
                    {allWeeks.map((week, i) => {
                        const revealed = revealedIds.has(week.id);
                        const isCurrent = week.id === currentWeek?.id;
                        return (
                            <div
                                key={week.id}
                                className="flex items-center gap-3 px-4 py-3"
                                style={{
                                    borderBottom: i < allWeeks.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                                    background: isCurrent
                                        ? "color-mix(in srgb, var(--secondary) 6%, white)"
                                        : "white",
                                }}
                            >
                                <span className="shrink-0 w-5 flex justify-center">
                                    {revealed
                                        ? <CheckCircle2 className="h-4 w-4" style={{ color: "var(--secondary)" }} />
                                        : <Lock className="h-3.5 w-3.5 text-text-muted opacity-40" />
                                    }
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${isCurrent ? "font-bold text-text" : revealed ? "font-semibold text-text" : "text-text-muted"}`}>
                                        Week {week.number} — {week.title}
                                    </p>
                                    <p className="text-xs text-text-muted">{week.unitTitle}</p>
                                </div>
                                {isCurrent && (
                                    <span
                                        className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                                        style={{
                                            background: "color-mix(in srgb, var(--secondary) 12%, transparent)",
                                            color: "var(--secondary)",
                                        }}
                                    >
                                        Current
                                    </span>
                                )}
                                <span className="text-xs text-text-muted shrink-0">
                                    {week.itemCount} {week.itemCount === 1 ? "act" : "acts"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
