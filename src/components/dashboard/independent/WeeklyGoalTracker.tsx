"use client";

import { useState, type CSSProperties } from "react";
import { Pencil, Target, X } from "lucide-react";

interface WeeklyGoalTrackerProps {
    completed: number;
    goal: number;
    daysRemaining: number;
    onGoalChange?: (newGoal: number) => void;
    editable?: boolean;
}

function getDaysLeftLabel(daysRemaining: number): string {
    if (daysRemaining <= 0) return "Last day";
    if (daysRemaining === 1) return "1 day left";
    return `${daysRemaining} days left`;
}

function getFooterMessage(completed: number, goal: number, isGoalMet: boolean): string {
    if (isGoalMet) return "Goal reached — nice work! 🎯";

    const remaining = Math.max(0, goal - completed);
    if (remaining === 1) return "One more to hit your goal 🎯";
    if (remaining > 1) return `${remaining} more to hit your goal 🎯`;
    return "Keep going this week 🎯";
}

const BRAND_PROGRESS_GRADIENT =
    "linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 52%, var(--accent-color) 100%)";

function getCompletedSegmentStyle(index: number, total: number): CSSProperties {
    if (total <= 1) {
        return { background: BRAND_PROGRESS_GRADIENT };
    }

    return {
        background: BRAND_PROGRESS_GRADIENT,
        backgroundSize: `${total * 100}% 100%`,
        backgroundPosition: `${(index / (total - 1)) * 100}% 0`,
    };
}

export function WeeklyGoalTracker({
    completed,
    goal,
    daysRemaining,
    onGoalChange,
    editable = true,
}: WeeklyGoalTrackerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [pendingGoal, setPendingGoal] = useState(goal);

    const isGoalMet = completed >= goal;

    const handleSave = () => {
        if (onGoalChange && pendingGoal >= 1 && pendingGoal <= 10) {
            onGoalChange(pendingGoal);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setPendingGoal(goal);
        setIsEditing(false);
    };

    return (
        <section
            className="dashboard-panel rounded-2xl p-[18px]"
            aria-label="Weekly goal"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Target size={18} className="shrink-0 text-secondary" aria-hidden />
                    <h2 className="font-display text-sm font-bold text-text">Weekly goal</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-text-muted"
                        style={{ background: "color-mix(in srgb, var(--dashboard-border) 42%, var(--dashboard-surface-start))" }}
                    >
                        {getDaysLeftLabel(daysRemaining)}
                    </span>
                    {editable && !isEditing && onGoalChange ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                            aria-label="Edit weekly goal"
                        >
                            <Pencil className="text-text-muted" size={14} />
                        </button>
                    ) : null}
                </div>
            </div>

            {isEditing ? (
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-sm text-text-muted" htmlFor="weekly-goal-select">
                        Activities per week:
                    </label>
                    <select
                        id="weekly-goal-select"
                        value={pendingGoal}
                        onChange={(e) => setPendingGoal(Number(e.target.value))}
                        className="rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-sm text-text"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-primary-dark"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-subtle)]"
                        aria-label="Cancel editing weekly goal"
                    >
                        <X className="text-text-muted" size={16} />
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-2 flex items-baseline gap-1.5">
                        <span
                            className="font-display text-[26px] font-bold leading-none tabular-nums"
                            style={{
                                background: BRAND_PROGRESS_GRADIENT,
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            {completed}
                        </span>
                        <span className="text-[13px] font-semibold text-text-muted">
                            of {goal} activities
                        </span>
                    </div>

                    <div
                        className="flex gap-1.5"
                        role="img"
                        aria-label={`${completed} of ${goal} activities completed`}
                    >
                        {Array.from({ length: goal }).map((_, index) => {
                            const isDone = index < completed;
                            return (
                                <div
                                    key={index}
                                    className={`h-3 flex-1 rounded-[6px] transition-colors ${
                                        isDone
                                            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]"
                                            : "border border-primary/12 bg-[color-mix(in_srgb,var(--primary-color)_6%,var(--dashboard-surface-start))]"
                                    }`}
                                    style={isDone ? getCompletedSegmentStyle(index, goal) : undefined}
                                />
                            );
                        })}
                    </div>

                    <p className="mt-2.5 text-[11.5px] font-medium text-text-muted">
                        {getFooterMessage(completed, goal, isGoalMet)}
                    </p>
                </>
            )}
        </section>
    );
}
