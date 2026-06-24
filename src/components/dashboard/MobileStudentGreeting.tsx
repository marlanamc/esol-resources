"use client";

import Link from "next/link";
import { FlameIcon } from "@/components/icons/Icons";
import { useStudentSummary } from "@/hooks/useStudentSummary";
import {
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekTodayIndex,
} from "@/lib/gamification/calendar-week";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function getStreakMessage(streak: number, longestStreak: number): string {
    if (streak === 0) return "Complete an activity today to start your streak!";
    if (streak === 1) return "Great start — come back tomorrow to keep it going.";
    if (streak < 7) return `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to a hot streak!`;
    if (streak >= longestStreak && streak > 0) return "New personal best — keep the momentum!";
    return "You're on fire — keep it going!";
}

const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

interface MobileStudentGreetingProps {
    userName: string;
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialWeeklyPoints?: number;
}

export function MobileStudentGreeting({
    userName,
    initialStreak = 0,
    initialLongestStreak = 0,
    initialSevenDayActivity = EMPTY_WEEK,
}: MobileStudentGreetingProps) {
    const summary = useStudentSummary();

    const streak = summary?.effectiveCurrentStreak ?? initialStreak;
    const longestStreak = initialLongestStreak;
    const sevenDayActivity = summary?.sevenDayActivity ?? initialSevenDayActivity;

    const todayIndex = getCalendarWeekTodayIndex();
    const isHotStreak = streak >= 7;
    const firstName = userName.split(" ")[0];

    return (
        <div className="px-1 pt-3 pb-1">
            {/* Greeting */}
            <h1 className="font-display text-2xl font-bold leading-tight text-text">
                {getGreeting()}, {firstName}
            </h1>

            {/* Streak row */}
            <Link
                href="/dashboard/profile"
                className="mt-3 flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`${streak} day streak — view profile`}
            >
                {/* Flame badge */}
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: isHotStreak
                            ? "linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)"
                            : "linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)",
                    }}
                    aria-hidden
                >
                    <FlameIcon
                        size={18}
                        className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"}
                    />
                </div>

                {/* Streak text + message */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-lg font-bold leading-none text-text tabular-nums">
                            {streak}
                        </span>
                        <span className="text-sm font-medium text-text-muted">
                            day{streak !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium leading-tight text-text-muted">
                        {getStreakMessage(streak, longestStreak)}
                    </p>
                </div>

                {/* Week dots */}
                <div className="flex items-center gap-1">
                    {sevenDayActivity.map((active, i) => {
                        const isToday = i === todayIndex;
                        const isFuture = i > todayIndex;
                        return (
                            <div key={i} className="flex flex-col items-center gap-0.5">
                                <div
                                    className="h-5 w-5 rounded-full transition-all duration-300"
                                    style={{
                                        background: active
                                            ? "var(--primary)"
                                            : isFuture
                                                ? "transparent"
                                                : "color-mix(in srgb, var(--dashboard-border) 38%, var(--dashboard-surface-start))",
                                        border: active
                                            ? "2px solid var(--primary)"
                                            : isToday
                                                ? "2px solid color-mix(in srgb, var(--dashboard-border) 60%, transparent)"
                                                : isFuture
                                                    ? "2px dashed color-mix(in srgb, var(--border-subtle) 70%, transparent)"
                                                    : "2px solid color-mix(in srgb, var(--dashboard-border) 70%, transparent)",
                                        opacity: isFuture ? 0.5 : 1,
                                    }}
                                    aria-hidden
                                />
                                <span
                                    className="text-[8px] font-bold leading-none"
                                    style={{
                                        color: isToday
                                            ? "var(--primary)"
                                            : "var(--text-muted)",
                                    }}
                                >
                                    {CALENDAR_WEEK_DAY_LABELS[i]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Link>
        </div>
    );
}
