"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Providers } from "@/components/Providers";
import { DEFAULT_PASSWORD_BLOCKED_MESSAGE, isDisallowedPassword } from "@/lib/auth-config";

function PasswordResetContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReturningToLogin, setIsReturningToLogin] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        const mustChange = session?.user?.mustChangePassword;
        if (!mustChange) {
            router.replace("/dashboard");
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

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
                body: JSON.stringify({ newPassword: password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update password.");
            }
            setSuccess(true);
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

    const handleReturnToLogin = async () => {
        setIsReturningToLogin(true);
        await signOut({ redirect: true, callbackUrl: "/login?updated=1" });
    };

    const inputClasses = "w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-strong)] placeholder:text-[var(--color-text-muted)]";

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-bg">
            <div className="max-w-md w-full space-y-6 sm:space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 text-primary">
                        Set Your Password
                    </h1>
                    <p className="text-sm mb-2 font-semibold text-secondary">
                        Step 2 of 3
                    </p>
                    <p className="text-base sm:text-sm text-[var(--color-text)]">
                        Create your new password.
                    </p>
                    <p className="text-xs mt-1 leading-5 text-[var(--color-text-muted)]">
                        Espanol: Paso 2 de 3. Crea una clave nueva.
                    </p>
                </div>
                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
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
                                    <p className="text-sm font-medium text-error">
                                        {error}
                                    </p>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-[background-color,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${isSubmitting ? "bg-[var(--color-text-muted)] cursor-not-allowed" : "bg-primary hover:bg-primary-dark cursor-pointer"}`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="border rounded-2xl p-5 sm:p-6 space-y-5 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-secondary/40 shadow-md">
                        <div className="border rounded-lg p-3 bg-secondary/10 border-secondary">
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                Password updated.
                            </p>
                            <p className="text-sm leading-6 text-[var(--color-text)]">
                                Step 3 of 3: Return to Sign In and use your new password.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleReturnToLogin}
                            disabled={isReturningToLogin}
                            className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-[background-color,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${isReturningToLogin ? "bg-[var(--color-text-muted)] cursor-not-allowed" : "bg-[var(--color-text)] hover:opacity-90 cursor-pointer"}`}
                        >
                            {isReturningToLogin ? "Returning..." : "Back to Sign In"}
                        </button>
                        <p className="text-xs text-center leading-5 text-[var(--color-text-muted)]">
                            Espanol: Vuelve a entrar con tu clave nueva.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PasswordResetPage() {
    return (
        <Providers>
            <PasswordResetContent />
        </Providers>
    );
}
