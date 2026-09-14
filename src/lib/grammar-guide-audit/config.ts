/**
 * Rules waived for guides that sit inside the audited weeks but are not weekly
 * grammar mini-guides. The audit encodes mini-guide authoring conventions, and
 * applying them to a different kind of artifact produces noise, not quality.
 *
 *   all-verb-tenses-overview
 *     A whole-year reference covering all 12 tenses. Capping it at five
 *     sections and five questions would gut the thing it exists to be, and its
 *     quiz deliberately checks recall of formulas printed in its own reference
 *     chart, which is what answer-recycled-from-explanation-text flags.
 *
 * Universal rules still apply: em dashes, title consistency, having sections at
 * all, and malformed exercises.
 */
export const GUIDE_RULE_EXEMPTIONS: Record<string, ReadonlySet<string>> = {
    "all-verb-tenses-overview": new Set([
        "section-count",
        "missing-text-exercise",
        "mini-quiz-count",
        "mini-quiz-topic",
        "mini-quiz-skill",
        "mini-quiz-skill-tag",
        "mini-quiz-error-detection",
        "american-name-missing",
        "answer-recycled-from-explanation-text",
    ]),
};

/** True when this rule is waived for this guide. See GUIDE_RULE_EXEMPTIONS. */
export function isRuleExempt(slug: string, ruleId: string): boolean {
    return GUIDE_RULE_EXEMPTIONS[slug]?.has(ruleId) ?? false;
}

/** Guides that do not require tenseDiagram sections (non-tense grammar focus). */
export const TENSE_DIAGRAM_EXEMPT_SLUGS = new Set([
    "verb-forms-overview",
    "parts-of-speech",
    "questions-real-answers",
    "your-week-in-english",
    "getting-there-directions",
    "can-should-must",
    "what-are-you-good-at",
    "lets-make-a-suggestion",
    "zero-first-conditional",
    "more-less-the-most",
    "how-much-how-many",
    "asking-right-questions-housing",
    "have-to-dont-have-to-cant",
    "need-to-find-a-place-infinitives",
    "must-have-to-should-at-work",
    "second-conditional-what-would-you-do",
    "phrasal-verbs-at-work",
    "enjoy-doing-want-to-do",
    "passive-voice-what-was-done",
    "should-shouldnt-health-advice",
    "stop-taking-or-stop-to-take",
]);

/** Guides that must include at least one section with tenseDiagram. */
export const TENSE_DIAGRAM_REQUIRED_SLUGS = new Set([
    "welcome-back-tenses-review",
    "past-simple-past-continuous",
    "just-already-yet",
    "have-you-ever",
    "how-long-for-since",
    "it-was-happening-when",
    "past-perfect",
    "present-perfect-how-long",
    "ive-been-working",
]);

export const AMERICAN_NAMES = [
    "james", "sarah", "michael", "jennifer", "robert", "jessica", "emily", "david",
    "ashley", "michelle", "brian", "lisa", "mark", "nicole", "kevin", "rachel",
    "thomas", "angela", "steven", "laura", "ryan", "hannah", "connor", "olivia",
    "emma", "matthew", "stephanie", "scott", "heather", "justin", "amy", "patrick",
    "sean", "brendan", "kathleen", "maureen", "danny", "gina", "sal", "vinnie",
    "jenny", "tony", "susan",
];

export const WORKPLACE_KEYWORDS = [
    "shift", "landlord", "rent", "clinic", "supervisor", "deposit", "bus", "overtime",
    "paycheck", "lease", "restaurant", "construction", "factory", "housecleaning",
    "warehouse", "payroll", "manager", "coworker", "landlord", "tenant", "bill",
    "electric", "grocery", "listing", "apartment",
];

export const CIVIC_WEEKS = new Set([9, 10, 11, 12]);

export const WHOLESOME_PHRASES = [
    "volunteer",
    "community center",
    "sign up to help",
    "bulletin board",
];

export const PRESSURE_KEYWORDS = [
    "form", "hours", "deadline", "before cutoff", "office closes", "appointment",
    "shift", "rent", "lease", "bill", "paycheck",
];

export const TEXTBOOK_PHRASES = [
    "in english, we",
    "remember that the",
    "the rule is",
    "let us learn",
    "it is important to note",
];

export const VAGUE_JOB_PHRASES = [
    "works at a company",
    "at the office",
    "at the company",
];

export const CASUAL_SPEAKER_HINTS = [
    "cousin", "coworker", "neighbor", "friend", "sister", "brother", "manager",
    "supervisor", "landlord",
];

export const PLAIN_YELLOW_AVATARS = new Set(["👩", "👨", "🧑"]);
