// Match the compact toolbar and single-card review layout in VocabReviewClient.
export default function VocabReviewLoading() {
    return (
        <main className="fixed inset-0 z-[300] flex flex-col gap-4 overflow-y-auto bg-bg px-3 pb-24 pt-4 sm:relative sm:z-auto sm:mx-auto sm:min-h-[calc(100vh-6rem)] sm:w-full sm:max-w-2xl sm:overflow-visible sm:px-6">
            <p role="status" className="sr-only">Loading vocabulary review…</p>
            <div aria-hidden="true" className="flex items-center gap-3 rounded-2xl border border-border/40 bg-[var(--surface-elevated)] px-3 py-2.5 sm:px-4">
                <div className="h-10 w-10 shrink-0 skeleton rounded-full" />
                <div className="h-2 min-w-0 flex-1 skeleton rounded-full" />
                <div className="h-7 w-12 skeleton rounded-full" />
                <div className="h-10 w-10 shrink-0 skeleton rounded-full" />
            </div>
            <div aria-hidden="true" className="flex flex-1 flex-col gap-4">
                <div className="flex min-h-[380px] flex-1 flex-col items-center justify-center gap-6 rounded-[32px] border border-border/40 bg-[var(--surface-elevated)] p-6 sm:p-10">
                    <div className="h-5 w-24 skeleton rounded-full" />
                    <div className="h-12 w-3/4 skeleton rounded-xl" />
                    <div className="h-5 w-1/2 skeleton rounded" />
                </div>
                <div className="grid grid-cols-3 gap-2.5 px-1 sm:gap-3">
                    {[0, 1, 2].map((item) => <div key={item} className="h-16 skeleton rounded-2xl" />)}
                </div>
            </div>
        </main>
    );
}
