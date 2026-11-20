// Mirrors the one-week course map (CourseMapRoad): a sticky week bar, one week
// card with activity tiles and an Extra list, then previous/next week buttons.
// Desktop adds the unit sidebar (CourseMapRoadSidebar).
export default function CourseMapLoading() {
    return (
        <div className="min-h-dvh bg-bg">
            <main className="container mx-auto pt-2 pb-28 px-4 md:px-6 max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl lg:pt-4">
                <div className="lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] lg:gap-8 lg:items-start lg:pt-2">
                    {/* Desktop sidebar: title, unit list, Practice Library */}
                    <aside className="hidden lg:block space-y-5">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-text leading-tight">Course Map</h1>
                            <p className="text-sm text-text-muted mt-1">Loading your course map…</p>
                        </div>
                        <div aria-hidden="true" className="flex flex-col gap-1.5">
                            {Array.from({ length: 8 }, (_, unit) => (
                                <div key={unit} className="flex min-h-[52px] items-center gap-3 rounded-[14px] px-3 py-2">
                                    <div className="h-8 w-2.5 shrink-0 skeleton rounded" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-2.5 w-1/3 skeleton rounded" />
                                        <div className="h-3.5 w-3/4 skeleton rounded" />
                                    </div>
                                    <div className="h-3 w-7 shrink-0 skeleton rounded" />
                                </div>
                            ))}
                        </div>
                        <div aria-hidden="true" className="h-[50px] skeleton rounded-2xl" />
                    </aside>

                    <div className="min-w-0 -mx-4 md:-mx-6 lg:mx-0">
                        <p role="status" className="sr-only lg:hidden">Loading your course map…</p>

                        <div aria-hidden="true">
                            {/* Week bar: eyebrow + "Week N dates", All weeks pill */}
                            <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-2 lg:px-1 lg:pt-1 lg:pb-3 border-b border-border/40">
                                <div className="min-w-0 flex-1 space-y-2 py-1">
                                    <div className="h-2.5 w-28 skeleton rounded" />
                                    <div className="h-6 w-44 lg:h-7 lg:w-56 skeleton rounded" />
                                </div>
                                <div className="h-11 w-28 shrink-0 skeleton rounded-full" />
                            </div>

                            {/* Week card */}
                            <div className="my-2 pt-2 px-4 lg:px-1">
                                <div className="rounded-[18px] border border-border/40 px-3.5 pt-2.5 pb-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="h-3 w-14 skeleton rounded" />
                                        <div className="h-4 w-20 skeleton rounded-full" />
                                    </div>
                                    <div className="mt-2 h-6 w-3/4 skeleton rounded" />
                                    <div className="mt-2 flex gap-1.5">
                                        {[0, 1, 2].map((verb) => (
                                            <div key={verb} className="h-5 w-14 skeleton rounded-full" />
                                        ))}
                                    </div>
                                    <div className="mt-2.5 flex items-center gap-3">
                                        <div className="flex flex-1 gap-1">
                                            {[0, 1, 2, 3, 4].map((step) => (
                                                <div key={step} className="h-2 flex-1 skeleton rounded" />
                                            ))}
                                        </div>
                                        <div className="h-3 w-16 skeleton rounded" />
                                    </div>

                                    {/* Activity tiles */}
                                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                                        {[0, 1, 2, 3, 4].map((tile) => (
                                            <div
                                                key={tile}
                                                className={`min-h-[112px] flex-col items-center justify-center gap-2 rounded-[18px] border border-border/40 px-1.5 py-2.5 ${tile === 4 ? "hidden sm:flex" : "flex"}`}
                                            >
                                                <div className="h-10 w-10 skeleton rounded-full" />
                                                <div className="h-3 w-3/4 skeleton rounded" />
                                                <div className="h-2.5 w-1/2 skeleton rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Extra list */}
                                    <div className="mt-3">
                                        <div className="h-2.5 w-12 skeleton rounded mx-1 mb-2" />
                                        {[0, 1, 2].map((row) => (
                                            <div key={row} className={`flex min-h-[48px] items-center gap-3 px-1 py-1.5 ${row > 0 ? "border-t border-border/40" : ""}`}>
                                                <div className="h-5 w-5 shrink-0 skeleton rounded-full" />
                                                <div className="h-3.5 flex-1 max-w-[60%] skeleton rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Previous / next week */}
                            <div className="grid grid-cols-2 gap-2.5 px-4 pt-4 pb-6 lg:px-1">
                                <div className="h-16 skeleton rounded-2xl" />
                                <div className="h-16 skeleton rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
