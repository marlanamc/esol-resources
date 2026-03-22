"use client";

import { useState } from "react";

type FormMode = "form" | "sent";

export function ForgotPasswordForm() {
    const [mode, setMode] = useState<FormMode>("form");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok && response.status !== 429) {
                setError(data.error || "Failed to send reset link");
                return;
            }

            if (response.status === 429) {
                setError("Too many requests. Please try again later.");
                return;
            }

            // Always show success to prevent email enumeration
            setMode("sent");
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName =
        "w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]";

    // Success state - email sent
    if (mode === "sent") {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                        Check Your Email
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        If an account exists with <span className="font-medium text-[var(--color-text)]">{email}</span>, we&apos;ve sent a password reset link.
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Didn&apos;t receive an email? Check your spam folder or{" "}
                        <button
                            type="button"
                            onClick={() => setMode("form")}
                            className="text-primary hover:underline font-semibold"
                        >
                            try again
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    // Request form
    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClassName}
                        required
                        autoComplete="email"
                        autoFocus
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div role="alert" className="border-2 rounded-lg p-3 bg-error/10 border-error">
                        <p className="text-sm font-medium text-error">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${
                        isSubmitting
                            ? "bg-[var(--color-text-muted)] cursor-not-allowed pointer-events-none"
                            : "bg-primary hover:bg-primary-dark cursor-pointer relative z-10 block"
                    }`}
                >
                    <span className="relative z-20 pointer-events-none">
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </span>
                </button>
            </div>
        </form>
    );
}
