import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";
import { countUnreadReplies } from "@/lib/learner/study-log";
import type { StudentStudyWeek } from "@/lib/learner/study-log-data";
import { StudyWeekDots } from "./StudyWeekDots";

export const STUDY_LOG_HREF = "/dashboard/practice";

/** Home card: title, days toward the learner's days-a-week goal and Log button, Mon–Sun dots, one goal line, then any unread teacher replies. */
export function StudyWeekCard({ week, goalDays, entries, earlierReplies }: StudentStudyWeek) {
    const unread = countUnreadReplies(entries) + countUnreadReplies(earlierReplies);
    const days = week.daysPracticed;
    const done = days >= goalDays;
    const left = goalDays - days;
    return (
        <section
            aria-labelledby="study-week-heading"
            className={`space-y-3 rounded-[20px] border-2 border-emerald-700 px-4 py-3 dark:border-emerald-600 ${
                done ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-surface-elevated"
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 id="study-week-heading" className="m-0 font-display text-lg font-bold leading-tight text-text">
                        {done ? "Goal done!" : "My practice week"}
                    </h2>
                    <p className="m-0 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        {days} of {goalDays} days
                    </p>
                </div>
                <Link
                    href={STUDY_LOG_HREF}
                    className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-sm font-bold text-[#fffdfa] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Plus size={15} strokeWidth={2.6} aria-hidden />
                    Log
                    <span className="sr-only"> my practice</span>
                </Link>
            </div>

            <StudyWeekDots week={week} compact />

            <p className="m-0 text-sm text-text-muted">
                {done
                    ? "You did it! Extra days still count."
                    : `${left} more ${left === 1 ? "day" : "days"} to reach your goal.`}
            </p>

            {unread > 0 ? (
                <Link
                    href={STUDY_LOG_HREF}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-3 text-base font-bold text-[#fffdfa] no-underline dark:bg-emerald-600"
                >
                    <MessageCircle size={18} aria-hidden />
                    {unread === 1 ? "Your teacher replied" : `Your teacher replied ${unread} times`}
                </Link>
            ) : null}
        </section>
    );
}
