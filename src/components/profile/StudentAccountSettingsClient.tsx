"use client";

import { useState, type FormEvent } from "react";
import { DEFAULT_PASSWORD_BLOCKED_MESSAGE, isDisallowedPassword } from "@/lib/auth/config";

export default function StudentAccountSettingsClient() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword) {
            setError("Please enter your current password.");
            return;
        }

        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (isDisallowedPassword(password)) {
            setError(DEFAULT_PASSWORD_BLOCKED_MESSAGE);
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password, currentPassword }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to update password.");
            }
            setSuccess("Password updated. Next time you sign in, use your new password.");
            setCurrentPassword("");
            setPassword("");
            setConfirm("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to update password.");
            } else {
                setError("Failed to update password.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses =
        "w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full mb-6">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-4 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                        Change password
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                        Update your password if you think someone else knows it or you just want something easier to remember.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Current password
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className={inputClasses}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className={inputClasses}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        className={inputClasses}
                        required
                    />
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
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-[background-color,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${
                        isSubmitting ? "bg-[var(--color-text-muted)] cursor-not-allowed" : "bg-primary hover:bg-primary-dark cursor-pointer"
                    }`}
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                If you need help changing your password, please ask your teacher.
            </p>
        </form>
    );
}

