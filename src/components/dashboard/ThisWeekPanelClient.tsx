"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ActivityTimeline, type TimelineItem } from "@/components/dashboard/ActivityTimeline";
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
}

export function ThisWeekPanelClient({
    weekNumber,
    weekTitle,
    unitNumber,
    progress,
    items,
    continueHref,
    continueLabel,
    mapHref,
}: ThisWeekPanelClientProps) {
    const [expanded, setExpanded] = useState(false);
    const panelId = useId();
    const tone = getCourseMapUnitTone(unitNumber);
    const accent = { fg: tone.accent, bg: tone.surface };

    const currentItem =
        items.find((item) => item.status === "current") ??
        items.find((item) => item.status === "todo");
    const collapsedItems = currentItem ? [currentItem] : items.slice(0, 1);
    const canExpand = items.length > 1;
    const visibleItems = expanded ? items : collapsedItems;

    return (
        <section aria-label="This week">
            <div
                className="dashboard-panel rounded-3xl overflow-hidden"
                style={{ border: `1px solid color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-border))` }}
            >
                <div
                    className="border-b px-5 py-2.5"
                    style={{
                        borderColor: "var(--dashboard-border)",
                        background: `color-mix(in srgb, ${tone.surface} 70%, var(--dashboard-surface-start))`,
                    }}
                >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 gap-y-0.5">
                        <span
                            className="text-xs font-bold leading-none"
                            style={{ color: tone.accent }}
                        >
                            Week {weekNumber}
                        </span>
                        <span className="text-xs font-bold leading-none tabular-nums text-text-muted">
                            {progress.done} of {progress.total}
                        </span>
                        <h2 className="col-span-2 m-0 font-display text-[1.65rem] font-bold leading-[1.1] tracking-tight text-text">
                            {weekTitle}
                        </h2>
                    </div>
                </div>

                <div className="px-5 pt-2" id={panelId}>
                    <ActivityTimeline
                        items={visibleItems}
                        accent={accent}
                        layout="list"
                        showStartButton={false}
                        plain
                    />
                </div>

                <div className="flex items-center justify-between gap-3 px-5 pt-1">
                    {canExpand ? (
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            style={{ color: tone.accent }}
                            aria-expanded={expanded}
                            aria-controls={panelId}
                            onClick={() => setExpanded((open) => !open)}
                        >
                            {expanded ? "Show less" : "See full week"}
                            <ChevronDown
                                size={16}
                                aria-hidden
                                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                            />
                        </button>
                    ) : (
                        <span />
                    )}
                    <Link
                        href={mapHref}
                        className="inline-flex items-center gap-0.5 rounded-lg py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        style={{ color: tone.accent }}
                    >
                        Full map
                        <ArrowRight size={14} aria-hidden />
                    </Link>
                </div>

                <div className="px-5 pb-4 pt-1">
                    <Link
                        href={continueHref}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold text-white transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ background: tone.accent }}
                    >
                        {continueLabel}
                        <ArrowRight size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
