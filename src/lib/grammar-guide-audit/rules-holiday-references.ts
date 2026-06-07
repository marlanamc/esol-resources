import type { LoadedGuide } from "./types";
import type { AuditFinding } from "./types";
import { collectGuideStrings } from "./collect-strings";

function warning(
    slug: string,
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "warning", ruleId, slug, path, message, snippet };
}

/** Named US/cultural holidays — flag when they appear as scene flavor without teaching purpose. */
const NAMED_HOLIDAY_PATTERN =
    /\b(?:Indigenous Peoples'? Day|Labor Day|MLK Day|Martin Luther King(?: Jr\.)? Day|Memorial Day|Veterans Day|Thanksgiving|Christmas(?: Eve| week)?|Hanukkah|Halloween|Juneteenth|Kwanzaa|Nochebuena|Lunar New Year|St\. Patrick'?s Day|New Year'?s(?: Eve)?|Cinco de Mayo|Orthodox Easter|Workers Memorial Day|Día de los Muertos|Three Kings|Guadalupe)\b/i;

const GENERIC_HOLIDAY_OK = /\b(?:the holidays?|a holiday|holiday hours?|holiday schedule)\b/i;

const HOLIDAY_THEMED_SECTION = /holiday|christmas|hanukkah|nochebuena/i;

const HOLIDAY_THEMED_GUIDE_SLUGS = new Set([
    "zero-first-conditional",
    "how-long-for-since",
]);

function isContextuallyAllowed(slug: string, text: string, entryPath: string): boolean {
    if (slug === "zero-first-conditional" && /\b(?:Christmas Eve|Hanukkah|Christmas week)\b/i.test(text)) {
        return true;
    }
    if (
        slug === "doctor-said-reported-speech" &&
        /\b(?:fast|blood work)\b/i.test(text) &&
        /\bEaster\b/i.test(text)
    ) {
        return true;
    }
    if (
        /\b(?:were getting|was writing|ready for)\b/i.test(text) &&
        /\bLunar New Year\b/i.test(text)
    ) {
        return true;
    }
    if (/\b(?:Monday(?:'s| is) a holiday|federal holidays?)\b/i.test(text)) {
        return true;
    }
    return false;
}

function sectionIndexFromPath(path: string): number | null {
    const match = path.match(/sections\[(\d+)\]/);
    return match ? Number.parseInt(match[1]!, 10) : null;
}

function isHolidayThemedSection(guide: LoadedGuide, path: string): boolean {
    const sectionIndex = sectionIndexFromPath(path);
    if (sectionIndex === null) return false;
    const section = guide.content.sections?.[sectionIndex];
    if (!section) return false;
    const haystack = `${section.id} ${section.title}`;
    return HOLIDAY_THEMED_SECTION.test(haystack);
}

function isLikelySceneCaption(entryPath: string, value: string): boolean {
    return (
        entryPath.includes("explanation") &&
        (value.includes("sceneCard(") || /^\s*[A-Z][^.]{8,80}\.\s/.test(value.replace(/<[^>]+>/g, " ").trim()))
    );
}

export function runHolidayReferenceRules(guide: LoadedGuide): AuditFinding[] {
    const { slug, content } = guide;
    const findings: AuditFinding[] = [];

    for (const entry of collectGuideStrings(content)) {
        const text = entry.plainText;
        const match = text.match(NAMED_HOLIDAY_PATTERN);
        if (!match) continue;

        if (GENERIC_HOLIDAY_OK.test(text) && !NAMED_HOLIDAY_PATTERN.test(text.replace(GENERIC_HOLIDAY_OK, ""))) {
            continue;
        }

        if (isContextuallyAllowed(slug, text, entry.path)) {
            continue;
        }

        if (HOLIDAY_THEMED_GUIDE_SLUGS.has(slug) && isHolidayThemedSection(guide, entry.path)) {
            continue;
        }

        if (isHolidayThemedSection(guide, entry.path)) {
            continue;
        }

        const holiday = match[0];
        const inDialogue = entry.path.includes(".text") || entry.value.includes("speaker:");
        const inSceneCaption = entry.value.includes("sceneCard(");

        if (inDialogue) {
            findings.push(
                warning(
                    slug,
                    "holiday-reference-dialogue",
                    entry.path,
                    `Named holiday "${holiday}" in dialogue — keep only if it changes the grammar situation`,
                    text.slice(0, 140),
                ),
            );
            continue;
        }

        if (inSceneCaption || isLikelySceneCaption(entry.path, entry.value)) {
            findings.push(
                warning(
                    slug,
                    "holiday-reference-scene",
                    entry.path,
                    `Scene caption mentions "${holiday}" without a clear grammar reason — use plain time/place instead`,
                    text.slice(0, 140),
                ),
            );
            continue;
        }

        findings.push(
            warning(
                slug,
                "holiday-reference-narration",
                entry.path,
                `Named holiday "${holiday}" may be unnecessary flavor — keep only when it affects the scenario`,
                text.slice(0, 140),
            ),
        );
    }

    return findings;
}
