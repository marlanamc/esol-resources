"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { BookOpen, Medal } from "lucide-react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { getMedalTier, getMedalTierLabel, type MedalTier } from "@/lib/medal-utils";

export interface ProfileQuizGrade {
    id: string;
    title: string;
    score: number | null;
}

const VISIBLE_ROWS = 6;

const NEXT_TIER: Record<MedalTier, MedalTier | null> = {
    bronze: "silver",
    silver: "gold",
    gold: "platinum",
    platinum: null,
};

const TIER_PILL: Record<MedalTier, string> = {
    bronze: "bg-orange-100 text-orange-900 dark:bg-orange-950/60 dark:text-orange-200",
    silver: "bg-slate-200 text-slate-800 dark:bg-slate-700/60 dark:text-slate-100",
    gold: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200",
    platinum: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200",
};

function gradeHint(score: number | null): string {
    if (score === null) return "Not done yet";
    const tier = getMedalTier(score);
    if (!tier) return "Try again to earn a medal";
    const next = NEXT_TIER[tier];
    const medal = `${getMedalTierLabel(tier)} medal`;
    return next ? `${medal} · Try again for ${getMedalTierLabel(next).toLowerCase()}` : `${medal} · Perfect!`;
}

function ScorePill({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-sm font-bold text-text-muted">To do</span>;
    }
    const tier = getMedalTier(score);
    const tone = tier ? TIER_PILL[tier] : "bg-surface-subtle text-text";
    return (
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[15px] font-extrabold tabular-nums ${tone}`}>
            {tier && <Medal className="h-4 w-4" aria-hidden />}
            {score}%
        </span>
    );
}

function GradeList({ grades, emptyText }: { grades: ProfileQuizGrade[]; emptyText: string }) {
    const [showAll, setShowAll] = useState(false);
    if (grades.length === 0) {
        return <p className="rounded-xl border border-dashed border-border/60 p-4 text-[15px] text-text-muted">{emptyText}</p>;
    }
    const visible = showAll ? grades : grades.slice(0, VISIBLE_ROWS);
    return (
        <>
            <ul className="space-y-2">
                {visible.map((quiz) => (
                    <li key={quiz.id}>
                        <ActivityLink
                            activityId={quiz.id}
                            className="flex min-h-[60px] items-center gap-3 rounded-xl bg-surface-subtle px-3.5 py-2.5 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-base font-bold text-text">{quiz.title}</span>
                                <span className="block text-sm font-semibold text-text-muted">{gradeHint(quiz.score)}</span>
                            </span>
                            <ScorePill score={quiz.score} />
                        </ActivityLink>
                    </li>
                ))}
            </ul>
            {grades.length > VISIBLE_ROWS && (
                <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="min-h-11 w-full rounded-xl text-[15px] font-bold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    {showAll ? "Show less" : `Show all ${grades.length}`}
                </button>
            )}
        </>
    );
}

/** Weekly and mini quiz scores in two tabs; the medal tier rides inside each score. */
export function ProfileQuizGrades({ weekly, mini }: { weekly: ProfileQuizGrade[]; mini: ProfileQuizGrade[] }) {
    const [tab, setTab] = useState<"weekly" | "mini">("weekly");
    const baseId = useId();
    const tabRefs = useRef<Record<"weekly" | "mini", HTMLButtonElement | null>>({ weekly: null, mini: null });

    const tabs = [
        { key: "weekly" as const, label: "Weekly quizzes" },
        { key: "mini" as const, label: "Mini quizzes" },
    ];

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const next = tab === "weekly" ? "mini" : "weekly";
        setTab(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <section aria-labelledby={`${baseId}-heading`} className="space-y-4 rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen size={22} aria-hidden />
                </span>
                <h2 id={`${baseId}-heading`} className="text-xl font-extrabold text-text">My quiz grades</h2>
            </div>

            <div role="tablist" aria-label="Quiz type" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-1 rounded-xl bg-surface-subtle p-1">
                {tabs.map(({ key, label }) => {
                    const selected = tab === key;
                    return (
                        <button
                            key={key}
                            ref={(node) => { tabRefs.current[key] = node; }}
                            type="button"
                            role="tab"
                            id={`${baseId}-tab-${key}`}
                            aria-selected={selected}
                            aria-controls={`${baseId}-panel-${key}`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setTab(key)}
                            className={`min-h-11 rounded-lg text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                selected ? "bg-surface-base font-extrabold text-text shadow-sm" : "font-bold text-text-muted hover:text-text"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div role="tabpanel" id={`${baseId}-panel-${tab}`} aria-labelledby={`${baseId}-tab-${tab}`} className="space-y-2">
                {tab === "weekly" ? (
                    <GradeList key="weekly" grades={weekly} emptyText="No weekly quizzes yet." />
                ) : (
                    <GradeList key="mini" grades={mini} emptyText="No mini quizzes yet." />
                )}
            </div>
        </section>
    );
}
