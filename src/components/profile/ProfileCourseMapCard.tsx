import Link from "next/link";
import { Check, ChevronRight, Map as MapIcon } from "lucide-react";
import type { ProfileCourseMapProgress } from "@/lib/course-map-week";
import type { CatchUpWeek } from "@/lib/course-map-navigation";

const MAX_CATCH_UP_ROWS = 4;

function weekMapHref(weekNumber: number): string {
    return `/dashboard/map?week=${weekNumber}#week-${weekNumber}`;
}

function weekCircleLabel(week: CatchUpWeek): string {
    if (week.isDone) return `Week ${week.weekNumber}: finished`;
    const status = `${week.done} of ${week.total} done`;
    return week.isCurrent ? `Week ${week.weekNumber}, this week: ${status}` : `Week ${week.weekNumber}: ${status}`;
}

function WeekCircle({ week }: { week: CatchUpWeek }) {
    const tone = week.isDone
        ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
        : week.isCurrent
          ? "border-primary bg-primary text-text-on-accent"
          : "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-200";
    const caption = week.isCurrent ? "Now" : `Wk ${week.weekNumber}`;

    return (
        <li>
            <Link
                href={week.href ?? weekMapHref(week.weekNumber)}
                aria-label={weekCircleLabel(week)}
                className="flex w-11 flex-col items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] text-[15px] font-extrabold ${tone}`}>
                    {week.isDone ? <Check className="h-[18px] w-[18px]" strokeWidth={3.2} aria-hidden /> : week.weekNumber}
                </span>
                <span
                    className={`text-xs font-bold ${
                        week.isCurrent ? "text-text" : week.isDone ? "text-text-muted" : "text-amber-800 dark:text-amber-300"
                    }`}
                    aria-hidden
                >
                    {caption}
                </span>
            </Link>
        </li>
    );
}

function CatchUpRow({ week }: { week: CatchUpWeek }) {
    const left = week.total - week.done;
    const percent = week.total > 0 ? Math.round((week.done / week.total) * 100) : 0;
    return (
        <li>
            <Link
                href={week.href ?? weekMapHref(week.weekNumber)}
                className="flex min-h-16 items-center gap-3 rounded-xl border border-border/60 bg-surface-base p-3 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-base font-bold leading-snug text-text">
                        Week {week.weekNumber} · {week.title}
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-amber-100 dark:bg-amber-950/60" aria-hidden>
                            <span className="block h-full rounded-full bg-amber-500 dark:bg-amber-400" style={{ width: `${percent}%` }} />
                        </span>
                        <span className="text-sm font-bold text-amber-800 dark:text-amber-300">{left} left</span>
                    </span>
                </span>
                <span className="flex h-10 shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-primary px-3.5 text-[15px] font-extrabold text-text-on-accent">
                    Finish
                    <ChevronRight className="h-4 w-4" aria-hidden />
                </span>
            </Link>
        </li>
    );
}

/**
 * Profile card that pushes learners to finish the course map: one circle per
 * week so far, the unfinished past weeks with a direct "Finish" link, and a
 * one-line link to this week.
 */
export function ProfileCourseMapCard({ progress }: { progress: ProfileCourseMapProgress }) {
    const { weeks } = progress;
    if (weeks.length === 0) return null;

    const finishedWeeks = weeks.filter((week) => week.isDone).length;
    const doneActivities = weeks.reduce((sum, week) => sum + week.done, 0);
    const totalActivities = weeks.reduce((sum, week) => sum + week.total, 0);
    const percent = totalActivities > 0 ? Math.round((doneActivities / totalActivities) * 100) : 0;
    const unfinishedPast = weeks.filter((week) => !week.isDone && !week.isCurrent);
    const currentWeek = weeks.find((week) => week.isCurrent);

    return (
        <section aria-labelledby="profile-course-map-heading" className="space-y-4 rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-sm">
            <div className="flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <MapIcon size={22} aria-hidden />
                    </span>
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[.08em] text-text-muted">My course map</p>
                        <h2 id="profile-course-map-heading" className="text-xl font-extrabold text-text">
                            {finishedWeeks} of {weeks.length} {weeks.length === 1 ? "week" : "weeks"} finished
                        </h2>
                    </div>
                </div>
                <span className="text-[15px] font-extrabold text-primary">{percent}%</span>
            </div>

            <div
                className="h-3 overflow-hidden rounded-full bg-surface-subtle"
                role="progressbar"
                aria-label="Course map activities done"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
            >
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>

            <ol className="flex flex-wrap gap-x-1.5 gap-y-3" aria-label="Weeks">
                {weeks.map((week) => <WeekCircle key={week.weekNumber} week={week} />)}
            </ol>

            {unfinishedPast.length > 0 ? (
                <div className="space-y-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
                    <div>
                        <h3 className="text-[17px] font-extrabold text-text">Finish your old weeks</h3>
                        <p className="text-[15px] text-text">It is not too late! Old weeks are still open. Every week you finish counts.</p>
                    </div>
                    <ul className="space-y-2">
                        {unfinishedPast.slice(0, MAX_CATCH_UP_ROWS).map((week) => <CatchUpRow key={week.weekNumber} week={week} />)}
                    </ul>
                    {unfinishedPast.length > MAX_CATCH_UP_ROWS && (
                        <Link href="/dashboard/map" className="inline-flex min-h-11 items-center text-[15px] font-bold text-primary underline-offset-4 hover:underline">
                            See all {unfinishedPast.length} weeks on the course map
                        </Link>
                    )}
                </div>
            ) : (
                <p className="rounded-2xl bg-emerald-50 p-4 text-[15px] font-semibold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    All your old weeks are finished. Great job!
                </p>
            )}

            {currentWeek && (
                <Link
                    href={currentWeek.href ?? weekMapHref(currentWeek.weekNumber)}
                    className="flex min-h-[52px] items-center justify-between gap-3 rounded-xl bg-surface-subtle px-4 text-base font-bold text-text transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <span>
                        This week: Week {currentWeek.weekNumber} · {currentWeek.done} of {currentWeek.total} done
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
            )}
        </section>
    );
}
