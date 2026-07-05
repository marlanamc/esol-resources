import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

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
                className="dashboard-panel rounded-[22px] border px-5 py-5 shadow-[0_6px_20px_rgba(40,31,23,0.06)]"
                style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${tone.chipBg} 64%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-start) 72%)`,
                    borderColor: `color-mix(in srgb, ${tone.accent} 16%, var(--dashboard-border))`,
                }}
            >
                <p
                    className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: "var(--primary)" }}
                >
                    Today's Next Step
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-2xl"
                            style={{
                                background: `color-mix(in srgb, ${tone.chipBg} 82%, #ffffff)`,
                                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 48%, transparent)`,
                            }}
                            aria-hidden
                        >
                            {resolveIcon(type, category, icon)}
                        </span>
                        <div className="min-w-0">
                            <h2 className="font-display text-xl font-bold leading-tight text-text sm:text-2xl">
                                {title}
                            </h2>
                            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-text-muted">
                                <span>{resolveTypeLabel(type, category)}</span>
                                <span aria-hidden>·</span>
                                <Clock size={13} aria-hidden />
                                {minutes} min
                            </p>
                        </div>
                    </div>
                    <Link
                        href={href}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 text-[15px] font-extrabold text-[color:var(--text-on-accent)] shadow-[0_6px_16px_rgba(40,31,23,0.12)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 sm:w-auto"
                    >
                        Start
                        <ArrowRight size={18} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
