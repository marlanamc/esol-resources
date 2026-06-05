"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClassOption {
    id: string;
    name: string;
}

interface Props {
    classes: ClassOption[];
}

export function CreateCalendarEventForm({ classes }: Props) {
    const router = useRouter();
    const [classId, setClassId] = useState(classes[0]?.id || "");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<"holiday" | "event" | "due" | "quiz">("holiday");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!classId || !title || !date) {
            setError("Please complete class, title, and date.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId,
                    title,
                    date,
                    endDate: endDate || undefined,
                    type,
                    description: description || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Unable to add calendar item");
            }

            setSuccess("Saved and shared with students.");
            setTitle("");
            setDate("");
            setDescription("");
            setEndDate("");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to add calendar item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClass = "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
    const fieldStyle = { borderColor: "var(--border-subtle)" };
    const labelClass = "text-xs font-semibold text-text-muted uppercase tracking-wide";

    return (
        <form className="space-y-3" onSubmit={onSubmit}>
            {classes.length === 0 && (
                <p className="text-xs text-text-muted">Create a class first to share dates.</p>
            )}

            {classes.length > 1 && (
                <div className="space-y-1">
                    <label className={labelClass}>Class</label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className={fieldClass}
                        style={fieldStyle}
                        disabled={classes.length === 0}
                    >
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-1">
                <label className={labelClass}>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spring Break" className={fieldClass} style={fieldStyle} />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className={labelClass}>Start date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className={fieldClass} style={fieldStyle} />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>End date <span className="normal-case font-normal">(optional)</span></label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className={fieldClass} style={fieldStyle} />
                </div>
            </div>

            <div className="space-y-1">
                <label className={labelClass}>Type</label>
                <select value={type} onChange={(e) => {
                    const v = e.target.value;
                    if (v === "holiday" || v === "event" || v === "due" || v === "quiz") setType(v);
                }} className={fieldClass} style={fieldStyle}>
                    <option value="holiday">Holiday / No school</option>
                    <option value="event">School event</option>
                    <option value="due">Reminder / due date</option>
                    <option value="quiz">Quiz / Test</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className={labelClass}>Notes <span className="normal-case font-normal">(optional)</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={2} placeholder="Optional notes for students"
                    className={fieldClass} style={fieldStyle} />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
            {success && <p className="text-xs font-semibold text-secondary">{success}</p>}

            <button type="submit" disabled={isSubmitting || classes.length === 0}
                className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60 transition-opacity"
                style={{ background: "var(--secondary)" }}>
                {isSubmitting ? "Saving…" : "Add to calendar"}
            </button>
        </form>
    );
}
