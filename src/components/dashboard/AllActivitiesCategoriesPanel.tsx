import Link from "next/link";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

const ACTIVITY_CATEGORIES = [
    { label: "Grammar", href: "/dashboard/activities?category=grammar", category: "grammar", emoji: "📖" },
    { label: "Vocabulary", href: "/dashboard/activities?category=vocabulary", category: "vocabulary", emoji: "🗂️" },
    { label: "Quizzes", href: "/dashboard/activities?category=quizzes", category: "quizzes", emoji: "✏️" },
    { label: "Games", href: "/dashboard/activities?category=games", category: "games", emoji: "🎮" },
    { label: "Pronunciation", href: "/dashboard/activities?category=pronunciation", category: "pronunciation", emoji: "🔊" },
    { label: "Speaking", href: "/dashboard/activities?category=speaking", category: "speaking", emoji: "🎤" },
] as const;

export function AllActivitiesCategoriesPanel() {
    return (
        <section className="dashboard-panel hidden lg:block rounded-2xl p-5" aria-label="All activities">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-text">All Activities</h2>
                <Link
                    href="/dashboard/activities"
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    style={{ color: "var(--primary)" }}
                >
                    Browse all →
                </Link>
            </div>
            <div className="grid grid-cols-6 gap-2.5">
                {ACTIVITY_CATEGORIES.map((chip) => {
                    const tone = getLearnerCategoryTone(chip.category);

                    return (
                        <Link
                            key={chip.label}
                            href={chip.href}
                            className="flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            style={{
                                backgroundColor: tone.chipBg,
                                borderColor: tone.border,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none"
                                style={{
                                    background: `color-mix(in srgb, ${tone.accent} 14%, var(--dashboard-surface-start))`,
                                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 60%, transparent)`,
                                }}
                            >
                                {chip.emoji}
                            </span>
                            <span className="text-[11px] font-bold leading-tight" style={{ color: tone.chipText }}>
                                {chip.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
