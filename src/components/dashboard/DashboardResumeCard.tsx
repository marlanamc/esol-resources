import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import type { DashboardResumeData } from "@/lib/course-map-week";

function typeToToneKey(type: string): string {
    switch (type) {
        case "guide":
            return "grammar";
        case "game":
            return "games";
        case "pronunciation":
            return "pronunciation";
        case "writing":
            return "writing";
        case "speaking":
            return "speaking";
        case "vocabulary":
            return "vocabulary";
        default:
            return "quizzes";
    }
}

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
    const itemTone = getLearnerCategoryTone(typeToToneKey(data.currentItem.type) as Parameters<typeof getLearnerCategoryTone>[0]);
    const mins = data.currentItem.estMinutes ?? 5;
    const unitMeta = data.showUnitMonths
        ? `${data.unitTitle} · ${data.unitMonth}`
        : `Unit ${data.unitNumber}`;

    return (
        <div
            className="dashboard-panel rounded-[26px] border p-5 shadow-[0_10px_32px_rgba(40,31,23,0.07)] sm:p-7"
            style={{
                background: `linear-gradient(135deg, ${tone.surface} 0%, color-mix(in srgb, ${tone.chipBg} 58%, var(--dashboard-surface-start)) 56%, var(--dashboard-surface-start) 100%)`,
                borderColor: `color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-border))`,
            }}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p
                    className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: tone.button }}
                >
                    Your Next Step
                </p>
                <span
                    className="rounded-full border px-2.5 py-1 text-[11px] font-bold"
                    style={{
                        background: `color-mix(in srgb, ${tone.accent} 10%, transparent)`,
                        borderColor: `color-mix(in srgb, ${tone.accent} 20%, transparent)`,
                        color: tone.button,
                    }}
                >
                    {pct}%
                </span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] text-3xl"
                        style={{
                            background: `color-mix(in srgb, ${itemTone.chipBg} 76%, #ffffff)`,
                            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${itemTone.border} 45%, transparent)`,
                        }}
                        aria-hidden
                    >
                        {typeGlyph(data.currentItem.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <span
                            className="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                            style={{
                                background: `color-mix(in srgb, ${tone.chipBg} 78%, #ffffff)`,
                                borderColor: `color-mix(in srgb, ${tone.accent} 18%, transparent)`,
                                color: tone.button,
                            }}
                        >
                            {unitMeta}
                        </span>
                        <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-text sm:text-[28px]">
                            {data.currentItem.title}
                        </h2>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
                            <span>{typeLabel(data.currentItem.type)}</span>
                            <span aria-hidden>·</span>
                            <Clock size={14} aria-hidden />
                            {mins} min
                        </p>
                    </div>
                </div>

                <Link
                    href={data.continueHref}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-base font-extrabold text-white shadow-[0_8px_20px_rgba(40,31,23,0.12)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto"
                    style={{
                        background: `linear-gradient(180deg, color-mix(in srgb, ${tone.button} 88%, #ffffff) 0%, ${tone.button} 100%)`,
                    }}
                >
                    <span>Start</span>
                    <ArrowRight size={21} aria-hidden />
                </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div
                    className="h-2 min-w-[180px] flex-1 overflow-hidden rounded-full"
                    style={{ background: "var(--surface-subtle)", border: "1px solid var(--dashboard-border)" }}
                    aria-hidden
                >
                    <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${tone.accent} 0%, color-mix(in srgb, ${tone.accent} 70%, #e8933a) 100%)`,
                        }}
                    />
                </div>
                <Link
                    href={data.mapHref}
                    className="inline-flex items-center gap-1 rounded text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    style={{ color: tone.button }}
                >
                    Full map
                    <ArrowRight size={14} aria-hidden />
                </Link>
            </div>
        </div>
    );
}
