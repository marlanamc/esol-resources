import Link from "next/link";
import { getThisWeekPanelData } from "@/lib/course-map-week";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

interface ThisWeekPanelProps {
    user: { id: string; role?: string | null };
}

function ProgressRing({
    pct,
    size,
    fg,
}: {
    pct: number;
    size: number;
    fg: string;
}) {
    const stroke = 5.5;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * (pct / 100);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="var(--dashboard-border)"
                strokeWidth={stroke}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={fg}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 0.8s ease-out" }}
            />
            <text
                x={size / 2}
                y={size / 2}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize={size * 0.22}
                fontWeight={800}
                fill="var(--text)"
            >
                {pct}%
            </text>
        </svg>
    );
}

export async function ThisWeekPanel({ user }: ThisWeekPanelProps) {
    const data = await getThisWeekPanelData(user);
    if (!data) return null;

    const tone = getCourseMapUnitTone(data.unitNumber);
    const accent = { fg: tone.accent, bg: tone.surface };
    const pct =
        data.progress.total > 0
            ? Math.round((data.progress.done / data.progress.total) * 100)
            : 0;

    const currentItem = data.items.find((i) => i.status === "current");
    const continueHref = currentItem?.href ?? "/dashboard/map";

    return (
        <div
            className="dashboard-panel rounded-3xl overflow-hidden"
            style={{ border: `1px solid color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-border))` }}
        >
            {/* Header band */}
            <div
                style={{
                    padding: "20px 22px 16px",
                    background: `linear-gradient(135deg, ${tone.surface}, transparent)`,
                    borderBottom: "1px solid var(--dashboard-border)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                        <p
                            style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                letterSpacing: "0.09em",
                                textTransform: "uppercase",
                                color: tone.accent,
                                margin: 0,
                            }}
                        >
                            This week &middot; Week {data.weekNumber}
                        </p>
                        <h2
                            className="font-display"
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                marginTop: 6,
                                lineHeight: 1.15,
                                color: "var(--text)",
                            }}
                        >
                            {data.weekTitle}
                        </h2>
                        {data.weekGoal && (
                            <p
                                style={{
                                    margin: "7px 0 0",
                                    fontSize: 13,
                                    color: "var(--text-muted)",
                                    maxWidth: 460,
                                    lineHeight: 1.45,
                                }}
                            >
                                {data.weekGoal}
                            </p>
                        )}
                    </div>
                    <ProgressRing pct={pct} size={58} fg={tone.accent} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            paddingInline: "10px",
                            paddingBlock: "4px",
                            borderRadius: 999,
                            background: `color-mix(in srgb, ${tone.accent} 12%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${tone.accent} 22%, transparent)`,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: tone.accent,
                        }}
                    >
                        {data.progress.done} of {data.progress.total} done
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                        {data.unitTitle} &middot; {data.unitMonth}
                    </span>
                </div>
            </div>

            {/* Timeline body */}
            <div style={{ padding: "20px 22px" }}>
                <ActivityTimeline items={data.items} accent={accent} />
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 22px 20px",
                }}
            >
                <Link
                    href={continueHref}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                        background: `linear-gradient(180deg, color-mix(in srgb, ${tone.accent} 82%, #fff) -30%, ${tone.accent} 70%)`,
                        boxShadow: `0 6px 16px color-mix(in srgb, ${tone.accent} 28%, transparent)`,
                    }}
                >
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M3 2.5l6 3.5-6 3.5V2.5z" />
                    </svg>
                    Continue
                </Link>
                <Link
                    href="/dashboard/map"
                    className="inline-flex items-center gap-1 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                    style={{ color: tone.accent }}
                >
                    Full map
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M6 4l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
