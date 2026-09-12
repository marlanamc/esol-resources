"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ActivityTimeline, type TimelineItem } from "@/components/dashboard/ActivityTimeline";
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
    /** How many timeline rows to show before "See full week". Desktop can show more. */
    collapsedLimit?: number;
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
    showUnitMonths = true,
    collapsedLimit = 1,
}: ThisWeekPanelClientProps) {
    const [expanded, setExpanded] = useState(false);
    const panelId = useId();
    const tone = getCourseMapUnitTone(unitNumber);
    const accent = { fg: "var(--primary)", bg: "var(--surface-base)" };

    const currentItem =
        items.find((item) => item.status === "current") ??
        items.find((item) => item.status === "todo");
    const collapsedItems = previewAroundCurrent(items, currentItem, collapsedLimit);
    const canExpand = items.length > collapsedItems.length;
    const visibleItems = expanded ? items : collapsedItems;
    const progressPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"}>
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
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
                        <div className="min-w-0">
                            <span
                                className="block text-xs font-bold leading-none"
                                style={{ color: tone.accent }}
                            >
                                {formatLevelLabel(weekNumber, showUnitMonths)}
                            </span>
                            <h2 className="m-0 mt-1 font-display text-[1.65rem] font-bold leading-[1.1] tracking-tight text-text">
                                {weekTitle}
                            </h2>
                        </div>
                        <WeekProgressRing
                            pct={progressPct}
                            done={progress.done}
                            total={progress.total}
                            noun={showUnitMonths ? "week" : "level"}
                        />
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
                            className="inline-flex items-center gap-1 rounded-lg py-2 text-sm font-bold text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            aria-expanded={expanded}
                            aria-controls={panelId}
                            onClick={() => setExpanded((open) => !open)}
                        >
                            {expanded ? "Show less" : showUnitMonths ? "See full week" : "See full level"}
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
                        className="inline-flex items-center gap-0.5 rounded-lg py-2 text-sm font-bold text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Full map
                        <ArrowRight size={14} aria-hidden />
                    </Link>
                </div>

                <div className="px-5 pb-4 pt-1">
                    <Link
                        href={continueHref}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 lg:w-auto lg:min-w-[10.5rem] lg:px-7"
                        style={{ background: "var(--primary)", color: "var(--text-on-accent)" }}
                    >
                        {continueLabel}
                        <ArrowRight size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function previewAroundCurrent(
    items: TimelineItem[],
    currentItem: TimelineItem | undefined,
    limit: number
): TimelineItem[] {
    if (items.length === 0 || limit <= 0) return [];
    if (limit >= items.length) return items;
    if (limit === 1) return currentItem ? [currentItem] : items.slice(0, 1);

    const idx = currentItem
        ? Math.max(0, items.findIndex((item) => item.activityId === currentItem.activityId))
        : 0;
    const start = Math.max(0, Math.min(idx - 1, items.length - limit));
    return items.slice(start, start + limit);
}

function WeekProgressRing({
    pct,
    done,
    total,
    noun,
}: {
    pct: number;
    done: number;
    total: number;
    noun: string;
}) {
    const size = 46;
    const stroke = 4.5;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * (pct / 100);

    return (
        <span
            className="relative inline-flex shrink-0"
            role="img"
            aria-label={`${done} of ${total} ${noun} activities done, ${pct} percent`}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="var(--dashboard-border)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[11px] font-extrabold tabular-nums leading-none text-text">
                {pct}%
            </span>
        </span>
    );
}
