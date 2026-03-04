export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-bg">
            <main className="container mx-auto pt-4 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 lg:col-span-9 space-y-6 sm:space-y-8">
                        <div className="space-y-3">
                            <div className="h-12 w-72 skeleton rounded-lg" />
                            <div className="flex gap-3 flex-wrap">
                                <div className="h-12 w-36 skeleton rounded-full" />
                                <div className="h-12 w-32 skeleton rounded-full" />
                                <div className="h-12 w-28 skeleton rounded-full" />
                            </div>
                        </div>

                        <div className="h-28 skeleton rounded-2xl" />
                        <div className="h-52 skeleton rounded-2xl" />
                        <div className="h-40 skeleton rounded-2xl" />
                    </div>

                    <aside className="hidden md:block md:col-span-4 lg:col-span-3">
                        <div className="rounded-2xl p-6 space-y-4 bg-[#faf6f1] border border-[#e7dfd3]">
                            <div className="h-72 skeleton rounded-xl" />
                            <div className="h-44 skeleton rounded-xl" />
                            <div className="space-y-2 pt-3 border-t border-border/40">
                                <div className="h-4 w-24 skeleton rounded" />
                                <div className="h-9 w-full skeleton rounded-lg" />
                                <div className="h-9 w-full skeleton rounded-lg" />
                                <div className="h-9 w-full skeleton rounded-lg" />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
