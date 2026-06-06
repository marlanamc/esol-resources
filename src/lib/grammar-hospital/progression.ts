import type { GrammarHospitalCase, GrammarHospitalErrorTag, GrammarHospitalHelper } from "@/types/activity";

/** Teaching order — most common beginner errors first. */
export const DIAGNOSE_TAG_ORDER: GrammarHospitalErrorTag[] = [
    "wrong-helper",
    "verb-form",
    "missing-word",
    "extra-word",
    "word-order",
];

const PRIMARY_HELPERS = new Set<GrammarHospitalHelper>([
    "do",
    "does",
    "be",
    "am",
    "is",
    "are",
]);

function hasObviousGap(unhealthy: string): boolean {
    return /_{2,}|___/.test(unhealthy);
}

/** Skip abstract "what's wrong?" when the gap is visible or the fix is pick-a-helper. */
export function shouldSkipDiagnose(caseItem: GrammarHospitalCase): boolean {
    if (hasObviousGap(caseItem.unhealthy)) return true;

    const complexity = caseItem.complexity ?? 3;
    const singleTag = caseItem.errorTags.length === 1 ? caseItem.errorTags[0] : null;

    if (singleTag === "wrong-helper" && complexity <= 1) return true;

    if (singleTag === "missing-word" && PRIMARY_HELPERS.has(caseItem.correctHelper)) {
        return true;
    }

    return false;
}

export function getDiagnoseConfig(caseItem: GrammarHospitalCase): {
    tags: GrammarHospitalErrorTag[];
    multiSelect: boolean;
} {
    if (shouldSkipDiagnose(caseItem)) {
        return { tags: [], multiSelect: false };
    }

    const complexity = caseItem.complexity ?? 3;
    const required = caseItem.errorTags;
    const maxOptions =
        complexity <= 2 ? 2 : complexity <= 3 ? 3 : complexity <= 4 ? 4 : 5;
    const multiSelect = complexity >= 4 && required.length > 1;

    const tags: GrammarHospitalErrorTag[] = [...required];
    for (const candidate of DIAGNOSE_TAG_ORDER) {
        if (tags.length >= maxOptions) break;
        if (!tags.includes(candidate)) tags.push(candidate);
    }

    tags.sort(
        (a, b) => DIAGNOSE_TAG_ORDER.indexOf(a) - DIAGNOSE_TAG_ORDER.indexOf(b)
    );

    return { tags, multiSelect };
}

export function sortCasesProgressively(cases: GrammarHospitalCase[]): GrammarHospitalCase[] {
    return [...cases].sort((a, b) => {
        const complexityDelta = (a.complexity ?? 3) - (b.complexity ?? 3);
        if (complexityDelta !== 0) return complexityDelta;
        return a.id.localeCompare(b.id);
    });
}

export function getCaseStepInfo(
    caseItem: GrammarHospitalCase,
    phase: "diagnose" | "helper" | "repair" | "feedback"
): { stepNumber: number; totalSteps: number } {
    const skipDiagnose = shouldSkipDiagnose(caseItem);
    const totalSteps = skipDiagnose ? 2 : 3;

    if (skipDiagnose) {
        if (phase === "helper") return { stepNumber: 1, totalSteps };
        return { stepNumber: 2, totalSteps };
    }

    if (phase === "diagnose") return { stepNumber: 1, totalSteps };
    if (phase === "helper") return { stepNumber: 2, totalSteps };
    return { stepNumber: 3, totalSteps };
}

export function getInitialCasePhase(
    caseItem: GrammarHospitalCase | undefined
): "diagnose" | "helper" {
    return caseItem && shouldSkipDiagnose(caseItem) ? "helper" : "diagnose";
}
