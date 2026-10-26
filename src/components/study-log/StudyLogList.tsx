import { getStudyLogKind, type StudyLogEntry } from "@/lib/learner/study-log";
import { StudyLogKindIcon } from "./StudyLogKindIcon";

/** Logged practice, one sentence per row with its kind as an icon. */
export function StudyLogList({ entries }: { entries: StudyLogEntry[] }) {
    if (entries.length === 0) return null;
    return (
        <ul className="m-0 list-none space-y-2 p-0">
            {entries.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2.5 rounded-xl border border-border bg-bg px-3 py-2">
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        title={getStudyLogKind(entry.kind).label}
                    >
                        <StudyLogKindIcon kind={entry.kind} size={17} strokeWidth={2.2} />
                        <span className="sr-only">{getStudyLogKind(entry.kind).label}:</span>
                    </span>
                    <span className="min-w-0 break-words text-[0.9375rem] leading-snug text-text">{entry.text}</span>
                </li>
            ))}
        </ul>
    );
}
