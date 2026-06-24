"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
type FormValues = z.infer<typeof schema>;

type FormMode = "loading" | "invalid" | "form" | "success";

export function ResetPasswordForm() {
    const [mode, setMode] = useState<FormMode>("loading");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    useEffect(() => {
        async function validateToken() {
            if (!token) { setMode("invalid"); return; }
            try {
                const data = await apiFetch<{ valid: boolean; username?: string }>(
                    `/api/auth/reset-password?token=${encodeURIComponent(token)}`
                );
                if (data.valid) {
                    setUsername(data.username || "");
                    setMode("form");
                } else {
                    setMode("invalid");
                }
            } catch {
                setMode("invalid");
            }
        }
        validateToken();
    }, [token]);

    const onSubmit = async (values: FormValues) => {
        try {
            await apiFetch("/api/auth/reset-password", {
                method: "POST",
                body: { token, password: values.password },
            });
            setMode("success");
            setTimeout(() => router.push("/login?updated=1"), 2000);
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to reset password",
            });
        }
    };

    const inputClassName =
        "w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]";

    if (mode === "loading") {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </div>
        );
    }

    if (mode === "invalid") {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Invalid or Expired Link</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        This password reset link is no longer valid. Please request a new one.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    if (mode === "success") {
        return (
            <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Password Reset!</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Redirecting to sign in...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                {username && (
                    <p className="text-sm text-[var(--color-text-muted)] text-center">
                        Resetting password for <span className="font-semibold text-[var(--color-text)]">{username}</span>
                    </p>
                )}

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="••••••••"
                            className={`${inputClassName} pr-11`}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface-base)]/80 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] border border-[var(--color-border-subtle)] cursor-pointer"
                            aria-pressed={showPassword}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password ? (
                        <p className="mt-1.5 text-sm text-error">{errors.password.message}</p>
                    ) : (
                        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">At least 8 characters</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className={inputClassName}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1.5 text-sm text-error">{errors.confirmPassword.message}</p>
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
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </span>
                </button>
            </div>
        </form>
    );
}
