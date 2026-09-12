import { toSafeExternalUrl } from "@/lib/shared/safe-url";

export type HelpfulLinkId =
    | "google-classroom"
    | "absence-form"
    | "advisor-bulletin-board"
    | "in-class-games-library";

export type HelpfulLink = {
    id: HelpfulLinkId;
    label: string;
    href: string;
};

/** Category tone keys used for colorful link styling in the dashboard and menu. */
export const HELPFUL_LINK_TONE_KEYS: Record<HelpfulLinkId, "vocabulary" | "quizzes" | "games"> = {
    "google-classroom": "vocabulary",
    "absence-form": "quizzes",
    "advisor-bulletin-board": "games",
    "in-class-games-library": "games",
};

const HELPFUL_LINK_CONFIG: { id: HelpfulLinkId; label: string; envKey: string }[] = [
    { id: "google-classroom", label: "Google Classroom", envKey: "NEXT_PUBLIC_GOOGLE_CLASSROOM_URL" },
    { id: "absence-form", label: "Absence form", envKey: "NEXT_PUBLIC_ABSENCE_FORM_URL" },
    {
        id: "advisor-bulletin-board",
        label: "Advisor Bulletin Board",
        envKey: "NEXT_PUBLIC_ADVISOR_BULLETIN_BOARD_URL",
    },
    {
        id: "in-class-games-library",
        label: "In-class games library",
        envKey: "NEXT_PUBLIC_IN_CLASS_GAMES_LIBRARY_URL",
    },
];

export function getHelpfulLinks(): HelpfulLink[] {
    const links: HelpfulLink[] = [];

    for (const { id, label, envKey } of HELPFUL_LINK_CONFIG) {
        const raw = process.env[envKey]?.trim();
        if (!raw) continue;

        const href = toSafeExternalUrl(raw);
        if (!href) continue;

        links.push({ id, label, href });
    }

    return links;
}
