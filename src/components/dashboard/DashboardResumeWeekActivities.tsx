"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ActivityTimeline, type TimelineItem } from "@/components/dashboard/ActivityTimeline";

interface DashboardResumeWeekActivitiesProps {
    items: TimelineItem[];
    accent: { fg: string; bg: string };
    toneButton: string;
}

export function DashboardResumeWeekActivities({
    items,
    accent,
    toneButton,
}: DashboardResumeWeekActivitiesProps) {
    const [expanded, setExpanded] = useState(false);
    const panelId = useId();

    if (items.length <= 1) return null;

    const doneCount = items.filter((item) => item.status === "done").length;
    const upcomingCount = items.filter(
        (item) => item.status === "todo" || item.status === "current"
    ).length;

    const summary =
        doneCount > 0 && upcomingCount > 0
            ? `${doneCount} done · ${upcomingCount} to go`
            : doneCount > 0
              ? `${doneCount} done`
              : `${upcomingCount} activities`;

    const toggleLabel = expanded
        ? "Hide this week's activities"
        : `See all ${items.length} activities this week`;

    return (
        <>
            <div
                className="mt-5 border-t pt-4 lg:hidden"
                style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 80%, transparent)" }}
            >
                <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setExpanded((open) => !open)}
                >
                    <span className="min-w-0">
                        <span
                            className="block text-[11px] font-extrabold uppercase tracking-[0.14em]"
                            style={{ color: toneButton }}
                        >
                            This week
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-text">{toggleLabel}</span>
                        {!expanded ? (
                            <span className="mt-0.5 block text-xs font-medium text-text-muted">{summary}</span>
                        ) : null}
                    </span>
                    <ChevronDown
                        size={18}
                        aria-hidden
                        className={`shrink-0 text-text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                </button>

                {expanded ? (
                    <div id={panelId} className="mt-3">
                        <ActivityTimeline items={items} accent={accent} />
                    </div>
                ) : null}
            </div>

            <div
                className="mt-5 hidden border-t pt-4 lg:block"
                style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 80%, transparent)" }}
            >
                <p
                    className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em]"
                    style={{ color: toneButton }}
                >
                    This week · {summary}
                </p>
                <ActivityTimeline items={items} accent={accent} />
            </div>
        </>
    );
}
