import Link from "next/link";
import type { DashboardResumeData } from "@/lib/course-map-week";
import { DashboardHeroCta } from "@/components/dashboard/DashboardHeroCta";


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
    return (
        <Link
            href={data.continueHref}
            className="dashboard-panel group flex items-center gap-3 overflow-hidden rounded-[20px] border px-4 py-3 shadow-[0_6px_20px_rgba(40,31,23,0.06)] transition-transform hover:scale-[1.005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
                background: "var(--dashboard-surface-start)",
                borderColor: "color-mix(in srgb, var(--dashboard-border) 80%, transparent)",
                borderTopColor: "var(--primary)",
                borderTopWidth: "3px",
            }}
        >
            <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-xl"
                style={{
                    background: "color-mix(in srgb, var(--primary) 7%, var(--dashboard-surface-start))",
                    boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--primary) 14%, transparent)",
                }}
                aria-hidden
            >
                {typeGlyph(data.currentItem.type)}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                    Continue
                </span>
                <span className="mt-0.5 block font-display text-base font-bold leading-snug text-text sm:text-lg">
                    {data.currentItem.title}
                </span>
            </span>

            <DashboardHeroCta label="Start" />
        </Link>
    );
}
