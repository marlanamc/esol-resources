import type { GrammarHospitalCase, GrammarHospitalHelper } from "@/types/activity";

/** Beginner helper-verb choices shown in the picker (replaces generic "be"). */
export const BEGINNER_HELPER_OPTIONS: GrammarHospitalHelper[] = [
    "do",
    "does",
    "am",
    "is",
    "are",
];

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
