import { BookOpen, Copy, Gamepad2, Link2, Pencil, Puzzle, Mic, Volume2, ClipboardCheck, RotateCcw } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

/** Prefer explicit activity format; title matching covers existing named games. */
export function getCourseMapActivityFormat(type: string, vocabUi?: string, title = "") {
    if (vocabUi === "flashcards") return { label: "Flash cards", icon: Copy, tone: "vocabulary" } as const;
    if (vocabUi === "matching") return { label: "Match pairs", icon: Link2, tone: "vocabulary" } as const;
    if (vocabUi === "fill-blank") return { label: "Complete sentences", icon: Pencil, tone: "vocabulary" } as const;
    if (type === "game" && /^word sort\b/i.test(title)) return { label: "Sort words", icon: Puzzle, tone: "games" } as const;
    switch (type) {
        case "guide": return { label: "Read & practice", icon: BookOpen, tone: "grammar" } as const;
        case "game": return { label: "Game", icon: Gamepad2, tone: "games" } as const;
        case "quiz": return { label: "Quiz", icon: ClipboardCheck, tone: "quizzes" } as const;
        case "assessment": return { label: "Check-in", icon: ClipboardCheck, tone: "quizzes" } as const;
        case "speaking": return { label: "Speaking", icon: Mic, tone: "speaking" } as const;
        case "pronunciation": return { label: "Listen & say", icon: Volume2, tone: "pronunciation" } as const;
        case "writing": return { label: "Writing", icon: Pencil, tone: "writing" } as const;
        case "vocabulary": return { label: "Word practice", icon: BookOpen, tone: "vocabulary" } as const;
        case "review": return { label: "Review", icon: RotateCcw, tone: "default" } as const;
        default: return { label: "Practice", icon: BookOpen, tone: "default" } as const;
    }
}

export function CourseMapActivityFormatChip({ type, vocabUi, title }: { type: string; vocabUi?: string; title: string }) {
    const format = getCourseMapActivityFormat(type, vocabUi, title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = format.icon;
    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium leading-tight" style={{ background: tone.chipBg, color: tone.chipText }}>
            <Icon size={13} className="shrink-0" aria-hidden />
            <span>{format.label}</span>
        </span>
    );
}
