import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
    return (
        <AuthPageShell
            id="login-form"
            title="Sign in to continue"
            skipLabel="Skip to login form"
        >
            <Suspense fallback={<div className="text-center text-sm text-[var(--color-text-muted)]">Loading login form…</div>}>
                <LoginForm />
            </Suspense>
            <div className="border rounded-2xl p-4 sm:p-5 space-y-3 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-subtle)]">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                    First-time login steps
                </p>
                <ol className="grid grid-cols-[1.5rem_1fr] items-start gap-x-2 gap-y-2 text-[15px] leading-6 text-[var(--color-text)] list-none">
                    <li className="contents">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold bg-primary-light/30 text-primary-dark">1</span>
                        <p>Sign in with the username and password from your teacher.</p>
                    </li>
                    <li className="contents">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold bg-primary-light/30 text-primary-dark">2</span>
                        <p>If asked, create a new password.</p>
                    </li>
                    <li className="contents">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold bg-primary-light/30 text-primary-dark">3</span>
                        <p>Find your class work on the dashboard.</p>
                    </li>
                </ol>
            </div>
            <p className="text-center text-sm text-[var(--color-text-muted)]">
                Have an invite code?{" "}
                <Link href="/join" className="text-primary hover:underline font-semibold">
                    Create an account
                </Link>
            </p>
            <p className="text-center text-xs text-[var(--color-text-muted)]">
                <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                </Link>
            </p>
        </AuthPageShell>
    );
}
