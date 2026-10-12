import { Check } from "lucide-react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { stripVocabTypeSuffix } from "@/lib/vocab/display";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

interface NewThisWeekSectionProps {
    items: FeaturedAssignment[];
    subtitle?: string | null;
    /** `list` uses the course map's activity rows (mobile classroom home). */
    variant?: "grid" | "list";
}

/** Course map rows tag pronunciation games as "pronunciation"; match that so Featured uses the same color. */
function resolveFormatType(assignment: FeaturedAssignment): string {
    if ((assignment.activity.category || "").toLowerCase() === "pronunciation") return "pronunciation";
    return (assignment.activity.type || "").toLowerCase();
}

function resolveBadgeLabel(assignment: FeaturedAssignment): string {
    return resolveFormatType(assignment) === "game" ? "New game" : "New";
}

/** Size the grid to the item count so a short list never leaves one card alone on a row. */
function gridColumnsClass(count: number): string {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    return "grid-cols-2 2xl:grid-cols-4";
}

function resolveDisplayTitle(assignment: FeaturedAssignment): string {
    const rawTitle = assignment.title || assignment.activity.title;
    return (
        assignment.displayTitle ||
        stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, " Guide"))
    );
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
        <section aria-labelledby="featured-for-you-heading">
            <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="featured-for-you-heading" className="font-display text-base font-bold text-text">
                    Featured for you
                </h2>
                {subtitle ? <p className="text-xs text-text-muted">{subtitle}</p> : null}
            </div>

            <div className={`grid gap-3 ${gridColumnsClass(items.length)}`}>
                {items.map((assignment) => {
                    const title = resolveDisplayTitle(assignment);
                    const format = getCourseMapActivityFormat(resolveFormatType(assignment), undefined, title);
                    const tone = getLearnerCategoryTone(format.tone);
                    const Icon = format.icon;

                    return (
                        <ActivityLink
                            key={assignment.id}
                            activityId={assignment.activityId}
                            assignmentId={assignment.assignmentId ?? assignment.id}
                            href={assignment.href}
                            className="group flex items-center gap-3 rounded-2xl border border-[color:var(--dashboard-border)] py-3.5 pl-4 pr-4 [box-shadow:var(--dashboard-shadow-rest)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[color:var(--featured-hover-border)] hover:[box-shadow:var(--dashboard-shadow-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            style={{
                                background: "var(--surface-elevated)",
                                ["--featured-hover-border" as string]: `color-mix(in srgb, ${tone.accent} 45%, var(--dashboard-border))`,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                style={{ border: `2px solid ${tone.accent}`, color: tone.accent }}
                            >
                                <Icon size={19} aria-hidden />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="line-clamp-2 text-balance text-base font-bold leading-snug text-text">
                                    {title}
                                </span>
                                <span className="text-[13px] font-bold" style={{ color: tone.chipText }}>
                                    {format.label}
                                </span>
                            </span>
                            {assignment.isNewRelease && (assignment.progress ?? 0) < 100 ? (
                                <span
                                    className="shrink-0 self-start rounded-full px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-wide"
                                    style={{
                                        color: "var(--primary-text)",
                                        background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                                    }}
                                >
                                    {resolveBadgeLabel(assignment)}
                                </span>
                            ) : null}
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
