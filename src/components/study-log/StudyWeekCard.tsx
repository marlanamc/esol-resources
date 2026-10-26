import Link from "next/link";
import { Plus } from "lucide-react";
import { getStudyLogKind } from "@/lib/learner/study-log";
import type { StudentStudyWeek } from "@/lib/learner/study-log-data";
import { StudyWeekDots } from "./StudyWeekDots";

export const STUDY_LOG_HREF = "/dashboard/practice";

/** Home card: title, day count and Log button on one row, compact Mon–Sun dots, then the latest log. */
export function StudyWeekCard({ week, entries }: StudentStudyWeek) {
    const latest = entries[0];
    return (
        <section aria-labelledby="study-week-heading" className="space-y-2.5 rounded-[20px] border-2 border-emerald-700 bg-surface-elevated px-4 py-3 dark:border-emerald-600">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 id="study-week-heading" className="m-0 font-display text-lg font-bold leading-tight text-text">
                        My practice week
                    </h2>
                    <p className="m-0 text-sm text-text-muted">
                        <b className="text-emerald-800 dark:text-emerald-300">{week.daysPracticed} of 7 days</b> · Goal: 15 min a day
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

            {latest ? (
                <p className="m-0 truncate text-sm text-text-muted">
                    <b className="text-text">{getStudyLogKind(latest.kind).label}:</b> {latest.text}
                </p>
            ) : null}
        </section>
    );
}
