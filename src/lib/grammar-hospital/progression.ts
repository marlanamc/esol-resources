import type {
    GrammarHospitalCase,
    GrammarHospitalErrorTag,
    GrammarHospitalFocus,
    GrammarHospitalHelper,
    GrammarHospitalTier,
} from "@/types/activity";

/**
 * The tiles a learner actually gets in build mode.
 *
 * Every shipped word bank ends with a bare '?' or '.' tile, which made terminal
 * punctuation a word to place rather than the grammar being taught. Worse, the
 * Check answer button only enables once the bank is empty, so a forgotten '?'
 * left the learner tapping a disabled button with nothing explaining why.
 * Answer matching ignores punctuation, so the tiles can simply go.
 */
export function toWordTiles(wordBank: readonly string[]): string[] {
    return wordBank.filter((tile) => tile.trim() && /[\p{L}\p{N}]/u.test(tile));
}

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

    if (
        singleTag === "missing-word" &&
        caseItem.correctHelper !== undefined &&
        PRIMARY_HELPERS.has(caseItem.correctHelper)
    ) {
        return true;
    }

    return false;
}

/**
 * Skip the helper step when the case has no helper verb to choose. A missing
 * third-person -s ("She work here.") is a real beginner error with no helper
 * involved; forcing a do/does/is pick there would teach the wrong lesson.
 */
export function shouldSkipHelper(caseItem: GrammarHospitalCase): boolean {
    return caseItem.correctHelper === undefined;
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
    // Repair always runs; feedback shares its number. Either of the other two
    // can be skipped, so build the sequence rather than hard-coding 2 or 3.
    const sequence: Array<"diagnose" | "helper" | "repair"> = [];
    if (!shouldSkipDiagnose(caseItem)) sequence.push("diagnose");
    if (!shouldSkipHelper(caseItem)) sequence.push("helper");
    sequence.push("repair");

    const totalSteps = sequence.length;
    const lookup = phase === "feedback" ? "repair" : phase;
    const idx = sequence.indexOf(lookup);

    return { stepNumber: idx === -1 ? totalSteps : idx + 1, totalSteps };
}

export function getInitialCasePhase(
    caseItem: GrammarHospitalCase | undefined
): "diagnose" | "helper" | "repair" {
    if (!caseItem) return "diagnose";
    if (!shouldSkipDiagnose(caseItem)) return "diagnose";
    if (!shouldSkipHelper(caseItem)) return "helper";
    return "repair";
}

/**
 * Pick `roundSize` cases at random, then order them easiest-first.
 *
 * Sampling before sorting is deliberate: it keeps a round graded gently while
 * varying which cases appear, so replaying an optional practice item is not the
 * same five sentences every time. Returns the whole deck when no size is set or
 * the deck is already small enough.
 */
/**
 * Deal a round that climbs.
 *
 * A flat random draw from a deck spanning several complexity levels can hand a
 * learner five of the same difficulty -- five easy ones teach nothing new, five
 * hard ones stall them on the first case. Dealing round-robin from easiest
 * upwards spans every level present, so after sortCasesProgressively the round
 * opens on the gentlest case available and ends on the hardest.
 */
export function sampleRound(
    cases: GrammarHospitalCase[],
    roundSize?: number
): GrammarHospitalCase[] {
    if (!roundSize || roundSize <= 0 || cases.length <= roundSize) {
        return sortCasesProgressively(cases);
    }

    const byComplexity = new Map<number, GrammarHospitalCase[]>();
    for (const caseItem of cases) {
        const level = caseItem.complexity ?? 3;
        const bucket = byComplexity.get(level);
        if (bucket) bucket.push(caseItem);
        else byComplexity.set(level, [caseItem]);
    }

    const levels = [...byComplexity.keys()].sort((a, b) => a - b);
    for (const level of levels) {
        const bucket = byComplexity.get(level)!;
        for (let i = bucket.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
        }
    }

    const picked: GrammarHospitalCase[] = [];
    while (picked.length < roundSize) {
        let tookOne = false;
        for (const level of levels) {
            if (picked.length >= roundSize) break;
            const next = byComplexity.get(level)!.pop();
            if (!next) continue;
            picked.push(next);
            tookOne = true;
        }
        // Every bucket is empty — the caller asked for more than the deck holds.
        if (!tookOne) break;
    }

    return sortCasesProgressively(picked);
}

export interface DeckFilter {
    tier: GrammarHospitalTier;
    complexity: number;
    focuses: GrammarHospitalFocus[];
}

/**
 * The deck a learner actually sees for a given setting.
 *
 * Each narrowing step widens back if it would leave nothing, so a preset can
 * never strand a learner on an empty round. That fallback is also the trap: a
 * preset whose focuses match too few cases silently serves the whole tier
 * instead, which is how a "focused" round starts feeling like a grab bag.
 * Tests assert that the shipped presets clear the bar without it.
 */
export function filterDeck(
    allCases: GrammarHospitalCase[],
    settings: DeckFilter
): GrammarHospitalCase[] {
    const inTier = allCases.filter((c) => (c.tier ?? "beginner") === settings.tier);
    const inComplexity = inTier.filter((c) => (c.complexity ?? 3) <= settings.complexity);
    const base = inComplexity.length > 0 ? inComplexity : inTier;

    if (settings.focuses.length === 0) return base;

    const narrowed = base.filter((c) => settings.focuses.includes(c.grammarFocus ?? "do-does"));
    return narrowed.length > 0 ? narrowed : base;
}
