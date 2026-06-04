import type { ReactNode } from "react";
import { MomentumCard } from "@/components/dashboard/MomentumCard";
import { formatDashboardWeekRangeLabel } from "@/lib/dashboard/week-range-label";

export type DashboardWelcomeHeroMomentumProps = {
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
};

interface DashboardWelcomeHeroProps {
    userName: string;
    nameEmoji?: ReactNode;
    momentum: DashboardWelcomeHeroMomentumProps;
    weekLabel?: string;
    /** Inside shared week hub panel — no extra outer card */
    weekHub?: boolean;
}

export function DashboardWelcomeHero({
    userName,
    nameEmoji,
    momentum,
    weekLabel = formatDashboardWeekRangeLabel(new Date()),
    weekHub = false,
}: DashboardWelcomeHeroProps) {
    const displayName = userName.trim() || "there";

    return (
        <section
            className={`hidden lg:flex w-full min-w-0 ${weekHub ? "" : "dashboard-panel paper-texture rounded-2xl overflow-hidden"}`}
            aria-label="Welcome"
        >
            <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-6 py-4 xl:px-8 xl:py-4.5 xl:pr-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted flex items-center gap-2">
                        <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-sm leading-none bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                            aria-hidden
                        >
                            📋
                        </span>
                        {weekLabel}
                    </p>
                    <h1
                        className="font-display font-bold text-text leading-tight tracking-tight flex items-baseline gap-x-2.5 gap-y-1 flex-wrap"
                        style={{ textWrap: "balance" }}
                    >
                        <span className="text-lg xl:text-xl text-text-muted font-medium">
                            Welcome back,
                        </span>
                        <span className="text-[1.8rem] xl:text-[2rem] text-primary relative inline-block leading-none">
                            {displayName}
                            <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-[#88A392]/40 -z-10 rounded-sm -rotate-1" />
                        </span>
                        {nameEmoji ? (
                            <span className="inline-flex text-2xl leading-none">{nameEmoji}</span>
                        ) : null}
                    </h1>
                    <p className="text-xs text-text-muted/90 leading-relaxed max-w-lg mt-0.5">
                        Here&apos;s your path and progress for this week.
                    </p>
                </div>

                <div
                    className={`hidden xl:block w-px shrink-0 self-stretch ${weekHub ? "my-4" : "my-5"}`}
                    style={{ background: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}
                    aria-hidden
                />

                <div
                    className={`w-full shrink-0 ${
                        weekHub
                            ? "px-6 pb-4 pt-0 xl:w-[min(100%,380px)] xl:px-8 xl:pb-4.5 xl:pt-4 xl:pl-4"
                            : "px-6 pb-4 pt-0 xl:w-[min(100%,380px)] xl:px-8 xl:py-4.5 xl:pl-2 xl:pb-4.5 xl:pt-4"
                    }`}
                >
                    <MomentumCard variant="header" embedded borderless={weekHub} {...momentum} />
                </div>
            </div>
        </section>
    );
}
