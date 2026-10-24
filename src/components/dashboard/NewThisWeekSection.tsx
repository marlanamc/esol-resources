import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { stripVocabTypeSuffix } from "@/lib/vocab/display";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";
import type { ResumePracticeItem } from "@/lib/dashboard/resume-practice";

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

/** Leave enough room for activity titles before adding columns on wider screens. */
function gridColumnsClass(count: number): string {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4";
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
        return <KeepPracticingList items={items} />;
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
                                <span className="text-[0.8125rem] font-bold" style={{ color: tone.chipText }}>
                                    {format.label}
                                </span>
                            </span>
                            {assignment.isNewRelease && (assignment.progress ?? 0) < 100 ? (
                                <span
                                    className="shrink-0 self-start rounded-full px-2.5 py-[3px] text-[0.6875rem] font-bold uppercase tracking-wide"
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

/** Mobile home: the game you stopped in, then the teacher's featured activities. Finished ones drop off. */
export function KeepPracticingList({ items, resume = null }: { items: FeaturedAssignment[]; resume?: ResumePracticeItem | null }) {
    // The resume row already covers that game; don't list it twice.
    const resumeTitle = resume?.title.trim().toLowerCase();
    const open = items.filter(
        (assignment) => (assignment.progress ?? 0) < 100 && resolveDisplayTitle(assignment).trim().toLowerCase() !== resumeTitle
    );
    if (open.length === 0 && !resume) return null;
    const gamesTone = getLearnerCategoryTone("games");

    return (
        <section aria-labelledby="keep-practicing-heading" className={`font-legible ${roadStyles.road}`}>
            <h2 id="keep-practicing-heading" className="mb-1.5 font-display text-[1.1875rem] font-bold leading-tight text-text">
                Keep practicing
            </h2>
            <div>
                {resume ? (
                    <Link
                        href={resume.href}
                        aria-label={`${resume.action}: ${resume.title}`}
                        className="flex min-h-[60px] items-center gap-3 rounded-lg px-1 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <span
                            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
                            style={{ background: gamesTone.surface, color: gamesTone.accent }}
                        >
                            <Gamepad2 size={18} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[0.9375rem] leading-[1.3] font-semibold text-text">{resume.title}</span>
                            <span className="mt-0.5 block text-[0.8125rem] text-text-muted">
                                {resume.action === "Play another round" ? "Play another round" : "You stopped here"}
                            </span>
                            {resume.progress !== null ? (
                                <span role="progressbar" aria-label="Patterns unlocked" aria-valuenow={resume.progress} aria-valuemin={0} aria-valuemax={100} className="mt-1.5 block h-1 max-w-40 overflow-hidden rounded-full" style={{ background: "var(--road-progress-todo)" }}>
                                    <span className="block h-full rounded-full" style={{ width: `${resume.progress}%`, background: gamesTone.accent }} />
                                </span>
                            ) : null}
                            <span className="sr-only">{resume.note}</span>
                        </span>
                        <span className="shrink-0 text-[0.875rem] font-bold" style={{ color: gamesTone.chipText }}>
                            {resume.action === "Play another round" ? "Play" : "Finish"} ›
                        </span>
                    </Link>
                ) : null}
                {open.map((assignment, index) => {
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
                            className="flex min-h-[60px] items-center gap-3 rounded-lg px-1 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                            style={{ borderTop: index === 0 && !resume ? undefined : ROW_BORDER }}
                        >
                            <span
                                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
                                style={{ background: tone.surface, color: tone.accent }}
                            >
                                <Icon size={18} aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[0.9375rem] leading-[1.3] font-semibold text-text">{title}</span>
                                <span className="mt-0.5 block text-[0.8125rem] text-text-muted">{format.label}</span>
                            </span>
                            {assignment.isNewRelease ? (
                                <span className="shrink-0 text-[0.6875rem] font-extrabold uppercase tracking-[.06em]" style={{ color: "var(--primary-text)" }}>
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
