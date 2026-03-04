"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Providers from "@/components/Providers";

function PasswordResetContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            // ensure session refresh on next login
            await signOut({ redirect: true, callbackUrl: "/login" });
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

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fef9f3' }}>
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#d97757' }}>
                        Set Your Password
                    </h1>
                    <p className="text-sm mb-6" style={{ color: '#7ba884', fontWeight: '600' }}>
                        For your first login, please set a new password.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="border rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#ffffff', borderColor: '#d9cfc0', boxShadow: '0 4px 12px rgba(43, 58, 74, 0.1), 0 2px 4px rgba(43, 58, 74, 0.06)' }}>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#2b3a4a' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full px-4 py-3 border-2 rounded-xl transition-[border-color] duration-200 outline-none focus:border-[#d97757]"
                                style={{
                                    borderColor: '#d9cfc0',
                                    color: '#2b3a4a',
                                    backgroundColor: '#ffffff',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#2b3a4a' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Repeat your password"
                                className="w-full px-4 py-3 border-2 rounded-xl transition-[border-color] duration-200 outline-none focus:border-[#d97757]"
                                style={{
                                    borderColor: '#d9cfc0',
                                    color: '#2b3a4a',
                                    backgroundColor: '#ffffff',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        {error && (
                            <div className="border-2 rounded-lg p-3" style={{ backgroundColor: 'rgba(231, 111, 81, 0.1)', borderColor: '#e76f51' }}>
                                <p className="text-sm font-medium" style={{ color: '#e76f51' }}>
                                    {error}
                                </p>
                            </div>
                        )}
                        {success && (
                            <div className="border-2 rounded-lg p-3" style={{ backgroundColor: 'rgba(123, 168, 132, 0.1)', borderColor: '#7ba884' }}>
                                <p className="text-sm font-medium" style={{ color: '#2b3a4a' }}>
                                    Password updated. Please sign in again.
                                </p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-[background-color,transform] duration-200 active:scale-95 ${isSubmitting ? "bg-[#8996a6] cursor-not-allowed" : "bg-[#d97757] hover:bg-[#c4624a] cursor-pointer"}`}
                            style={{
                                boxShadow: '0 1px 3px rgba(43, 58, 74, 0.08), 0 1px 2px rgba(43, 58, 74, 0.04)'
                            }}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
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



