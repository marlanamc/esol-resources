"use client";

import Link from "next/link";
import { FlameIcon, CheckCircleIcon } from "@/components/icons/Icons";
import { useStudentSummary } from "@/hooks/useStudentSummary";
import {
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekTodayIndex,
} from "@/lib/gamification/calendar-week";

const STREAK_ACCENT = "var(--primary)";

function CheckIcon({ size = 10 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
                d="M2.5 6.2 5 8.7 9.5 3.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function getMessage(streak: number, longestStreak: number): string {
    if (streak === 0) return "Complete an activity today to start your streak!";
    if (streak === 1) return "Great start — come back tomorrow to keep it going.";
    if (streak < 7) return `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to reach a hot streak!`;
    if (streak >= longestStreak && streak > 0) return "New personal best — keep the momentum!";
    return "You're on fire — keep it going!";
}

const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

type MomentumCardVariant = "default" | "sidebar" | "header";

interface MomentumCardProps {
    /** Server-fetched initial values so the card renders immediately without layout shift */
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
    initialWeeklyPoints?: number;
    /** sidebar = narrow rail (md only); header = beside welcome (lg+) */
    variant?: MomentumCardVariant;
    /** Strip card chrome when nested inside DashboardWelcomeHero */
    embedded?: boolean;
    /** No inner border/gradient box (week hub layout) */
    borderless?: boolean;
}

export function MomentumCard({
    initialStreak = 0,
    initialLongestStreak = 0,
    initialSevenDayActivity = EMPTY_WEEK,
    initialWeeklyPoints = 0,
    variant = "default",
    embedded = false,
    borderless = false,
}: MomentumCardProps) {
    const summary = useStudentSummary();

    const streak = summary?.effectiveCurrentStreak ?? initialStreak;
    const longestStreak = initialLongestStreak;
    const weeklyPoints = summary?.actualWeeklyPoints ?? initialWeeklyPoints;
    const sevenDayActivity = summary?.sevenDayActivity ?? initialSevenDayActivity;

    const todayIndex = getCalendarWeekTodayIndex();
    const isHotStreak = streak >= 7;
    const isNewRecord = streak > 0 && streak >= longestStreak;

    const isSidebar = variant === "sidebar";
    const isHeader = variant === "header";
    const isRail = isSidebar || isHeader;

    const cardGradient = isRail
        ? "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)"
        : isHotStreak
            ? "linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-surface) 28%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-end)) 100%)"
            : "linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 16%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)";
    const cardBorder = isRail
        ? "color-mix(in srgb, var(--primary) 14%, var(--dashboard-border))"
        : isHotStreak
            ? "var(--tone-speaking-border)"
            : "var(--tone-quizzes-border)";
    const flameIconSize = 24;
    const flameShellSize = "w-12 h-12";
    const dotSize = "w-7 h-7";
    const dotIconActive = 15;
    const dotIconToday = 13;

    const streakAccent = isHotStreak && !isRail ? "var(--tone-speaking-accent)" : STREAK_ACCENT;

    const weeklyPointsBadge = (
        <span
            className={`inline-flex items-center gap-1 font-bold leading-none tabular-nums rounded-full dashboard-pill stats-badge-polish ${
                isRail ? "text-xs px-2.5 py-1" : "text-[11px] px-2.5 py-1"
            }`}
            style={{
                background: "var(--tone-quizzes-chip-bg)",
                color: "var(--tone-quizzes-accent)",
                border: "1px solid var(--tone-quizzes-border)",
            }}
            aria-label={`${weeklyPoints} points this week`}
        >
            <span aria-hidden>⭐</span>
            {weeklyPoints.toLocaleString()}
        </span>
    );

    const streakHeading = (
        <div className="flex flex-wrap items-baseline gap-1">
            <span className={`font-bold text-text leading-none ${isRail ? "text-xl" : "text-2xl"} ${isHeader ? "font-display" : ""}`}>
                {streak}
            </span>
            <span className={`font-medium text-text-muted ${isRail ? "text-xs" : "text-sm"}`}>
                day{streak !== 1 ? "s" : ""}
            </span>
            {isNewRecord && streak > 0 && (
                <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{
                        background: "var(--tone-speaking-surface)",
                        color: "var(--tone-speaking-chip-text)",
                    }}
                >
                    Best!
                </span>
            )}
        </div>
    );

    const weekDots = (
        <div className="mt-3 flex items-end justify-between">
            {sevenDayActivity.map((active, i) => {
                const isToday = i === todayIndex;
                const isFuture = i > todayIndex;
                return (
                    <div key={i} className="flex flex-col items-center min-w-0 gap-1">
                        <div
                            className={`${dotSize} rounded-full flex items-center justify-center transition-all duration-300`}
                            style={{
                                background: active
                                    ? "var(--primary)"
                                    : isToday
                                        ? "var(--tone-quizzes-surface)"
                                        : isFuture
                                            ? "transparent"
                                            : "var(--tone-quizzes-chip-bg)",
                                border: active
                                    ? "2px solid var(--primary)"
                                    : isToday
                                        ? "2px solid var(--tone-quizzes-border)"
                                        : isFuture
                                            ? "2px dashed var(--border-subtle)"
                                            : "2px solid var(--border-subtle)",
                                opacity: isFuture ? 0.45 : 1,
                            }}
                        >
                            {active ? (
                                <CheckCircleIcon className="text-white" size={dotIconActive} />
                            ) : isToday ? (
                                <FlameIcon className="text-[var(--tone-quizzes-accent)]" size={dotIconToday} />
                            ) : null}
                        </div>
                        <span
                            className="font-semibold leading-none text-[10px]"
                            style={{
                                color: isToday
                                    ? "var(--primary)"
                                    : isFuture
                                        ? "var(--text-soft, var(--tone-quizzes-accent))"
                                        : "var(--text-muted, var(--tone-quizzes-accent))",
                            }}
                        >
                            {CALENDAR_WEEK_DAY_LABELS[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const railCardClass =
        "group block w-full min-w-0 rounded-[26px] border transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

    const refinedRailBody = (
        <div className="flex flex-col gap-3">
            {/* Top row: flame badge + streak count + weekly points chip */}
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${isHotStreak ? "animate-pulse" : ""}`}
                    style={{
                        background: isHotStreak
                            ? "linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)"
                            : "linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)",
                    }}
                    aria-hidden
                >
                    <FlameIcon
                        size={26}
                        className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-bold leading-none text-text tabular-nums">
                            {streak}
                        </span>
                        <span className="text-sm font-medium text-text-muted">
                            day{streak !== 1 ? "s" : ""}
                        </span>
                        {isNewRecord && streak > 0 ? (
                            <span
                                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                    background: "var(--tone-speaking-surface)",
                                    color: "var(--tone-speaking-chip-text)",
                                }}
                            >
                                Best!
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1 text-xs font-medium leading-tight text-text-muted">
                        {getMessage(streak, longestStreak)}
                    </p>
                </div>
                {weeklyPointsBadge}
            </div>
            {/* Week dots — slightly smaller */}
            <div className="grid w-full grid-cols-7 gap-1">
                {sevenDayActivity.map((active, i) => {
                    const isToday = i === todayIndex;
                    const isFuture = i > todayIndex;
                    const isMissed = !active && !isToday && !isFuture;
                    return (
                        <div key={i} className="flex min-w-0 flex-col items-center gap-1">
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300"
                                style={{
                                    background: active
                                        ? streakAccent
                                        : isMissed
                                            ? "color-mix(in srgb, var(--dashboard-border) 38%, var(--dashboard-surface-start))"
                                            : "transparent",
                                    border: active
                                        ? `2px solid ${streakAccent}`
                                        : isToday
                                            ? "2px solid color-mix(in srgb, var(--dashboard-border) 42%, transparent)"
                                            : isFuture
                                                ? `2px solid ${streakAccent}`
                                                : "2px solid color-mix(in srgb, var(--dashboard-border) 70%, transparent)",
                                    opacity: isFuture ? 0.9 : 1,
                                }}
                            >
                                {active ? <span className="text-white"><CheckIcon size={12} /></span> : null}
                            </div>
                            <span
                                className="text-[9px] font-bold leading-none"
                                style={{
                                    color: isToday ? streakAccent : isFuture ? "var(--text-soft, var(--text-muted))" : "var(--text-muted)",
                                }}
                            >
                                {CALENDAR_WEEK_DAY_LABELS[i]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Link
            href="/dashboard/profile"
            className={
                isHeader && embedded
                    ? "group block w-full min-w-0 rounded-xl p-0 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    : isRail
                        ? `${railCardClass} ${isHeader ? "max-w-[420px] shrink-0 p-4" : "p-4"}`
                        : "dashboard-panel rounded-2xl p-4 block transition-shadow hover:shadow-lg"
            }
            style={
                isHeader && embedded
                    ? undefined
                    : { background: cardGradient, borderColor: cardBorder }
            }
        >
            {isRail ? (
                <div
                    className={
                        isHeader && embedded
                            ? borderless
                                ? "w-full min-w-0 py-0.5"
                                : "w-full min-w-0 rounded-[22px] border p-5"
                            : undefined
                    }
                    style={
                        isHeader && embedded && !borderless
                            ? { background: cardGradient, borderColor: cardBorder }
                            : undefined
                    }
                >
                    {refinedRailBody}
                </div>
            ) : (
                <>
                    <div className="flex items-start gap-3">
                        <div
                            className={`${flameShellSize} rounded-full flex items-center justify-center shrink-0 ${isHotStreak ? "animate-pulse" : ""}`}
                            style={{
                                background: isHotStreak
                                    ? "linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)"
                                    : "linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)",
                            }}
                        >
                            <FlameIcon
                                className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"}
                                size={flameIconSize}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            {streakHeading}
                            <p className="text-xs text-text-muted mt-0.5 leading-snug">
                                {getMessage(streak, longestStreak)}
                            </p>
                        </div>
                        {weeklyPointsBadge}
                    </div>
                    {weekDots}
                </>
            )}
        </Link>
    );
}
