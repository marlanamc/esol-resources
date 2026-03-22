"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface InviteValidation {
    valid: boolean;
    invitedBy?: string;
    error?: string;
}

export function JoinForm() {
    const [inviteCode, setInviteCode] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [inviteValidation, setInviteValidation] = useState<InviteValidation | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get invite code from URL on mount
    useEffect(() => {
        const codeFromUrl = searchParams.get("code");
        if (codeFromUrl) {
            setInviteCode(codeFromUrl.toUpperCase());
            validateInviteCode(codeFromUrl);
        }
    }, [searchParams]);

    const validateInviteCode = async (code: string) => {
        if (!code || code.length < 6) {
            setInviteValidation(null);
            return;
        }

        setIsValidatingCode(true);
        try {
            const response = await fetch(`/api/invites/${encodeURIComponent(code.toUpperCase())}`);
            const data = await response.json();

            if (data.ok && data.data) {
                setInviteValidation({
                    valid: true,
                    invitedBy: data.data.invitedBy,
                });
            } else {
                setInviteValidation({
                    valid: false,
                    error: data.error || "Invalid invite code",
                });
            }
        } catch {
            setInviteValidation({
                valid: false,
                error: "Could not validate invite code",
            });
        } finally {
            setIsValidatingCode(false);
        }
    };

    const handleInviteCodeChange = (value: string) => {
        const uppercased = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
        setInviteCode(uppercased);

        // Validate when code reaches full length
        if (uppercased.length === 8) {
            validateInviteCode(uppercased);
        } else {
            setInviteValidation(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldError(null);

        // Client-side validation
        if (!inviteCode || inviteCode.length !== 8) {
            setError("Please enter a valid invite code");
            return;
        }

        if (username.length < 3) {
            setFieldError("username");
            setError("Username must be at least 3 characters");
            return;
        }

        if (!/^[a-z0-9_-]+$/i.test(username)) {
            setFieldError("username");
            setError("Username can only contain letters, numbers, underscores, and hyphens");
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError("email");
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 8) {
            setFieldError("password");
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setFieldError("confirmPassword");
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inviteCode,
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Map error codes to field errors
                if (data.code === "USERNAME_TAKEN" || data.code === "INVALID_USERNAME") {
                    setFieldError("username");
                } else if (data.code === "EMAIL_TAKEN" || data.code === "INVALID_EMAIL") {
                    setFieldError("email");
                } else if (data.code === "INVALID_PASSWORD") {
                    setFieldError("password");
                } else if (data.code === "INVALID_INVITE_CODE" || data.code === "INVITE_EXPIRED" || data.code === "INVITE_INACTIVE") {
                    setFieldError("inviteCode");
                }
                setError(data.error || "Registration failed");
                return;
            }

            // Registration successful - sign in automatically
            const signInResult = await signIn("credentials", {
                username: username.toLowerCase(),
                password,
                redirect: false,
            });

            if (signInResult?.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                // If auto-login fails, redirect to login page
                router.push("/login?registered=1");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName = (field: string) =>
        `w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
            fieldError === field ? "border-error" : "border-[var(--color-border-strong)]"
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                {/* Invite Code */}
                <div>
                    <label htmlFor="inviteCode" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Invite Code
                    </label>
                    <input
                        id="inviteCode"
                        type="text"
                        value={inviteCode}
                        onChange={(e) => handleInviteCodeChange(e.target.value)}
                        placeholder="ABCD1234"
                        className={`${inputClassName("inviteCode")} font-mono tracking-wider text-center uppercase`}
                        maxLength={8}
                        required
                        autoComplete="off"
                    />
                    {isValidatingCode && (
                        <p className="mt-2 text-xs text-[var(--color-text-muted)]">Validating code...</p>
                    )}
                    {inviteValidation?.valid && (
                        <p className="mt-2 text-xs text-secondary font-medium">
                            Invited by {inviteValidation.invitedBy}
                        </p>
                    )}
                    {inviteValidation && !inviteValidation.valid && (
                        <p className="mt-2 text-xs text-error font-medium">{inviteValidation.error}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        placeholder="your_username"
                        className={inputClassName("username")}
                        maxLength={30}
                        required
                        autoComplete="username"
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                        Letters, numbers, underscores, and hyphens only
                    </p>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClassName("email")}
                        required
                        autoComplete="email"
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                        Used for password recovery
                    </p>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`${inputClassName("password")} pr-11`}
                            minLength={8}
                            required
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
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">At least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClassName("confirmPassword")}
                        minLength={8}
                        required
                        autoComplete="new-password"
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
                    disabled={isLoading || (inviteValidation !== null && !inviteValidation.valid)}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${
                        isLoading || (inviteValidation !== null && !inviteValidation.valid)
                            ? "bg-[var(--color-text-muted)] cursor-not-allowed pointer-events-none"
                            : "bg-primary hover:bg-primary-dark cursor-pointer relative z-10 block"
                    }`}
                >
                    <span className="relative z-20 pointer-events-none">
                        {isLoading ? "Creating account..." : "Create Account"}
                    </span>
                </button>
            </div>
        </form>
    );
}
