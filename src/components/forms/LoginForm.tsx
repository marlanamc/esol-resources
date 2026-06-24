"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, type SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearServiceWorkerCache } from "@/lib/clearCache";

const schema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const passwordUpdated = searchParams.get("updated") === "1";

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            const timeoutPromise: Promise<SignInResponse | undefined> = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Login timeout")), 10000)
            );

            const signInPromise = signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            const result = await Promise.race([signInPromise, timeoutPromise]);

            if (result?.error) {
                setError("root", { message: "Invalid credentials. Please check your username and password." });
            } else if (result?.ok) {
                await Promise.race([
                    clearServiceWorkerCache(),
                    new Promise((resolve) => setTimeout(resolve, 1200)),
                ]);
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("root", { message: "Login failed. Please try again." });
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.message === "Login timeout") {
                setError("root", { message: "Login is taking too long. Please check your connection and try again." });
            } else {
                setError("root", { message: "An error occurred. Please try again." });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} method="post" action="/login" className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        {...register("username")}
                        placeholder="username…"
                        className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]"
                    />
                    {errors.username && (
                        <p className="mt-1.5 text-sm text-error">{errors.username.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            {...register("password")}
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)] pr-11"
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
                </div>
                {errors.root && (
                    <div role="alert" className="border-2 rounded-lg p-3 bg-error/10 border-error">
                        <p className="text-sm font-medium text-error">{errors.root.message}</p>
                    </div>
                )}
                {passwordUpdated && !errors.root && (
                    <div className="border-2 rounded-lg p-3 bg-secondary/10 border-secondary">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                            Password updated. Sign in with your new password.
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${isSubmitting ? "bg-[var(--color-text-muted)] cursor-not-allowed pointer-events-none" : "bg-primary hover:bg-primary-dark cursor-pointer relative z-10 block"}`}
                >
                    <span className="relative z-20 pointer-events-none">{isSubmitting ? "Signing in…" : "Sign In"}</span>
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-[var(--color-text-muted)]">
                    <p className="leading-5">
                        First time? Use your temporary password.
                    </p>
                    <a href="/forgot-password" className="text-primary hover:underline font-medium">
                        Forgot password?
                    </a>
                </div>
            </div>
        </form>
    );
}
