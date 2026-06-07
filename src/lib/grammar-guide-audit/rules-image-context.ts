/**
 * Heuristic: does the scene photo actually fit the scene it is placed on?
 *
 * The existing image rules (rules-images.ts) only check mechanical metadata
 * (alt present, credit present, no em-dash, no duplicate ids). They cannot tell
 * that a bright-office interview photo was dropped onto a "warehouse loading
 * dock" caption. This rule compares the scene *caption* (what the photo should
 * show) against the photo's *alt* text (what it actually shows) and flags likely
 * mismatches.
 *
 * It is deliberately conservative — a review aid, not a build gate. Findings are
 * always `warning` severity. The visual contact sheet
 * (scripts/checks/build-mini-guide-image-sheet.ts) is the real safety net; this
 * just pre-flags the obvious offenders so they sort to the top.
 */

import type { AuditFinding } from "./types";
import type { SceneContextEntry } from "./scene-context";

export const SCENE_MISMATCH_RULE_ID = "image-scene-mismatch";

/**
 * Distinct setting "groups". Keywords are kept disjoint across groups so that a
 * caption and an alt landing in *different* groups is a strong conflict signal.
 */
const SETTING_GROUPS: Record<string, string[]> = {
    warehouse: ["warehouse", "loading dock", "forklift", "inventory", "pallet", "stockroom"],
    factory: ["factory", "assembly line", "machinery", "manufacturing"],
    construction: ["construction", "hard hat", "job site", "scaffolding", "builder", "contractor"],
    // Interviews and meetings happen in offices — keep them in one group so an
    // interview caption next to a desk/meeting photo does not read as a conflict.
    office: [
        "office", "desk", "cubicle", "conference room", "boardroom",
        "interview", "hiring manager", "job interview", "recruiter", "meeting",
    ],
    classroom: ["classroom", "students", "lesson", "whiteboard", "chalkboard", "adult ed", "lecture"],
    clinic: ["clinic", "doctor", "nurse", "exam room", "patient", "hospital", "waiting room", "triage", "stethoscope"],
    pharmacy: ["pharmacy", "pharmacist", "prescription", "drugstore"],
    kitchen: ["kitchen", "chef", "stove", "cooking"],
    restaurant: ["restaurant", "waiter", "waitress", "dining", "server", "cafe", "diner", "barista", "plated meal"],
    store: ["grocery", "supermarket", "cashier", "checkout", "retail", "aisle", "shopping cart"],
    transit: ["bus", "bus stop", "subway", "train", "platform", "transit", "commute"],
    home: ["apartment", "living room", "bedroom", "couch", "sofa", "residential"],
    breakroom: ["break room", "breakroom", "break area", "lunch room", "lunchroom"],
    bank: ["bank teller", "bank counter"],
    laundry: ["laundromat", "laundry"],
    outdoors: ["park", "sidewalk", "street corner", "playground"],
};

const STOPWORDS = new Set([
    "the", "and", "for", "with", "from", "into", "near", "this", "that", "they",
    "their", "them", "she", "her", "his", "him", "you", "your", "are", "was", "were",
    "who", "what", "when", "where", "while", "during", "between", "across", "together",
    "two", "three", "four", "five", "one", "talking", "sitting", "standing", "walking",
    "people", "person", "woman", "women", "man", "men", "worker", "workers", "group",
    "small", "young", "bright", "another", "each", "other", "some", "front",
]);

function lower(text: string): string {
    return text.toLowerCase();
}

// Match keywords on word boundaries so "park" does not fire on "Parkway"/"parking".
const KEYWORD_PATTERNS: Array<{ group: string; re: RegExp }> = Object.entries(
    SETTING_GROUPS,
).flatMap(([group, keywords]) =>
    keywords.map((kw) => ({
        group,
        re: new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`),
    })),
);

export function settingGroupsIn(text: string): Set<string> {
    const haystack = lower(text);
    const found = new Set<string>();
    for (const { group, re } of KEYWORD_PATTERNS) {
        if (re.test(haystack)) found.add(group);
    }
    return found;
}

function contentWords(text: string): Set<string> {
    const words = lower(text)
        .split(/[^a-z]+/)
        .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
    return new Set(words);
}

function intersects<T>(a: Set<T>, b: Set<T>): boolean {
    for (const value of a) {
        if (b.has(value)) return true;
    }
    return false;
}

export interface SceneMatchResult {
    flagged: boolean;
    reason: "setting-conflict" | "generic-photo" | null;
    detail: string;
}

/**
 * Pure evaluator shared by the audit rule and the visual contact sheet so both
 * agree on what counts as a mismatch.
 */
export function evaluateSceneMatch(
    caption: string | null,
    alt: string,
): SceneMatchResult {
    if (!caption || !alt.trim()) {
        return { flagged: false, reason: null, detail: "" };
    }

    const captionGroups = settingGroupsIn(caption);
    const altGroups = settingGroupsIn(alt);

    // Strong signal: caption and photo both name a setting, but different ones.
    if (captionGroups.size > 0 && altGroups.size > 0 && !intersects(captionGroups, altGroups)) {
        return {
            flagged: true,
            reason: "setting-conflict",
            detail: `caption setting [${[...captionGroups].join(", ")}] vs photo setting [${[...altGroups].join(", ")}]`,
        };
    }

    // Softer signal: caption calls for a specific setting, but the photo shows no
    // recognizable setting and shares no concrete noun with the caption — likely a
    // generic stock shot dropped in.
    if (captionGroups.size > 0 && altGroups.size === 0) {
        const captionWords = contentWords(caption);
        const altWords = contentWords(alt);
        if (!intersects(captionWords, altWords)) {
            return {
                flagged: true,
                reason: "generic-photo",
                detail: `caption setting [${[...captionGroups].join(", ")}] but photo shows no matching setting or shared detail`,
            };
        }
    }

    return { flagged: false, reason: null, detail: "" };
}

/**
 * Run the scene-context heuristic for one guide. Pairs each parsed sceneCard
 * caption with the matching image module alt text.
 */
export function runSceneImageContextRules(
    slug: string,
    sceneContexts: SceneContextEntry[],
    imageEntries: Array<{ sceneId: string; alt: string }>,
): AuditFinding[] {
    const altBySceneId = new Map(imageEntries.map((entry) => [entry.sceneId, entry.alt]));
    const findings: AuditFinding[] = [];

    for (const scene of sceneContexts) {
        const alt = altBySceneId.get(scene.sceneId);
        if (alt === undefined) continue; // image-module rules already report missing scenes
        const result = evaluateSceneMatch(scene.caption, alt);
        if (!result.flagged) continue;

        findings.push({
            severity: "warning",
            ruleId: SCENE_MISMATCH_RULE_ID,
            slug,
            path: `${slug}#${scene.sceneId}`,
            message:
                result.reason === "setting-conflict"
                    ? `Scene photo may not match its caption (${result.detail})`
                    : `Scene photo may be a generic stand-in (${result.detail})`,
            snippet: scene.caption ?? undefined,
        });
    }

    return findings;
}
