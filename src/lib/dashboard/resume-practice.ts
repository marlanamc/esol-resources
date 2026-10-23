import { parseCategoryData } from "@/lib/categoryData";
import { resolveActivityGameUi } from "@/lib/gamification/activity-points";
import { buildActivityHref, withReturnTo } from "@/lib/learner/navigation";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";

export interface PracticeProgressRow {
    activityId: string;
    assignmentId: string | null;
    progress: number;
    status: string;
    categoryData: string | null;
    updatedAt: Date;
    activity: {
        title: string;
        type: string;
        category: string | null;
        ui: string | null;
        content: string;
        deletedAt: Date | null;
        isReleased: boolean;
    };
}

export interface ResumePracticeItem {
    title: string;
    href: string;
    detail: string;
    action: string;
    progress: number | null;
    note: string;
}

const GROUP_GAMES = new Set(["irregular-verbs", "gerund-infinitive", "parts-of-speech"]);
const FREE_PLAY = new Set(["emotion-spin-wheel", "cafe-catch-up"]);
const REPEATABLE_ROUNDS = new Set([
    "verb-forms", "numbers", "ed-pronunciation", "minimal-pairs", "pronunciation-listening",
    "timeline-tenses", "trivia-game", "grammar-hospital", "comparison-battle", "verb-speed-round", "sentence-builder",
]);

function hasAttempt(data: Record<string, unknown> | null): boolean {
    return Object.values(data ?? {}).some(value => {
        if (!value || typeof value !== "object") return false;
        const record = value as Record<string, unknown>;
        return (typeof record.attempts === "number" && record.attempts > 0)
            || (typeof record.exercisesCompleted === "number" && record.exercisesCompleted > 0);
    });
}

/** Only describe checkpoints the game actually saves; percentages are not question counts. */
export function describePractice(row: PracticeProgressRow): ResumePracticeItem | null {
    if (row.activity.type !== "game" || !isLearnerVisibleActivity(row.activity)) return null;
    const ui = resolveActivityGameUi(row.activity);
    // Word Lab has its own daily course card and saved-words section.
    if (ui === "word-rescue" || row.activityId === "word-rescue") return null;
    const data = parseCategoryData(row.categoryData);
    const progress = Math.min(100, Math.max(0, row.progress));
    const complete = row.status === "completed" || row.status === "submitted" || progress >= 100;
    // Merely opening an activity must not create an unfinished-work reminder.
    if (!complete && progress === 0 && !hasAttempt(data)) return null;
    const base = {
        title: row.activity.title,
        href: withReturnTo(buildActivityHref(row.activityId, row.assignmentId), "/dashboard"),
    };
    if (GROUP_GAMES.has(ui)) {
        return {
            ...base,
            detail: progress >= 100 ? "Patterns unlocked · keep building mastery" : `${progress}% of patterns unlocked`,
            action: "Continue practicing",
            progress: progress < 100 ? progress : null,
            note: "Completed rounds saved · choose your next round",
        };
    }
    if (FREE_PLAY.has(ui)) {
        return { ...base, detail: "Free play · practice at your own pace", action: "Continue playing", progress: null, note: "Return for more practice whenever you're ready" };
    }
    if (REPEATABLE_ROUNDS.has(ui)) {
        return {
            ...base,
            detail: complete ? "Last round finished · ready for another?" : "Return to your practice",
            action: complete ? "Play another round" : "Continue practicing",
            progress: null,
            note: "Completed practice saved · new rounds start fresh",
        };
    }
    if (complete) return null;
    return { ...base, detail: "Return to your practice", action: "Continue playing", progress: null, note: "Keep practicing at your own pace" };
}

/** Newest saved activity wins, including when a newer assignment has completed it. */
export function pickResumePractice(rows: PracticeProgressRow[]): ResumePracticeItem | null {
    const seen = new Set<string>();
    for (const row of [...rows].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())) {
        if (seen.has(row.activityId)) continue;
        seen.add(row.activityId);
        const item = describePractice(row);
        if (item) return item;
    }
    return null;
}
