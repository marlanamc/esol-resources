"use client";

import Link from "next/link";
import { FlameIcon, CheckCircleIcon } from "@/components/icons/Icons";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";
import { useStudentSummary } from "@/hooks/useStudentSummary";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getMessage(streak: number, longestStreak: number): string {
    if (streak === 0) return "Complete an activity today to start your streak!";
    if (streak === 1) return "Great start — come back tomorrow to keep it going.";
    if (streak < 7) return `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to reach a hot streak!`;
    if (streak >= longestStreak && streak > 0) return "New personal best — keep the momentum!";
    return "You're on fire — keep it going!";
}

const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

interface MomentumCardProps {
    /** Server-fetched initial values so the card renders immediately without layout shift */
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
}

export function MomentumCard({
    initialStreak = 0,
    initialLongestStreak = 0,
    initialSevenDayActivity = EMPTY_WEEK,
    initialTotalPoints = 0,
}: MomentumCardProps) {
    const summary = useStudentSummary();

    const streak = summary?.effectiveCurrentStreak ?? initialStreak;
    const longestStreak = initialLongestStreak;
    const totalPoints = summary?.totalPoints ?? initialTotalPoints;
    const sevenDayActivity = summary?.sevenDayActivity ?? initialSevenDayActivity;

    // today is always index 6 (rolling 7-day window ending today)
    const todayIndex = 6;
    const isHotStreak = streak >= 7;
    const isNewRecord = streak > 0 && streak >= longestStreak;

    const activeDaysThisWeek = sevenDayActivity.filter(Boolean).length;
    const weekActivityPct = Math.round((activeDaysThisWeek / 7) * 100);

    return (
        <Link
            href="/dashboard/profile"
            className="dashboard-panel rounded-2xl p-4 block transition-shadow hover:shadow-lg"
            style={{
                background: isHotStreak
                    ? "linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-surface) 28%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-end)) 100%)"
                    : "linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 16%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                borderColor: isHotStreak
                    ? "var(--tone-speaking-border)"
                    : "var(--tone-quizzes-border)",
            }}
        >
            {/* Top row: flame + streak + longest streak badge */}
            <div className="flex items-start gap-3">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isHotStreak ? "animate-pulse" : ""}`}
                    style={{
                        background: isHotStreak
                            ? "linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)"
                            : "linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)",
                    }}
                >
                    <FlameIcon
                        className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"}
                        size={24}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-text leading-none">{streak}</span>
                        <span className="text-sm font-medium text-text-muted">
                            day{streak !== 1 ? "s" : ""}
                        </span>
                        {isNewRecord && streak > 0 && (
                            <span
                                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                    background: "var(--tone-speaking-surface)",
                                    color: "var(--tone-speaking-chip-text)",
                                }}
                            >
                                Best!
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 leading-snug">
                        {getMessage(streak, longestStreak)}
                    </p>
                </div>

                {/* Lifetime points — top right */}
                <span
                    className="flex shrink-0 items-center text-[11px] font-bold leading-none tabular-nums px-2.5 py-1 rounded-full dashboard-pill stats-badge-polish"
                    style={{
                        background: "color-mix(in srgb, var(--primary) 14%, var(--dashboard-surface-start))",
                        color: "var(--primary)",
                        border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
                    }}
                >
                    {totalPoints.toLocaleString()} pts
                </span>
            </div>

            {/* 7-day week dots */}
            <div className="mt-3 flex justify-between items-end">
                {sevenDayActivity.map((active, i) => {
                    const isToday = i === todayIndex;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{
                                    background: active
                                        ? "var(--primary)"
                                        : isToday
                                            ? "var(--tone-quizzes-surface)"
                                            : "var(--tone-quizzes-chip-bg)",
                                    border: active
                                        ? "2px solid var(--primary)"
                                        : isToday
                                            ? "2px solid var(--tone-quizzes-border)"
                                            : "2px solid var(--border-subtle)",
                                }}
                            >
                                {active ? (
                                    <CheckCircleIcon className="text-white" size={15} />
                                ) : isToday ? (
                                    <FlameIcon className="text-[var(--tone-quizzes-accent)]" size={13} />
                                ) : null}
                            </div>
                            <span
                                className="text-[10px] font-semibold leading-none"
                                style={{ color: isToday ? "var(--primary)" : "var(--text-muted, var(--tone-quizzes-accent))" }}
                            >
                                {DAY_LABELS[i]}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Weekly points + activity bar */}
            <div className="mt-3 flex items-center gap-2.5">
                <div className="shrink-0">
                    <StudentQuickStats
                        mobile
                        maxVisible={1}
                        chipKeys={["weekly"]}
                        compact
                        tight
                        linked={false}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div
                        className={`relative w-full overflow-hidden rounded-full border h-4 ${
                            weekActivityPct >= 100
                                ? "border-[#d7c09a]/50 shadow-[inset_0_1px_2px_rgba(138,91,61,0.06)] dark:border-[rgba(245,217,138,0.24)] dark:shadow-[inset_0_1px_2px_rgba(8,16,24,0.3)]"
                                : "border-[#e8e0d4]/50 shadow-[inset_0_1px_2px_rgba(78,57,39,0.04)] dark:border-[rgba(226,232,240,0.24)] dark:shadow-[inset_0_1px_2px_rgba(8,16,24,0.32)]"
                        }`}
                        style={{
                            background: weekActivityPct >= 100
                                ? "var(--checklist-track-bg-complete)"
                                : "var(--checklist-track-bg)",
                        }}
                    >
                        <div
                            className={`absolute inset-y-0 left-0 rounded-[999px] transition-[width] duration-700 ease-out ${
                                weekActivityPct >= 90 && weekActivityPct < 100 ? "progress-liquid" : ""
                            }`}
                            style={{
                                width: `${weekActivityPct}%`,
                                background: weekActivityPct >= 100
                                    ? "linear-gradient(90deg, #b8442a 0%, #d96838 35%, #e8933a 70%, #f5c842 100%)"
                                    : "linear-gradient(90deg, #c8552e 0%, #dd6b36 40%, #e8882e 75%, #f0a832 100%)",
                                boxShadow: weekActivityPct >= 100
                                    ? "0 0 12px rgba(217,119,87,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
                                    : weekActivityPct >= 90
                                        ? "0 0 10px rgba(217,119,87,0.35), inset 0 1px 0 rgba(255,255,255,0.25)"
                                        : "0 0 8px rgba(217,119,87,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }}
                        />
                    </div>
                </div>

                <span className="text-[10px] font-medium text-text-muted leading-none shrink-0 tabular-nums">
                    {activeDaysThisWeek}<span className="text-text-soft">/7 days</span>
                </span>
            </div>
        </Link>
    );
}
