import type { LucideIcon } from "lucide-react";
import {
    Apple,
    ArrowLeftRight,
    AudioLines,
    Blocks,
    BookOpen,
    Briefcase,
    CalendarDays,
    ClipboardCheck,
    Clock,
    Copy,
    Gamepad2,
    GitCommitHorizontal,
    Hash,
    HeartPulse,
    House,
    Link2,
    MessageCircleQuestion,
    Mic,
    Pencil,
    PersonStanding,
    Puzzle,
    RefreshCcw,
    RotateCcw,
    Scale,
    ShieldCheck,
    ShoppingCart,
    Signpost,
    Stethoscope,
    Tags,
    Volume2,
} from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

type GameTone = "games" | "vocabulary" | "grammar" | "pronunciation" | "speaking" | "quizzes";

/**
 * Each named game gets its own icon and color, so a week's games don't all look
 * like the same gamepad. First match wins; match the start of the course-map title.
 * Titles may arrive shortened by formatNextUpActivityTitle (e.g. "Timeline: Easy Start").
 * Add a row here when a new game goes on the map; a test fails if a map game has none.
 */
const NAMED_GAMES: { match: RegExp; label: string; icon: LucideIcon; tone: GameTone }[] = [
    { match: /^word sort\b/i, label: "Sort words", icon: Puzzle, tone: "games" },
    { match: /^(tense path|timeline\b)/i, label: "Game", icon: GitCommitHorizontal, tone: "vocabulary" },
    { match: /^present perfect\b/i, label: "Game", icon: RefreshCcw, tone: "vocabulary" },
    { match: /^(sound path|say it & spell it)\b/i, label: "Game", icon: AudioLines, tone: "pronunciation" },
    { match: /^time words\b/i, label: "Game", icon: Clock, tone: "games" },
    { match: /^time indicators\b/i, label: "Game", icon: ArrowLeftRight, tone: "speaking" },
    { match: /^sentence builder\b/i, label: "Game", icon: Blocks, tone: "games" },
    { match: /^(grammar hospital|grammar first aid|helper verb repair)\b/i, label: "Game", icon: Stethoscope, tone: "quizzes" },
    { match: /^action or description\b/i, label: "Game", icon: PersonStanding, tone: "speaking" },
    { match: /^word jobs\b/i, label: "Game", icon: Briefcase, tone: "speaking" },
    { match: /^(week \d+:|parts of speech)/i, label: "Game", icon: Tags, tone: "grammar" },
    { match: /^be or do\b/i, label: "Game", icon: Signpost, tone: "games" },
    { match: /^question word\b/i, label: "Game", icon: MessageCircleQuestion, tone: "speaking" },
    { match: /^numbers\b/i, label: "Game", icon: Hash, tone: "speaking" },
    { match: /^compare prices\b/i, label: "Game", icon: Scale, tone: "speaking" },
    { match: /^countable\b/i, label: "Game", icon: Apple, tone: "grammar" },
    { match: /^grocery budget\b/i, label: "Game", icon: ShoppingCart, tone: "speaking" },
    { match: /^compare apartments\b/i, label: "Game", icon: House, tone: "games" },
    { match: /^work schedule\b/i, label: "Game", icon: CalendarDays, tone: "games" },
    { match: /^workplace rights\b/i, label: "Game", icon: ShieldCheck, tone: "quizzes" },
    { match: /^healthy habits\b/i, label: "Game", icon: HeartPulse, tone: "pronunciation" },
];

/** Prefer explicit activity format; title matching covers existing named games. */
export function getCourseMapActivityFormat(type: string, vocabUi?: string, title = "") {
    if (vocabUi === "flashcards") return { label: "Flash cards", icon: Copy, tone: "vocabulary" } as const;
    if (vocabUi === "matching") return { label: "Match pairs", icon: Link2, tone: "vocabulary" } as const;
    if (vocabUi === "fill-blank") return { label: "Complete sentences", icon: Pencil, tone: "vocabulary" } as const;
    if (type === "game") {
        const named = NAMED_GAMES.find((game) => game.match.test(title.trim()));
        if (named) return { label: named.label, icon: named.icon, tone: named.tone };
    }
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

export function CourseMapActivityFormatChip({ type, vocabUi, title, size = "sm" }: { type: string; vocabUi?: string; title: string; size?: "sm" | "md" }) {
    const format = getCourseMapActivityFormat(type, vocabUi, title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = format.icon;
    const sizeClass = size === "md" ? "px-[9px] py-1 text-[0.8125rem] font-semibold" : "px-2 py-1 text-xs font-medium";
    return (
        <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full leading-tight ${sizeClass}`} style={{ background: tone.chipBg, color: tone.chipText }}>
            <Icon size={size === "md" ? 14 : 13} className="shrink-0" aria-hidden />
            <span>{format.label}</span>
        </span>
    );
}
