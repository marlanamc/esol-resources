import { Check } from "lucide-react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { getGameEmojiForActivity } from "@/lib/game-emoji";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { stripVocabTypeSuffix } from "@/lib/vocab/display";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

interface NewThisWeekSectionProps {
    items: FeaturedAssignment[];
    subtitle?: string | null;
    /** `list` uses the course map's activity rows (mobile classroom home). */
    variant?: "grid" | "list";
}

function resolveCategoryKey(assignment: FeaturedAssignment): string {
    const category = (assignment.activity.category || "").toLowerCase();
    const type = (assignment.activity.type || "").toLowerCase();
    // Pronunciation games are stored as type "game"; the category is what the course map colors by.
    if (category === "pronunciation" || type === "pronunciation") return "pronunciation";
    if (category === "games" || type === "game") return "games";
    if (category === "speaking" || type === "speaking") return "speaking";
    if (category === "vocabulary" || category === "vocab" || assignment.activityId.startsWith("vocab-")) {
        return "vocabulary";
    }
    if (category === "grammar" || type === "guide") return "grammar";
    if (category === "quizzes" || category === "quiz" || type === "quiz") return "quizzes";
    return category || "quizzes";
}

/** Course map rows tag pronunciation games as "pronunciation"; match that so Featured uses the same color. */
function resolveFormatType(assignment: FeaturedAssignment): string {
    if ((assignment.activity.category || "").toLowerCase() === "pronunciation") return "pronunciation";
    return (assignment.activity.type || "").toLowerCase();
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
    variant = "grid",
}: NewThisWeekSectionProps) {
    if (items.length === 0) {
        return null;
    }

    if (variant === "list") {
        return <FeaturedList items={items} />;
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

            <div className="grid grid-cols-2 gap-2 md:gap-3">
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
                            className="group flex items-stretch overflow-hidden rounded-[14px] border transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(40,31,23,0.05),0_10px_24px_rgba(40,31,23,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 md:rounded-[18px]"
                            style={{
                                background: "var(--surface-elevated, #ffffff)",
                                borderColor: "color-mix(in srgb, var(--dashboard-border) 72%, transparent)",
                                boxShadow: "0 1px 2px rgba(40,31,23,0.04), 0 6px 18px rgba(40,31,23,0.05)",
                            }}
                        >
                            {/* Category accent: quiet 3px left border rule instead of icon box */}
                            <span
                                className="w-[3px] shrink-0 self-stretch rounded-l-[14px] md:rounded-l-[18px]"
                                style={{ background: tone.accent }}
                                aria-hidden
                            />
                            <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2.5 md:gap-3 md:px-4 md:py-3.5">
                                <span
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] text-sm leading-none md:h-8 md:w-8 md:rounded-[10px] md:text-base"
                                    style={{
                                        background: `color-mix(in srgb, ${tone.chipBg} 78%, transparent)`,
                                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 40%, transparent)`,
                                    }}
                                    aria-hidden
                                >
                                    {activityEmoji}
                                </span>
                                <div className="min-w-0 flex-1 space-y-0.5 md:space-y-1">
                                    <span className="hidden md:inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-[3px] text-[10px] font-semibold uppercase leading-none tracking-wide text-primary">
                                        {badgeLabel}
                                    </span>
                                    <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-text md:truncate md:text-[15px] md:font-bold">
                                        {displayTitle}
                                    </p>
                                    <p className="text-[11px] leading-none text-text-muted/90 md:text-xs">
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

const ROW_BORDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

function FeaturedList({ items }: { items: FeaturedAssignment[] }) {
    return (
        <section aria-label="Featured" className={`font-legible ${roadStyles.road}`}>
            <h2 className="mb-2 text-[12px] font-extrabold uppercase tracking-[.07em] text-text-muted">Featured</h2>
            <div
                className="overflow-hidden rounded-2xl"
                style={{
                    background: "var(--surface-base)",
                    border: "1px solid color-mix(in srgb, var(--road-rail) 75%, transparent)",
                }}
            >
                {items.map((assignment, index) => {
                    const title = resolveDisplayTitle(assignment);
                    const format = getCourseMapActivityFormat(resolveFormatType(assignment), undefined, title);
                    const tone = getLearnerCategoryTone(format.tone);
                    const Icon = format.icon;
                    const done = (assignment.progress ?? 0) >= 100;

                    return (
                        <ActivityLink
                            key={assignment.id}
                            activityId={assignment.activityId}
                            assignmentId={assignment.assignmentId ?? assignment.id}
                            href={assignment.href}
                            className="flex min-h-[64px] items-center gap-3 px-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                            style={{ borderTop: index === 0 ? undefined : ROW_BORDER }}
                        >
                            <span
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                style={
                                    done
                                        ? { background: tone.surface, color: tone.accent }
                                        : { background: "var(--surface-base)", border: `2px solid ${tone.accent}`, color: tone.accent }
                                }
                            >
                                <Icon size={19} aria-hidden />
                                {done ? (
                                    <span
                                        className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full"
                                        style={{ background: "var(--success-color)", color: "var(--road-on-success)", boxShadow: "0 0 0 2px var(--surface-base)" }}
                                    >
                                        <Check size={10} strokeWidth={3.5} aria-hidden />
                                    </span>
                                ) : null}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className={`block text-[15px] leading-[1.3] ${done ? "font-medium text-text-muted" : "font-semibold text-text"}`}>
                                    {title}
                                </span>
                                <span className="mt-0.5 block text-[13px] font-semibold" style={{ color: done ? "var(--text-muted)" : tone.chipText }}>
                                    {format.label}
                                </span>
                                {done ? <span className="sr-only">Done</span> : null}
                            </span>
                            {assignment.isNewRelease && !done ? (
                                <span
                                    className="shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.06em] text-text-muted"
                                    style={{ background: "var(--road-neutral-chip)" }}
                                >
                                    New
                                </span>
                            ) : null}
                        </ActivityLink>
                    );
                })}
            </div>
        </section>
    );
}
