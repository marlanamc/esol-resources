import { Suspense } from "react";
import Link from "next/link";
import { JoinForm } from "@/components/forms/JoinForm";

export const metadata = {
    title: "Join Class Companion",
    description: "Create your free account to start learning English",
};

export default function JoinPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-bg">
            <a
                href="#join-form"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to registration form
            </a>
            <div id="join-form" className="max-w-md w-full space-y-5 sm:space-y-6" tabIndex={-1}>
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 text-primary">
                        Class Companion
                    </h1>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 font-bold text-secondary">
                        Independent Learner
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4 text-[var(--color-text)]">
                        Create your account
                    </h2>
                </div>
                <Suspense
                    fallback={
                        <div className="text-center text-sm text-[var(--color-text-muted)]">
                            Loading registration form...
                        </div>
                    }
                >
                    <JoinForm />
                </Suspense>
                <p className="text-center text-sm text-[var(--color-text-muted)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-semibold">
                        Sign in
                    </Link>
                </p>
                <p className="text-center text-xs text-[var(--color-text-muted)]">
                    <Link href="/privacy" className="hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
