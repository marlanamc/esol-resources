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

const BARE_BEDROOM_PATTERN =
    /\b(?:a|an|the)\s+(?:one|two|three|four|five)[- ]bedroom\b(?!\s+(?:apartment|unit|flat|house|home|rental|condo|place|listing|on|near|is|was|are|were|with|for|in|at|to|from|that|this|on the list))/i;

const BARE_BEDROOM_SUPERLATIVE_PATTERN =
    /\b(?:the\s+)?(?:smallest|cheapest|biggest|largest|best|lowest|highest)\s+(?:one|two|three|four|five)[- ]bedroom\b(?!\s+(?:apartment|unit|flat|house|home|rental|condo|place|listing|on|near|is|was|are|were|with|for|in|at|to|from|that|this|on the list))/i;

const SHARE_BARE_BEDROOM_PATTERN =
    /\bshare\s+(?:a|an|the)\s+(?:one|two|three|four|five)[- ]bedroom\b(?!\s+(?:apartment|unit|flat|house|home|rental|condo|place|with))/i;

const EXAMPLE_ROW_FRAGMENT_PATTERN = /<\/em>\s*\/\s*<em>(?:a|an|the)\s+/i;

const SUBJECT_ME_AND_PATTERN = /\b(?:^|[.!?]\s*)[Mm]e and [A-Z]/;

const UNNATURAL_DURATION_PATTERN = /\bhow long have you (?:cleaned|done)\b(?!\s+(?:for|since|here|there|at|in|on|with))/i;

const SKIP_PATH_SUFFIXES = [
    ".options[",
    "miniQuiz[",
];

function shouldSkipPath(path: string, plainText: string): boolean {
    if (SKIP_PATH_SUFFIXES.some((suffix) => path.includes(suffix))) {
        // Keep wrong-answer quiz options available for error-spotting exercises.
        if (/error|wrong|incorrect|mistake|not correct|should be/i.test(plainText)) {
            return true;
        }
        if (path.includes(".options[")) {
            return true;
        }
    }
    return false;
}

function checkBareBedroom(slug: string, path: string, text: string): AuditFinding[] {
    const findings: AuditFinding[] = [];
    for (const pattern of [
        BARE_BEDROOM_PATTERN,
        BARE_BEDROOM_SUPERLATIVE_PATTERN,
        SHARE_BARE_BEDROOM_PATTERN,
    ]) {
        const match = text.match(pattern);
        if (match) {
            findings.push(
                warning(
                    slug,
                    "bare-bedroom-noun",
                    path,
                    `Housing term "${match[0]}" may need a noun (apartment, unit, place) for learner clarity`,
                    text.slice(0, 120),
                ),
            );
        }
    }
    return findings;
}

export function runGrammarHeuristics(guide: LoadedGuide): AuditFinding[] {
    const { slug, content } = guide;
    const findings: AuditFinding[] = [];

    for (const entry of collectGuideStrings(content)) {
        const text = entry.plainText;
        if (!text || shouldSkipPath(entry.path, text)) continue;

        if (EXAMPLE_ROW_FRAGMENT_PATTERN.test(entry.value)) {
            findings.push(
                warning(
                    slug,
                    "example-row-fragment",
                    entry.path,
                    "Example row may use a sentence fragment after a slash; write full sentences for learners",
                    text.slice(0, 120),
                ),
            );
        }

        if (SUBJECT_ME_AND_PATTERN.test(text)) {
            findings.push(
                warning(
                    slug,
                    "subject-me-and",
                    entry.path,
                    '"Me and …" as subject — prefer "My friend and I" in model sentences',
                    text.slice(0, 120),
                ),
            );
        }

        if (UNNATURAL_DURATION_PATTERN.test(text) && !/\bhow long have you been\b/i.test(text)) {
            findings.push(
                warning(
                    slug,
                    "unnatural-duration-question",
                    entry.path,
                    'Duration question may read more naturally as "How long have you been …?" or "How long have you worked …?"',
                    text.slice(0, 120),
                ),
            );
        }

        findings.push(...checkBareBedroom(slug, entry.path, text));
    }

    return findings;
}
