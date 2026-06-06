"use client";

import { useState } from "react";
import Link from "next/link";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { ActivityTimeline, type TimelineItem, type TimelineStatus } from "@/components/dashboard/ActivityTimeline";

export interface IndependentLevelMapActivity {
    activityId: string;
    title: string;
    type: string;
    status: TimelineStatus;
    href: string;
}

export interface IndependentLevelMapStage {
    stageNumber: number;
    label: string;
    status: "done" | "current" | "todo";
    completed: number;
    total: number;
    activities: IndependentLevelMapActivity[];
}

interface IndependentLevelMapProps {
    stages: IndependentLevelMapStage[];
    totalCompleted: number;
    totalActivities: number;
    overallPct: number;
}

function ProgressRing({ pct, size, fg }: { pct: number; size: number; fg: string }) {
    const stroke = 6;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * (pct / 100);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--dashboard-border)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fg}
                strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 0.8s ease-out" }} />
        </svg>
    );
}

function UnitBadge({ n, status, size = 44 }: { n: number; status: "done" | "current" | "todo"; size?: number }) {
    const tone = getCourseMapUnitTone(n);
    const bg = `linear-gradient(150deg, color-mix(in srgb, ${tone.accent} 78%, #fff), ${tone.accent})`;
    return (
        <div style={{
            width: size, height: size, borderRadius: 14, flexShrink: 0,
            display: "grid", placeItems: "center", position: "relative",
            background: bg, color: "#fff",
            boxShadow: `0 5px 12px color-mix(in srgb, ${tone.accent} 32%, transparent)`,
        }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size * 0.42 }}>{n}</span>
            {status === "done" && (
                <span style={{
                    position: "absolute", bottom: -3, right: -3,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#4a7c59", color: "#fff",
                    display: "grid", placeItems: "center",
                    border: "2px solid var(--surface-base)",
                }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            )}
        </div>
    );
}

function StatusChip({ status }: { status: "done" | "current" | "todo" }) {
    if (status === "done") {
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                paddingInline: "8px", paddingBlock: "3px", borderRadius: 999,
                background: "#e9f0ea", color: "#3a6347",
                fontSize: 10.5, fontWeight: 700,
            }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Completed
            </span>
        );
    }
    if (status === "current") {
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                paddingInline: "8px", paddingBlock: "3px", borderRadius: 999,
                background: "#fbeae4", color: "var(--primary)",
                fontSize: 10.5, fontWeight: 700,
            }}>
                In progress
            </span>
        );
    }
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            paddingInline: "8px", paddingBlock: "3px", borderRadius: 999,
            background: "var(--surface-subtle)", color: "var(--text-muted)",
            fontSize: 10.5, fontWeight: 700,
        }}>
            Available
        </span>
    );
}

function LevelSection({ stage, defaultOpen }: { stage: IndependentLevelMapStage; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const tone = getCourseMapUnitTone(stage.stageNumber);
    const pct = stage.total > 0 ? Math.round((stage.completed / stage.total) * 100) : 0;
    const items: TimelineItem[] = stage.activities.map((a) => ({
        activityId: a.activityId,
        title: a.title,
        type: a.type,
        status: a.status,
        href: a.href,
    }));

    return (
        <div className="dashboard-panel" style={{ overflow: "hidden", borderRadius: 20 }}>
            <button
                onClick={() => setOpen(!open)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px", textAlign: "left", cursor: "pointer",
                    background: open ? `linear-gradient(135deg, ${tone.surface}, transparent)` : "transparent",
                    border: "none",
                }}
            >
                <UnitBadge n={stage.stageNumber} status={stage.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: tone.accent }}>
                            Level {stage.stageNumber}
                        </span>
                        <StatusChip status={stage.status} />
                    </div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 17, marginTop: 3, lineHeight: 1.15, color: "var(--text)" }}>
                        {stage.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>
                        {stage.completed}/{stage.total} activities · {pct}%
                    </div>
                </div>
                <span style={{
                    color: "var(--text-muted)", flexShrink: 0,
                    transform: open ? "rotate(90deg)" : "none",
                    transition: "transform .2s",
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {open && stage.total > 0 && (
                <div style={{ padding: "10px 20px 22px" }}>
                    <ActivityTimeline items={items} accent={{ fg: tone.accent, bg: tone.surface }} />
                </div>
            )}
        </div>
    );
}

function LevelNavItem({ stage, isActive, onClick }: { stage: IndependentLevelMapStage; isActive: boolean; onClick: () => void }) {
    const tone = getCourseMapUnitTone(stage.stageNumber);
    return (
        <button
            onClick={onClick}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "8px 9px", borderRadius: 11, cursor: "pointer",
                background: isActive ? tone.surface : "transparent",
                border: "none", textAlign: "left",
                transition: "background .15s",
            }}
        >
            <span style={{
                width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800,
                background: stage.status === "done"
                    ? "#4a7c59"
                    : isActive ? tone.accent : tone.chipBg,
                color: stage.status === "done" || isActive ? "#fff" : tone.accent,
            }}>
                {stage.status === "done" ? (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 6.5l3 3L10.5 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : stage.stageNumber}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                    fontSize: 12.5, fontWeight: isActive ? 700 : 600,
                    color: "var(--text)", lineHeight: 1.15,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {stage.label}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 1 }}>Level {stage.stageNumber}</div>
            </div>
            {isActive && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: tone.accent, flexShrink: 0 }} />
            )}
        </button>
    );
}

