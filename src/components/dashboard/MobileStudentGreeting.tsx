"use client";

import Link from "next/link";
import { Star } from "lucide-react";
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
    initialSevenDayActivity = EMPTY_WEEK,
    initialWeeklyPoints = 0,
}: MobileStudentGreetingProps) {
    const summary = useStudentSummary();

    const streak = summary?.effectiveCurrentStreak ?? initialStreak;
    const sevenDayActivity = summary?.sevenDayActivity ?? initialSevenDayActivity;
    const weeklyPoints = summary?.actualWeeklyPoints ?? initialWeeklyPoints;

    const todayIndex = getCalendarWeekTodayIndex();
    const isHotStreak = streak >= 7;
    const firstName = userName.split(" ")[0];

    return (
        <div className="px-1 pt-4 pb-1">
            {/* Greeting */}
            <h1 className="font-display text-2xl font-bold leading-tight text-text">
                {getGreeting()}, {firstName}
            </h1>

            {/* Streak card */}
            <Link
                href="/dashboard/profile"
                className="dashboard-panel mt-4 block rounded-2xl border p-4 transition-transform duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                    borderColor: "var(--dashboard-border)",
                    background: "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
                }}
                aria-label={`${streak} day streak, ${weeklyPoints} points this week — view profile`}
            >
                {/* Top row: flame + streak headline + points pill */}
                <div className="flex items-start gap-3">
                    {/* Flame badge */}
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{
                            background: isHotStreak
                                ? "var(--tone-speaking-chip-bg)"
                                : "color-mix(in srgb, var(--primary) 12%, var(--dashboard-surface-start))",
                        }}
                        aria-hidden
                    >
                        <FlameIcon
                            size={22}
                            className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-primary"}
                        />
                    </div>

                    {/* Streak text + message */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-display text-2xl font-bold leading-none text-text tabular-nums">
                                {streak}
                            </span>
                            <span className="text-sm font-semibold text-text-muted">
                                day{streak !== 1 ? "s" : ""} streak
                            </span>
                        </div>
                    </div>

                    {/* Weekly points pill */}
                    <span
                        className="flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-bold tabular-nums text-text"
                        style={{
                            borderColor: "var(--dashboard-border)",
                            background: "var(--surface-elevated)",
                        }}
                    >
                        <Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" aria-hidden />
                        {weeklyPoints}
                    </span>
                </div>

                {/* Week dots */}
                <div className="mt-4 flex items-stretch justify-between">
                    {sevenDayActivity.map((active, i) => {
                        const isToday = i === todayIndex;
                        const isFuture = i > todayIndex;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300"
                                    style={{
                                        background: active
                                            ? "var(--primary)"
                                            : "transparent",
                                        border: active
                                            ? "2px solid var(--primary)"
                                            : isToday
                                                ? "2px solid var(--primary)"
                                                : isFuture
                                                    ? "2px dashed color-mix(in srgb, var(--dashboard-border) 80%, transparent)"
                                                    : "2px solid color-mix(in srgb, var(--dashboard-border) 90%, transparent)",
                                        opacity: isFuture ? 0.6 : 1,
                                    }}
                                    aria-hidden
                                >
                                    {active && (
                                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                                            <path
                                                d="M4 9.2 7.4 12.6 14 5.8"
                                                stroke="white"
                                                strokeWidth="2.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span
                                    className="text-[10px] font-bold leading-none"
                                    style={{
                                        color: isToday ? "var(--primary)" : "var(--text-muted)",
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
