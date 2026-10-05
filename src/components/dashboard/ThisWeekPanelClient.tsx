"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown, ChevronRight, Play } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import {
    ActivityRow,
    SegmentedProgress,
    timelineToRoadActivities,
} from "@/components/dashboard/course-map-road/parts";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import type { RoadActivity } from "@/lib/course-map-road";

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
    unitMonth,
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
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;

    // Same rows and colors as the course map road, so desktop and mobile read as one app.
    const activities = timelineToRoadActivities(items, weekNumber);
    const currentItem = activities.find((activity) => activity.isNext);
    const collapsedItems = previewAroundCurrent(activities, currentItem, collapsedLimit);
    const canExpand = activities.length > collapsedItems.length;
    const visibleItems = expanded ? activities : collapsedItems;
    const divider = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"} className={roadStyles.road}>
            <div
                className="overflow-hidden rounded-3xl"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    boxShadow: "0 12px 28px rgba(40,31,23,.08)",
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
                            className="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            You are here
                        </span>
                    </div>
                    <h2 className="m-0 mt-1.5 font-display text-[1.65rem] font-bold leading-[1.1] tracking-tight text-text">
                        {weekTitle}
                    </h2>
                    {activities.length > 0 ? (
                        <div className="mt-3 flex items-center gap-3">
                            <SegmentedProgress activities={activities} accent={tone.accent} />
                            <span className="text-sm font-bold whitespace-nowrap text-text-muted">
                                {progress.done} of {progress.total} done
                            </span>
                        </div>
                    ) : null}
                </div>

                <div id={panelId}>
                    {visibleItems.map((activity) => (
                        <ActivityRow key={activity.id} activity={activity} showNext inset={20} />
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3" style={{ borderTop: divider }}>
                    <Link
                        href={continueHref}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            background: tone.button,
                            color: "var(--road-on-accent)",
                            boxShadow: `0 8px 18px color-mix(in srgb, ${tone.button} 25%, transparent)`,
                        }}
                    >
                        <Play size={14} fill="currentColor" aria-hidden />
                        {continueLabel}
                    </Link>
                    <div className="flex items-center gap-4">
                        {canExpand ? (
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg py-2 text-sm font-bold text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                onClick={() => setExpanded((open) => !open)}
                            >
                                {expanded ? "Show less" : `See all ${activities.length}`}
                                <ChevronDown
                                    size={16}
                                    aria-hidden
                                    className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                                />
                            </button>
                        ) : null}
                        <Link
                            href={mapHref}
                            className="inline-flex items-center gap-0.5 rounded-lg py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            style={{ color: tone.accent }}
                        >
                            Open map
                            <ChevronRight size={16} aria-hidden />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function previewAroundCurrent(
    items: RoadActivity[],
    currentItem: RoadActivity | undefined,
    limit: number
): RoadActivity[] {
    if (items.length === 0 || limit <= 0) return [];
    if (limit >= items.length) return items;
    if (limit === 1) return currentItem ? [currentItem] : items.slice(0, 1);

    const idx = currentItem
        ? Math.max(0, items.findIndex((item) => item.id === currentItem.id))
        : 0;
    const start = Math.max(0, Math.min(idx - 1, items.length - limit));
    return items.slice(start, start + limit);
}
