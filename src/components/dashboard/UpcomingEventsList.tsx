"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarEvent } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
    showSyncedLabel?: boolean;
}

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
                        const colorClass = ev.type === "quiz"
                            ? "bg-[#5f8267]"
                            : ev.type === "holiday"
                                ? "bg-[#6d89ac]"
                                : "bg-[#a98966]";

                        const typeLabel = ev.type === "quiz"
                            ? "Quiz/Test"
                            : ev.type === "holiday"
                                ? "Holiday"
                                : "Due";

                        return (
                            <div key={`${ev.title}-${idx}`} className="relative flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 border border-border/45 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(28,35,44,0.05)]">
                                <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${colorClass}`} aria-hidden="true" />

                                <div className="pl-1 min-w-0 flex-1 basis-full sm:basis-auto">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`} />
                                        <span className="font-semibold text-text truncate">{ev.title}</span>
                                    </div>
                                    <p className="text-[11px] text-text-muted mt-1">{typeLabel}</p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-text-muted sm:ml-auto shrink-0 pl-1">
                                    <span className="whitespace-nowrap font-medium">{dateLabel}</span>
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ev.id)}
                                            disabled={isDeleting === ev.id}
                                            className="text-[11px] text-red-600 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-md bg-red-50 disabled:opacity-50 min-h-[36px] touch-manipulation font-medium"
                                        >
                                            {isDeleting === ev.id ? "Deleting…" : "Delete"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
