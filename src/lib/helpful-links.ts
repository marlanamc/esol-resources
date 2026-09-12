import { ACCENT_PRESETS, type AccentKey } from "@/lib/accent-colors";
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

/** Accent presets used for Class resources icon + menu chip colors. */
export const HELPFUL_LINK_ACCENT_KEYS: Record<HelpfulLinkId, AccentKey> = {
    "google-classroom": "ocean",
    "absence-form": "teal",
    "advisor-bulletin-board": "terracotta",
    "in-class-games-library": "plum",
};

export function getHelpfulLinkColors(id: HelpfulLinkId) {
    const preset = ACCENT_PRESETS[HELPFUL_LINK_ACCENT_KEYS[id]];
    return {
        accent: preset.swatch,
        accentStrong: preset.light.primaryDark,
        surface: `color-mix(in srgb, ${preset.swatch} 12%, white)`,
        border: `color-mix(in srgb, ${preset.swatch} 28%, transparent)`,
    };
}

const HELPFUL_LINK_CONFIG: { id: HelpfulLinkId; label: string; envKey: string }[] = [
    { id: "google-classroom", label: "Google Classroom", envKey: "NEXT_PUBLIC_GOOGLE_CLASSROOM_URL" },
    { id: "absence-form", label: "Absence form", envKey: "NEXT_PUBLIC_ABSENCE_FORM_URL" },
    {
        id: "advisor-bulletin-board",
        label: "Advisor bulletin board",
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
