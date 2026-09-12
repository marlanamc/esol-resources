"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { useStudentSummary } from "@/hooks/useStudentSummary";
import {
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekTodayIndex,
} from "@/lib/gamification/calendar-week";

function CheckIcon({ size = 11 }: { size?: number }) {
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
    if (streak === 0) return "Complete an activity today to start your streak.";
    if (streak === 1) return "Great start — come back tomorrow.";
    if (streak < 7) return `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to a hot streak.`;
    if (streak >= longestStreak && streak > 0) return "New personal best — keep going.";
    return "You're on fire — keep it going.";
}

const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

type MomentumCardVariant = "default" | "sidebar" | "header";

interface MomentumCardProps {
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
    initialWeeklyPoints?: number;
    variant?: MomentumCardVariant;
    embedded?: boolean;
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
    const streakAccent = isHotStreak ? "var(--tone-speaking-accent)" : "var(--primary)";

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

    const body = (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
                <div className="flex shrink-0 items-center gap-2">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                            background: "color-mix(in srgb, var(--tone-quizzes-accent) 20%, var(--dashboard-surface-start))",
                            color: "var(--tone-quizzes-accent)",
                        }}
                        aria-hidden
                    >
                        <Flame size={16} fill="currentColor" strokeWidth={1.6} />
                    </div>

                    <div className="leading-none">
                        <div className="font-display text-[1.5rem] font-bold leading-none tabular-nums text-text">
                            {streak}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold leading-none tracking-tight text-text">
                            day streak
                        </div>
                    </div>
                </div>

                <div
                    className="h-7 w-px shrink-0"
                    style={{ background: "color-mix(in srgb, var(--text-muted) 36%, transparent)" }}
                    aria-hidden
                />

                <div className="min-w-0 flex-1 text-[12px] font-medium leading-snug text-text">
                    {getMessage(streak, longestStreak)}
                </div>

                <span className="shrink-0 text-[13px] font-bold tabular-nums leading-none text-text">
                    {weeklyPoints.toLocaleString()} pts
                </span>
            </div>

            <div className="grid grid-cols-7" role="list" aria-label="This week's activity">
                {sevenDayActivity.map((active, i) => {
                    const isToday = i === todayIndex;
                    const isFuture = i > todayIndex;
                    const isMissed = !active && !isToday && !isFuture;
                    return (
                        <div key={i} className="flex min-w-0 flex-col items-center gap-0.5" role="listitem">
                            <div
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{
                                    background: active
                                        ? streakAccent
                                        : isMissed
                                            ? "color-mix(in srgb, var(--text-muted) 16%, var(--dashboard-surface-start))"
                                            : "transparent",
                                    border: active
                                        ? "2px solid transparent"
                                        : isToday
                                            ? `2px solid ${streakAccent}`
                                            : isFuture
                                                ? "2px dashed color-mix(in srgb, var(--text-muted) 45%, transparent)"
                                                : "2px solid transparent",
                                }}
                                aria-label={`${CALENDAR_WEEK_DAY_LABELS[i]}${active ? ", completed" : isToday ? ", today" : isFuture ? ", upcoming" : ", missed"}`}
                            >
                                {active ? (
                                    <span style={{ color: "var(--text-on-accent)" }}>
                                        <CheckIcon size={10} />
                                    </span>
                                ) : null}
                            </div>
                            <span
                                className="text-[9px] font-bold leading-none"
                                style={{ color: isToday ? streakAccent : "var(--text-muted)" }}
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
                    ? "group block w-full min-w-0 rounded-xl p-0 leading-none transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    : isRail
                        ? `group block w-full min-w-0 rounded-2xl border px-3 py-2.5 leading-none transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${isHeader ? "max-w-[420px] shrink-0" : ""}`
                        : "dashboard-panel block rounded-2xl px-3 py-2.5 leading-none transition-shadow hover:shadow-lg"
            }
            style={
                isHeader && embedded
                    ? undefined
                    : { background: cardGradient, borderColor: cardBorder }
            }
            aria-label={`${streak}-day streak${isNewRecord ? ", personal best" : ""}. ${getMessage(streak, longestStreak)} ${weeklyPoints} points this week.`}
        >
            {isHeader && embedded ? (
                <div
                    className={borderless ? "w-full min-w-0 py-0.5" : "w-full min-w-0 rounded-2xl border px-3.5 py-3"}
                    style={borderless ? undefined : { background: cardGradient, borderColor: cardBorder }}
                >
                    {body}
                </div>
            ) : (
                body
            )}
        </Link>
    );
}
