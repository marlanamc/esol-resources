"use client";

import { signIn, type SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearServiceWorkerCache } from "@/lib/clearCache";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const passwordUpdated = searchParams.get("updated") === "1";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const timeoutPromise: Promise<SignInResponse | undefined> = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Login timeout')), 10000)
            );

            const signInPromise = signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            const result = await Promise.race([signInPromise, timeoutPromise]);

            if (result?.error) {
                console.error('[Login] Error:', result.error);
                setError(`Invalid credentials. Please check your username and password.`);
            } else if (result?.ok) {
                await Promise.race([
                    clearServiceWorkerCache(),
                    new Promise((resolve) => setTimeout(resolve, 1200)),
                ]);
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error: unknown) {
            console.error('[Login] Exception:', error);
            if (error instanceof Error && error.message === 'Login timeout') {
                setError("Login is taking too long. Please check your connection and try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username…"
                        className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)] pr-11"
                            required
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
                {error && (
                    <div role="alert" className="border-2 rounded-lg p-3 bg-error/10 border-error">
                        <p className="text-sm font-medium text-error">
                            {error}
                        </p>
                    </div>
                )}
                {passwordUpdated && !error && (
                    <div className="border-2 rounded-lg p-3 bg-secondary/10 border-secondary">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                            Password updated. Sign in with your new password.
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${isLoading ? "bg-[var(--color-text-muted)] cursor-not-allowed pointer-events-none" : "bg-primary hover:bg-primary-dark cursor-pointer relative z-10 block"}`}
                >
                    <span className="relative z-20 pointer-events-none">{isLoading ? 'Signing in…' : 'Sign In'}</span>
                </button>
                <p className="text-xs sm:text-sm text-center leading-5 text-[var(--color-text-muted)]">
                    First time today? Use your temporary password first.
                </p>
            </div>
        </form>
    );
}
