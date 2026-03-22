"use client";

import { useState } from "react";
import { CheckCircle2, Target, Pencil, X } from "lucide-react";

interface WeeklyGoalTrackerProps {
    completed: number;
    goal: number;
    daysRemaining: number;
    onGoalChange?: (newGoal: number) => void;
    editable?: boolean;
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

    const percentComplete = Math.min(100, Math.round((completed / goal) * 100));
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
        <div
            className="dashboard-panel rounded-2xl p-4"
            style={{
                background: isGoalMet
                    ? "linear-gradient(135deg, color-mix(in srgb, var(--tone-grammar-surface) 20%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-grammar-surface) 12%, var(--dashboard-surface-end)) 100%)"
                    : "linear-gradient(135deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
                borderColor: isGoalMet
                    ? "var(--tone-grammar-border)"
                    : "var(--dashboard-border)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                            background: isGoalMet
                                ? "linear-gradient(135deg, var(--tone-grammar-chip-bg) 0%, var(--tone-grammar-surface) 100%)"
                                : "color-mix(in srgb, var(--tone-vocab-surface) 24%, var(--dashboard-surface-start))",
                        }}
                    >
                        {isGoalMet ? (
                            <CheckCircle2
                                className="text-[var(--tone-grammar-accent)]"
                                size={18}
                            />
                        ) : (
                            <Target
                                className="text-[var(--tone-vocab-accent)]"
                                size={18}
                            />
                        )}
                    </div>
                    <span className="text-sm font-semibold text-text">Weekly Goal</span>
                </div>

                {editable && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg hover:bg-surface-subtle transition-colors"
                        aria-label="Edit weekly goal"
                    >
                        <Pencil className="text-text-muted" size={14} />
                    </button>
                )}
            </div>

            {/* Goal Editor */}
            {isEditing ? (
                <div className="flex items-center gap-3 mb-3">
                    <label className="text-sm text-text-muted">Activities per week:</label>
                    <select
                        value={pendingGoal}
                        onChange={(e) => setPendingGoal(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-base text-text text-sm"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1.5 rounded-lg hover:bg-surface-subtle transition-colors"
                        aria-label="Cancel"
                    >
                        <X className="text-text-muted" size={16} />
                    </button>
                </div>
            ) : (
                <>
                    {/* Progress Display */}
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-text">{completed}</span>
                        <span className="text-lg text-text-muted">/</span>
                        <span className="text-lg font-medium text-text-muted">{goal}</span>
                        <span className="text-sm text-text-muted ml-1">activities</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 rounded-full overflow-hidden mb-2" style={{
                        background: "var(--checklist-track-bg)",
                    }}>
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${percentComplete}%`,
                                background: isGoalMet
                                    ? "linear-gradient(90deg, var(--tone-grammar-accent) 0%, var(--tone-grammar-chip-bg) 100%)"
                                    : "linear-gradient(90deg, var(--tone-vocab-accent) 0%, var(--tone-vocab-chip-bg) 100%)",
                            }}
                        />
                    </div>

                    {/* Footer Message */}
                    <p className="text-xs text-text-muted">
                        {isGoalMet ? (
                            <span className="text-[var(--tone-grammar-accent)] font-medium">
                                Goal reached! Keep going!
                            </span>
                        ) : daysRemaining === 0 ? (
                            "Last day of the week!"
                        ) : daysRemaining === 1 ? (
                            "1 day remaining"
                        ) : (
                            `${daysRemaining} days remaining`
                        )}
                    </p>
                </>
            )}
        </div>
    );
}
