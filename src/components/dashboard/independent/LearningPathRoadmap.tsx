"use client";

import { Check, Lock } from "lucide-react";
import type { StageProgress } from "@/lib/independent-progress";

interface LearningPathRoadmapProps {
    stages: StageProgress[];
    totalProgress: {
        completed: number;
        total: number;
        percent: number;
    };
}

export function LearningPathRoadmap({ stages, totalProgress }: LearningPathRoadmapProps) {
    return (
        <div className="dashboard-panel rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text">Your Learning Path</h3>
                <span className="text-xs font-medium text-text-muted">
                    {totalProgress.completed}/{totalProgress.total} completed
                </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="relative h-2 rounded-full overflow-hidden mb-5" style={{
                background: "var(--checklist-track-bg)",
            }}>
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                        width: `${totalProgress.percent}%`,
                        background: "linear-gradient(90deg, var(--tone-grammar-accent) 0%, var(--tone-vocab-accent) 100%)",
                    }}
                />
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6">
                {/* Vertical line */}
                <div
                    className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: "var(--border-subtle)" }}
                />

                {stages.map((stage, index) => {
                    const isComplete = stage.completed === stage.total && stage.total > 0;
                    const isLocked = !stage.isCurrentStage && index > 0 && !isComplete && stages[index - 1]?.completed !== stages[index - 1]?.total;
                    const isCurrent = stage.isCurrentStage;

                    return (
                        <div key={stage.stage} className="relative mb-5 last:mb-0">
                            {/* Stage Node */}
                            <div
                                className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    isComplete
                                        ? "bg-[var(--tone-grammar-chip-bg)] border-[var(--tone-grammar-accent)]"
                                        : isCurrent
                                        ? "bg-[var(--tone-vocab-chip-bg)] border-[var(--tone-vocab-accent)]"
                                        : "bg-surface-subtle border-border-subtle"
                                }`}
                            >
                                {isComplete ? (
                                    <Check className="text-[var(--tone-grammar-accent)]" size={14} />
                                ) : isLocked ? (
                                    <Lock className="text-text-light" size={12} />
                                ) : (
                                    <span className={`text-xs font-bold ${
                                        isCurrent ? "text-[var(--tone-vocab-accent)]" : "text-text-muted"
                                    }`}>
                                        {stage.stage}
                                    </span>
                                )}
                            </div>

                            {/* Stage Content */}
                            <div className={`ml-4 ${isLocked ? "opacity-50" : ""}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`text-sm font-semibold ${
                                        isCurrent ? "text-text" : "text-text-muted"
                                    }`}>
                                        {stage.label}
                                    </h4>
                                    {isCurrent && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--tone-vocab-surface)] text-[var(--tone-vocab-chip-text)]">
                                            Current
                                        </span>
                                    )}
                                </div>

                                {/* Progress for this stage */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{
                                        background: "var(--surface-subtle)",
                                    }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${stage.total > 0 ? (stage.completed / stage.total) * 100 : 0}%`,
                                                background: isComplete
                                                    ? "var(--tone-grammar-accent)"
                                                    : isCurrent
                                                    ? "var(--tone-vocab-accent)"
                                                    : "var(--text-color-light)",
                                            }}
                                        />
                                    </div>
                                    <span className="text-[11px] text-text-muted whitespace-nowrap">
                                        {stage.completed}/{stage.total}
                                    </span>
                                </div>

                                {/* Activity dots (compact view) */}
                                {!isLocked && stage.activities.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {stage.activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    activity.completed
                                                        ? "bg-[var(--tone-grammar-accent)]"
                                                        : "bg-border-subtle"
                                                }`}
                                                title={activity.title}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
