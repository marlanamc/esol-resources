import type { ComparisonRow, TimelineElement } from "@/types/activity";
import { LEARN_TENSES_LESSONS, type LearnTensesFamilyId } from "@/data/timeline-learn-tenses";
import type { PrepositionIconKind } from "@/components/reference/PrepositionIcon";

export interface ComparisonBlock {
    title: string;
    leftLabel: string;
    rightLabel: string;
    rows: ComparisonRow[];
    showLabelColumn?: boolean;
}

/**
 * Single source of truth for the ESOL 3B pocket grammar reference.
 * Rendered both in-app (src/app/dashboard/reference/page.tsx) and in the
 * printable handout (FY27/reference-sheets/esol-3b-grammar-reference.html).
 *
 * Each `family` id maps to one stable color used everywhere that family
 * appears (dual coding). Every family also has a `shape` string used as a
 * redundant non-color cue (icon/marker), so the sheet still works for
 * colorblind readers, grayscale photocopies, and screen readers.
 */

export interface ReferenceFamily {
    id: string;
    label: string;
    /** Decorative accent — the exact hue the Timeline Tenses game uses for this family (see LearnTensesWalkthrough's FAMILY_STYLE). Backgrounds, borders, icons only — never body text. */
    color: string;
    /**
     * Darkened variant of `color` that meets WCAG AA (4.5:1) against a white
     * background. Use this, never `color`, for any small/body text.
     */
    textColor: string;
    /** Redundant non-color cue (emoji/glyph) shown next to the color swatch. */
    shape: string;
}

export const REFERENCE_FAMILIES: Record<string, ReferenceFamily> = {
    "word-types": { id: "word-types", label: "Parts of Speech", color: "#b05740", textColor: "#b05740", shape: "●" },
    "simple": { id: "simple", label: "Simple Tenses", color: "#3d8e42", textColor: "#39843e", shape: "✕" },
    "continuous": { id: "continuous", label: "Continuous Tenses", color: "#268a82", textColor: "#24827a", shape: "〜" },
    "perfect": { id: "perfect", label: "Perfect Tenses", color: "#c44a28", textColor: "#c44a28", shape: "→" },
    "perfect-continuous": { id: "perfect-continuous", label: "Perfect Continuous Tenses", color: "#b56e1a", textColor: "#a96718", shape: "〜→" },
    "used-to": { id: "used-to", label: "Used To / Be Used To / Get Used To", color: "#6b4fb8", textColor: "#6b4fb8", shape: "◐" },
    "structure": { id: "structure", label: "Sentence Structure", color: "#3d7fa5", textColor: "#3c7da3", shape: "▦" },
    "modals": { id: "modals", label: "Modals", color: "#c07840", textColor: "#a46636", shape: "◆" },
    "comparison": { id: "comparison", label: "Comparing Things", color: "#6a8d73", textColor: "#5e7d66", shape: "▲" },
    "voice": { id: "voice", label: "Passive / Reported", color: "#7a5c8c", textColor: "#7a5c8c", shape: "◀" },
};

/**
 * Modals plotted on a low→high certainty/obligation scale (0–100%), the same
 * idea as the one standout page in the old PDF — reused here as the pattern
 * for every modal, not a one-off. Color darkens with certainty (redundant
 * cue alongside the position/percent, so it still reads in grayscale).
 */
export interface ModalScaleEntry {
    word: string;
    percent: number;
    example: string;
}

/**
 * Darker = more certain/obligatory. Fixed 3-step palette (not a continuous
 * gradient), and every step is independently checked at >=4.5:1 contrast
 * against white (WCAG AA for body text) so the percent label stays readable
 * at every step, not just the darkest one.
 */
export function getModalCertaintyColor(percent: number): string {
    if (percent >= 70) return "#9a5e28"; // high — darkest
    if (percent >= 35) return "#a46636"; // moderate
    return "#a76624"; // low
}

