import Link from "next/link";
import { Plus } from "lucide-react";
import type { StudentStudyWeek } from "@/lib/learner/study-log-data";
import { StudyLogList } from "./StudyLogList";
import { StudyWeekDots } from "./StudyWeekDots";

export const STUDY_LOG_HREF = "/dashboard/practice";

/** Home card: this week's practice dots, the "Log my practice" button and the latest logs. */
export function StudyWeekCard({ week, entries }: StudentStudyWeek) {
    return (
        <section aria-labelledby="study-week-heading" className="space-y-3 rounded-[20px] border-2 border-emerald-700 bg-surface-elevated p-4 dark:border-emerald-600">
            <div className="flex items-baseline justify-between gap-3">
                <h2 id="study-week-heading" className="m-0 font-display text-xl font-bold text-text">
                    My practice week
                </h2>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{week.daysPracticed} of 7 days</span>
            </div>

            <StudyWeekDots week={week} />

            <p className="m-0 text-[0.9375rem] text-text">
                Goal: <b>15 minutes of English a day</b>. Small practice makes a big difference.
            </p>

            <Link
                href={STUDY_LOG_HREF}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary text-[1.0625rem] font-bold text-[#fffdfa] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                <Plus size={20} strokeWidth={2.6} aria-hidden />
                Log my practice
            </Link>

            <StudyLogList entries={entries.slice(0, 3)} />
        </section>
    );
}
