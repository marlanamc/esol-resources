import { TrophyIcon } from "@/components/icons/Icons";

export default function LeaderboardLoading() {
    return (
        <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg)' }}>
            <p role="status" className="sr-only">Loading the leaderboard…</p>
            <header aria-hidden="true" className="sticky top-0 backdrop-blur-lg border-b" style={{ zIndex: 200, backgroundColor: 'var(--surface-overlay)', borderColor: 'var(--border-subtle)' }}>
                <div className="container mx-auto pt-2.5 pb-0.5 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                            <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-on-accent)]" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-7 w-52 max-w-full skeleton rounded-lg" />
                            <div className="h-4 w-36 max-w-full skeleton rounded" />
                        </div>
                    </div>
                    <div className="flex gap-2 py-3">
                        {[0, 1, 2].map((tab) => <div key={tab} className="h-9 w-24 skeleton rounded-full" />)}
                    </div>
                </div>
            </header>

            <main aria-hidden="true" className="container mx-auto py-6 px-4 sm:px-6 space-y-6 pb-28 md:pb-10">
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/40 bg-[var(--surface-elevated)]">
                    {[0, 1].map((stat) => (
                        <div key={stat} className="min-w-0 space-y-2 px-3 py-3 sm:px-4">
                            <div className="h-4 w-24 max-w-full skeleton rounded" />
                            <div className="h-7 w-20 max-w-full skeleton rounded" />
                        </div>
                    ))}
                </div>
                <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                    <div className="border-b p-4" style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}>
                        <div className="h-6 w-32 max-w-full skeleton rounded" />
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="p-4 flex items-center gap-3">
                                <div className="h-6 w-8 skeleton rounded flex-shrink-0" />
                                <div className="h-8 w-8 skeleton rounded-full flex-shrink-0" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-32 max-w-full skeleton rounded" />
                                    <div className="h-3 w-20 skeleton rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
