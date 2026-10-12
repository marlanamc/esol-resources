import Link from "next/link";
import { BookOpen, ClipboardCheck, Copy, Gamepad2, Volume2 } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

// Same icon set as the course map rows; vocabulary uses the cards icon so it doesn't share Grammar's book.
const ACTIVITY_CATEGORIES = [
    { label: "Grammar", href: "/dashboard/activities?category=grammar", category: "grammar", icon: BookOpen },
    { label: "Vocabulary", href: "/dashboard/activities?category=vocabulary", category: "vocabulary", icon: Copy },
    { label: "Quizzes", href: "/dashboard/activities?category=quizzes", category: "quizzes", icon: ClipboardCheck },
    { label: "Games", href: "/dashboard/activities?category=games", category: "games", icon: Gamepad2 },
    { label: "Pronunciation", href: "/dashboard/activities?category=pronunciation", category: "pronunciation", icon: Volume2 },
] as const;

export function AllActivitiesCategoriesPanel() {
    return (
        <section className="dashboard-panel hidden lg:block rounded-2xl p-5" aria-labelledby="all-activities-heading">
            <div className="mb-4 flex items-center justify-between">
                <h2 id="all-activities-heading" className="font-display text-base font-bold text-text">All Activities</h2>
                <Link
                    href="/dashboard/activities"
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    style={{ color: "var(--primary-text)" }}
                >
                    Browse all →
                </Link>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
                {ACTIVITY_CATEGORIES.map((chip) => {
                    const tone = getLearnerCategoryTone(chip.category);
                    const Icon = chip.icon;

                    return (
                        <Link
                            key={chip.label}
                            href={chip.href}
                            className="flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            style={{
                                backgroundColor: tone.chipBg,
                                borderColor: tone.border,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{
                                    color: tone.accent,
                                    background: `color-mix(in srgb, ${tone.accent} 14%, var(--dashboard-surface-start))`,
                                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 60%, transparent)`,
                                }}
                            >
                                <Icon size={19} aria-hidden />
                            </span>
                            <span className="text-[13px] font-bold leading-tight" style={{ color: tone.chipText }}>
                                {chip.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
