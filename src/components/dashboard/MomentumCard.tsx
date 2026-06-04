"use client";

import Link from "next/link";
import { FlameIcon, CheckCircleIcon, StarIcon } from "@/components/icons/Icons";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";
import { useStudentSummary } from "@/hooks/useStudentSummary";
import {
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekTodayIndex,
} from "@/lib/gamification/calendar-week";

function getMessage(streak: number, longestStreak: number): string {
    if (streak === 0) return "Complete an activity today to start your streak!";
    if (streak === 1) return "Great start — come back tomorrow to keep it going.";
    if (streak < 7) return `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to reach a hot streak!`;
    if (streak >= longestStreak && streak > 0) return "New personal best — keep the momentum!";
    return "You're on fire — keep it going!";
}

function getSidebarMessage(streak: number, longestStreak: number): string {
    if (streak === 0) return "Start your streak today";
    if (streak === 1) return "Come back tomorrow";
    if (streak < 7) return `${7 - streak} day${7 - streak === 1 ? "" : "s"} to hot streak`;
    if (streak >= longestStreak && streak > 0) return "Personal best!";
    return "Hot streak — keep going";
}

const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

type MomentumCardVariant = "default" | "sidebar" | "header";

interface MomentumCardProps {
    /** Server-fetched initial values so the card renders immediately without layout shift */
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
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
    initialTotalPoints = 0,
    variant = "default",
    embedded = false,
    borderless = false,
}: MomentumCardProps) {
    const summary = useStudentSummary();

    const streak = summary?.effectiveCurrentStreak ?? initialStreak;
    const longestStreak = initialLongestStreak;
    const totalPoints = summary?.totalPoints ?? initialTotalPoints;
    const weeklyPoints = summary?.actualWeeklyPoints ?? 0;
    const sevenDayActivity = summary?.sevenDayActivity ?? initialSevenDayActivity;

    const todayIndex = getCalendarWeekTodayIndex();
    const isHotStreak = streak >= 7;
    const isNewRecord = streak > 0 && streak >= longestStreak;

    const activeDaysThisWeek = sevenDayActivity
        .slice(0, todayIndex + 1)
        .filter(Boolean).length;
    const weekActivityPct = Math.round((activeDaysThisWeek / 7) * 100);
    const isSidebar = variant === "sidebar";
    const isHeader = variant === "header";
    const isRail = isSidebar || isHeader;

    const cardGradient = isHotStreak
        ? "linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-surface) 28%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-end)) 100%)"
        : "linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 16%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)";
    const cardBorder = isHotStreak ? "var(--tone-speaking-border)" : "var(--tone-quizzes-border)";
    const flameIconSize = isRail ? 20 : 24;
    const flameShellSize = isRail ? "w-10 h-10" : "w-12 h-12";
    const dotSize = isRail ? "w-6 h-6" : "w-7 h-7";
    const dotIconActive = isRail ? 12 : 15;
    const dotIconToday = isRail ? 10 : 13;
    const compactMessage = (streak: number, longest: number) =>
        isRail ? getSidebarMessage(streak, longest) : getMessage(streak, longest);

    const pointsBadge = (
        <span
            className={`inline-flex items-center font-bold leading-none tabular-nums rounded-full dashboard-pill stats-badge-polish ${
                isRail ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1"
            }`}
            style={{
                background: "color-mix(in srgb, var(--primary) 14%, var(--dashboard-surface-start))",
                color: "var(--primary)",
                border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
            }}
        >
            {totalPoints.toLocaleString()} pts
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
        <div
            className={
                isRail
                    ? `grid w-full grid-cols-7 ${isHeader ? "gap-1" : "gap-0.5"}`
                    : "mt-3 flex items-end justify-between"
            }
        >
            {sevenDayActivity.map((active, i) => {
                const isToday = i === todayIndex;
                const isFuture = i > todayIndex;
                return (
                    <div
                        key={i}
                        className={`flex flex-col items-center min-w-0 ${isRail ? "gap-0.5" : "gap-1"}`}
                    >
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
                            className={`font-semibold leading-none ${isRail ? "text-[9px]" : "text-[10px]"}`}
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

    const activityBar = (
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
    );

    const sidebarActivityBar = (
        <div
            className={`relative w-full overflow-hidden rounded-full border h-2.5 ${
                weekActivityPct >= 100
                    ? "border-[#d7c09a]/50 dark:border-[rgba(245,217,138,0.24)]"
                    : "border-[#e8e0d4]/50 dark:border-[rgba(226,232,240,0.24)]"
            }`}
            style={{
                background: weekActivityPct >= 100
                    ? "var(--checklist-track-bg-complete)"
                    : "var(--checklist-track-bg)",
            }}
        >
            <div
                className="absolute inset-y-0 left-0 rounded-[999px] transition-[width] duration-700 ease-out"
                style={{
                    width: `${weekActivityPct}%`,
                    background: weekActivityPct >= 100
                        ? "linear-gradient(90deg, #b8442a 0%, #d96838 35%, #e8933a 70%, #f5c842 100%)"
                        : "linear-gradient(90deg, #c8552e 0%, #dd6b36 40%, #e8882e 75%, #f0a832 100%)",
                }}
            />
        </div>
    );

    const railWeeklyFooter = (
        <div className={`${isHeader ? "mt-1" : "mt-3"} space-y-1 min-w-0`}>
            <div className="flex items-center justify-between gap-2 text-[10px] leading-none">
                {weeklyPoints > 0 ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-text tabular-nums">
                        <StarIcon className="text-[var(--tone-speaking-accent)] shrink-0" size={11} />
                        {weeklyPoints}
                        <span className="font-medium text-text-muted">this week</span>
                    </span>
                ) : (
                    <span className="font-medium text-text-muted">No points yet this week</span>
                )}
                <span className="font-medium text-text-muted tabular-nums shrink-0">
                    {activeDaysThisWeek}<span className="text-text-soft">/7 active</span>
                </span>
            </div>
            {sidebarActivityBar}
        </div>
    );

    const weeklyFooter = isRail ? (
        railWeeklyFooter
    ) : (
        <div className="mt-3 flex items-center gap-2.5 min-w-0">
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
            <div className="min-w-0 flex-1">{activityBar}</div>
            <span className="text-[10px] font-medium text-text-muted leading-none shrink-0 tabular-nums">
                {activeDaysThisWeek}<span className="text-text-soft">/7 days</span>
            </span>
        </div>
    );

    const railCardClass =
        "group block w-full min-w-0 rounded-2xl border transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35";
    const weekDotsTrack = (
        <div
            className={`rounded-xl border px-1 py-1.5 ${isHeader ? "px-1.5" : ""}`}
            style={{
                background: "color-mix(in srgb, var(--dashboard-surface-start) 72%, transparent)",
                borderColor: "color-mix(in srgb, var(--dashboard-border) 55%, transparent)",
            }}
        >
            {weekDots}
        </div>
    );

    const flameOrb = (
        <div
            className={`${flameShellSize} rounded-full flex items-center justify-center shrink-0 shadow-sm ${isHotStreak ? "animate-pulse" : ""}`}
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
    );

    return (
        <Link
            href="/dashboard/profile"
            className={
                isHeader && embedded
                    ? "group block w-full min-w-0 rounded-xl p-0 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    : isRail
                        ? `${railCardClass} ${isHeader ? "max-w-[420px] shrink-0 p-3" : "p-3.5"}`
                        : "dashboard-panel rounded-2xl p-4 block transition-shadow hover:shadow-lg"
            }
            style={
                isHeader && embedded
                    ? undefined
                    : { background: cardGradient, borderColor: cardBorder }
            }
        >
            {isHeader ? (
                <div
                    className={
                        embedded
                            ? borderless
                                ? "w-full min-w-0 py-0.5"
                                : "w-full min-w-0 rounded-xl border p-3.5 sm:p-4"
                            : undefined
                    }
                    style={
                        embedded && !borderless
                            ? { background: cardGradient, borderColor: cardBorder }
                            : undefined
                    }
                >
                    {embedded ? (
                        <div className="flex flex-col gap-2 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    {flameOrb}
                                    <div className="min-w-0">
                                        {streakHeading}
                                        <p className="text-[11px] text-text-muted mt-1 leading-snug">
                                            {compactMessage(streak, longestStreak)}
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 pt-0.5">{pointsBadge}</div>
                            </div>
                            {weekDotsTrack}
                            {railWeeklyFooter}
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="flex items-start gap-2.5 shrink-0">
                                {flameOrb}
                                <div className="min-w-0">
                                    {streakHeading}
                                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                                        {compactMessage(streak, longestStreak)}
                                    </p>
                                    <div className="mt-1.5">{pointsBadge}</div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                {weekDotsTrack}
                                {railWeeklyFooter}
                            </div>
                        </div>
                    )}
                </div>
            ) : isSidebar ? (
                <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mb-2.5">
                        Your momentum
                    </p>
                    <div className="flex items-start gap-2.5 min-w-0">
                        {flameOrb}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-2xl font-display font-bold text-text leading-none tabular-nums">
                                            {streak}
                                        </span>
                                        <span className="text-xs font-medium text-text-muted">
                                            day{streak !== 1 ? "s" : ""}
                                        </span>
                                        {isNewRecord && streak > 0 && (
                                            <span
                                                className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                                                style={{
                                                    background: "var(--tone-speaking-surface)",
                                                    color: "var(--tone-speaking-chip-text)",
                                                }}
                                            >
                                                Best
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                                        {getSidebarMessage(streak, longestStreak)}
                                    </p>
                                </div>
                                {pointsBadge}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">{weekDotsTrack}</div>
                    {weeklyFooter}
                </>
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
                        {pointsBadge}
                    </div>
                    {weekDots}
                    {weeklyFooter}
                </>
            )}
        </Link>
    );
}