export const MODAL_CERTAINTY_SCALE: ModalScaleEntry[] = [
    { word: "Might / May", percent: 10, example: "This treatment might work." },
    { word: "Could", percent: 20, example: "Your headache could be from the new medication." },
    { word: "Can", percent: 25, example: "You can take this with or without food." },
    { word: "Would", percent: 35, example: "If it worsens, I would come back in." },
    { word: "Should", percent: 50, example: "You should rest for 48 hours." },
    { word: "Ought to", percent: 60, example: "Patients ought to report allergies." },
    { word: "Need to", percent: 75, example: "You need to finish the full course." },
    { word: "Have to", percent: 90, example: "You have to arrive by 8am." },
    { word: "Must", percent: 100, example: "This form must be signed first." },
];

export interface ReferenceTenseEntry {
    id: string;
    title: string;
    familyId: LearnTensesFamilyId;
    description: string;
    formulas: { affirmative: string; negative: string; question: string };
    example: { sentence: string; verbPhrase: string };
    /** Real game data — rendered with the app's own <TimelineCanvas>, so these diagrams are pixel-identical to the tenses game. */
    timelineElements: TimelineElement[];
}

/**
 * Flattened from the Timeline Tenses game's own lesson data
 * (`@/data/timeline-learn-tenses`), so formulas, examples, and timeline
 * diagrams are identical to what students already see in the game — not a
 * second, hand-authored copy that can drift out of sync.
 *
 * `continuous-present-near-future` is a 4th bonus card in that family (a
 * near-future use of Present Continuous) and isn't one of the 12 core
 * tenses this reference sheet covers, so it's excluded here.
 */
const TENSE_FAMILY_IDS: LearnTensesFamilyId[] = ["simple", "continuous", "perfect", "perfect-continuous", "used-to"];

export const TENSE_ENTRIES: ReferenceTenseEntry[] = TENSE_FAMILY_IDS.flatMap((familyId) =>
    LEARN_TENSES_LESSONS[familyId].cards
        .filter((card) => card.id !== "continuous-present-near-future")
        .map((card): ReferenceTenseEntry => ({
            id: card.id,
            title: card.tenseName,
            familyId,
            description: card.shortMeaning,
            formulas: card.formulas,
            example: card.examples.affirmative,
            timelineElements: card.timelineElements,
        }))
);

export interface ReferenceSection {
    id: string;
    title: string;
    icon: string;
    familyId: keyof typeof REFERENCE_FAMILIES;
    rule: string;
    /** Tenses only: all three sentence forms, shown as a compact triplet. */
    formulas?: { affirmative: string; negative: string; question: string };
    /** Tenses only: real game timeline data, rendered with <TimelineCanvas>. */
    timelineElements?: TimelineElement[];
    examples?: string[];
    comparison?: ComparisonBlock;
    /** Additional tables rendered after the main one (e.g. two reported-speech tables, a 4-up contractions grid). */
    extraComparisons?: ComparisonBlock[];
    /** Word lists shown as labeled columns (e.g. gerund/infinitive/either verb groups). */
    wordLists?: { title: string; words: string[] }[];
    /** Prepositions only: small box+dot/arrow "picture" per term, standing in for the old PDF's clip art. */
    prepositionIcons?: { kind: PrepositionIconKind; label: string }[];
    tip?: { title: string; content: string };
    /** Modals only: the full present/future vs. past modal table. */
    modalsTable?: { modal: string; present: string; past: string }[];
    /** Modals only: render the low→high certainty scale instead of a formula/example box. */
    certaintyScale?: ModalScaleEntry[];
    /** Layout hint for the print sheet: give this card the full page width (content-heavy cards — long tables, word lists). */
    fullWidth?: boolean;
    /** One-line self-test to turn passive reference into light retrieval practice. */
    quickCheck?: string;
    /** Slug of the matching full interactive guide in grammar-guide-registry, if one exists. */
    fullGuideSlug?: string;
}

