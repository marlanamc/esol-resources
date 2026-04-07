import Link from "next/link";
import { LoginCtaLink } from "@/components/ui/LoginCtaLink";

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: "linear-gradient(135deg, var(--color-bg-gradient-start) 0%, var(--color-bg) 50%, var(--color-bg-gradient-end) 100%)"
        }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <header className="text-center space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="mb-0 text-xs sm:text-sm uppercase tracking-[0.15em] text-primary-dark font-semibold">
                            ESOL Learning Platform
                        </p>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-text">
                        <span className="inline-block">Class</span>{" "}
                        <span className="inline-block relative">
                            Companion
                            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10C52 4 148 -2 298 10" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    <div className="flex flex-col items-center gap-3 pt-4">
                        <LoginCtaLink />
                        <Link
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--tone-vocabulary-accent-strong)] transition-all hover:bg-[var(--tone-vocabulary-surface-muted)] hover:shadow-sm"
                            href="/vocab/level-1"
                        >
                            Level 1 Vocabulary Preview
                            <span className="opacity-60">→</span>
                        </Link>
                        <p className="mb-0 text-xs text-[var(--color-text-muted)]">
                            Private beta · invite-only ·{" "}
                            <a
                                href="mailto:mcreed@ebhcs.org"
                                className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
                            >
                                Contact Marlie
                            </a>
                        </p>
                    </div>
                    <p className="mt-8 text-xs text-[var(--color-text-muted)]">
                        <Link href="/privacy" className="hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </header>
            </div>
        </div>
    );
}
