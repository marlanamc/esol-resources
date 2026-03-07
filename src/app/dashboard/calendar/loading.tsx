export default function CalendarLoading() {
    return (
        <div className="min-h-screen bg-bg">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 md:pb-12">
                <div className="flex justify-center w-full">
                    <div
                        className="w-full max-w-md rounded-2xl border p-4 sm:p-6 surface-card-shadow"
                        style={{
                            borderColor: 'var(--border-subtle)',
                            background: 'linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)',
                        }}
                    >
                        <div className="h-4 w-32 skeleton rounded mb-4" />
                        <div className="h-64 skeleton rounded-xl" />
                    </div>
                </div>

                <div
                    className="rounded-2xl border p-4 sm:p-6 surface-card-shadow"
                    style={{
                        borderColor: 'var(--border-subtle)',
                        background: 'linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)',
                    }}
                >
                    <div className="h-7 w-28 skeleton rounded-lg mb-4" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border surface-elevated" style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className="h-10 w-10 skeleton rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-40 skeleton rounded" />
                                    <div className="h-3 w-24 skeleton rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
