// Shared fallback for dashboard routes without a more specific loading screen.
// Keep it neutral: this boundary also wraps account, search, reports, and other pages.
export default function DashboardLoading() {
    return (
        <main className="min-h-[50dvh] bg-bg flex items-center justify-center px-4 pb-24">
            <div role="status" className="flex flex-col items-center gap-4 text-text-muted">
                <div aria-hidden="true" className="h-8 w-8 animate-spin motion-reduce:animate-none rounded-full border-2 border-border border-t-primary" />
                <p className="text-sm">Loading your page…</p>
            </div>
        </main>
    );
}
