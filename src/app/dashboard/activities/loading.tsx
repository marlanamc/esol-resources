export default function ActivitiesLoading() {
    return (
        <div className="min-h-screen bg-bg">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="h-4 w-36 skeleton rounded" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="rounded-2xl border border-border/40 p-4 bg-white">
                                <div className="h-20 skeleton rounded-xl mb-3" />
                                <div className="h-5 w-24 skeleton rounded mx-auto mb-2" />
                                <div className="h-3 w-28 skeleton rounded mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
