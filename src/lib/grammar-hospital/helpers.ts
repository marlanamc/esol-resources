import type { GrammarHospitalCase, GrammarHospitalHelper } from "@/types/activity";

/** Beginner helper-verb choices shown in the picker (replaces generic "be"). */
export const BEGINNER_HELPER_OPTIONS: GrammarHospitalHelper[] = [
    "do",
    "does",
    "am",
    "is",
    "are",
];

/**
 * Plausible distractors per helper, grouped by the confusion they actually
 * target. The picker used to show the beginner five for every case, which left
 * any case needing did/were/have/had/will unanswerable — the correct option was
 * not on screen. Each group keeps the correct helper alongside the helpers a
 * learner realistically reaches for instead.
 */
const HELPER_OPTION_GROUPS: Record<GrammarHospitalHelper, GrammarHospitalHelper[]> = {
    do: ["do", "does", "is", "are"],
    does: ["do", "does", "is", "are"],
    be: ["do", "does", "am", "is", "are"],
    am: ["am", "is", "are", "do"],
    is: ["am", "is", "are", "does"],
    are: ["am", "is", "are", "do"],
    did: ["did", "do", "was", "were"],
    was: ["was", "were", "did", "is"],
    were: ["was", "were", "did", "are"],
    have: ["have", "has", "had", "do"],
    has: ["have", "has", "had", "does"],
    had: ["have", "has", "had", "did"],
    can: ["can", "could", "do", "will"],
    could: ["can", "could", "would", "did"],
    should: ["should", "would", "could", "can"],
    would: ["would", "will", "could", "should"],
    will: ["will", "would", "can", "do"],
};

const SENTENCE_START_HELPER =
    /^(do|does|did|is|are|am|was|were|have|has|had|will|can|could|should|would)\b/i;

/** True when the fixed sentence begins with a helper (e.g. questions). */
export function helperAtSentenceStart(caseItem: GrammarHospitalCase): boolean {
    return SENTENCE_START_HELPER.test(caseItem.healthy.trim());
}

export function formatHelperOptionLabel(
    helper: GrammarHospitalHelper,
    atSentenceStart: boolean
): string {
    if (!atSentenceStart) return helper;
    return helper.charAt(0).toUpperCase() + helper.slice(1);
}

export function resolveCorrectHelper(helper: GrammarHospitalHelper): GrammarHospitalHelper {
    return helper === "be" ? "is" : helper;
}

/**
 * Helper options for a case's picker. Always contains the correct answer —
 * that is the invariant the old BEGINNER_HELPER_OPTIONS-for-everything
 * behaviour violated for every non-beginner case.
 */
export function getHelperOptions(caseItem: GrammarHospitalCase): GrammarHospitalHelper[] {
    if (!caseItem.correctHelper) return [];

    const correct = resolveCorrectHelper(caseItem.correctHelper);

    // Beginner cases keep the familiar five-tile board so the step stays stable
    // across a whole beginner round.
    if ((caseItem.tier ?? "beginner") === "beginner" && BEGINNER_HELPER_OPTIONS.includes(correct)) {
        return BEGINNER_HELPER_OPTIONS;
    }

    const group = HELPER_OPTION_GROUPS[correct] ?? [];
    const options = group.includes(correct) ? group : [correct, ...group];
    return Array.from(new Set(options));
}
