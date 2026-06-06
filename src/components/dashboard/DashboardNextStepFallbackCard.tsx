import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner-theme";

type DashboardNextStepFallbackCardProps = {
    href: string;
    title: string;
    type: string;
    category?: string | null;
    minutes?: number;
    icon?: string;
};

function resolveCategory(type: string, category?: string | null): string {
    const normalizedType = type.toLowerCase();
    const normalizedCategory = (category || "").toLowerCase();

    if (normalizedCategory === "vocabulary" || normalizedCategory === "vocab") return "vocabulary";
    if (normalizedCategory === "grammar" || normalizedType === "guide") return "grammar";
    if (normalizedCategory === "games" || normalizedType === "game") return "games";
    if (normalizedCategory === "pronunciation") return "pronunciation";
    if (normalizedCategory === "speaking") return "speaking";
    if (normalizedCategory === "quizzes" || normalizedType === "quiz") return "quizzes";
    return normalizedCategory || "vocabulary";
}

function resolveTypeLabel(type: string, category?: string | null): string {
    const key = resolveCategory(type, category);
    if (key === "vocabulary") return "Practice";
    if (key === "grammar") return "Study";
    if (key === "games") return "Game";
    if (key === "pronunciation") return "Speak";
    if (key === "speaking") return "Practice";
    return "Quiz";
}

function resolveIcon(type: string, category?: string | null, icon?: string): string {
    if (icon) return icon;
    const key = resolveCategory(type, category);
    if (key === "vocabulary") return "🗂️";
    if (key === "grammar") return "📖";
    if (key === "games") return "🎮";
    if (key === "pronunciation") return "🔊";
    if (key === "speaking") return "🎤";
    return "✏️";
}

export function DashboardNextStepFallbackCard({
    href,
    title,
    type,
    category,
    minutes = 10,
    icon,
}: DashboardNextStepFallbackCardProps) {
    const categoryKey = resolveCategory(type, category);
    const tone = getLearnerCategoryTone(categoryKey);

    return (
        <section aria-label="Your next step">
            <div
                className="dashboard-panel rounded-[26px] border px-6 py-7 shadow-[0_10px_32px_rgba(40,31,23,0.07)]"
                style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${tone.chipBg} 64%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-start) 72%)`,
                    borderColor: `color-mix(in srgb, ${tone.accent} 16%, var(--dashboard-border))`,
                }}
            >
                <p
                    className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: "var(--primary)" }}
                >
                    Your Next Step
                </p>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <span
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] text-3xl"
                            style={{
                                background: `color-mix(in srgb, ${tone.chipBg} 82%, #ffffff)`,
                                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 48%, transparent)`,
                            }}
                            aria-hidden
                        >
                            {resolveIcon(type, category, icon)}
                        </span>
                        <div className="min-w-0">
                            <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-[28px]">
                                {title}
                            </h2>
                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
                                <span>{resolveTypeLabel(type, category)}</span>
                                <span aria-hidden>·</span>
                                <Clock size={14} aria-hidden />
                                {minutes} min
                            </p>
                        </div>
                    </div>
                    <Link
                        href={href}
                        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-7 text-base font-extrabold text-[color:var(--text-on-accent)] shadow-[0_8px_20px_rgba(40,31,23,0.12)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 sm:w-auto"
                    >
                        Start
                        <ArrowRight size={21} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
