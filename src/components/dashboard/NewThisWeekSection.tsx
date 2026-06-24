
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { getGameEmojiForActivity } from "@/lib/game-emoji";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { stripVocabTypeSuffix } from "@/lib/vocab-display";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

interface NewThisWeekSectionProps {
    items: FeaturedAssignment[];
    subtitle?: string | null;
}

function resolveCategoryKey(assignment: FeaturedAssignment): string {
    const category = (assignment.activity.category || "").toLowerCase();
    const type = (assignment.activity.type || "").toLowerCase();
    if (category === "games" || type === "game") return "games";
    if (category === "speaking" || type === "speaking") return "speaking";
    if (category === "vocabulary" || category === "vocab" || assignment.activityId.startsWith("vocab-")) {
        return "vocabulary";
    }
    if (category === "grammar" || type === "guide") return "grammar";
    if (category === "pronunciation" || type === "pronunciation") return "pronunciation";
    if (category === "quizzes" || category === "quiz" || type === "quiz") return "quizzes";
    return category || "quizzes";
}

function resolveTypeLabel(assignment: FeaturedAssignment): string {
    const key = resolveCategoryKey(assignment);
    switch (key) {
        case "games":
            return "Game";
        case "vocabulary":
            return "Vocabulary";
        case "speaking":
            return "Speaking";
        case "grammar":
            return "Grammar";
        case "pronunciation":
            return "Pronunciation";
        case "quizzes":
            return "Quiz";
        default:
            return getLearnerCategoryTone(key).label;
    }
}


function resolveBadgeLabel(assignment: FeaturedAssignment): string {
    const key = resolveCategoryKey(assignment);
    if (key === "games") return "New game";
    return "New";
}


function resolveDisplayTitle(assignment: FeaturedAssignment): string {
    const rawTitle = assignment.title || assignment.activity.title;
    return (
        assignment.displayTitle ||
        stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, " Guide"))
    );
}

function resolveActivityEmoji(assignment: FeaturedAssignment): string {
    const categoryKey = resolveCategoryKey(assignment);
    const title = assignment.title || assignment.activity.title;

    if (categoryKey === "games") {
        return getGameEmojiForActivity({
            activityId: assignment.activityId,
            title,
        });
    }

    switch (categoryKey) {
        case "vocabulary":
            return "🗂️";
        case "grammar":
            return "📖";
        case "speaking":
            return "🎤";
        case "pronunciation":
            return "🔊";
        case "quizzes":
            return "✏️";
        default:
            return "📌";
    }
}

export function NewThisWeekSection({
    items,
    subtitle,
}: NewThisWeekSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section aria-label="New and featured this week">
            <div className="mb-3.5">
                <div className="flex items-center gap-2">
                    <span
                        className="h-[2px] w-6 shrink-0 rounded-full bg-primary"
                        aria-hidden
                    />
                    <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-primary">
                        Featured for you
                    </h2>
                </div>
                {subtitle ? (
                    <p className="mt-1 text-xs text-text-muted/85">{subtitle}</p>
                ) : null}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-0.5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {items.map((assignment) => {
                    const categoryKey = resolveCategoryKey(assignment);
                    const tone = getLearnerCategoryTone(categoryKey);
                    const displayTitle = resolveDisplayTitle(assignment);
                    const typeLabel = resolveTypeLabel(assignment);
                    const activityEmoji = resolveActivityEmoji(assignment);
                    const badgeLabel = assignment.isNewRelease
                        ? resolveBadgeLabel(assignment)
                        : "Featured";

                    return (
                        <ActivityLink
                            key={assignment.id}
                            activityId={assignment.activityId}
                            assignmentId={assignment.assignmentId ?? assignment.id}
                            href={assignment.href}
                            className="group shrink-0 w-[min(100%,268px)] snap-start overflow-hidden rounded-[18px] border flex items-stretch transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(40,31,23,0.05),0_10px_24px_rgba(40,31,23,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 md:basis-[calc(50%-0.375rem)] md:w-auto"
                            style={{
                                background: "var(--surface-elevated, #ffffff)",
                                borderColor: "color-mix(in srgb, var(--dashboard-border) 72%, transparent)",
                                boxShadow: "0 1px 2px rgba(40,31,23,0.04), 0 6px 18px rgba(40,31,23,0.05)",
                            }}
                        >
                            {/* Category accent: quiet 3px left border rule instead of icon box */}
                            <span
                                className="w-[3px] shrink-0 self-stretch rounded-l-[18px]"
                                style={{ background: tone.accent }}
                                aria-hidden
                            />
                            <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5">
                                <span
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-base leading-none"
                                    style={{
                                        background: `color-mix(in srgb, ${tone.chipBg} 78%, transparent)`,
                                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 40%, transparent)`,
                                    }}
                                    aria-hidden
                                >
                                    {activityEmoji}
                                </span>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-[3px] text-[10px] font-semibold uppercase leading-none tracking-wide text-primary">
                                        {badgeLabel}
                                    </span>
                                    <p className="truncate text-[15px] font-bold leading-tight text-text">
                                        {displayTitle}
                                    </p>
                                    <p className="text-xs leading-none text-text-muted/90">
                                        {typeLabel}
                                    </p>
                                </div>
                            </div>
                        </ActivityLink>
                    );
                })}
            </div>
        </section>
    );
}
