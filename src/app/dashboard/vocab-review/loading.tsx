export default function VocabReviewLoading() {
    return (
        <div className="min-h-screen bg-bg">
            <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 md:pb-12">
                <div
                    className="relative overflow-hidden rounded-[32px] border p-5 sm:p-6"
                    style={{
                        borderColor: "color-mix(in srgb, var(--tone-vocabulary-border) 82%, var(--border-subtle))",
                        background: "linear-gradient(180deg, color-mix(in srgb, var(--tone-vocabulary-surface) 16%, var(--surface-elevated)) 0%, color-mix(in srgb, var(--tone-vocabulary-surfaceMuted) 14%, var(--surface-subtle)) 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 16px 40px rgba(21, 38, 31, 0.08)",
                    }}
                >
                    <div
                        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl"
                        style={{ background: "var(--tone-vocabulary-accent)" }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="space-y-3">
                            <div className="h-4 w-24 skeleton rounded-full" />
                            <div className="h-10 w-56 skeleton rounded-xl" />
                            <div className="h-4 w-44 skeleton rounded" />
                        </div>
                        <div className="h-11 w-11 skeleton rounded-full" />
                    </div>

                    <div className="relative mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <section
                            className="rounded-[28px] border p-5 sm:p-6"
                            style={{
                                borderColor: "color-mix(in srgb, var(--tone-vocabulary-border) 65%, transparent)",
                                background: "color-mix(in srgb, var(--surface-elevated) 88%, transparent)",
                            }}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="h-4 w-20 skeleton rounded-full" />
                                    <div className="h-6 w-36 skeleton rounded-lg" />
                                </div>
                                <div className="h-9 w-24 skeleton rounded-full" />
                            </div>

                            <div className="mt-6 rounded-[28px] border p-5 sm:p-7" style={{ borderColor: "var(--border-subtle)" }}>
                                <div className="space-y-4">
                                    <div className="h-5 w-24 skeleton rounded-full" />
                                    <div className="h-12 w-3/4 skeleton rounded-2xl" />
                                    <div className="h-5 w-2/3 skeleton rounded-xl" />
                                    <div className="h-24 w-full skeleton rounded-[24px]" />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <div key={idx} className="h-16 skeleton rounded-2xl" />
                                ))}
                            </div>
                        </section>

                        <aside className="space-y-4">
                            <div
                                className="rounded-[28px] border p-5"
                                style={{
                                    borderColor: "color-mix(in srgb, var(--tone-vocabulary-border) 58%, transparent)",
                                    background: "color-mix(in srgb, var(--surface-elevated) 82%, transparent)",
                                }}
                            >
                                <div className="h-4 w-28 skeleton rounded-full" />
                                <div className="mt-4 space-y-3">
                                    <div className="h-12 skeleton rounded-2xl" />
                                    <div className="h-12 skeleton rounded-2xl" />
                                    <div className="h-12 skeleton rounded-2xl" />
                                </div>
                            </div>

                            <div
                                className="rounded-[28px] border p-5"
                                style={{
                                    borderColor: "color-mix(in srgb, var(--tone-vocabulary-border) 50%, transparent)",
                                    background: "color-mix(in srgb, var(--surface-subtle) 86%, var(--surface-elevated))",
                                }}
                            >
                                <div className="h-4 w-24 skeleton rounded-full" />
                                <div className="mt-4 space-y-2.5">
                                    <div className="h-4 w-full skeleton rounded" />
                                    <div className="h-4 w-5/6 skeleton rounded" />
                                    <div className="h-4 w-2/3 skeleton rounded" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
