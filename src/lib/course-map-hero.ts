import type { CourseMapActivity, CourseMapActivityType } from "@/lib/course-map";

export function formatNextUpActivityTitle(title: string): string {
    const shortened = title
        .replace("Welcome Back: Simple & Continuous Review + V3 Preview", "Simple & Continuous Review")
        .replace("Parts of Speech Discovery Game", "Parts of Speech Game")
        .replace("Grammar Hospital: Helper Verb Repair", "Helper Verb Repair")
        .replace("Vowel Names Practice:", "Vowel Names:")
        .replace("Timeline Tenses:", "Timeline:")
        .replace("Full Parts of Speech Practice Library", "Parts of Speech Practice")
        .replace(/\s+\+\s+V3 Preview$/i, "")
        .trim();

    if (title.startsWith("Welcome Back:") && !shortened.startsWith("Welcome Back:")) {
        return `Welcome Back: ${shortened}`;
    }
    return shortened;
}

export function getCourseMapEstimatedMinutes(activityType: CourseMapActivityType): number {
    switch (activityType) {
        case "game":
        case "writing":
        case "speaking":
        case "assessment":
            return 10;
        default:
            return 5;
    }
}

export function getCourseMapActivityIconEmoji(
    activityType: CourseMapActivityType,
    assignmentType?: string,
    category?: string | null
): string {
    if (assignmentType || category) {
        const t = (assignmentType || "").toLowerCase();
        const c = (category || "").toLowerCase();
        if (t === "guide" && c === "grammar") return "📖";
        if (t === "guide") return "📖";
        if (t === "game") return "🎮";
        if (t === "quiz") return "✏️";
        if (t === "speaking") return "🎤";
        if (t === "writing") return "✍️";
        if (t === "vocabulary" || c === "vocabulary") return "🗂️";
        if (t === "worksheet") return "📄";
        if (t === "slides") return "📊";
    }

    switch (activityType) {
        case "guide":
            return "📖";
        case "game":
            return "🎮";
        case "quiz":
            return "✏️";
        case "pronunciation":
            return "🔊";
        case "writing":
            return "✍️";
        case "speaking":
            return "🎤";
        case "review":
            return "🔁";
        case "catch-up":
            return "🧭";
        case "assessment":
            return "✅";
        default:
            return "📌";
    }
}

export function getCourseMapEstimatedMinutesForActivity(activity: CourseMapActivity): number {
    return getCourseMapEstimatedMinutes(activity.activityType);
}
