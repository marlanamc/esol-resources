import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata = {
    title: "Forgot Password - Class Companion",
    description: "Request a password reset link",
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-bg">
            <a
                href="#forgot-form"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to form
            </a>
            <div id="forgot-form" className="max-w-md w-full space-y-5 sm:space-y-6" tabIndex={-1}>
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 text-primary">
                        Class Companion
                    </h1>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4 text-[var(--color-text)]">
                        Forgot Password?
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Enter your email and we&apos;ll send you a reset link.
                    </p>
                </div>
                <ForgotPasswordForm />
                <p className="text-center text-sm text-[var(--color-text-muted)]">
                    Remember your password?{" "}
                    <a href="/login" className="text-primary hover:underline font-semibold">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
