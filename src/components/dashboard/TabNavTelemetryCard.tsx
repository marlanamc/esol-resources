"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Clock3, Gauge } from "lucide-react";

type TelemetrySummary = {
    totalEvents: number;
    routeCommit: { avgMs: number; p50Ms: number; p95Ms: number };
    firstFrame: { avgMs: number; p50Ms: number; p95Ms: number };
    idleReady: { avgMs: number; p50Ms: number; p95Ms: number };
};

type LoadState = "idle" | "loading" | "ready" | "error";

async function fetchSummary(url: string): Promise<TelemetrySummary> {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load tab telemetry");
    return (await res.json()) as TelemetrySummary;
}

function MetricCell({
    label,
    p50,
    p95,
    avg,
}: {
    label: string;
    p50: number;
    p95: number;
    avg: number;
}) {
    return (
        <div className="rounded-lg border border-border bg-bg-light/40 p-3">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-text-muted">{label}</p>
            <div className="mt-1 flex items-end gap-3">
                <p className="text-lg font-bold text-text">{p50}ms</p>
                <p className="text-xs text-text-muted">p95 {p95}ms</p>
            </div>
            <p className="text-[11px] text-text-muted mt-1">avg {avg}ms</p>
        </div>
    );
}

export function TabNavTelemetryCard() {
    const [state, setState] = useState<LoadState>("idle");
    const [overall, setOverall] = useState<TelemetrySummary | null>(null);
    const [activities, setActivities] = useState<TelemetrySummary | null>(null);

    const load = useCallback(async () => {
        setState((prev) => (prev === "idle" ? "loading" : prev));
        try {
            const [all, acts] = await Promise.all([
                fetchSummary("/api/diagnostics/tab-nav"),
                fetchSummary("/api/diagnostics/tab-nav?to=/dashboard/activities"),
            ]);
            setOverall(all);
            setActivities(acts);
            setState("ready");
        } catch {
            setState("error");
        }
    }, []);

    useEffect(() => {
        void load();
        const id = window.setInterval(() => {
            void load();
        }, 30_000);
        return () => clearInterval(id);
    }, [load]);

    return (
        <section className="mb-6 rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-text flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Tab Navigation Telemetry
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                        Live p50/p95 from recent dashboard tab switches (24h in-memory).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => void load()}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-bg-light/40 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {state === "loading" && !overall ? (
                <p className="text-sm text-text-muted mt-4">Loading telemetry...</p>
            ) : state === "error" ? (
                <p className="text-sm text-rose-600 mt-4">Could not load telemetry yet.</p>
            ) : (
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border p-4">
                        <p className="text-sm font-semibold text-text flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-primary" />
                            All Tracked Tabs
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                            {overall?.totalEvents ?? 0} sampled events
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <MetricCell
                                label="Route Commit"
                                p50={overall?.routeCommit.p50Ms ?? 0}
                                p95={overall?.routeCommit.p95Ms ?? 0}
                                avg={overall?.routeCommit.avgMs ?? 0}
                            />
                            <MetricCell
                                label="First Frame"
                                p50={overall?.firstFrame.p50Ms ?? 0}
                                p95={overall?.firstFrame.p95Ms ?? 0}
                                avg={overall?.firstFrame.avgMs ?? 0}
                            />
                            <MetricCell
                                label="Idle Ready"
                                p50={overall?.idleReady.p50Ms ?? 0}
                                p95={overall?.idleReady.p95Ms ?? 0}
                                avg={overall?.idleReady.avgMs ?? 0}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                        <p className="text-sm font-semibold text-text flex items-center gap-2">
                            <Clock3 className="w-4 h-4 text-secondary" />
                            Activities Tab Focus
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                            {activities?.totalEvents ?? 0} sampled activities switches
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <MetricCell
                                label="Route Commit"
                                p50={activities?.routeCommit.p50Ms ?? 0}
                                p95={activities?.routeCommit.p95Ms ?? 0}
                                avg={activities?.routeCommit.avgMs ?? 0}
                            />
                            <MetricCell
                                label="First Frame"
                                p50={activities?.firstFrame.p50Ms ?? 0}
                                p95={activities?.firstFrame.p95Ms ?? 0}
                                avg={activities?.firstFrame.avgMs ?? 0}
                            />
                            <MetricCell
                                label="Idle Ready"
                                p50={activities?.idleReady.p50Ms ?? 0}
                                p95={activities?.idleReady.p95Ms ?? 0}
                                avg={activities?.idleReady.avgMs ?? 0}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
