"use client";

import Link from "next/link";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { buildActivityHref } from "@/lib/learner-navigation";
import type { DailyChecklistHabit } from "@/lib/daily-habits";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

interface ContinueLearningRowProps {
    vocabHabit: DailyChecklistHabit | null;
    items: FeaturedAssignment[];
}

function resolveCategoryKey(assignment: FeaturedAssignment): string {
    const category = (assignment.activity.category || "").toLowerCase();
    const type = (assignment.activity.type || "").toLowerCase();
    if (category === "games" || type === "game") return "games";
    if (category === "speaking" || type === "speaking") return "speaking";
    if (category === "vocabulary" || category === "vocab" || assignment.activityId.startsWith("vocab-")) return "vocabulary";
    if (category === "grammar" || type === "guide") return "grammar";
    if (category === "pronunciation" || type === "pronunciation") return "pronunciation";
    if (category === "quizzes" || category === "quiz" || type === "quiz") return "quizzes";
    return category || "quizzes";
}

function resolveTypeLabel(assignment: FeaturedAssignment): string {
    switch (resolveCategoryKey(assignment)) {
        case "games": return "Game";
        case "vocabulary": return "Vocab";
        case "speaking": return "Speaking";
        case "grammar": return "Grammar";
        case "pronunciation": return "Pronunciation";
        default: return "Quiz";
    }
}

function ContinueCard({
    href,
    categoryKey,
    title,
    badge,
}: {
    href: string;
    categoryKey: string;
    title: string;
    badge: string;
}) {
    const tone = getLearnerCategoryTone(categoryKey);

    return (
        <Link
            href={href}
            className="flex w-[130px] min-w-[130px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-3 transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
                borderColor: tone.border,
                background: `linear-gradient(160deg, color-mix(in srgb, ${tone.chipBg} 70%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-start) 100%)`,
            }}
        >
            {/* Category badge */}
            <span
                className="inline-flex self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{
                    background: tone.chipBg,
                    color: tone.chipText,
                    border: `1px solid color-mix(in srgb, ${tone.border} 60%, transparent)`,
                }}
            >
                {badge}
            </span>

            {/* Title */}
            <p className="mt-2 line-clamp-2 text-[12px] font-semibold leading-tight text-text">
                {title}
            </p>
        </Link>
    );
}

export function ContinueLearningRow({ vocabHabit, items }: ContinueLearningRowProps) {
    const hasVocab = vocabHabit !== null;
    const featuredItems = items.slice(0, 4);
    const hasContent = hasVocab || featuredItems.length > 0;

    if (!hasContent) return null;

    const vocabTone = getLearnerCategoryTone("vocabulary");
    const isDoneToday = vocabHabit?.status === "done-today";
    const visibleNewCount = vocabHabit ? Math.min(vocabHabit.newCount, 6) : 0;

    const vocabBadge = isDoneToday
        ? "Done ✓"
        : vocabHabit && visibleNewCount > 0
            ? `${visibleNewCount} new`
            : vocabHabit && vocabHabit.dueCount > 0
                ? `${vocabHabit.dueCount} due`
                : "Vocab";

    return (
        <section aria-label="Continue learning">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold leading-tight text-text">
                    Continue Learning
                </h2>
                <Link
                    href="/dashboard/activities"
                    className="shrink-0 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
                >
                    See all ›
                </Link>
            </div>

            <div className="relative w-full min-w-0 overflow-hidden">
                <div
                    className="flex w-full min-w-0 gap-2.5 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="list"
                >
                    {/* Vocab habit card */}
                    {hasVocab && vocabHabit && (
                        <Link
                            key="vocab-daily"
                            href={vocabHabit.href}
                            role="listitem"
                            className="flex w-[130px] min-w-[130px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-3 transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            style={{
                                borderColor: isDoneToday
                                    ? `color-mix(in srgb, ${vocabTone.border} 50%, var(--border-subtle))`
                                    : vocabTone.border,
                                background: isDoneToday
                                    ? `color-mix(in srgb, ${vocabTone.chipBg} 50%, var(--dashboard-surface-start))`
                                    : `linear-gradient(160deg, color-mix(in srgb, ${vocabTone.chipBg} 70%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-start) 100%)`,
                                opacity: isDoneToday ? 0.8 : 1,
                            }}
                        >
                            <span
                                className="inline-flex self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                style={{
                                    background: vocabTone.chipBg,
                                    color: vocabTone.chipText,
                                    border: `1px solid color-mix(in srgb, ${vocabTone.border} 60%, transparent)`,
                                }}
                            >
                                {vocabBadge}
                            </span>
                            <p className="mt-2 line-clamp-2 text-[12px] font-semibold leading-tight text-text">
                                {vocabHabit.title}
                            </p>
                        </Link>
                    )}

                    {/* Featured activity cards */}
                    {featuredItems.map((item) => {
                        const categoryKey = resolveCategoryKey(item);
                        const title = item.displayTitle || item.title || item.activity.title;
                        const href = item.href ?? buildActivityHref(item.activityId, item.id);
                        return (
                            <div key={item.id} role="listitem">
                                <ContinueCard
                                    href={href}
                                    categoryKey={categoryKey}
                                    title={title}
                                    badge={resolveTypeLabel(item)}
                                />
                            </div>
                        );
                    })}

                    {/* Trailing spacer */}
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
