"use client";

import { signIn, type SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearServiceWorkerCache } from "@/lib/clearCache";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            // Add timeout to prevent hanging
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
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6" style={{ backgroundColor: '#ffffff', borderColor: '#d9cfc0', boxShadow: '0 4px 12px rgba(43, 58, 74, 0.1), 0 2px 4px rgba(43, 58, 74, 0.06)' }}>
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: '#2b3a4a' }}>
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
                        className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-[#d97757]"
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
                    <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#2b3a4a' }}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-[#d97757]"
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
                {passwordUpdated && !error && (
                    <div className="border-2 rounded-lg p-3" style={{ backgroundColor: 'rgba(123, 168, 132, 0.12)', borderColor: '#7ba884' }}>
                        <p className="text-sm font-medium" style={{ color: '#2b3a4a' }}>
                            Password updated. Sign in with your new password.
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-[background-color,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isLoading ? "bg-[#8996a6] cursor-not-allowed" : "bg-[#d97757] hover:bg-[#c4624a] cursor-pointer"}`}
                    style={{
                        boxShadow: '0 1px 3px rgba(43, 58, 74, 0.08), 0 1px 2px rgba(43, 58, 74, 0.04)'
                    }}
                >
                    {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
                <p className="text-xs sm:text-sm text-center leading-5" style={{ color: '#5e6f80' }}>
                    First time today? Use your temporary password first.
                </p>
            </div>
        </form>
    );
}
