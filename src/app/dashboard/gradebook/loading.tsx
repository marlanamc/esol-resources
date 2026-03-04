export default function GradebookLoading() {
    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8">
                    <div className="h-4 w-32 skeleton rounded mb-2" />
                    <div className="h-8 w-72 skeleton rounded mb-2" />
                    <div className="h-4 w-96 skeleton rounded" />
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-border/40 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="h-10 flex-1 skeleton rounded-lg" />
                        <div className="h-10 w-56 skeleton rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-border/40 shadow-xl overflow-hidden">
                    <div className="p-4 space-y-3">
                        <div className="h-10 w-full skeleton rounded-lg" />
                        <div className="h-10 w-full skeleton rounded-lg" />
                        <div className="h-10 w-full skeleton rounded-lg" />
                        <div className="h-10 w-full skeleton rounded-lg" />
                        <div className="h-10 w-full skeleton rounded-lg" />
                    </div>
                </div>
            </main>
        </div>
    );
}
