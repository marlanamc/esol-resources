"use client";
import { useStudentSummaryState } from "@/hooks/useStudentSummary";
export function PointsSyncStatus({ hasConfirmedPoints = false }: { hasConfirmedPoints?: boolean }) {
    const { status, data, refresh } = useStudentSummaryState();
    if (status === "ready") return null;
    return <span role="status" className="text-xs text-text-muted">
        {status === "loading" ? "Updating points…" : data || hasConfirmedPoints ? "Showing your last saved points." : "Points temporarily unavailable."}
        {status === "stale" && <button type="button" onClick={refresh} className="ml-2 min-h-11 underline">Try again</button>}
    </span>;
}
