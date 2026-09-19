export default function Loading() {
    return <div role="status" aria-live="polite" className="space-y-5"><p className="text-sm text-text-muted">Loading your workspace…</p><div className="h-8 w-48 rounded bg-border/40 animate-pulse"/><div className="h-64 rounded-xl bg-border/20 animate-pulse"/></div>;
}
