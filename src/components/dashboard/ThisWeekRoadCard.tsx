"use client";

import Link from "next/link";
import { ChevronRight, Flame, Play, Star } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import { WeekStepLines } from "@/components/dashboard/WeekStepLines";
import { WeekLearningDisclosure } from "@/components/dashboard/course-map-road/parts";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

export interface ThisWeekRoadCardProps {
    weekNumber: number;
    weekTitle: string;
    unitNumber: number;
    unitMonth: string;
    progress: { done: number; total: number };
    items: TimelineItem[];
    currentTitle: string;
    continueHref: string;
    continueLabel: "Start here" | "Continue" | "Review this week";
    mapHref: string;
    showUnitMonths?: boolean;
    /** Streak and ledger points this week; shown on the line under the road. */
    momentum?: { streak: number; weeklyPoints: number } | null;
}

const DIVIDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

/** The course map's "You are here" card, sized for the mobile home. */
export function ThisWeekRoadCard({
    weekNumber,
    weekTitle,
    unitNumber,
    unitMonth,
    progress,
    items,
    currentTitle,
    continueHref,
    mapHref,
    showUnitMonths = true,
    momentum = null,
}: ThisWeekRoadCardProps) {
    const tone = getCourseMapUnitTone(unitNumber);
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;
    const weekDone = progress.total > 0 && progress.done >= progress.total;
    const showMomentum = momentum != null && (momentum.streak > 0 || momentum.weeklyPoints > 0);

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"} className={`font-legible ${roadStyles.road}`}>
            <div
                className="overflow-hidden rounded-[20px]"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    // Negative spread keeps the shadow inside the card's width: .dashboard-shell clips
                    // overflow-x on phones, which cut a wide shadow into a hard band under the card.
                    boxShadow: "0 1px 2px rgba(40,31,23,.06), 0 10px 16px -8px rgba(40,31,23,.18)",
                }}
            >
                <div className="px-4 pt-2.5 pb-2" style={{ background: tone.surface }}>
                    <span className="flex items-center justify-between gap-2.5 text-[0.8438rem] font-bold leading-tight text-text-muted">
                        <span className="min-w-0 truncate">
                            <span style={{ color: tone.accent }}>{unitLabel}</span> · {weekLabel}
                        </span>
                        {momentum && showMomentum ? (
                            <span className="flex shrink-0 items-center gap-2.5 text-[0.8125rem]">
                                {momentum.streak > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <Flame size={14} aria-hidden style={{ color: "var(--tone-speaking-accent, #b56e1a)" }} />
                                        <span className="text-text">{momentum.streak}</span>
                                        <span className="sr-only"> {momentum.streak === 1 ? "day" : "days"} in a row</span>
                                    </span>
                                ) : null}
                                <span className="flex items-center gap-1">
                                    <Star size={14} aria-hidden fill="var(--accent-color, #e9c46a)" style={{ color: "#cba342" }} />
                                    <span className="text-text">{momentum.weeklyPoints.toLocaleString()}</span>
                                    <span className="sr-only"> points this week</span>
                                </span>
                            </span>
                        ) : null}
                    </span>
                    <h2 className="mt-1 mb-0 font-display text-[1.5625rem] font-bold leading-[1.12] text-balance text-text">{weekTitle}</h2>
                    <WeekLearningDisclosure weekNumber={weekNumber} accent={tone.accent} compact className="mt-0.5" />
                </div>

                <div className="px-3 pt-2 pb-2.5">
                    {weekDone ? (
                        <div className="rounded-[14px] px-4 py-3" style={{ background: "var(--road-done-bg)" }}>
                            <p className="m-0 font-display text-[1.1875rem] font-bold" style={{ color: "var(--road-done-text)" }}>
                                You finished {weekLabel}.
                            </p>
                            <p className="mt-1 mb-0 text-[0.875rem] text-text">You can review anything on the map.</p>
                        </div>
                    ) : (
                        <Link
                            href={continueHref}
                            className="flex min-h-[60px] items-center gap-3 rounded-[14px] py-2 pr-3.5 pl-2.5 transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            style={{
                                background: tone.button,
                                color: "var(--road-on-accent)",
                                boxShadow: `0 8px 18px -8px color-mix(in srgb, ${tone.button} 70%, transparent)`,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                style={{ background: "var(--road-on-accent)", color: tone.button }}
                            >
                                <Play size={16} fill="currentColor" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[0.6875rem] font-extrabold uppercase tracking-[.06em] opacity-90">Next up</span>
                                <span className="block text-[1.0625rem] font-bold leading-snug">{currentTitle}</span>
                            </span>
                            <ChevronRight size={20} strokeWidth={2.5} aria-hidden className="shrink-0" />
                        </Link>
                    )}
                </div>

                <WeekStepLines items={items} weekNumber={weekNumber} mapHref={mapHref} showUnitMonths={showUnitMonths} accent={tone.button} />

                <Link
                    href={mapHref}
                    className="flex min-h-12 items-center justify-center gap-1 text-[0.875rem] font-bold text-text-muted"
                    style={{ borderTop: DIVIDER }}
                >
                    More practice on the Map
                    <ChevronRight size={16} aria-hidden />
                </Link>
            </div>
        </section>
    );
}
