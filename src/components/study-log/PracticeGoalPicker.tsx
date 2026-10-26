"use client";

import { useState } from "react";
import { PRACTICE_GOAL_OPTIONS } from "@/lib/learner/study-log";
import { refreshPracticeViews } from "@/app/dashboard/practice/actions";

/** "How many days a week?" buttons. Saves on tap; the home card's count follows it. Lives in the profile's practice journal. */
export function PracticeGoalPicker({ goalDays, onChange }: { goalDays: number; onChange: (days: number) => void }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function pick(days: number) {
        if (busy || days === goalDays) return;
        const previous = goalDays;
        onChange(days);
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/study-log/goal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ days }),
            });
            if (!res.ok) throw new Error("save failed");
            refreshPracticeViews().catch(() => {});
        } catch {
            onChange(previous);
            setError("Could not save your goal. Try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-2">
            <div role="group" aria-label="My goal: how many days a week?" className="grid grid-cols-5 gap-1.5">
                {PRACTICE_GOAL_OPTIONS.map((days) => {
                    const on = days === goalDays;
                    return (
                        <button
                            key={days}
                            type="button"
                            aria-pressed={on}
                            aria-label={`${days} days a week`}
                            onClick={() => void pick(days)}
                            className={`flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl ${
                                on
                                    ? "border-2! border-emerald-800! bg-emerald-700! text-[#fffdfa] dark:bg-emerald-600!"
                                    : "border-2! border-border! bg-surface-elevated! text-text"
                            }`}
                        >
                            <span className="text-2xl font-bold leading-none" aria-hidden>{days}</span>
                            <span className="text-xs font-bold" aria-hidden>days</span>
                        </button>
                    );
                })}
            </div>
            <p role="status" aria-live="polite" className="m-0 text-sm text-text-muted">
                {error ? <span style={{ color: "var(--error-color)" }}>{error}</span> : "Even 15 minutes a day counts!"}
            </p>
        </div>
    );
}