export function IndependentLevelMap({ stages, totalCompleted, totalActivities, overallPct }: IndependentLevelMapProps) {
    const currentStage = stages.find((s) => s.status === "current") ?? stages[0];
    const [activeNavStage, setActiveNavStage] = useState(currentStage?.stageNumber ?? 1);

    const scrollToStage = (stageNumber: number) => {
        setActiveNavStage(stageNumber);
        const el = document.getElementById(`level-section-${stageNumber}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const primaryAccent = currentStage ? getCourseMapUnitTone(currentStage.stageNumber).accent : "var(--primary)";

    return (
        <>
            {/* Desktop layout */}
            <div className="hidden lg:grid" style={{ gridTemplateColumns: "288px 1fr", gap: 24, alignItems: "start" }}>
                {/* Sticky sidebar */}
                <aside style={{ display: "grid", gap: 16, position: "sticky", top: "5.5rem" }}>
                    <div>
                        <Link
                            href="/dashboard/independent"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors rounded-lg mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Dashboard
                        </Link>
                        <h1 className="font-display" style={{ fontSize: 27, fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>Level Map</h1>
                        <p style={{ margin: "5px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Self-paced · all levels open</p>
                    </div>

                    {/* Progress card */}
                    <div className="dashboard-panel" style={{ padding: 18, borderRadius: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <ProgressRing pct={overallPct} size={66} fg={primaryAccent} />
                                <span style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 800, color: "var(--text)",
                                }}>{overallPct}%</span>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                                    {totalCompleted}{" "}
                                    <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: 13 }}>
                                        / {totalActivities} activities
                                    </span>
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                                    {overallPct}% complete · keep climbing
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Level nav */}
                    <div className="dashboard-panel" style={{ padding: 12, borderRadius: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-muted)", padding: "6px 8px 8px" }}>
                            Levels
                        </div>
                        <div style={{ display: "grid", gap: 2 }}>
                            {stages.map((s) => (
                                <LevelNavItem
                                    key={s.stageNumber}
                                    stage={s}
                                    isActive={activeNavStage === s.stageNumber}
                                    onClick={() => scrollToStage(s.stageNumber)}
                                />
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/dashboard/activities"
                        className="flex items-center justify-between w-full rounded-2xl border px-4 py-3 text-sm font-semibold text-text hover:bg-surface-subtle transition-colors"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        <span>Practice Library</span>
                        <span style={{ color: "var(--text-muted)" }}>→</span>
                    </Link>
                </aside>

                {/* Level sections */}
                <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
                    {stages.map((s) => (
                        <div key={s.stageNumber} id={`level-section-${s.stageNumber}`}>
                            <LevelSection stage={s} defaultOpen={s.status === "current"} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile layout */}
            <div className="lg:hidden" style={{ display: "grid", gap: 16 }}>
                <div>
                    <Link
                        href="/dashboard/independent"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors rounded-lg mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Dashboard
                    </Link>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Level Map</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>All levels are open — move at your own pace.</p>
                </div>

                {/* Mobile progress card */}
                <div className="dashboard-panel" style={{ padding: 18, borderRadius: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <ProgressRing pct={overallPct} size={58} fg={primaryAccent} />
                            <span style={{
                                position: "absolute", inset: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 800, color: "var(--text)",
                            }}>{overallPct}%</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                                {totalCompleted} / {totalActivities} activities
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{overallPct}% complete</div>
                        </div>
                    </div>
                </div>

                {/* Mobile level chip scroller */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {stages.map((s) => {
                        const tone = getCourseMapUnitTone(s.stageNumber);
                        const isActive = s.status === "current";
                        return (
                            <button
                                key={s.stageNumber}
                                onClick={() => {
                                    const el = document.getElementById(`level-section-mobile-${s.stageNumber}`);
                                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                style={{
                                    flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                                    padding: "7px 12px", borderRadius: 999, border: "none", cursor: "pointer",
                                    background: isActive ? tone.accent : tone.chipBg,
                                    color: isActive ? "#fff" : tone.accent,
                                    fontSize: 12, fontWeight: 700,
                                }}
                            >
                                {s.status === "done" && (
                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                        <path d="M2 5.5l2.5 2.5L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                Lvl {s.stageNumber}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile level sections */}
                <div style={{ display: "grid", gap: 12 }}>
                    {stages.map((s) => (
                        <div key={s.stageNumber} id={`level-section-mobile-${s.stageNumber}`}>
                            <LevelSection stage={s} defaultOpen={s.status === "current"} />
                        </div>
                    ))}
                </div>

                <Link
                    href="/dashboard/activities"
                    className="flex items-center justify-between w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold text-text hover:bg-surface-subtle transition-colors"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <span>Practice Library</span>
                    <span style={{ color: "var(--text-muted)" }}>→</span>
                </Link>
            </div>
        </>
    );
}
