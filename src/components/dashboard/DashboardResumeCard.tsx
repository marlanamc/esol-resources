import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import type { DashboardResumeData } from "@/lib/course-map-week";
import { DashboardResumeWeekActivities } from "@/components/dashboard/DashboardResumeWeekActivities";


function typeLabel(type: string): string {
    switch (type) {
        case "guide":
            return "Grammar";
        case "game":
            return "Game";
        case "quiz":
            return "Quiz";
        case "pronunciation":
            return "Pronunciation";
        case "writing":
            return "Writing";
        case "speaking":
            return "Speaking";
        case "vocabulary":
            return "Vocabulary";
        default:
            return "Activity";
    }
}

function typeGlyph(type: string): string {
    switch (type) {
        case "guide":
            return "📖";
        case "game":
            return "🎮";
        case "quiz":
            return "✏️";
        case "pronunciation":
            return "🔊";
        case "writing":
            return "✍️";
        case "speaking":
            return "🎤";
        case "vocabulary":
            return "🗂️";
        default:
            return "📌";
    }
}

interface DashboardResumeCardProps {
    data: DashboardResumeData;
}

export function DashboardResumeCard({ data }: DashboardResumeCardProps) {
    const tone = getCourseMapUnitTone(data.unitNumber);
    const pct =
        data.progress.total > 0
            ? Math.round((data.progress.done / data.progress.total) * 100)
            : 0;
    const mins = data.currentItem.estMinutes ?? 5;
    const unitMeta = data.showUnitMonths
        ? `${data.unitTitle} · ${data.unitMonth}`
        : `Unit ${data.unitNumber}`;
    // accent still passed to week activities for quiet timeline dots
    const accent = { fg: tone.accent, bg: tone.surface };

    return (
        <div
            className="dashboard-panel overflow-hidden rounded-[20px] border shadow-[0_6px_20px_rgba(40,31,23,0.06)]"
            style={{
                background: "var(--dashboard-surface-start)",
                borderColor: "color-mix(in srgb, var(--dashboard-border) 80%, transparent)",
                borderTopColor: "var(--primary)",
                borderTopWidth: "3px",
            }}
        >
            <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                {/* Row 1: label + progress badge + Start button all on one line */}
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-xl"
                        style={{
                            background: "color-mix(in srgb, var(--primary) 7%, var(--dashboard-surface-start))",
                            boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--primary) 14%, transparent)",
                        }}
                        aria-hidden
                    >
                        {typeGlyph(data.currentItem.type)}
                    </div>

                    {/* Title block */}
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                            Your Next Step · <span className="font-semibold">{unitMeta}</span>
                        </p>
                        <h2 className="mt-0.5 truncate font-display text-lg font-bold leading-snug text-text sm:text-xl">
                            {data.currentItem.title}
                        </h2>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                            <span>{typeLabel(data.currentItem.type)}</span>
                            <span aria-hidden>·</span>
                            <Clock size={11} aria-hidden />
                            {mins} min
                        </p>
                    </div>

                    {/* Start button — compact */}
                    <Link
                        href={data.continueHref}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(176,87,64,0.28)] transition-transform hover:scale-[1.02] hover:bg-[var(--primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    >
                        Start
                        <ArrowRight size={16} aria-hidden />
                    </Link>
                </div>

                {/* Progress bar + Full map */}
                <div className="mt-3 flex items-center gap-3">
                    <div
                        className="h-1 flex-1 overflow-hidden rounded-full"
                        style={{ background: "var(--surface-subtle)", border: "1px solid var(--dashboard-border)" }}
                        aria-hidden
                    >
                        <div
                            className="h-full rounded-full transition-[width] duration-700 ease-out"
                            style={{ width: `${pct}%`, background: "var(--primary)" }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-primary/70">{pct}%</span>
                    <Link
                        href={data.mapHref}
                        className="inline-flex items-center gap-1 rounded text-xs font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Full map
                        <ArrowRight size={12} aria-hidden />
                    </Link>
                </div>

                <DashboardResumeWeekActivities
                    items={data.weekItems}
                    accent={accent}
                    toneButton="var(--primary)"
                />
            </div>
        </div>
    );
}
