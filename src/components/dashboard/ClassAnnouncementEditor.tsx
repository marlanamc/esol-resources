"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClassAnnouncementEditorProps {
    classId: string;
    initialAnnouncement: string | null;
}

const MAX_ANNOUNCEMENT_LENGTH = 1000;

export function ClassAnnouncementEditor({
    classId,
    initialAnnouncement,
}: ClassAnnouncementEditorProps) {
    const router = useRouter();
    const [announcement, setAnnouncement] = useState(initialAnnouncement ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const remaining = MAX_ANNOUNCEMENT_LENGTH - announcement.length;

    const saveAnnouncement = async () => {
        setIsSaving(true);
        setError(null);
        setIsSaved(false);

        try {
            const response = await fetch(`/api/classes/${classId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    announcement: announcement.trim() ? announcement : null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.error || "Failed to save announcement");
            }

            setIsSaved(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save announcement");
        } finally {
            setIsSaving(false);
        }
    };

    const clearAnnouncement = async () => {
        setAnnouncement("");
        setIsSaving(true);
        setError(null);
        setIsSaved(false);

        try {
            const response = await fetch(`/api/classes/${classId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ announcement: null }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.error || "Failed to clear announcement");
            }

            setIsSaved(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to clear announcement");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <p className="text-xs text-text-muted mb-2">
                Shown on the student dashboard above their weekly checklist. Supports <strong>**bold**</strong>, <em>*italic*</em>, and <code className="text-xs bg-[var(--surface-subtle)] px-1 rounded">- bullet</code> lists.
            </p>

            <textarea
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                rows={4}
                maxLength={MAX_ANNOUNCEMENT_LENGTH}
                placeholder="e.g. Quiz on Friday. Complete all speaking activities by Thursday."
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                style={{ borderColor: "var(--border-subtle)" }}
            />

            <div className="mt-1 text-xs text-text-muted text-right">
                {remaining} / {MAX_ANNOUNCEMENT_LENGTH}
            </div>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            {isSaved && !error && <p className="mt-2 text-xs text-secondary font-semibold">Saved.</p>}

            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={saveAnnouncement}
                    disabled={isSaving}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
                    style={{ background: "var(--primary)" }}
                >
                    {isSaving ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={clearAnnouncement}
                    disabled={isSaving || announcement.trim().length === 0}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border disabled:opacity-40 transition-colors hover:bg-[var(--surface-subtle)]"
                    style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
