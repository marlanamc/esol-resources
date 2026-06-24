"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
    const [sent, setSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            await apiFetch("/api/auth/forgot-password", {
                method: "POST",
                body: { email: values.email.toLowerCase() },
            });
            setSentEmail(values.email);
            setSent(true);
        } catch (err) {
            if (err instanceof ApiError && err.status === 429) {
                setError("root", { message: "Too many requests. Please try again later." });
            } else if (err instanceof ApiError && !err.isServerError) {
                setError("root", { message: err.message });
            } else {
                // Always show success to prevent email enumeration
                setSentEmail(values.email);
                setSent(true);
            }
        }
    };

    const inputClassName =
        "w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]";

    if (sent) {
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
                        If an account exists with <span className="font-medium text-[var(--color-text)]">{sentEmail}</span>, we&apos;ve sent a password reset link.
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Didn&apos;t receive an email? Check your spam folder or{" "}
                        <button
                            type="button"
                            onClick={() => setSent(false)}
                            className="text-primary hover:underline font-semibold"
                        >
                            try again
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={inputClassName}
                        autoComplete="email"
                        autoFocus
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>
                    )}
                </div>

                {errors.root && (
                    <div role="alert" className="border-2 rounded-lg p-3 bg-error/10 border-error">
                        <p className="text-sm font-medium text-error">{errors.root.message}</p>
                    </div>
                )}

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
