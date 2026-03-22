"use client";

import Link from "next/link";
import { FlameIcon } from "@/components/icons/Icons";

interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
    const isHotStreak = currentStreak >= 7;
    const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;

    // Encouragement messages based on streak
    const getMessage = () => {
        if (currentStreak === 0) {
            return "Complete an activity today to start your streak!";
        }
        if (currentStreak === 1) {
            return "Great start! Come back tomorrow to keep it going.";
        }
        if (currentStreak < 7) {
            return `${7 - currentStreak} more days to reach a hot streak!`;
        }
        if (isNewRecord) {
            return "New personal best! Keep the momentum!";
        }
        return "Amazing consistency! You're on fire!";
    };

    return (
        <Link
            href="/dashboard/profile"
            className="dashboard-panel rounded-2xl p-4 block transition-shadow hover:shadow-lg"
            style={{
                background: isHotStreak
                    ? "linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-surface) 24%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-end)) 100%)"
                    : "linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                borderColor: isHotStreak
                    ? "var(--tone-speaking-border)"
                    : "var(--tone-quizzes-border)",
            }}
        >
            <div className="flex items-center gap-4">
                {/* Fire Icon */}
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isHotStreak ? "animate-pulse" : ""
                    }`}
                    style={{
                        background: isHotStreak
                            ? "linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)"
                            : "linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)",
                    }}
                >
                    <FlameIcon
                        className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"}
                        size={28}
                    />
                </div>

                {/* Streak Info */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-text">
                            {currentStreak}
                        </span>
                        <span className="text-sm font-medium text-text-muted">
                            day{currentStreak !== 1 ? "s" : ""}
                        </span>
                        {isNewRecord && currentStreak > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--tone-speaking-surface)] text-[var(--tone-speaking-chip-text)] uppercase tracking-wide">
                                Best
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                        {getMessage()}
                    </p>
                </div>
            </div>

            {/* Longest streak (if different from current and current is active) */}
            {currentStreak > 0 && longestStreak > currentStreak && (
                <div className="mt-3 pt-3 border-t border-border-subtle">
                    <p className="text-xs text-text-muted">
                        Longest streak: <span className="font-semibold text-text">{longestStreak} days</span>
                    </p>
                </div>
            )}
        </Link>
    );
}
