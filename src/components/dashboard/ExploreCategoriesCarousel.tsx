"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Blocks, ClipboardList, Gamepad2, Layers, Mic } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

const EXPLORE_CATEGORIES: Array<{
    key: string;
    label: string;
    icon: LucideIcon;
}> = [
    { key: "grammar", label: "Grammar", icon: Blocks },
    { key: "vocabulary", label: "Vocabulary", icon: Layers },
    { key: "games", label: "Games", icon: Gamepad2 },
    { key: "pronunciation", label: "Pronunciation", icon: Mic },
    { key: "quizzes", label: "Quizzes", icon: ClipboardList },
];

export function ExploreCategoriesCarousel() {
    return (
        <section
            aria-label="Explore activity categories"
            className="min-w-0 md:hidden"
        >
            <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold leading-tight text-text">Explore</h2>
                <Link
                    href="/dashboard/activities"
                    className="shrink-0 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
                >
                    See all
                    <span aria-hidden="true" className="ml-0.5">
                        ›
                    </span>
                </Link>
            </div>

            <div className="flex flex-wrap gap-2" role="list">
                {EXPLORE_CATEGORIES.map(({ key, label, icon: Icon }) => {
                    const tone = getLearnerCategoryTone(key);

                    return (
                        <Link
                            key={key}
                            href={`/dashboard/activities?category=${key}`}
                            role="listitem"
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold text-text transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                            style={{
                                borderColor: tone.border,
                                background: `color-mix(in srgb, ${tone.accent} 10%, var(--dashboard-surface-start))`,
                                color: tone.accentStrong ?? "var(--text)",
                            }}
                        >
                            <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                            {label}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
