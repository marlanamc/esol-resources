"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Blocks, ClipboardList, Gamepad2, Layers, Mic, MessageCircle } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { buildActivityHref } from "@/lib/learner-navigation";
import type { DailyChecklistHabit } from "@/lib/daily-habits";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

const CATEGORY_ICON: Record<string, LucideIcon> = {
    grammar: Blocks,
    vocabulary: Layers,
    games: Gamepad2,
    pronunciation: Mic,
    speaking: MessageCircle,
    quizzes: ClipboardList,
};

function CategoryIcon({ categoryKey, color }: { categoryKey: string; color: string }) {
    const Icon = CATEGORY_ICON[categoryKey] ?? ClipboardList;
    return <Icon size={20} strokeWidth={2} color={color} aria-hidden="true" />;
}

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
    subtitle,
}: {
    href: string;
    categoryKey: string;
    title: string;
    subtitle: string;
}) {
    const tone = getLearnerCategoryTone(categoryKey);

    return (
        <Link
            href={href}
            className="dashboard-panel flex w-[140px] min-w-[140px] shrink-0 snap-start flex-col gap-2 rounded-2xl border p-3 transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
                borderColor: tone.border,
                background: "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
            }}
        >
            {/* Category icon */}
            <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                    background: `color-mix(in srgb, ${tone.accent} 16%, var(--dashboard-surface-start))`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 65%, transparent)`,
                }}
            >
                <CategoryIcon categoryKey={categoryKey} color={tone.accent} />
            </span>

            {/* Title */}
            <p className="line-clamp-2 text-[12.5px] font-semibold leading-tight text-text">
                {title}
            </p>

            {/* Subtitle */}
            <p className="mt-auto text-[11px] font-medium leading-none text-text-muted">
                {subtitle}
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
                            className="dashboard-panel flex w-[140px] min-w-[140px] shrink-0 snap-start flex-col gap-2 rounded-2xl border p-3 transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            style={{
                                borderColor: isDoneToday
                                    ? `color-mix(in srgb, ${vocabTone.border} 50%, var(--border-subtle))`
                                    : vocabTone.border,
                                background: "linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)",
                                opacity: isDoneToday ? 0.8 : 1,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{
                                    color: vocabTone.accent,
                                    background: `color-mix(in srgb, ${vocabTone.accent} 16%, var(--dashboard-surface-start))`,
                                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vocabTone.border} 65%, transparent)`,
                                }}
                                aria-hidden="true"
                            >
                                <Layers size={20} strokeWidth={2} />
                            </span>
                            <p className="line-clamp-2 text-[12.5px] font-semibold leading-tight text-text">
                                {vocabHabit.title}
                            </p>
                            <p className="mt-auto text-[11px] font-medium leading-none text-text-muted">
                                {vocabBadge}
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
                                    subtitle={resolveTypeLabel(item)}
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
