import Link from "next/link";

export const metadata = {
    title: "Password Help - My ESOL Class",
    description: "Get help signing in",
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-bg">
            <a
                href="#password-help"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to password help
            </a>
            <div id="password-help" className="max-w-md w-full space-y-5 sm:space-y-6" tabIndex={-1}>
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 text-primary">
                        My ESOL Class
                    </h1>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 font-bold text-secondary">
                        Class Companion
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4 text-[var(--color-text)]">
                        Forgot your password?
                    </h2>
                </div>
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
            </div>
        </div>
    );
}
