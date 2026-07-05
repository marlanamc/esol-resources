import type { InteractiveGuideContent } from "@/types/activity";

/**
 * Registry for the interactive grammar-reader guides served by
 * src/app/grammar-reader/[slug]/page.tsx. Each entry holds the metadata the
 * old per-slug pages exported, the Activity title used to resolve the DB
 * activity id, and a lazy loader for the guide content module.
 *
 * The completion key for a guide is its slug. Print-only content (served by
 * grammar-reader/[slug]/print) lives in @/lib/grammar-content-loader.
 */
export interface GrammarGuideEntry {
    /** Activity.title used with getGrammarGuideActivity(title) */
    activityTitle: string;
    metaTitle: string;
    metaDescription: string;
    loadContent: () => Promise<InteractiveGuideContent>;
}

export const grammarGuides: Record<string, GrammarGuideEntry> = {
    "all-four-conditionals-quick-tour": {
        activityTitle: "All Four Conditionals: A Quick Tour",
        metaTitle: "All Four Conditionals: A Quick Tour - Interactive Guide | Class Companion",
        metaDescription: "Review zero, first, second, and third conditionals side by side through one worker's bad week of lifting injuries, clinic visits, and missed shifts.",
        loadContent: () =>
            import("@/content/grammar/all-four-conditionals-quick-tour").then((m) => m.allFourConditionalsQuickTourContent),
    },
    "all-the-tenses-year-in-review": {
        activityTitle: "All the Tenses: A Year in Review",
        metaTitle: "All the Tenses: A Year in Review - Interactive Guide | Class Companion",
        metaDescription: "Review all eleven Level 3 tenses through Rosa's real year of restaurant shifts, evening class, kids' school, and the 121 bus home.",
        loadContent: () =>
            import("@/content/grammar/all-the-tenses-year-in-review").then((m) => m.allTheTensesYearInReviewContent),
    },
    "all-verb-tenses-overview": {
        activityTitle: "All Verb Tenses Overview Guide",
        metaTitle: "All Verb Tenses Overview - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master all 12 English verb tenses with a complete timeline and usage guide. Perfect for comprehensive review and final presentations.",
        loadContent: () =>
            import("@/content/grammar/all-verb-tenses-overview").then((m) => m.allVerbTensesOverviewContent),
    },
    "articles-community-resources": {
        activityTitle: "Articles & References for Community Resources Guide",
        metaTitle: "Articles & References for Community Resources - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Clarify general vs specific resources with a/an/the and zero article to describe East Boston housing, job, and health services confidently.",
        loadContent: () =>
            import("@/content/grammar/articles-community-resources").then((m) => m.articlesCommunityResourcesContent),
    },
    "asking-right-questions-housing": {
        activityTitle: "Asking the Right Questions About Housing",
        metaTitle: "Asking the Right Questions About Housing - Interactive Guide | Class Companion",
        metaDescription: "Learn information questions and indirect questions in English using real housing situations: calling landlords, asking about rent, utilities, and whether children are allowed.",
        loadContent: () =>
            import("@/content/grammar/asking-right-questions-housing").then((m) => m.askingRightQuestionsHousingContent),
    },
    "be-used-to-get-used-to": {
        activityTitle: "Be Used to / Get Used to",
        metaTitle: "Be Used to / Get Used to - Interactive Guide | Class Companion",
        metaDescription: "Learn be used to and get used to with gerunds through night shifts, winter commutes, school emails, and still adjusting to life in Boston.",
        loadContent: () =>
            import("@/content/grammar/be-used-to-get-used-to").then((m) => m.beUsedToGetUsedToContent),
    },
    "can-should-must": {
        activityTitle: "Can, Should, Must",
        metaTitle: "Can, Should, Must - Interactive Guide | Class Companion",
        metaDescription: "Learn to use can, should, and must in real digital safety situations.",
        loadContent: () =>
            import("@/content/grammar/can-should-must").then((m) => m.canShouldMustContent),
    },
    "continuous-tenses-review": {
        activityTitle: "Continuous Tenses Review",
        metaTitle: "Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Continuous Tenses Review tense with exercises, examples, and practice. Learn when and how to use Continuous Tenses Review correctly.",
        loadContent: () =>
            import("@/content/grammar/continuous-tenses-review").then((m) => m.continuousTensesReviewContent),
    },
    "cycle-1-review": {
        activityTitle: "Cycle 1 Review",
        metaTitle: "Cycle 1 Review - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "A gentle flow through Cycle 1 grammar: simple, continuous, parts of speech, frequency, comparatives, and connectors with a final mini-quiz.",
        loadContent: () =>
            import("@/content/grammar/cycle-1-review").then((m) => m.cycleOneReviewContent),
    },
    "doctor-said-reported-speech": {
        activityTitle: "The Doctor Said: Reported Speech",
        metaTitle: "The Doctor Said: Reported Speech - Interactive Guide | Class Companion",
        metaDescription: "Learn reported speech through a real clinic call about a child's asthma inhaler.",
        loadContent: () =>
            import("@/content/grammar/doctor-said-reported-speech").then((m) => m.doctorSaidReportedSpeechContent),
    },
    "enjoy-doing-want-to-do": {
        activityTitle: "Enjoy Doing vs. Want to Do",
        metaTitle: "Enjoy Doing vs. Want to Do - Interactive Grammar Guide | Class Companion",
        metaDescription: "Learn which verbs take a gerund and which take an infinitive, using real conversations about work and career goals.",
        loadContent: () =>
            import("@/content/grammar/enjoy-doing-want-to-do").then((m) => m.enjoyDoingWantToDoContent),
    },
    "future-continuous": {
        activityTitle: "Future Continuous Guide",
        metaTitle: "Future Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Future Continuous tense with exercises, examples, and practice. Learn when and how to use Future Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/future-continuous").then((m) => m.futureContinuousContent),
    },
    "future-perfect": {
        activityTitle: "Future Perfect Guide",
        metaTitle: "Future Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Future Perfect tense with exercises, examples, and practice. Learn when and how to use Future Perfect correctly.",
        loadContent: () =>
            import("@/content/grammar/future-perfect").then((m) => m.futurePerfectContent),
    },
    "future-perfect-continuous": {
        activityTitle: "Future Perfect Continuous Guide",
        metaTitle: "Future Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Future Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Future Perfect Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/future-perfect-continuous").then((m) => m.futurePerfectContinuousContent),
    },
    "future-perfect-family": {
        activityTitle: "Future Perfect Family Guide",
        metaTitle: "Future Perfect Family Guide | ESOL Teacher Resources",
        metaDescription: "Concise comparison of Future Perfect Simple and Continuous to help learners spot the result vs duration clues.",
        loadContent: () =>
            import("@/content/grammar/future-perfect-family").then((m) => m.futurePerfectFamilyContent),
    },
    "future-simple": {
        activityTitle: "Future Simple Guide",
        metaTitle: "Future Simple - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Future Simple tense with exercises, examples, and practice. Learn when and how to use Future Simple correctly.",
        loadContent: () =>
            import("@/content/grammar/future-simple").then((m) => m.futureSimpleContent),
    },
    "gerunds-infinitives": {
        activityTitle: "Gerunds & Infinitives Guide",
        metaTitle: "Gerunds & Infinitives Patterns | ESOL Teacher Resources",
        metaDescription: "Master the six core gerund and infinitive patterns with guided explanations, examples, and practice questions to avoid common mistakes.",
        loadContent: () =>
            import("@/content/grammar/gerunds-infinitives").then((m) => m.gerundsInfinitivesContent),
    },
    "gerunds-infinitives-full-review": {
        activityTitle: "Gerunds + Infinitives: Full Review",
        metaTitle: "Gerunds + Infinitives: Full Review - Interactive Guide | Class Companion",
        metaDescription: "Review gerunds after prepositions, infinitives after verbs, gerund verbs, and meaning-change pairs through one packed survival week with Marisol.",
        loadContent: () =>
            import("@/content/grammar/gerunds-infinitives-full-review").then((m) => m.gerundsInfinitivesFullReviewContent),
    },
    "getting-there-directions": {
        activityTitle: "Getting There: Directions + Imperatives",
        metaTitle: "Getting There: Directions + Imperatives - Interactive Guide | Class Companion",
        metaDescription: "Learn affirmative and negative imperatives plus prepositions of location to give and follow directions in your neighborhood.",
        loadContent: () =>
            import("@/content/grammar/getting-there-directions").then((m) => m.gettingThereDirectionsContent),
    },
    "have-to-dont-have-to-cant": {
        activityTitle: "Have to, Don't Have to, Can't",
        metaTitle: "Have to, Don't Have to, Can't - Interactive Guide | Class Companion",
        metaDescription: "Learn obligation and prohibition modals through real tenant rights scenarios in East Boston.",
        loadContent: () =>
            import("@/content/grammar/have-to-dont-have-to-cant").then((m) => m.haveToDontHaveToCantContent),
    },
    "have-you-ever": {
        activityTitle: "Have You Ever...?",
        metaTitle: "Have You Ever...? - Interactive Guide | Class Companion",
        metaDescription: "Learn to use 'Have you ever...?' for life experiences, contrast it with past simple, and practice short answers in real East Boston community situations.",
        loadContent: () =>
            import("@/content/grammar/have-you-ever").then((m) => m.haveYouEverContent),
    },
    "how-long-for-since": {
        activityTitle: "How Long + For and Since",
        metaTitle: "How Long + For and Since - Interactive Guide | Class Companion",
        metaDescription: "Learn to talk about duration using the present perfect with 'for' and 'since' in real East Boston situations: leases, jobs, phone plans, and the holiday season.",
        loadContent: () =>
            import("@/content/grammar/how-long-for-since").then((m) => m.howLongForSinceContent),
    },
    "how-much-how-many": {
        activityTitle: "How Much / How Many: Countable + Uncountable",
        metaTitle: "How Much / How Many: Countable + Uncountable - Interactive Guide | Class Companion",
        metaDescription: "Learn to use much, many, a lot of, a few, and a little when shopping on a budget and feeding a family.",
        loadContent: () =>
            import("@/content/grammar/how-much-how-many").then((m) => m.howMuchHowManyContent),
    },
    "i-used-to-but-now-i": {
        activityTitle: "I Used to, but Now I...",
        metaTitle: "I Used to, but Now I... - Interactive Guide | Class Companion",
        metaDescription: "Learn used to and didn't use to for past habits that changed, through a life-before-and-after-Boston scenario.",
        loadContent: () =>
            import("@/content/grammar/i-used-to-but-now-i").then((m) => m.iUsedToButNowIContent),
    },
    "imperatives-declaratives": {
        activityTitle: "Imperatives vs Declaratives Guide",
        metaTitle: "Imperatives vs Declaratives - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Understand the difference between commands (imperatives) and statements (declaratives). Master tone and politeness in medical and professional communication.",
        loadContent: () =>
            import("@/content/grammar/imperatives-declaratives").then((m) => m.imperativesDeclarativesContent),
    },
    "information-questions": {
        activityTitle: "Information Questions Guide",
        metaTitle: "Information Questions - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master WH-questions in English: who, what, when, where, why, how. Learn question word order, how much vs how many, and essential housing and workplace questions for real-life situations.",
        loadContent: () =>
            import("@/content/grammar/information-questions").then((m) => m.informationQuestionsContent),
    },
    "it-was-happening-when": {
        activityTitle: "It Was Happening When: Past Tenses in Housing Stories",
        metaTitle: "It Was Happening When: Past Tenses in Housing Stories - Interactive Guide | Class Companion",
        metaDescription: "Practice past simple and past continuous in a real housing emergency — pipe burst at midnight, telling the landlord what was happening.",
        loadContent: () =>
            import("@/content/grammar/it-was-happening-when").then((m) => m.itWasHappeningWhenContent),
    },
    "ive-been-working": {
        activityTitle: "I've Been Working: Present Perfect Continuous",
        metaTitle: "I've Been Working: Present Perfect Continuous - Interactive Guide | Class Companion",
        metaDescription: "Learn the Present Perfect Continuous with real workplace scenes: construction sites, bus stops, hotel housekeeping, and job fairs.",
        loadContent: () =>
            import("@/content/grammar/ive-been-working").then((m) => m.iveBeenWorkingContent),
    },
    "just-already-yet": {
        activityTitle: "Just, Already, Yet",
        metaTitle: "Just, Already, Yet - Interactive Guide | Class Companion",
        metaDescription: "Learn the meaning and placement of just, already, and yet in everyday English — running errands, checking a to-do list, and talking with neighbors in East Boston.",
        loadContent: () =>
            import("@/content/grammar/just-already-yet").then((m) => m.justAlreadyYetContent),
    },
    "lets-make-a-suggestion": {
        activityTitle: "Let's Make a Suggestion",
        metaTitle: "Let's Make a Suggestion - Interactive Guide | Class Companion",
        metaDescription: "Learn how to make suggestions in English using let's, could, should, and why don't we in real workplace and housing situations.",
        loadContent: () =>
            import("@/content/grammar/lets-make-a-suggestion").then((m) => m.letsMakeASuggestionContent),
    },
    "medical-instructions-complete": {
        activityTitle: "Medical Instructions: Modals, Imperatives & Declaratives",
        metaTitle: "Medical Instructions: Modals, Imperatives & Declaratives | ESOL Teacher Resources",
        metaDescription: "Interactive healthcare English guide: imperatives on labels, declaratives in the exam room, modals for advice and permission, and tone in real clinic scenes.",
        loadContent: () =>
            import("@/content/grammar/medical-instructions-complete").then((m) => m.medicalInstructionsCompleteContent),
    },
    "medicine-labels-insurance": {
        activityTitle: "Medicine Labels & Insurance Cards Guide",
        metaTitle: "Medicine Labels & Insurance Cards | ESOL Teacher Resources",
        metaDescription: "Interactive healthcare English guide for reading medicine labels, dosage warnings, pharmacy questions, insurance cards, and common U.S. insurance terms.",
        loadContent: () =>
            import("@/content/grammar/medicine-labels-insurance").then((m) => m.medicineLabelsInsuranceContent),
    },
    "modals-health-advice-caution-consent": {
        activityTitle: "Modals for Health: Advice, Caution & Consent Guide",
        metaTitle: "Modals for Health: Advice, Caution & Consent - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master health modals: should/shouldn't (advice), must/must not (caution), can/may/are allowed to (consent). Learn to follow medical instructions, understand warnings, and exercise patient rights.",
        loadContent: () =>
            import("@/content/grammar/modals-health-advice-caution-consent").then((m) => m.modalsHealthAdviceCautionConsentContent),
    },
    "modals-obligation-permission": {
        activityTitle: "Modals for Obligation & Permission Guide",
        metaTitle: "Modals for Obligation & Permission - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master workplace modals: must, have to, can, may, could, should. Learn politeness levels for professional requests, permission, and obligations with real workplace examples.",
        loadContent: () =>
            import("@/content/grammar/modals-obligation-permission").then((m) => m.modalsObligationPermissionContent),
    },
    "more-less-the-most": {
        activityTitle: "More, Less, the Most: Comparatives + Superlatives",
        metaTitle: "More, Less, the Most: Comparatives + Superlatives - Interactive Guide | Class Companion",
        metaDescription: "Compare prices, phone plans, and apartment listings using comparatives and superlatives in real East Boston situations.",
        loadContent: () =>
            import("@/content/grammar/more-less-the-most").then((m) => m.moreLessTheMostContent),
    },
    "must-have-to-should-at-work": {
        activityTitle: "Must, Have to, Should at Work",
        metaTitle: "Must, Have to, Should at Work - Interactive Guide | Class Companion",
        metaDescription: "Learn when to use must, have to, and should for workplace rules, employer requirements, and job advice.",
        loadContent: () =>
            import("@/content/grammar/must-have-to-should-at-work").then((m) => m.mustHaveToShouldAtWorkContent),
    },
    "need-to-find-a-place-infinitives": {
        activityTitle: "I Need to Find a Place: Infinitives",
        metaTitle: "I Need to Find a Place: Infinitives - Interactive Guide | Class Companion",
        metaDescription: "Learn infinitives after want, need, hope, plan, and would like — in a real housing search scenario.",
        loadContent: () =>
            import("@/content/grammar/need-to-find-a-place-infinitives").then((m) => m.needToFindAPlaceInfinitivesContent),
    },
    "paragraph-format": {
        activityTitle: "Paragraph Format Guide",
        metaTitle: "Paragraph Format - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master paragraph structure: topic sentence, supporting details, and conclusion. Essential for academic and professional writing.",
        loadContent: () =>
            import("@/content/grammar/paragraph-format").then((m) => m.paragraphFormatContent),
    },
    "parts-of-speech": {
        activityTitle: "Parts of Speech Guide",
        metaTitle: "Parts of Speech - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master the building blocks of English: nouns, verbs, adjectives, and adverbs. Learn to identify and use parts of speech with color-coding and real-world examples for adult learners.",
        loadContent: () =>
            import("@/content/grammar/parts-of-speech").then((m) => m.partsOfSpeechContent),
    },
    "passive-voice": {
        activityTitle: "Passive Voice Guide",
        metaTitle: "Passive Voice - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master passive voice (is/are/was/were + past participle) for understanding medical instructions, clinic procedures, and formal communication.",
        loadContent: () =>
            import("@/content/grammar/passive-voice").then((m) => m.passiveVoiceContent),
    },
    "passive-voice-what-was-done": {
        activityTitle: "Passive Voice: What Was Done",
        metaTitle: "Passive Voice: What Was Done - Interactive Guide | Class Companion",
        metaDescription: "Learn passive voice in English using real workplace scenarios: job ads, first-day paperwork, and schedule changes.",
        loadContent: () =>
            import("@/content/grammar/passive-voice-what-was-done").then((m) => m.passiveVoiceWhatWasDoneContent),
    },
    "past-continuous": {
        activityTitle: "Past Continuous Guide",
        metaTitle: "Past Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Past Continuous tense with exercises, examples, and practice. Learn when and how to use Past Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/past-continuous").then((m) => m.pastContinuousContent),
    },
    "past-perfect": {
        activityTitle: "Past Perfect: What Had Already Happened",
        metaTitle: "Past Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Past Perfect tense with exercises, examples, and practice. Master the time machine for understanding sequences of past events with real-world examples from housing, travel, and everyday life.",
        loadContent: () =>
            import("@/content/grammar/past-perfect").then((m) => m.pastPerfectContent),
    },
    "past-perfect-continuous": {
        activityTitle: "Past Perfect Continuous Guide",
        metaTitle: "Past Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Past Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Past Perfect Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/past-perfect-continuous").then((m) => m.pastPerfectContinuousContent),
    },
    "past-perfect-family": {
        activityTitle: "Past Perfect Family Guide",
        metaTitle: "Past Perfect Family Guide | ESOL Teacher Resources",
        metaDescription: "Short guide that pairs Past Perfect Simple with Past Perfect Continuous to show which action happened first and how long it lasted.",
        loadContent: () =>
            import("@/content/grammar/past-perfect-family").then((m) => m.pastPerfectFamilyContent),
    },
    "past-simple": {
        activityTitle: "Past Simple Guide",
        metaTitle: "Past Simple - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Past Simple tense with exercises, examples, and practice. Learn when and how to use Past Simple correctly.",
        loadContent: () =>
            import("@/content/grammar/past-simple").then((m) => m.pastSimpleContent),
    },
    "past-simple-past-continuous": {
        activityTitle: "Past Simple + Past Continuous: Telling the Story",
        metaTitle: "Past Simple + Past Continuous: Telling the Story - Interactive Grammar Guide | Class Companion",
        metaDescription: "Learn past simple for finished actions and past continuous for what was in progress. Practice with when, while, and real East Boston commute stories.",
        loadContent: () =>
            import("@/content/grammar/past-simple-past-continuous").then((m) => m.pastSimplePastContinuousContent),
    },
    "perfect-continuous-tenses-review": {
        activityTitle: "Perfect Continuous Tenses Review - Complete Guide",
        metaTitle: "Perfect Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Comprehensive review of Present Perfect Continuous, Past Perfect Continuous, and Future Perfect Continuous tenses with practice exercises.",
        loadContent: () =>
            import("@/content/grammar/perfect-continuous-tenses-review").then((m) => m.perfectContinuousTensesReviewContent),
    },
    "perfect-tenses-review": {
        activityTitle: "Perfect Tenses Review - Complete Guide",
        metaTitle: "Perfect Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Comprehensive review of Present Perfect, Past Perfect, and Future Perfect tenses with commonly confused tense comparisons and practice exercises.",
        loadContent: () =>
            import("@/content/grammar/perfect-tenses-review").then((m) => m.perfectTensesReviewContent),
    },
    "phrasal-verbs-at-work": {
        activityTitle: "Phrasal Verbs at Work",
        metaTitle: "Phrasal Verbs at Work - Interactive Grammar Guide | Class Companion",
        metaDescription: "Learn essential workplace phrasal verbs: clock in, fill out, call in sick, cover for, hand in, and more. Real work scenarios for ESOL learners.",
        loadContent: () =>
            import("@/content/grammar/phrasal-verbs-at-work").then((m) => m.phrasalVerbsAtWorkContent),
    },
    "prepositions-time-place": {
        activityTitle: "Prepositions of Time & Place Guide",
        metaTitle: "Prepositions of Time & Place - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master time and place prepositions for housing, transportation, and health contexts so directions and schedules stay clear.",
        loadContent: () =>
            import("@/content/grammar/prepositions-time-place").then((m) => m.prepositionsTimePlaceContent),
    },
    "present-continuous": {
        activityTitle: "Present Continuous Guide",
        metaTitle: "Present Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Present Continuous tense with exercises, examples, and practice. Learn when and how to use Present Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/present-continuous").then((m) => m.presentContinuousContent),
    },
    "present-perfect": {
        activityTitle: "Present Perfect Guide",
        metaTitle: "Present Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Present Perfect tense with exercises, examples, and practice. Learn when and how to use Present Perfect correctly.",
        loadContent: () =>
            import("@/content/grammar/present-perfect").then((m) => m.presentPerfectContent),
    },
    "present-perfect-continuous": {
        activityTitle: "Present Perfect Continuous Guide",
        metaTitle: "Present Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Present Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Present Perfect Continuous correctly.",
        loadContent: () =>
            import("@/content/grammar/present-perfect-continuous").then((m) => m.presentPerfectContinuousContent),
    },
    "present-perfect-family": {
        activityTitle: "Present Perfect Family Guide",
        metaTitle: "Present Perfect Family Guide | ESOL Teacher Resources",
        metaDescription: "Streamlined guide that pairs Present Perfect Simple and Continuous for quick comparison and practice.",
        loadContent: () =>
            import("@/content/grammar/present-perfect-family").then((m) => m.presentPerfectFamilyContent),
    },
    "present-perfect-how-long": {
        activityTitle: "Present Perfect + How Long",
        metaTitle: "Present Perfect + How Long - Interactive Grammar Guide | Class Companion",
        metaDescription: "Learn how to use Present Perfect with 'How long', for, and since in job interviews and real work conversations.",
        loadContent: () =>
            import("@/content/grammar/present-perfect-how-long").then((m) => m.presentPerfectHowLongContent),
    },
    "present-simple": {
        activityTitle: "Present Simple Guide",
        metaTitle: "Present Simple - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Present Simple tense with exercises, examples, and practice. Learn when and how to use Present Simple correctly.",
        loadContent: () =>
            import("@/content/grammar/present-simple").then((m) => m.presentSimpleContent),
    },
    "punctuation-capitalization": {
        activityTitle: "Punctuation & Capitalization Guide",
        metaTitle: "Punctuation & Capitalization - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master punctuation and capitalization rules for professional writing. Learn commas, apostrophes, quotation marks, and capital letters.",
        loadContent: () =>
            import("@/content/grammar/punctuation-capitalization").then((m) => m.punctuationCapitalizationContent),
    },
    "questions-real-answers": {
        activityTitle: "Questions That Get Real Answers",
        metaTitle: "Questions That Get Real Answers - Interactive Guide | Class Companion",
        metaDescription: "Learn how to form information questions with who, what, where, when, why, and how in real East Boston conversations.",
        loadContent: () =>
            import("@/content/grammar/questions-real-answers").then((m) => m.questionsRealAnswersContent),
    },
    "reported-speech": {
        activityTitle: "Reported Speech Guide",
        metaTitle: "Reported Speech - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Healthcare-themed reported speech (indirect speech): follow a clinic day with photos, dialogues, and mixed practice for MyChart, reception, exam rooms, pharmacy, and discharge. Say vs tell, tense backshift, and commands.",
        loadContent: () =>
            import("@/content/grammar/reported-speech").then((m) => m.reportedSpeechContent),
    },
    "second-conditional-what-would-you-do": {
        activityTitle: "Second Conditional: What Would You Do?",
        metaTitle: "Second Conditional: What Would You Do? - Interactive Grammar Guide | Class Companion",
        metaDescription: "Learn the second conditional with real workplace scenarios. Practice 'If I had a car, I would take the early shift' and give advice with 'If I were you...'",
        loadContent: () =>
            import("@/content/grammar/second-conditional-what-would-you-do").then((m) => m.secondConditionalWhatWouldYouDoContent),
    },
    "should-shouldnt-health-advice": {
        activityTitle: "You Should, You Shouldn't: Health Advice",
        metaTitle: "You Should, You Shouldn't: Health Advice - Interactive Guide | Class Companion",
        metaDescription: "Learn advice modals — should, shouldn't, ought to, and had better — through a real clinic visit scenario.",
        loadContent: () =>
            import("@/content/grammar/should-shouldnt-health-advice").then((m) => m.shouldShouldntHealthAdviceContent),
    },
    "simple-tenses-review": {
        activityTitle: "Simple Tenses Review",
        metaTitle: "Simple Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Complete interactive guide to Simple Tenses Review tense with exercises, examples, and practice. Learn when and how to use Simple Tenses Review correctly.",
        loadContent: () =>
            import("@/content/grammar/simple-tenses-review").then((m) => m.simpleTensesReviewContent),
    },
    "stop-taking-or-stop-to-take": {
        activityTitle: "Stop Taking It or Stop to Take It?",
        metaTitle: "Stop Taking It or Stop to Take It? - Interactive Guide | Class Companion",
        metaDescription: "Master meaning-change verb pairs: stop doing vs. stop to do, try doing vs. try to do, remember doing vs. remember to do — using real pharmacy scenarios.",
        loadContent: () =>
            import("@/content/grammar/stop-taking-or-stop-to-take").then((m) => m.stopTakingOrStopToTakeContent),
    },
    "superlatives-quantifiers": {
        activityTitle: "Superlatives & Quantifiers Guide",
        metaTitle: "Superlatives & Quantifiers - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master comparisons and quantities in English: superlatives (most/least/-est), quantifiers (many/much, few/little, fewer/less). Learn to compare apartments, jobs, and make better decisions with clear examples.",
        loadContent: () =>
            import("@/content/grammar/superlatives-quantifiers").then((m) => m.superlativesQuantifiersContent),
    },
    "third-conditional-what-would-have-happened": {
        activityTitle: "Third Conditional: What Would Have Happened",
        metaTitle: "Third Conditional: What Would Have Happened - Interactive Guide | Class Companion",
        metaDescription: "Learn third conditional for past regrets through a real health and missed-shifts scenario.",
        loadContent: () =>
            import("@/content/grammar/third-conditional-what-would-have-happened").then((m) => m.thirdConditionalWhatWouldHaveHappenedContent),
    },
    "used-to-would-rather": {
        activityTitle: "Used To & Would Rather Guide",
        metaTitle: "Used To & Would Rather - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master past habits with 'used to' and 'would', and express preferences with 'would rather'. Essential for discussing health changes, work history, and lifestyle goals.",
        loadContent: () =>
            import("@/content/grammar/used-to-would-rather").then((m) => m.usedToWouldRatherContent),
    },
    "verb-forms-overview": {
        activityTitle: "Verb Forms: V1 → V3",
        metaTitle: "Verb Forms: V1 → V3 - Interactive Guide | Class Companion",
        metaDescription: "Learn the five verb form codes (V1, V1-3rd, V1-ing, V2, V3) used on weekly verb quizzes. Quick intro before your first quiz.",
        loadContent: () =>
            import("@/content/grammar/verb-forms-overview").then((m) => m.verbFormsOverviewContent),
    },
    "welcome-back-tenses-review": {
        activityTitle: "Welcome Back: Simple & Continuous Review + V3 Preview",
        metaTitle: "Welcome Back: Tenses Review - Interactive Guide | Class Companion",
        metaDescription: "Review present and past simple and continuous tenses, then get a first look at V3 — the form you'll learn more about this year.",
        loadContent: () =>
            import("@/content/grammar/welcome-back-tenses-review").then((m) => m.welcomeBackTensesReviewContent),
    },
    "what-are-you-good-at": {
        activityTitle: "What Are You Good At?",
        metaTitle: "What Are You Good At? - Interactive Guide | Class Companion",
        metaDescription: "Learn gerunds after prepositions — good at, interested in, tired of, afraid of — through real job scenarios in East Boston.",
        loadContent: () =>
            import("@/content/grammar/what-are-you-good-at").then((m) => m.whatAreYouGoodAtContent),
    },
    "workplace-phrasal-verbs": {
        activityTitle: "Workplace Phrasal Verbs Guide",
        metaTitle: "Workplace Phrasal Verbs - Interactive Grammar Guide | ESOL Teacher Resources",
        metaDescription: "Master essential workplace phrasal verbs: clock in/out, fill out forms, call back, cover for, and more. Learn the secret language of professional communication.",
        loadContent: () =>
            import("@/content/grammar/workplace-phrasal-verbs").then((m) => m.workplacePhrasalVerbsContent),
    },
    "your-week-in-english": {
        activityTitle: "Your Week in English",
        metaTitle: "Your Week in English - Interactive Guide | Class Companion",
        metaDescription: "Learn adverbs of frequency, present simple for routines, and time expressions to talk about your weekly schedule in English.",
        loadContent: () =>
            import("@/content/grammar/your-week-in-english").then((m) => m.yourWeekInEnglishContent),
    },
    "zero-first-conditional": {
        activityTitle: "Zero + First Conditional: If This, Then That",
        metaTitle: "Zero + First Conditional: If This, Then That - Interactive Guide | Class Companion",
        metaDescription: "Learn Zero and First Conditionals through real workplace scenarios: shift rules, pay policies, and holiday overtime decisions.",
        loadContent: () =>
            import("@/content/grammar/zero-first-conditional").then((m) => m.zeroFirstConditionalContent),
    },
};

export const grammarGuideSlugs = Object.keys(grammarGuides).sort();

export function getGrammarGuide(slug: string): GrammarGuideEntry | null {
    return grammarGuides[slug] ?? null;
}
