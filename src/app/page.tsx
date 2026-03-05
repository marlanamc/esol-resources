import LoginCtaLink from "@/components/ui/LoginCtaLink";

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: "linear-gradient(135deg, #fdfbf7 0%, #f4f1ea 50%, #e9e6df 100%)"
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
                        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] text-primary-dark font-semibold">
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

                    <div className="flex flex-col items-center justify-center gap-3 pt-4">
                        <LoginCtaLink />
                        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#d9c5a6] bg-gradient-to-r from-[#fff7e8] via-[#fffdf7] to-[#eef8f1] px-5 py-4 text-left shadow-[0_10px_30px_rgba(43,58,74,0.12)]">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,87,0.16),transparent_48%)]" />
                            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f5b45]">
                                        <span className="h-2 w-2 rounded-full bg-[#d97757] animate-pulse" />
                                        Private Beta
                                    </p>
                                    <p className="mt-1 text-sm sm:text-base text-[#2b3a4a]">
                                        MyESOLClass is currently invite-only with limited onboarding.
                                    </p>
                                </div>
                                <a
                                    className="inline-flex items-center justify-center rounded-full border border-[#c98f73] bg-white/90 px-4 py-2 text-sm font-semibold text-[#8f5b45] transition-colors hover:bg-white hover:text-[#d97757]"
                                    href="mailto:mcreed@ebhcs.org"
                                >
                                    Contact Marlie
                                </a>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}
