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
]);

/** Guides that must include at least one section with tenseDiagram. */
export const TENSE_DIAGRAM_REQUIRED_SLUGS = new Set([
    "welcome-back-tenses-review",
    "past-simple-past-continuous",
    "just-already-yet",
    "have-you-ever",
    "how-long-for-since",
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
