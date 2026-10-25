"use client";

import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import { WeekStepLines } from "@/components/dashboard/WeekStepLines";
import { WeekLearningDisclosure } from "@/components/dashboard/course-map-road/parts";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

export interface ThisWeekPanelClientProps {
    weekNumber: number;
    weekTitle: string;
    weekGoal?: string;
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    progress: { done: number; total: number };
    items: TimelineItem[];
    continueHref: string;
    continueLabel: string;
    mapHref: string;
    showUnitMonths?: boolean;
}

export function ThisWeekPanelClient({
    weekNumber,
    weekTitle,
    unitNumber,
    unitMonth,
    items,
    continueHref,
    continueLabel,
    mapHref,
    showUnitMonths = true,
}: ThisWeekPanelClientProps) {
    const tone = getCourseMapUnitTone(unitNumber);
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;

    const divider = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"} className={roadStyles.road}>
            <div
                className="overflow-hidden rounded-3xl"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    boxShadow: "var(--elevation-raised, 0 12px 28px rgba(40,31,23,.12))",
                }}
            >
                <div className="px-5 pt-4 pb-3.5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-bold text-text-muted">
                            {unitNumber > 0 ? (
                                <>
                                    <span style={{ color: tone.accent }}>{unitLabel}</span> ·{" "}
                                </>
                            ) : null}
                            {weekLabel}
                        </span>
                        <span
                            className="shrink-0 rounded-full px-2.5 py-[3px] text-[0.6875rem] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            You are here
                        </span>
                    </div>
                    <h2 className="m-0 mt-1.5 font-display text-[1.65rem] font-bold leading-[1.1] tracking-tight text-text">
                        {weekTitle}
                    </h2>
                    <WeekLearningDisclosure weekNumber={weekNumber} accent={tone.accent} className="mt-1" />
                </div>

                {/* Same steps as the phone home and the Map, so the routine reads the same everywhere. */}
                <WeekStepLines items={items} weekNumber={weekNumber} mapHref={mapHref} showUnitMonths={showUnitMonths} accent={tone.button} inset={20} />

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3" style={{ borderTop: divider }}>
                    <Link
                        href={continueHref}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-bold transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            background: tone.button,
                            color: "var(--road-on-accent)",
                            boxShadow: `0 8px 18px color-mix(in srgb, ${tone.button} 25%, transparent)`,
                        }}
                    >
                        <Play size={14} fill="currentColor" aria-hidden />
                        {continueLabel}
                    </Link>
                    <Link
                        href={mapHref}
                        className="inline-flex items-center gap-0.5 rounded-lg py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        style={{ color: tone.accent }}
                    >
                        More practice on the Map
                        <ChevronRight size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
