"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteStudentButtonProps {
    userId: string;
    username: string;
    /** False when the student has work; the control explains why instead. */
    deletable: boolean;
    reason?: string;
}

export function DeleteStudentButton({
    userId,
    username,
    deletable,
    reason,
}: DeleteStudentButtonProps) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!deletable) {
        return (
            <span
                className="text-xs text-text-muted"
                title={reason ?? "This student has activity and cannot be deleted."}
            >
                —
            </span>
        );
    }

    async function handleDelete() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh();
                return;
            }
            const body = await res.json().catch(() => null);
            setError(body?.error ?? "Could not delete this account.");
            setConfirming(false);
        } catch {
            setError("Could not reach the server.");
            setConfirming(false);
        } finally {
            setLoading(false);
        }
    }

    if (confirming) {
        return (
            <span className="inline-flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex min-h-8 items-center rounded-full border border-red-200 bg-red-100 px-2.5 text-xs font-bold text-red-800 transition-colors hover:bg-red-200 disabled:opacity-50"
                >
                    {loading ? "Deleting…" : "Delete forever"}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={loading}
                    className="inline-flex min-h-8 items-center rounded-full border px-2.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-subtle disabled:opacity-50"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2">
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex min-h-8 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                title={`Permanently delete ${username}. This account has no activity.`}
                aria-label={`Permanently delete ${username}`}
            >
                <Trash2 size={12} aria-hidden />
                Delete
            </button>
            {error ? (
                <span role="alert" className="text-xs font-medium text-red-700">
                    {error}
                </span>
            ) : null}
        </span>
    );
}
