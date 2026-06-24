"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z
    .object({
        inviteCode: z
            .string()
            .min(8, "Please enter a valid 8-character invite code")
            .max(8, "Invite code must be 8 characters"),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username too long")
            .regex(/^[a-z0-9_-]+$/i, "Username can only contain letters, numbers, underscores, and hyphens"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
type FormValues = z.infer<typeof schema>;

interface InviteValidation {
    valid: boolean;
    invitedBy?: string;
    error?: string;
}

export function JoinForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [inviteValidation, setInviteValidation] = useState<InviteValidation | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    useEffect(() => {
        const codeFromUrl = searchParams.get("code");
        if (codeFromUrl) {
            const uppercased = codeFromUrl.toUpperCase();
            setValue("inviteCode", uppercased);
            validateInviteCode(uppercased);
        }
    }, [searchParams, setValue]);

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
                setInviteValidation({ valid: true, invitedBy: data.data.invitedBy });
            } else {
                setInviteValidation({ valid: false, error: data.error || "Invalid invite code" });
            }
        } catch {
            setInviteValidation({ valid: false, error: "Could not validate invite code" });
        } finally {
            setIsValidatingCode(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            await apiFetch("/api/auth/register", {
                method: "POST",
                body: {
                    inviteCode: values.inviteCode,
                    username: values.username.toLowerCase(),
                    email: values.email.toLowerCase(),
                    password: values.password,
                },
            });

            const signInResult = await signIn("credentials", {
                username: values.username.toLowerCase(),
                password: values.password,
                redirect: false,
            });

            if (signInResult?.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                router.push("/login?registered=1");
            }
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as { code?: string; error?: string };
                if (body.code === "USERNAME_TAKEN" || body.code === "INVALID_USERNAME") {
                    setError("username", { message: body.error ?? "Username error" });
                } else if (body.code === "EMAIL_TAKEN" || body.code === "INVALID_EMAIL") {
                    setError("email", { message: body.error ?? "Email error" });
                } else if (body.code === "INVALID_PASSWORD") {
                    setError("password", { message: body.error ?? "Password error" });
                } else if (
                    body.code === "INVALID_INVITE_CODE" ||
                    body.code === "INVITE_EXPIRED" ||
                    body.code === "INVITE_INACTIVE"
                ) {
                    setError("inviteCode", { message: body.error ?? "Invalid invite code" });
                } else {
                    setError("root", { message: body.error ?? "Registration failed" });
                }
            } else {
                setError("root", { message: "An error occurred. Please try again." });
            }
        }
    };

    const inputClassName = (hasError: boolean) =>
        `w-full px-4 py-3.5 min-h-[52px] border-2 rounded-xl transition-[border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus:border-primary text-[16px] bg-[var(--color-white)] dark:bg-[var(--color-surface-base)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
            hasError ? "border-error" : "border-[var(--color-border-strong)]"
        }`;

    const isDisabled = isSubmitting || (inviteValidation !== null && !inviteValidation.valid);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="border rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md">
                {/* Invite Code */}
                <div>
                    <label htmlFor="inviteCode" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Invite Code
                    </label>
                    <input
                        id="inviteCode"
                        type="text"
                        {...register("inviteCode")}
                        onChange={(e) => {
                            const uppercased = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
                            setValue("inviteCode", uppercased, { shouldValidate: false });
                            if (uppercased.length === 8) validateInviteCode(uppercased);
                            else setInviteValidation(null);
                        }}
                        placeholder="ABCD1234"
                        className={`${inputClassName(!!errors.inviteCode)} font-mono tracking-wider text-center uppercase`}
                        maxLength={8}
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
                    {errors.inviteCode && (
                        <p className="mt-1.5 text-sm text-error">{errors.inviteCode.message}</p>
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
                        {...register("username")}
                        onChange={(e) => setValue("username", e.target.value.toLowerCase(), { shouldValidate: false })}
                        placeholder="your_username"
                        className={inputClassName(!!errors.username)}
                        maxLength={30}
                        autoComplete="username"
                    />
                    {errors.username ? (
                        <p className="mt-1.5 text-sm text-error">{errors.username.message}</p>
                    ) : (
                        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                            Letters, numbers, underscores, and hyphens only
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={inputClassName(!!errors.email)}
                        autoComplete="email"
                    />
                    {errors.email ? (
                        <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>
                    ) : (
                        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">Used for password recovery</p>
                    )}
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
                            {...register("password")}
                            placeholder="••••••••"
                            className={`${inputClassName(!!errors.password)} pr-11`}
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

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className={inputClassName(!!errors.confirmPassword)}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1.5 text-sm text-error">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Error Message */}
                {errors.root && (
                    <div role="alert" className="border-2 rounded-lg p-3 bg-error/10 border-error">
                        <p className="text-sm font-medium text-error">{errors.root.message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm ${
                        isDisabled
                            ? "bg-[var(--color-text-muted)] cursor-not-allowed pointer-events-none"
                            : "bg-primary hover:bg-primary-dark cursor-pointer relative z-10 block"
                    }`}
                >
                    <span className="relative z-20 pointer-events-none">
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </span>
                </button>
            </div>
        </form>
    );
}
