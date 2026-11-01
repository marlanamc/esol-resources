import { getQuizVerbSet } from "@/data/verb-quiz-sets";
import { VERB_SPEED_ROUND_POOL } from "@/data/verb-speed-round-pool";
import { v3IsSameAsV2 } from "@/types/verb-speed-round";

export type WeekVerb = {
    v1: string;
    v2: string;
    v3: string;
    /** A verb from an earlier week brought back for review. */
    isReview: boolean;
};

// Quiz verbs that are not in the speed-round pool.
const EXTRA_FORMS: Record<string, [string, string]> = {
    become: ["became", "become"],
    show: ["showed", "shown"],
    forget: ["forgot", "forgotten"],
    let: ["let", "let"],
    win: ["won", "won"],
    quit: ["quit", "quit"],
    steal: ["stole", "stolen"],
    fight: ["fought", "fought"],
    hit: ["hit", "hit"],
};

function formsFor(v1: string): [string, string] | null {
    const pooled = VERB_SPEED_ROUND_POOL.find((verb) => verb.v1 === v1);
    if (pooled) return [pooled.v2, v3IsSameAsV2(pooled.v3) ? pooled.v2 : pooled.v3];
    return EXTRA_FORMS[v1] ?? null;
}

const QUIZ_ID = /^verb-quiz-(\d+)$/;

/** The verbs of the week, from the week's verb quiz (new verbs first, review verb last). */
export function getWeekVerbs(activityIds: string[]): WeekVerb[] {
    const verbs: WeekVerb[] = [];
    for (const id of activityIds) {
        const match = QUIZ_ID.exec(id);
        const set = match ? getQuizVerbSet(Number(match[1])) : null;
        if (!set) continue;
        const entries = [...set.verbs.map((v1) => ({ v1, isReview: false })), ...(set.reviewVerb ? [{ v1: set.reviewVerb, isReview: true }] : [])];
        for (const { v1, isReview } of entries) {
            if (verbs.some((verb) => verb.v1 === v1)) continue;
            const forms = formsFor(v1);
            verbs.push({ v1, v2: forms?.[0] ?? "", v3: forms?.[1] ?? "", isReview });
        }
    }
    return verbs;
}
