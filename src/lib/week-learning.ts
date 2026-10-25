/**
 * What each week teaches, in learner words, plus the pages of the printed
 * Grammar Reference Sheets that help with it. Page sections come from
 * docs/grammar-progression/reference-pages.json; page numbers are checked
 * against FY27/reference-sheets/esol-3b-grammar-reference.html by
 * tests/classes/week-learning.vitest.ts.
 */

export interface ReferencePage {
    /** Article id in the reference sheets. */
    section: string;
    page: number;
    label: string;
}

export interface WeekLearning {
    canDo: string[];
    pages: ReferencePage[];
}

export const WEEK_LEARNING: Record<number, WeekLearning> = {
    1: {
        canDo: ["I can find my way around the class app.", "I can talk about my routine and what I am doing now."],
        pages: [
            { section: "simple", page: 13, label: "Present and past simple" },
            { section: "continuous", page: 14, label: "Present and past continuous" },
        ],
    },
    2: {
        canDo: ["I can tell nouns, verbs, and adjectives apart.", "I can make a simple sentence with a subject and a verb."],
        pages: [
            { section: "word-types", page: 2, label: "Nouns and verbs" },
            { section: "build-sentence", page: 3, label: "Subject + verb" },
        ],
    },
    3: {
        canDo: ["I can find the noun and the verb in a sentence.", "I can write a complete sentence."],
        pages: [
            { section: "word-types", page: 2, label: "Nouns and verbs" },
            { section: "build-sentence", page: 3, label: "Build a complete sentence" },
        ],
    },
    4: {
        canDo: ["I can use V1, V2, and V3 verb forms.", "I can make a small English study routine."],
        pages: [
            { section: "verb-forms", page: 9, label: "The five verb forms" },
            { section: "irregular-verbs", page: 10, label: "V1, V2, and V3 patterns" },
        ],
    },
    5: {
        canDo: ["I can ask questions that get real answers.", "I can talk about my phone habits and my routines."],
        pages: [{ section: "questions", page: 18, label: "Question words and short answers" }],
    },
    6: {
        canDo: ["I can say how often I do things (always, usually, never).", "I can ask for and give directions."],
        pages: [
            { section: "adverbs", page: 5, label: "How often: always, usually, never" },
            { section: "simple", page: 13, label: "Present simple" },
            { section: "prepositions-movement", page: 8, label: "Directions and movement" },
        ],
    },
    7: {
        canDo: ["I can talk about results with if (If it rains, I take the bus).", "I can make a suggestion for my community."],
        pages: [{ section: "conditionals", page: 22, label: "If sentences: zero and first" }],
    },
    8: {
        canDo: ["I can use can, should, and must.", "I can make and answer a phone call."],
        pages: [
            { section: "modals", page: 24, label: "Can, should, and must" },
            { section: "modal-meaning", page: 25, label: "Permission, advice, and rules" },
        ],
    },
    9: {
        canDo: ["I can ask Have you ever...? and answer.", "I can use just, already, and yet."],
        pages: [
            { section: "perfect", page: 15, label: "Present perfect: experiences" },
            { section: "questions", page: 18, label: "Have/has questions and short answers" },
        ],
    },
    10: {
        canDo: ["I can say what I am good at (good at cooking).", "I can make a suggestion at a meeting."],
        pages: [{ section: "gerunds", page: 27, label: "Good at + V1-ing" }],
    },
    11: {
        canDo: ["I can ask and answer How long...?", "I can use for and since (for 3 years, since 2020)."],
        pages: [
            { section: "prepositions-time", page: 6, label: "For and since" },
            { section: "perfect", page: 15, label: "Present perfect: still true now" },
        ],
    },
    12: {
        canDo: ["I can compare two things (bigger, more expensive).", "I can say which is the best or the most."],
        pages: [{ section: "comparisons", page: 29, label: "Comparing: -er, more, the most" }],
    },
    13: {
        canDo: ["I can ask How much...? and How many...?", "I can talk about things I can and can't count."],
        pages: [{ section: "pronouns", page: 4, label: "A/an, plurals, and uncountable nouns" }],
    },
    14: {
        canDo: ["I can read a simple news headline.", "I can make a prediction about a chart."],
        pages: [
            { section: "comparisons", page: 29, label: "Comparing amounts and changes" },
            { section: "connectors", page: 21, label: "But, so, because" },
        ],
    },
    15: {
        canDo: ["I can use the tenses I know in a short story.", "I can choose present, past, or future."],
        pages: [
            { section: "simple", page: 13, label: "Present, past, and future simple" },
            { section: "continuous", page: 14, label: "Present and past continuous" },
            { section: "perfect", page: 15, label: "Present perfect" },
        ],
    },
    16: {
        canDo: ["I can ask good questions about an apartment.", "I can understand a simple housing ad."],
        pages: [
            { section: "questions", page: 18, label: "Question words" },
            { section: "build-sentence", page: 3, label: "Subject before verb" },
        ],
    },
    17: {
        canDo: ["I can use have to, don't have to, and can't.", "I can compare two places to live."],
        pages: [
            { section: "modal-meaning", page: 25, label: "Have to, don't have to, can't" },
            { section: "modals", page: 24, label: "Have to / need to" },
        ],
    },
    18: {
        canDo: ["I can say what I need to do (I need to call).", "I can ask my landlord for a repair."],
        pages: [
            { section: "gerunds", page: 27, label: "Need to, want to + V1" },
            { section: "verb-lists", page: 28, label: "Need, want, plan, hope" },
        ],
    },
    19: {
        canDo: ["I can tell a story about a housing problem.", "I can say what was happening when something happened."],
        pages: [
            { section: "continuous", page: 14, label: "Past continuous" },
            { section: "two-clauses", page: 19, label: "Was happening when..." },
        ],
    },
    20: {
        canDo: ["I can say what had already happened (had + V3).", "I can talk about my work experience."],
        pages: [
            { section: "perfect", page: 15, label: "Past perfect" },
            { section: "two-clauses", page: 19, label: "First event, second event" },
        ],
    },
    21: {
        canDo: ["I can talk about past jobs with used to.", "I can compare then and now."],
        pages: [{ section: "used-to", page: 30, label: "Used to + V1" }],
    },
    22: {
        canDo: ["I can say what I would do (If I won, I would...).", "I can talk about dreams and choices."],
        pages: [{ section: "conditionals", page: 22, label: "If sentences: second" }],
    },
    23: {
        canDo: ["I can say what I enjoy doing and want to do at work.", "I can use work phrases like clock in and pick up."],
        pages: [
            { section: "gerunds", page: 27, label: "Enjoy doing vs. want to do" },
            { section: "verb-lists", page: 28, label: "Enjoy, avoid, finish; want, need, plan" },
        ],
    },
    24: {
        canDo: ["I can talk about my job search with just, already, and yet.", "I can answer simple interview questions."],
        pages: [{ section: "perfect", page: 15, label: "Present perfect: just, already, yet" }],
    },
    25: {
        canDo: ["I can say what I have been doing (I've been working).", "I can talk about my skills and progress."],
        pages: [
            { section: "perfect-continuous", page: 16, label: "Present perfect continuous" },
            { section: "tense-choices", page: 17, label: "How much vs. how long" },
        ],
    },
    26: {
        canDo: ["I can say what I had been doing before a change.", "I can tell my work history."],
        pages: [
            { section: "perfect-continuous", page: 16, label: "Past perfect continuous" },
            { section: "perfect", page: 15, label: "Past perfect" },
        ],
    },
    27: {
        canDo: ["I can understand passive sentences (It was made...).", "I can read a pay stub."],
        pages: [{ section: "passive", page: 31, label: "Passive: is made, was made" }],
    },
    28: {
        canDo: ["I can give health advice with should and shouldn't.", "I can talk about going to the doctor."],
        pages: [
            { section: "modals", page: 24, label: "Should, ought to, had better" },
            { section: "modal-meaning", page: 25, label: "Advice or a rule?" },
        ],
    },
    29: {
        canDo: ["I can describe my symptoms.", "I can tell stop taking from stop to take."],
        pages: [{ section: "gerunds", page: 27, label: "Stop, remember, try" }],
    },
    30: {
        canDo: ["I can repeat what the doctor said.", "I can use said and told."],
        pages: [
            { section: "reported", page: 32, label: "Said and told" },
            { section: "reported-context", page: 33, label: "Repeating requests and instructions" },
        ],
    },
    31: {
        canDo: ["I can talk about what would have happened.", "I can ask questions at the pharmacy."],
        pages: [
            { section: "conditionals", page: 22, label: "If sentences: third" },
            { section: "modals-past", page: 26, label: "Would have + V3" },
        ],
    },
    32: {
        canDo: ["I can say what I will have done by a date.", "I can set a wellness goal."],
        pages: [
            { section: "perfect", page: 15, label: "Future perfect" },
            { section: "prepositions-time", page: 6, label: "By + a date" },
        ],
    },
    33: {
        canDo: ["I can say what I am used to and getting used to.", "I can talk about life changes."],
        pages: [
            { section: "used-to", page: 30, label: "Be used to / get used to" },
            { section: "gerunds", page: 27, label: "When to + V1-ing" },
        ],
    },
    34: {
        canDo: ["I can choose the right if sentence.", "I can tell a story about a bad week."],
        pages: [{ section: "conditionals", page: 22, label: "All four if sentences" }],
    },
    35: {
        canDo: ["I can say how long I will have been doing something.", "I can talk about my progress this year."],
        pages: [
            { section: "perfect-continuous", page: 16, label: "Future perfect continuous" },
            { section: "perfect", page: 15, label: "Future perfect" },
        ],
    },
    36: {
        canDo: ["I can choose the right tense for what I mean.", "I can talk about my year in English."],
        pages: [
            { section: "tense-choices", page: 17, label: "Choose the right tense" },
            { section: "formulas", page: 11, label: "Tense patterns" },
            { section: "perfect-continuous", page: 16, label: "Present, past, and future duration" },
        ],
    },
};

export function getWeekLearning(weekNumber: number): WeekLearning | null {
    return WEEK_LEARNING[weekNumber] ?? null;
}
