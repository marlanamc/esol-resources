import { AuthPageShell } from "@/components/auth/AuthPageShell";
import Link from "next/link";

export const metadata = {
    title: "Password help",
    description: "Get help signing in",
};

export default function ForgotPasswordPage() {
    return (
        <AuthPageShell
            id="password-help"
            title="Forgot your password?"
            skipLabel="Skip to password help"
        >
            <div className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-white)] p-5 text-center shadow-md dark:bg-[var(--color-surface-elevated)] sm:p-6">
                <p className="text-base font-semibold text-[var(--color-text)]">
                    Ask Marlie for help.
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    She can help you sign in and reset your password.
                </p>
                <Link href="/login" className="mt-5 inline-block font-semibold text-primary hover:underline">
                    Back to sign in
                </Link>
            </div>
        </AuthPageShell>
    );
}