/** Game card id -> grammar-guide-registry slug, for the "open full guide" link. */
const TENSE_CARD_TO_GUIDE_SLUG: Record<string, string> = {
    "simple-past": "past-simple",
    "simple-present": "present-simple",
    "simple-future": "future-simple",
    "continuous-past": "past-continuous",
    "continuous-present": "present-continuous",
    "continuous-future": "future-continuous",
    "perfect-past": "past-perfect",
    "perfect-present": "present-perfect",
    "perfect-future": "future-perfect",
    "perfect-continuous-past": "past-perfect-continuous",
    "perfect-continuous-present": "present-perfect-continuous",
    "perfect-continuous-future": "future-perfect-continuous",
    "used-to-past-habit": "i-used-to-but-now-i",
    "be-used-to-present": "be-used-to-get-used-to",
    "get-used-to-present": "be-used-to-get-used-to",
};

export const REFERENCE_SECTIONS: ReferenceSection[] = [
    {
        id: "parts-of-speech",
        title: "Parts of Speech",
        icon: "📚",
        familyId: "word-types",
        rule: "Every English sentence is built from a small set of word types, each with its own job.",
        examples: [
            "The <b>girl</b> ate an <b>apple</b>. (noun, noun)",
            "She <b>runs</b> quickly. (verb, adverb)",
            "The <b>yellow</b> flower is pretty. (adjective)",
        ],
        quickCheck: "Can you name the noun, verb, and adjective in your last sentence?",
        fullGuideSlug: "parts-of-speech",
    },
    {
        id: "adjectives-vs-adverbs",
        title: "Adjectives vs Adverbs",
        icon: "🎨",
        familyId: "word-types",
        rule: "Adjectives describe nouns/pronouns. Adverbs describe verbs, adjectives, other adverbs, or whole sentences.",
        comparison: {
            title: "Adjectives vs Adverbs",
            leftLabel: "Adjective",
            rightLabel: "Adverb",
            rows: [
                { label: "What kind?", left: "The <b>blue</b> bag is mine.", right: "She spoke <b>softly</b>." },
                { label: "How many?", left: "She has <b>three</b> cats.", right: "They will arrive <b>shortly</b>." },
                { label: "Which one?", left: "This is the <b>best</b> option.", right: "The kids play <b>outside</b>." },
            ],
        },
        quickCheck: "Is \"quickly\" an adjective or an adverb? What does it describe?",
    },
    {
        id: "adverbs-of-frequency",
        title: "Adverbs of Frequency",
        icon: "🔁",
        familyId: "word-types",
        rule: "These adverbs say how often something happens, from 100% (always) to 0% (never).",
        examples: [
            "100% <b>Always</b> — I always drink coffee in the morning.",
            "65% <b>Often</b> — Mike often misses soccer practice.",
            "50% <b>Sometimes</b> — Sometimes I allow myself to eat junk food.",
            "15% <b>Rarely</b> — Barbara rarely watches TV.",
            "0% <b>Never</b> — Jennifer never drinks alcohol.",
        ],
        quickCheck: "Put these in order from most to least often: seldom, usually, sometimes.",
    },
    ...TENSE_ENTRIES.map((tense): ReferenceSection => ({
        id: tense.id,
        title: tense.title,
        icon: tense.familyId === "used-to" ? "🔄" : "⏱️",
        familyId: tense.familyId,
        rule: tense.description,
        formulas: tense.formulas,
        timelineElements: tense.timelineElements,
        examples: [tense.example.sentence.replace(tense.example.verbPhrase, `<b>${tense.example.verbPhrase}</b>`)],
        fullGuideSlug: TENSE_CARD_TO_GUIDE_SLUG[tense.id],
    })),
    {
        id: "prepositions-time",
        title: "Prepositions of Time",
        icon: "🧭",
        familyId: "word-types",
        rule: "At = exact time/point. In = months, years, long periods. On = days and dates.",
        fullWidth: true,
        comparison: {
            title: "At / In / On",
            leftLabel: "Use",
            rightLabel: "Examples",
            rows: [
                { label: "at", left: "time of day, mealtimes, expressions", right: "<b>at</b> 4 o'clock, <b>at</b> noon, <b>at</b> breakfast, <b>at</b> night, <b>at</b> the moment" },
                { label: "in", left: "months, seasons, years, decades, long periods, parts of the day", right: "<b>in</b> April, <b>in</b> the summer, <b>in</b> 2000, <b>in</b> the 90s, <b>in</b> the past, <b>in</b> the morning" },
                { label: "on", left: "days, dates, parts of a specific day", right: "<b>on</b> Tuesday, <b>on</b> 15th June, <b>on</b> my birthday, <b>on</b> Monday morning" },
            ],
        },
        tip: {
            title: "Watch out",
            content: "\"at night\" is the one exception to the \"in + part of the day\" rule — not \"in night\".",
        },
        quickCheck: "Fill in: \"My birthday is ___ June.\" (at / in / on)",
        fullGuideSlug: "prepositions-time-place",
    },
    {
        id: "prepositions-space",
        title: "Prepositions of Space",
        icon: "📦",
        familyId: "word-types",
        rule: "These describe where something is — pictured here with a box and a dot.",
        fullWidth: true,
        prepositionIcons: [
            { kind: "in", label: "in" },
            { kind: "on", label: "on" },
            { kind: "under", label: "under" },
            { kind: "above", label: "above" },
            { kind: "below", label: "below" },
            { kind: "in-front-of", label: "in front of" },
            { kind: "behind", label: "behind" },
            { kind: "next-to", label: "next to" },
            { kind: "between", label: "between" },
            { kind: "on-the-left", label: "on the left" },
            { kind: "on-the-right", label: "on the right" },
            { kind: "opposite", label: "opposite" },
        ],
        quickCheck: "Which word fits: \"The cat sits ___ the two boxes\"? (between / opposite)",
        fullGuideSlug: "prepositions-time-place",
    },
    {
        id: "prepositions-movement",
        title: "Prepositions of Movement",
        icon: "🏃",
        familyId: "word-types",
        rule: "These show the path or direction something moves.",
        fullWidth: true,
        prepositionIcons: [
            { kind: "into", label: "into the box" },
            { kind: "out-of", label: "out of the box" },
            { kind: "around", label: "around the box" },
            { kind: "away-from", label: "away from the box" },
            { kind: "toward", label: "toward the box" },
            { kind: "past", label: "past the box" },
            { kind: "onto", label: "on to the box" },
            { kind: "off", label: "off the box" },
            { kind: "over", label: "over the box" },
            { kind: "under-the-wall", label: "under the wall" },
            { kind: "through", label: "through the pipe" },
            { kind: "across", label: "across the bridge" },
            { kind: "up", label: "up the stairs" },
            { kind: "down", label: "down the stairs" },
        ],
        quickCheck: "Which preposition fits: \"The cat jumped ___ the box\" (over, under, or into)?",
        fullGuideSlug: "getting-there-directions",
    },
    {
        id: "two-verb-sentences",
        title: "Sentences with Two Verbs",
        icon: "🔗",
        familyId: "structure",
        rule: "When one action interrupts another, the main clause keeps its tense and the interruption drops one tense back.",
        comparison: {
            title: "Main clause → interruption clause",
            leftLabel: "Main clause tense",
            rightLabel: "Interruption tense",
            rows: [
                { label: "Past Continuous", left: "was/were + verb-ing", right: "Past Simple" },
                { label: "Past Perfect", left: "had + V3", right: "Past Simple" },
                { label: "Future Perfect", left: "will have + V3", right: "Present Simple" },
            ],
        },
        examples: [
            "While I <b>was studying</b> last night, the power <b>went</b> out.",
            "She <b>had cleaned</b> for two hours when her husband <b>arrived</b>.",
            "By the time the guests <b>arrive</b>, we <b>will have prepared</b> a feast.",
        ],
        tip: {
            title: "Rule of thumb",
            content: "If the main clause is in the past, the interruption is in the past too. If the main clause is in the future, the interruption is in the present.",
        },
        quickCheck: "Which happens first in \"She had cleaned for two hours when her husband arrived\"?",
    },
    {
        id: "contractions",
        title: "Contractions",
        icon: "✂️",
        familyId: "structure",
        rule: "Contractions combine a subject/word and a verb (or a verb and 'not') into one shorter word with an apostrophe.",
        fullWidth: true,
        comparison: {
            title: "Full Form → Contraction",
            leftLabel: "Full Form",
            rightLabel: "Contraction",
            showLabelColumn: false,
            rows: [
                { label: "", left: "I am", right: "I'm" },
                { label: "", left: "You/We/They are", right: "You're / We're / They're" },
                { label: "", left: "He/She/It is", right: "He's / She's / It's" },
                { label: "", left: "I/You/We/They have", right: "I've / You've / We've / They've" },
                { label: "", left: "I/You/He/She/It/We/They will", right: "I'll / You'll / He'll / She'll / It'll / We'll / They'll" },
                { label: "", left: "I/You/He/She/It/We/They would / had", right: "I'd / You'd / He'd / She'd / It'd / We'd / They'd" },
            ],
        },
        extraComparisons: [
            {
                title: "Negative Contractions",
                leftLabel: "Full Form",
                rightLabel: "Contraction",
                showLabelColumn: false,
                rows: [
                    { label: "", left: "is / are / was / were not", right: "isn't / aren't / wasn't / weren't" },
                    { label: "", left: "have / has / had not", right: "haven't / hasn't / hadn't" },
                    { label: "", left: "do / does / did not", right: "don't / doesn't / didn't" },
                    { label: "", left: "will / would not", right: "won't / wouldn't" },
                    { label: "", left: "cannot / could / should not", right: "can't / couldn't / shouldn't" },
                ],
            },
        ],
        tip: {
            title: "Watch out",
            content: "\"will not\" → \"won't\" is irregular — it doesn't just shorten \"will\", the spelling changes.",
        },
        quickCheck: "What does \"they'd\" stand for? (two possible answers)",
    },
    {
        id: "modals",
        title: "Modals",
        icon: "📊",
        familyId: "modals",
        rule: "Modals add meaning to a verb — ability, permission, necessity, advice, or certainty — and never change form (no -s, no \"to\").",
        fullWidth: true,
        modalsTable: [
            { modal: "be supposed to", present: "We are supposed to meet here.", past: "We were supposed to meet here." },
            { modal: "can / could", present: "Can I learn modal verbs? / You can use my car.", past: "I could jump high but can't now." },
            { modal: "have to", present: "I have to go to class. / I don't have to go.", past: "I had to go to class. / I didn't have to go." },
            { modal: "had better", present: "You had better be on time.", past: "(past form uncommon)" },
            { modal: "may", present: "May I borrow your book? / He may be there.", past: "He may have been there." },
            { modal: "might", present: "He might be at school.", past: "He might have been there." },
            { modal: "must", present: "I must go to class. / You must not open that.", past: "Mary must have been sick." },
            { modal: "ought to", present: "I ought to study.", past: "I ought to have studied." },
            { modal: "shall", present: "Shall we dance? / Shall we go to dinner?", past: "—" },
            { modal: "should", present: "I should study.", past: "You should have paid bills." },
            { modal: "will / would", present: "I will call you tomorrow. / Would you pass the salt?", past: "I would have gone if I could." },
        ],
        certaintyScale: MODAL_CERTAINTY_SCALE,
        quickCheck: "Which is stronger: \"You should rest\" or \"You must rest\"?",
        fullGuideSlug: "modals-obligation-permission",
    },
    {
        id: "gerunds-infinitives",
        title: "Gerunds & Infinitives",
        icon: "🔀",
        familyId: "structure",
        rule: "A gerund (verb-ing) acts like a noun. An infinitive (to + verb) often follows an adjective, noun, or certain verbs.",
        comparison: {
            title: "Gerund vs Infinitive",
            leftLabel: "Gerund (-ing)",
            rightLabel: "Infinitive (to + verb)",
            rows: [
                { label: "Subject", left: "<b>Swimming</b> is fun!", right: "It's nice <b>to meet</b> you." },
                { label: "After preposition", left: "She thought about <b>calling</b> him.", right: "—" },
                { label: "After verb", left: "He enjoys <b>learning</b> English.", right: "We want <b>to visit</b> Mexico." },
            ],
        },
        fullWidth: true,
        wordLists: [
            { title: "Followed by a Gerund (-ing)", words: ["admit", "advise", "appreciate", "avoid", "complete", "consider", "deny", "discuss", "dislike", "enjoy", "finish", "imagine", "keep", "mention", "mind", "miss", "practice", "quit", "recommend", "suggest"] },
            { title: "Followed by an Infinitive (to + verb)", words: ["afford", "agree", "appear", "ask", "decide", "expect", "hope", "intend", "learn", "mean", "need", "offer", "plan", "prepare", "promise", "refuse", "seem", "volunteer", "wait", "want"] },
            { title: "Followed by Either", words: ["begin", "continue", "hate", "like", "love", "prefer", "start"] },
        ],
        quickCheck: "Which goes after \"enjoy\": a gerund or an infinitive?",
        fullGuideSlug: "gerunds-infinitives",
    },
    {
        id: "conditionals",
        title: "Conditionals",
        icon: "🔮",
        familyId: "structure",
        rule: "Conditionals describe a condition (the \"if\" part) and its result — and the tense pairing tells you how real or hypothetical it is.",
        comparison: {
            title: "If clause → main clause",
            leftLabel: "Type",
            rightLabel: "Formula & example",
            showLabelColumn: true,
            rows: [
                { label: "Zero (facts)", left: "If + present simple", right: "present simple — If you heat water, it <b>boils</b>." },
                { label: "First (real future)", left: "If + present simple", right: "will + verb — If it rains, I <b>will stay</b> home." },
                { label: "Second (unreal now)", left: "If + past simple", right: "would + verb — If I <b>won</b> the lottery, I <b>would travel</b>." },
                { label: "Third (unreal past)", left: "If + past perfect", right: "would have + V3 — If I <b>had known</b>, I <b>would have gone</b>." },
            ],
        },
        quickCheck: "Which conditional talks about something that didn't actually happen in the past?",
        fullGuideSlug: "all-four-conditionals-quick-tour",
    },
    {
        id: "comparatives-superlatives",
        title: "Comparatives & Superlatives",
        icon: "📈",
        familyId: "comparison",
        rule: "Comparatives compare two things (-er / more). Superlatives single out one from three or more (the -est / the most).",
        comparison: {
            title: "Comparative vs Superlative",
            leftLabel: "Comparative (2 things)",
            rightLabel: "Superlative (3+ things)",
            rows: [
                { label: "One syllable (tall)", left: "tall<b>er</b> than", right: "the tall<b>est</b>" },
                { label: "Two syllables ending -y (happy)", left: "happi<b>er</b> than", right: "the happi<b>est</b>" },
                { label: "Longer (expensive)", left: "<b>more</b> expensive than", right: "the <b>most</b> expensive" },
                { label: "good", left: "<b>better</b> than", right: "the <b>best</b>" },
                { label: "bad", left: "<b>worse</b> than", right: "the <b>worst</b>" },
                { label: "far", left: "<b>farther / further</b> than", right: "the <b>farthest / furthest</b>" },
            ],
        },
        quickCheck: "What's the comparative and superlative of \"bad\"?",
        fullGuideSlug: "more-less-the-most",
    },
    {
        id: "passive-voice",
        title: "Passive Voice",
        icon: "🔁",
        familyId: "voice",
        rule: "In passive voice, the subject receives the action instead of doing it — used when the doer is unknown, unimportant, or obvious.",
        fullWidth: true,
        comparison: {
            title: "Active vs Passive, by Tense",
            leftLabel: "Active",
            rightLabel: "Passive",
            rows: [
                { label: "Present Simple", left: "The teacher <b>checks</b> the homework.", right: "The homework <b>is checked</b> by the teacher." },
                { label: "Past Simple", left: "The ball <b>broke</b> the window.", right: "The window <b>was broken</b> by the ball." },
                { label: "Present Continuous", left: "Someone <b>is delivering</b> a pizza now.", right: "A pizza <b>is being delivered</b> now." },
                { label: "Past Continuous", left: "Workers <b>were moving</b> the chairs.", right: "The chairs <b>were being moved</b>." },
                { label: "Present Perfect", left: "The students <b>have finished</b> the test.", right: "The test <b>has been finished</b>." },
                { label: "Past Perfect", left: "She <b>had found</b> the keys.", right: "The keys <b>had been found</b>." },
                { label: "Future Simple", left: "They <b>will complete</b> the project by Friday.", right: "The project <b>will be completed</b> by Friday." },
                { label: "Modal Verbs", left: "You <b>should clean</b> the room.", right: "The room <b>should be cleaned</b>." },
            ],
        },
        tip: {
            title: "Why use passive voice",
            content: "We don't know who did it (\"The window was broken\"), the doer doesn't matter (\"The homework was collected\"), or the doer is obvious (\"He was arrested\").",
        },
        quickCheck: "Rewrite as passive: \"Someone stole my bike.\"",
        fullGuideSlug: "passive-voice",
    },
    {
        id: "reported-speech",
        title: "Reported Speech",
        icon: "💬",
        familyId: "voice",
        rule: "When you report what someone said, the verb tense shifts back one step, and time/place words change too.",
        fullWidth: true,
        comparison: {
            title: "Verb Tense Changes",
            leftLabel: "Direct speech",
            rightLabel: "Reported speech",
            rows: [
                { label: "Present Simple → Past Simple", left: "\"I <b>work</b> as a teacher.\"", right: "She said she <b>worked</b> as a teacher." },
                { label: "Present Continuous → Past Continuous", left: "\"I <b>am studying</b> medicine.\"", right: "She told me she <b>was studying</b> medicine." },
                { label: "Past Simple → Past Perfect", left: "\"I <b>moved</b> here in 1960.\"", right: "He told me he <b>had moved</b> there in 1960." },
                { label: "Present Perfect → Past Perfect", left: "\"I <b>have worked</b> here for 30 years.\"", right: "She said she <b>had worked</b> there for 30 years." },
                { label: "Future (will) → would", left: "\"I <b>will teach</b> you someday.\"", right: "Dad promised he <b>would teach</b> me someday." },
            ],
        },
        extraComparisons: [
            {
                title: "Time & Place Expression Changes",
                leftLabel: "Direct",
                rightLabel: "Reported",
                rows: [
                    { label: "today", left: "that day", right: "\"I feel sick today.\" → She said she felt sick that day." },
                    { label: "yesterday", left: "the day before", right: "\"I visited yesterday.\" → He said he had visited the day before." },
                    { label: "tomorrow", left: "the next day", right: "\"I'll call tomorrow.\" → She promised she'd call the next day." },
                    { label: "this week", left: "that week", right: "\"I'm busy this week.\" → He explained he was busy that week." },
                    { label: "last month", left: "the month before", right: "\"We moved last month.\" → They said they'd moved the month before." },
                    { label: "next year", left: "the following year", right: "\"I'll graduate next year.\" → She said she'd graduate the following year." },
                    { label: "here", left: "there", right: "\"I grew up here.\" → She said she'd grown up there." },
                    { label: "this / these", left: "that / those", right: "\"I love this place.\" → He said he loved that place." },
                ],
            },
        ],
        wordLists: [
            { title: "Useful Reporting Verbs", words: ["admitted", "claimed", "denied", "explained", "insisted", "mentioned", "suggested", "advised", "complained", "promised"] },
        ],
        tip: {
            title: "Reporting questions",
            content: "Yes/No questions use \"if\" or \"whether\": \"Do you remember?\" → I asked if he remembered. Wh-questions keep the question word: \"Where did you grow up?\" → I asked where she had grown up.",
        },
        quickCheck: "How would you report: Dad said, \"I'll teach you to cook someday.\"?",
        fullGuideSlug: "reported-speech",
    },
];
