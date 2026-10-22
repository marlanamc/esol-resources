export default function WorkspaceLoading() {
    return (
        <div className="space-y-5">
            <p role="status" className="text-sm text-text-muted">Loading your workspace…</p>
            <div aria-hidden="true" className="space-y-5">
                <div className="h-8 w-48 max-w-full rounded skeleton" />
                <div className="h-64 rounded-xl skeleton" />
            </div>
        </div>
    );
}
