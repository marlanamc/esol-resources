import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Suspense } from "react";
import Link from "next/link";
import { JoinForm } from "@/components/forms/JoinForm";

export const metadata = {
    title: "Create an account",
    description: "Create your free account to start learning English",
};

export default function JoinPage() {
    return (
        <AuthPageShell
            id="join-form"
            title="Create your account"
            skipLabel="Skip to registration form"
            brand="Class Companion"
            subtitle="Self-paced Learning"
        >
            <Suspense
                fallback={
                    <div className="text-center text-sm text-[var(--color-text-muted)]">
                        Loading registration form…
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
        </AuthPageShell>
    );
}
