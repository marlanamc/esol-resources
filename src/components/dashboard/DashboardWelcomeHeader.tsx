import type { ReactNode } from "react";
import {
    getTimeOfDayGreeting,
    getWelcomeEyebrow,
    getWelcomeMessage,
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
    const { subline } = getWelcomeMessage({
        mode,
        streak,
        weeklyCompleted,
        weeklyGoal,
        leaderboardRank,
        weekLabel,
    });

    return (
        <div className={`relative pt-1 pb-0 ${className}`.trim()}>
            {/* Quiet ambient glow — reduced from 50/35 to 22/18 so it doesn't compete */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-6 top-0 h-28 w-56 rounded-full opacity-[0.22] blur-3xl"
                style={{ background: "color-mix(in srgb, var(--primary) 16%, transparent)" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute left-32 top-6 h-20 w-36 rounded-full opacity-[0.18] blur-3xl"
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
                    <span className="block text-base font-medium text-text-muted sm:text-lg">
                        {greeting},
                    </span>
                    <span className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="relative inline-block leading-none text-[2rem] text-primary sm:text-[2.35rem]">
                            {displayName}
                            <span className="absolute -bottom-1 left-0 right-0 -z-10 h-3 -rotate-1 rounded-sm bg-[#88A392]/35" />
                        </span>
                        {nameEmoji ? (
                            <span className="inline-flex text-[1.85rem] leading-none sm:text-[2rem]">{nameEmoji}</span>
                        ) : null}
                    </span>
                </h1>

                {/* One-line subline only — streak/rank chips removed; they live in the sidebar MomentumCard */}
                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-text-muted/95 sm:text-[15px]">
                    {subline}
                </p>
            </div>
        </div>
    );
}
