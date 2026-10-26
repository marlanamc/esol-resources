import { Check } from "lucide-react";
import type { StudyWeek } from "@/lib/learner/study-log";

/** Tuesday and Thursday are class days; the dots mark them like the handout's study-week grid. */
const CLASS_DAYS = new Set(["Tuesday", "Thursday"]);

/** Mon–Sun practice dots: filled when the learner logged something that day. */
export function StudyWeekDots({ week }: { week: StudyWeek }) {
    return (
        <ol className="m-0 grid list-none grid-cols-7 gap-1 p-0 text-center" aria-label="My practice this week">
            {week.days.map((day) => {
                const done = day.kinds.length > 0;
                const dot = done
                    ? "bg-emerald-700 text-[#fffdfa] dark:bg-emerald-600"
                    : day.isToday
                      ? "border-2 border-primary text-primary-dark dark:text-primary-light"
                      : "border-2 border-dashed border-border";
                return (
                    <li key={day.dayKey} className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-text-muted" aria-hidden>
                            {day.label}
                        </span>
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${dot}`}>
                            {done ? <Check size={18} strokeWidth={3} aria-hidden /> : null}
                            <span className="sr-only">
                                {day.name}: {done ? "practiced" : day.isFuture ? "not yet" : "no practice"}
                            </span>
                        </span>
                        <span className="h-3.5 text-xs leading-none text-text-muted" aria-hidden>
                            {day.isToday ? "today" : CLASS_DAYS.has(day.name) ? "class" : ""}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
