"use client";

import Link from "next/link";
import { FlameIcon, CheckCircleIcon } from "@/components/icons/Icons";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";
import { useStudentSummary } from "@/hooks/useStudentSummary";
import {
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekTodayIndex,
} from "@/lib/gamification/calendar-week";

const STREAK_ACCENT = "var(--primary)";
const STREAK_ACCENT_DARK = "var(--primary-dark)";

function StreakProgressRing({
    streak,
    pct,
    size = 52,
}: {
    streak: number;
    pct: number;
    size?: number;
}) {
    const stroke = size >= 70 ? 7 : 4;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * (Math.min(100, Math.max(0, pct)) / 100);
    const innerSize = size - stroke * 2 - 2;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="absolute inset-0">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="color-mix(in srgb, var(--dashboard-border) 70%, transparent)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={STREAK_ACCENT}
                    strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: "stroke-dasharray 0.8s ease-out" }}
                />
            </svg>
            <div
                className="absolute rounded-full flex flex-col items-center justify-center leading-none"
                style={{
                    width: innerSize,
                    height: innerSize,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "var(--dashboard-surface-start)",
                }}
            >
                <FlameIcon size={size >= 70 ? 14 : 10} style={{ color: STREAK_ACCENT }} />
                <span className={`${size >= 70 ? "text-[25px]" : "text-sm"} mt-px font-extrabold tabular-nums text-text leading-none`}>{streak}</span>
            </div>
        </div>
    );
}

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
    const streakRingPct = isRail ? Math.min(100, streak * 10) : Math.round((activeDaysThisWeek / 7) * 100);
    const daysToPerfectWeek = Math.max(0, 7 - activeDaysThisWeek);

    const pointsBadge = (
        <span
            className={`inline-flex items-center gap-1 font-bold leading-none tabular-nums rounded-full dashboard-pill stats-badge-polish ${
                isRail ? "text-xs px-3 py-1" : "text-[11px] px-2.5 py-1"
            }`}
            style={{
                background: "color-mix(in srgb, var(--primary) 14%, var(--dashboard-surface-start))",
                color: STREAK_ACCENT_DARK,
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

    const weeklyFooter = (
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
        "group block w-full min-w-0 rounded-[26px] border transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";
    const refinedWeekDots = (
        <div className="grid w-full grid-cols-7 gap-1.5">
            {sevenDayActivity.map((active, i) => {
                const isToday = i === todayIndex;
                const isFuture = i > todayIndex;
                const isMissed = !active && !isToday && !isFuture;

                return (
                    <div key={i} className="flex min-w-0 flex-col items-center gap-1.5">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
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
                            {active ? (
                                <span className="text-white">
                                    <CheckIcon size={16} />
                                </span>
                            ) : null}
                        </div>
                        <span
                            className="text-xs font-bold leading-none"
                            style={{
                                color: isToday
                                    ? streakAccent
                                    : isFuture
                                        ? "var(--text-soft, var(--text-muted))"
                                        : "var(--text-muted)",
                            }}
                        >
                            {CALENDAR_WEEK_DAY_LABELS[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const refinedRailFooter = (
        <div className="mt-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-3 text-[13px] font-semibold text-text-muted">
                <p>
                    <span className="text-text tabular-nums">{activeDaysThisWeek} / 7</span>
                    <span className="ml-2">this week</span>
                </p>
                <p className="tabular-nums">
                    {daysToPerfectWeek === 0
                        ? "Perfect week"
                        : `${daysToPerfectWeek} day${daysToPerfectWeek === 1 ? "" : "s"} to perfect week`}
                </p>
            </div>
            <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ background: "color-mix(in srgb, var(--dashboard-border) 38%, var(--dashboard-surface-start))" }}
            >
                <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                        width: `${weekActivityPct}%`,
                        background: `linear-gradient(90deg, ${STREAK_ACCENT} 0%, color-mix(in srgb, ${STREAK_ACCENT} 82%, var(--primary-light)) 100%)`,
                    }}
                />
            </div>
        </div>
    );

    const refinedRailBody = (
        <div className="flex flex-col gap-3">
            {/* Top row: ring + title + pts badge all inline */}
            <div className="flex items-center gap-3">
                <StreakProgressRing streak={streak} pct={streakRingPct} size={52} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-display text-sm font-bold leading-tight text-text">
                            Hot streak
                        </p>
                        {pointsBadge}
                    </div>
                    <p className="mt-0.5 text-xs font-medium leading-tight text-text-muted">
                        {streak > 0 ? "Keep going!" : "Start today"}
                    </p>
                </div>
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
            {/* Footer: X/7 + days to perfect week + thin bar */}
            <div>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold text-text-muted">
                    <span><span className="text-text tabular-nums">{activeDaysThisWeek} / 7</span> this week</span>
                    <span className="tabular-nums">
                        {daysToPerfectWeek === 0 ? "Perfect week" : `${daysToPerfectWeek} day${daysToPerfectWeek === 1 ? "" : "s"} to go`}
                    </span>
                </div>
                <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: "color-mix(in srgb, var(--dashboard-border) 38%, var(--dashboard-surface-start))" }}
                >
                    <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{
                            width: `${weekActivityPct}%`,
                            background: `linear-gradient(90deg, ${STREAK_ACCENT} 0%, color-mix(in srgb, ${STREAK_ACCENT} 82%, var(--primary-light)) 100%)`,
                        }}
                    />
                </div>
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
                        {pointsBadge}
                    </div>
                    {weekDots}
                    {weeklyFooter}
                </>
            )}
        </Link>
    );
}
