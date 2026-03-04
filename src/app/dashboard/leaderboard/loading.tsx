import { TrophyIcon } from "@/components/icons/Icons";

export default function LeaderboardLoading() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#fef9f3' }}>
            <header className="sticky top-0 backdrop-blur-lg border-b-2" style={{ zIndex: 200, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#d9cfc0' }}>
                <div className="container mx-auto py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                        <TrophyIcon className="w-8 h-8 text-accent/60" />
                        <div className="space-y-2">
                            <div className="h-7 w-52 skeleton rounded-lg" />
                            <div className="h-4 w-36 skeleton rounded" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-6 px-4 sm:px-6 space-y-6 pb-28 md:pb-10">
                <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#d9cfc0' }}>
                    <div className="border-b-2 p-4" style={{ backgroundColor: '#f5f1e8', borderColor: '#d9cfc0' }}>
                        <div className="h-6 w-32 skeleton rounded" />
                    </div>
                    <div className="divide-y" style={{ borderColor: '#ede7db' }}>
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="p-4 flex items-center gap-3">
                                <div className="h-6 w-8 skeleton rounded flex-shrink-0" />
                                <div className="h-8 w-8 skeleton rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 skeleton rounded" />
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
