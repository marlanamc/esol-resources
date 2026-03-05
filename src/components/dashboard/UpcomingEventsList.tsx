"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarEvent } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
    showSyncedLabel?: boolean;
}

const EVENT_TYPE_STYLES: Record<NonNullable<CalendarEvent["type"]>, {
    accent: string;
    chipBg: string;
    chipBorder: string;
    chipText: string;
}> = {
    quiz: {
        accent: "#5f8267",
        chipBg: "#eef4ef",
        chipBorder: "#c7d8cc",
        chipText: "#3f5e47",
    },
    holiday: {
        accent: "#6d89ac",
        chipBg: "#eef3f9",
        chipBorder: "#c8d4e4",
        chipText: "#4c6788",
    },
    due: {
        accent: "#a98966",
        chipBg: "#f8f3ec",
        chipBorder: "#e1d3c3",
        chipText: "#7b6248",
    },
    event: {
        accent: "#7c6c98",
        chipBg: "#f3f0f8",
        chipBorder: "#d7cfe4",
        chipText: "#5f5178",
    },
    reminder: {
        accent: "#a98966",
        chipBg: "#f8f3ec",
        chipBorder: "#e1d3c3",
        chipText: "#7b6248",
    },
};

export default function UpcomingEventsList({ events, allowDelete = true, showSyncedLabel = true }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setError("");
        setIsDeleting(id);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to delete event");
            }
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete event");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div>
            {(showSyncedLabel || error) && (
                <div className="flex items-center justify-between mb-2">
                    {showSyncedLabel && <span className="text-[11px] font-medium text-text-muted/70">Synced to students</span>}
                    {error && <p className="text-xs text-red-600">{error}</p>}
                </div>
            )}
            {events.length === 0 ? (
                <p className="text-sm text-text-muted italic bg-bg-light/60 border border-border/30 rounded-lg px-3 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-2">
                    {events.slice(0, 6).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const dateLabel = sameDay
                            ? startDate.toLocaleDateString()
                            : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

                        const canDelete = allowDelete && Boolean(ev.id);
                        const eventType = ev.type || "due";
                        const colors = EVENT_TYPE_STYLES[eventType];

                        const typeLabel = eventType === "quiz"
                            ? "Quiz/Test"
                            : eventType === "holiday"
                                ? "Holiday"
                                : eventType === "event"
                                    ? "Event"
                                    : eventType === "reminder"
                                        ? "Reminder"
                                        : "Due";

                        return (
                            <div key={`${ev.title}-${idx}`} className="relative border border-border/45 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(28,35,44,0.05)]">
                                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r" style={{ backgroundColor: colors.accent }} aria-hidden="true" />

                                <div className="pl-1 min-w-0">
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: colors.accent }} />
                                            <span className="font-semibold text-text leading-tight whitespace-normal break-words">
                                                {ev.title}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 ml-4 flex flex-wrap items-center gap-2">
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
                                            style={{
                                                backgroundColor: colors.chipBg,
                                                borderColor: colors.chipBorder,
                                                color: colors.chipText,
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            <span>{dateLabel}</span>
                                        </span>
                                        <span
                                            className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                                            style={{
                                                backgroundColor: colors.chipBg,
                                                borderColor: colors.chipBorder,
                                                color: colors.chipText,
                                            }}
                                        >
                                            {typeLabel}
                                        </span>
                                    </div>
                                </div>
                                {canDelete && (
                                    <div className="mt-2 pl-5">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ev.id)}
                                            disabled={isDeleting === ev.id}
                                            className="text-[11px] text-red-600 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-md bg-red-50 disabled:opacity-50 min-h-[36px] touch-manipulation font-medium"
                                        >
                                            {isDeleting === ev.id ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
