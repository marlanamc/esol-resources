"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type LearnerMode = "classroom" | "independent";

interface LearnerModeToggleProps {
    hasClassEnrollments: boolean;
    initialMode: LearnerMode;
}

export function LearnerModeToggle({ hasClassEnrollments, initialMode }: LearnerModeToggleProps) {
    const [mode, setMode] = useState<LearnerMode>(initialMode);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchPreferences() {
            try {
                const response = await fetch("/api/user/preferences");
                if (response.ok) {
                    const data = await response.json();
                    setMode(data.learnerMode || initialMode);
                }
            } catch {
                setMode(initialMode);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPreferences();
    }, [initialMode]);

    const handleModeChange = async (newMode: LearnerMode) => {
        if (newMode === mode) return;

        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const response = await fetch("/api/user/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ learnerMode: newMode }),
            });

            if (!response.ok) {
                throw new Error("Failed to update preference");
            }

            setMode(newMode);
            setSuccess(`Switched to ${newMode === "independent" ? "self-paced" : "classroom"} mode`);

            // Redirect to appropriate dashboard after a short delay
            setTimeout(() => {
                if (newMode === "independent") {
                    router.push("/dashboard/independent");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }, 1000);
        } catch {
            setError("Failed to update preference. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!hasClassEnrollments && mode === "independent") {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md mb-6">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                    Learning Mode
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                    You&apos;re learning at your own pace. To join a class, ask your teacher for a class code.
                </p>
            </div>
        );
    }

    if (!hasClassEnrollments) {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md mb-6">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                    Learning Mode
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                    You&apos;re in classroom mode. To join a class, ask your teacher for a class code.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md mb-6">
                <div className="animate-pulse h-20 bg-[var(--color-surface-base)] rounded-lg" />
            </div>
        );
    }

    return (
        <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md mb-6 space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                    Learning Mode
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                    Choose how you want to learn. You can switch anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleModeChange("classroom")}
                    disabled={isSaving}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                        mode === "classroom"
                            ? "border-primary bg-primary/5"
                            : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]"
                    } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-text)]">Classroom</span>
                        {mode === "classroom" && (
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Follow your teacher&apos;s assignments and due dates
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => handleModeChange("independent")}
                    disabled={isSaving}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                        mode === "independent"
                            ? "border-primary bg-primary/5"
                            : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]"
                    } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-text)]">Self-paced</span>
                        {mode === "independent" && (
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Learn at your own pace with a guided path
                    </p>
                </button>
            </div>

            {error && (
                <div className="border-2 rounded-lg p-3 bg-error/10 border-error">
                    <p className="text-sm font-medium text-error">{error}</p>
                </div>
            )}

            {success && !error && (
                <div className="border-2 rounded-lg p-3 bg-secondary/10 border-secondary">
                    <p className="text-sm font-medium text-[var(--color-text)]">{success}</p>
                </div>
            )}
        </div>
    );
}
