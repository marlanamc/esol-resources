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
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");
    const [editType, setEditType] = useState<"holiday" | "event" | "due" | "reminder" | "quiz">("holiday");
    const [editDescription, setEditDescription] = useState("");
    const [error, setError] = useState("");

    const toDateInputValue = (value: Date | string | null | undefined) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const startEditing = (event: CalendarEvent) => {
        if (!event.id) return;
        setError("");
        setEditingId(event.id);
        setEditTitle(event.title || "");
        setEditDate(toDateInputValue(event.date));
        setEditEndDate(toDateInputValue(event.endDate));
        const eventType = event.type || "holiday";
        if (eventType === "holiday" || eventType === "event" || eventType === "due" || eventType === "reminder" || eventType === "quiz") {
            setEditType(eventType);
        } else {
            setEditType("holiday");
        }
        setEditDescription(event.description || "");
    };

    const handleSave = async (id?: string) => {
        if (!id) return;
        if (!editTitle.trim() || !editDate) {
            setError("Title and start date are required.");
            return;
        }
        setError("");
        setIsSaving(id);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    title: editTitle.trim(),
                    date: editDate,
                    endDate: editEndDate || undefined,
                    type: editType,
                    description: editDescription.trim() || undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch((err) => {
                    console.warn("Failed to parse API error response", err);
                    return {};
                });
                throw new Error(data.error || "Failed to update event");
            }
            setEditingId(null);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update event");
        } finally {
            setIsSaving(null);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        const confirmed = window.confirm("Delete this event? This cannot be undone.");
        if (!confirmed) return;
        setError("");
        setIsDeleting(id);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const data = await res.json().catch((err) => {
                    console.warn("Failed to parse API error response", err);
                    return {};
                });
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
                    {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
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
                        const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const dateLabel = sameDay
                            ? dateFmt.format(startDate)
                            : `${dateFmt.format(startDate)} – ${dateFmt.format(endDate)}`;

                        const canManage = allowDelete && Boolean(ev.id);
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
                            <div key={`${ev.title}-${idx}`} className="relative rounded-xl border border-border/45 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(28,35,44,0.05)] transition-transform transition-shadow duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(28,35,44,0.08)]">
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
                                {canManage && (
                                    <div className="mt-2 pl-5">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(ev)}
                                            className="text-[11px] text-sky-700 hover:text-sky-800 border border-sky-100 px-2.5 py-1.5 rounded-md bg-sky-50 min-h-[36px] touch-manipulation font-medium"
                                            aria-label={`Edit ${ev.title}`}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                                {canManage && editingId === ev.id && (
                                    <div className="mt-3 ml-5 rounded-lg border border-border/50 bg-bg-light/40 p-3 space-y-2">
                                        <div className="space-y-1">
                                            <label htmlFor={`event-title-${ev.id}`} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Title</label>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                id={`event-title-${ev.id}`}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label htmlFor={`event-start-${ev.id}`} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={editDate}
                                                    id={`event-start-${ev.id}`}
                                                    onChange={(e) => setEditDate(e.target.value)}
                                                    className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label htmlFor={`event-end-${ev.id}`} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">End Date</label>
                                                <input
                                                    type="date"
                                                    value={editEndDate}
                                                    id={`event-end-${ev.id}`}
                                                    onChange={(e) => setEditEndDate(e.target.value)}
                                                    className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor={`event-type-${ev.id}`} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Type</label>
                                            <select
                                                id={`event-type-${ev.id}`}
                                                value={editType}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "holiday" || value === "event" || value === "due" || value === "reminder" || value === "quiz") {
                                                        setEditType(value);
                                                    }
                                                }}
                                                className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            >
                                                <option value="holiday">Holiday</option>
                                                <option value="event">Event</option>
                                                <option value="due">Reminder</option>
                                                <option value="quiz">Quiz/Test</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor={`event-desc-${ev.id}`} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Description</label>
                                            <textarea
                                                rows={2}
                                                value={editDescription}
                                                id={`event-desc-${ev.id}`}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSave(ev.id)}
                                                disabled={isSaving === ev.id}
                                                className="text-[11px] text-white border border-primary px-2.5 py-1.5 rounded-md bg-primary disabled:opacity-50 min-h-[36px] touch-manipulation font-medium"
                                            >
                                                {isSaving === ev.id ? "Saving\u2026" : "Save"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setError("");
                                                }}
                                                className="text-[11px] text-text border border-border px-2.5 py-1.5 rounded-md bg-white min-h-[36px] touch-manipulation font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(ev.id)}
                                                disabled={isDeleting === ev.id}
                                                className="text-[11px] text-red-600 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-md bg-red-50 disabled:opacity-50 min-h-[36px] touch-manipulation font-medium"
                                            >
                                                {isDeleting === ev.id ? "Deleting\u2026" : "Delete"}
                                            </button>
                                        </div>
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
