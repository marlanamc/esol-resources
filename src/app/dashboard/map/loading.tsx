export default function CourseMapLoading() {
    return (
        <div className="min-h-dvh bg-bg">
            <main className="container mx-auto pt-2 pb-28 px-4 md:px-6 max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl lg:pt-4">
                <div className="lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] lg:gap-8 lg:items-start lg:pt-2">
                    <div className="space-y-5 mb-6 lg:mb-0">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-text leading-tight">Course Map</h1>
                            <p role="status" className="text-sm text-text-muted mt-1">Loading your course map…</p>
                        </div>
                        <div aria-hidden="true" className="hidden lg:block dashboard-panel rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 skeleton rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 skeleton rounded" />
                                    <div className="h-3 w-1/2 skeleton rounded" />
                                </div>
                            </div>
                            <div className="h-2 skeleton rounded" />
                            <div className="h-10 skeleton rounded-lg" />
                            <div className="h-10 skeleton rounded-lg" />
                        </div>
                    </div>

                    <div aria-hidden="true" className="min-w-0 space-y-5">
                        <div className="h-12 skeleton rounded-2xl" />
                        <div className="h-16 skeleton rounded-2xl" />
                        <div className="ml-5 border-l-2 border-border/40 pl-6 space-y-5">
                            {[0, 1, 2].map((step) => (
                                <div key={step} className="relative dashboard-panel rounded-2xl p-5 space-y-3">
                                    <div className="absolute -left-9 top-6 h-5 w-5 skeleton rounded-full" />
                                    <div className="h-5 w-1/2 skeleton rounded" />
                                    <div className="h-3 w-3/4 skeleton rounded" />
                                    <div className="h-10 skeleton rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
