import { getStudyLogKind, type StudyLogEntry } from "@/lib/learner/study-log";

/** Logged practice, one sentence per row with its kind as a tag. */
export function StudyLogList({ entries }: { entries: StudyLogEntry[] }) {
    if (entries.length === 0) return null;
    return (
        <ul className="m-0 list-none space-y-2 p-0">
            {entries.map((entry) => (
                <li key={entry.id} className="flex items-start gap-2.5 rounded-xl border border-border bg-bg px-3 py-2">
                    <span className="min-w-[3.5rem] shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-center text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {getStudyLogKind(entry.kind).label}
                    </span>
                    <span className="min-w-0 break-words text-[0.9375rem] leading-snug text-text">{entry.text}</span>
                </li>
            ))}
        </ul>
    );
}
