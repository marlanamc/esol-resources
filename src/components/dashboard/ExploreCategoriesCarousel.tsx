"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Blocks, ClipboardList, Gamepad2, Layers, Mic } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner-theme";

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
            className="min-w-0 overflow-hidden md:hidden"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
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

            <div className="relative w-full min-w-0 overflow-hidden">
                <div
                    className="flex w-full min-w-0 gap-2.5 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="list"
                >
                    {EXPLORE_CATEGORIES.map(({ key, label, icon: Icon }) => {
                        const tone = getLearnerCategoryTone(key);

                        return (
                            <Link
                                key={key}
                                href={`/dashboard/activities?category=${key}`}
                                role="listitem"
                                className="dashboard-panel snap-start flex w-[calc((100%-30px)/4.15)] min-w-[72px] max-w-[96px] shrink-0 flex-col items-center gap-2 rounded-2xl border px-1.5 py-3.5 transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                                style={{
                                    borderColor: tone.border,
                                    background:
                                        "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
                                }}
                            >
                                <span
                                    className="flex h-11 w-11 items-center justify-center rounded-full"
                                    style={{
                                        color: tone.accent,
                                        background: `color-mix(in srgb, ${tone.accent} 16%, var(--dashboard-surface-start))`,
                                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 65%, transparent)`,
                                    }}
                                >
                                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                                </span>
                                <span className="text-center text-[11px] font-bold leading-tight text-text">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                    {/* Trailing spacer so the last tile can scroll fully into view */}
                    <div aria-hidden="true" className="w-3 shrink-0" />
                </div>
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent"
                />
            </div>
        </section>
    );
}
