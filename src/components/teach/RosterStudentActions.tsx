"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, UserMinus, Undo2 } from "lucide-react";

type RosterAction = "remove" | "graduate" | "restore";

interface Props {
    classId: string;
    studentId: string;
    /** Shown in the confirmation prompt so the teacher sees who they picked. */
    studentName: string;
    /** Active students can be removed or graduated; others can be restored. */
    status: string;
}

const COPY: Record<RosterAction, { verb: string; explain: string; confirm: string }> = {
    remove: {
        verb: "Remove",
        explain: "Removes them from this class roster. Their work and points are kept.",
        confirm: "Remove",
    },
    graduate: {
        verb: "Graduate",
        explain:
            "Marks the class finished. With no other active class they become an independent learner. Their work and points are kept.",
        confirm: "Graduate",
    },
    restore: {
        verb: "Restore",
        explain: "Puts them back on the active roster.",
        confirm: "Restore",
    },
};

export function RosterStudentActions({ classId, studentId, studentName, status }: Props) {
    const router = useRouter();
    const [pending, setPending] = useState<RosterAction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function run(action: RosterAction) {
        setLoading(true);
        setError(null);
        try {
            const res =
                action === "remove"
                    ? await fetch(`/api/classes/${classId}/roster/${studentId}`, { method: "DELETE" })
                    : action === "graduate"
                      ? await fetch(`/api/classes/${classId}/roster/${studentId}/graduate`, {
                            method: "POST",
                        })
                      : await fetch(`/api/classes/${classId}/roster`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ studentId }),
                        });

            if (res.ok) {
                setPending(null);
                router.refresh();
                return;
            }
            const body = await res.json().catch(() => null);
            setError(body?.error ?? `Could not ${action} this student.`);
            setPending(null);
        } catch {
            setError("Could not reach the server.");
            setPending(null);
        } finally {
            setLoading(false);
        }
    }

    if (pending) {
        const copy = COPY[pending];
        return (
            <span className="inline-flex flex-col items-end gap-1">
                <span className="text-xs text-text-muted">{copy.explain}</span>
                <span className="inline-flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => run(pending)}
                        disabled={loading}
                        className="inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold transition-colors disabled:opacity-50"
                        style={{
                            borderColor: "var(--primary)",
                            background: "var(--primary)",
                            color: "var(--text-on-accent, #fff)",
                        }}
                    >
                        {loading ? "Working…" : `${copy.confirm} ${studentName}`}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPending(null)}
                        disabled={loading}
                        className="inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-subtle disabled:opacity-50"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        Cancel
                    </button>
                </span>
            </span>
        );
    }

    const isActive = status === "active";

    return (
        <span className="inline-flex items-center justify-end gap-1.5">
            {error ? (
                <span role="alert" className="text-xs font-medium" style={{ color: "var(--error-color, #b91c1c)" }}>
                    {error}
                </span>
            ) : null}

            {isActive ? (
                <>
                    <button
                        type="button"
                        onClick={() => setPending("graduate")}
                        className="inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-subtle"
                        style={{ borderColor: "var(--border-subtle)" }}
                        title={`Graduate ${studentName} from this class`}
                    >
                        <GraduationCap size={13} aria-hidden />
                        Graduate
                    </button>
                    <button
                        type="button"
                        onClick={() => setPending("remove")}
                        className="inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-subtle"
                        style={{ borderColor: "var(--border-subtle)" }}
                        title={`Remove ${studentName} from this class`}
                    >
                        <UserMinus size={13} aria-hidden />
                        Remove
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    onClick={() => setPending("restore")}
                    className="inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold transition-colors hover:bg-surface-subtle"
                    style={{ borderColor: "var(--border-subtle)", color: "var(--primary)" }}
                    title={`Restore ${studentName} to this class`}
                >
                    <Undo2 size={13} aria-hidden />
                    Restore
                </button>
            )}
        </span>
    );
}
