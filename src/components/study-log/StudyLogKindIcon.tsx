import { BookOpen, Headphones, MessageCircle, PenLine, Sparkles, Tv, type LucideProps } from "lucide-react";
import type { StudyLogKind } from "@/lib/learner/study-log";

const ICONS = {
    listen: Headphones,
    watch: Tv,
    read: BookOpen,
    write: PenLine,
    speak: MessageCircle,
    other: Sparkles,
} satisfies Record<StudyLogKind, unknown>;

/** The picture for a practice kind, used on the log tiles and in the list of logs. Decorative unless given a label. */
export function StudyLogKindIcon({ kind, ...props }: { kind: StudyLogKind } & LucideProps) {
    const Icon = ICONS[kind];
    return <Icon aria-hidden {...props} />;
}
