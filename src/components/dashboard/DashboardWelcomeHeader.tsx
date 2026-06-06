import type { ReactNode } from "react";
import {
    getTimeOfDayGreeting,
    getWelcomeChips,
    getWelcomeEyebrow,
    getWelcomeMessage,
    type DashboardWelcomeChip,
    type DashboardWelcomeMode,
} from "@/lib/dashboard/welcome-header";

interface DashboardWelcomeHeaderProps {
    userName: string;
    mode: DashboardWelcomeMode;
    nameEmoji?: ReactNode;
    weekLabel?: string;
    streak?: number;
    weeklyCompleted?: number;
    weeklyGoal?: number;
    leaderboardRank?: number | null;
    className?: string;
}

const CHIP_TONE_STYLES: Record<NonNullable<DashboardWelcomeChip["tone"]>, string> = {
    default: "border-[color:color-mix(in_srgb,var(--dashboard-border)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-surface-start)_88%,var(--dashboard-shell-bg))] text-text-muted",
    primary: "border-[color:color-mix(in_srgb,var(--primary)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--dashboard-surface-start))] text-primary",
    secondary: "border-[color:color-mix(in_srgb,var(--secondary)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--secondary)_12%,var(--dashboard-surface-start))] text-[color:var(--secondary-dark)]",
    accent: "border-[color:color-mix(in_srgb,var(--accent-dark)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_18%,var(--dashboard-surface-start))] text-[color:var(--accent-dark)]",
};

export function DashboardWelcomeHeader({
    userName,
    mode,
    nameEmoji,
    weekLabel,
    streak = 0,
    weeklyCompleted,
    weeklyGoal,
    leaderboardRank,
    className = "",
}: DashboardWelcomeHeaderProps) {
    const displayName = userName.trim() || "there";
    const eyebrow = getWelcomeEyebrow(mode, weekLabel);
    const greeting = getTimeOfDayGreeting();
    const { subline, highlight } = getWelcomeMessage({
        mode,
        streak,
        weeklyCompleted,
        weeklyGoal,
        leaderboardRank,
        weekLabel,
    });
    const chips = getWelcomeChips({
        streak,
        leaderboardRank,
        highlight,
    });

    return (
        <div className={`relative pt-2 pb-1 ${className}`.trim()}>
            <div
                aria-hidden
                className="pointer-events-none absolute -left-6 top-0 h-28 w-56 rounded-full opacity-50 blur-3xl"
                style={{ background: "color-mix(in srgb, var(--primary) 16%, transparent)" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute left-32 top-6 h-20 w-36 rounded-full opacity-35 blur-3xl"
                style={{ background: "color-mix(in srgb, var(--secondary) 18%, transparent)" }}
            />

            <div className="relative min-w-0">
                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                    <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                        aria-hidden
                    >
                        {eyebrow.icon}
                    </span>
                    {eyebrow.label}
                </p>

                <h1
                    className="font-display font-bold text-text leading-[1.05] tracking-tight"
                    style={{ textWrap: "balance" }}
                >
                    <span className="block text-xl font-medium text-text-muted sm:text-[1.35rem]">
                        {greeting},
                    </span>
                    <span className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[2.35rem] text-primary relative inline-block leading-none sm:text-[2.75rem]">
                            {displayName}
                            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#88A392]/35 -z-10 rounded-sm -rotate-1" />
                        </span>
                        {nameEmoji ? (
                            <span className="inline-flex text-[1.85rem] leading-none sm:text-[2rem]">{nameEmoji}</span>
                        ) : null}
                    </span>
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-text-muted/95 sm:text-[15px]">
                    {subline}
                </p>

                {chips.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Your progress highlights">
                        {chips.map((chip) => (
                            <li
                                key={chip.key}
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none ${CHIP_TONE_STYLES[chip.tone ?? "default"]}`}
                            >
                                {chip.label}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    );
}
