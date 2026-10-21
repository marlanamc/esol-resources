import type {
    SentenceBuilderBlank,
    SentenceBuilderPickRound,
    SentenceBuilderPlaceRound,
    SentenceBuilderRound,
    SentenceBuilderTrueRound,
} from "@/types/activity";

export const DEFAULT_SENTENCE_BUILDER_ROUND_SIZE = 8;

export interface PlaceResult {
    correct: boolean;
    /** "Also correct!" note when the learner chose a less common correct slot. */
    note?: string;
}

/** Every slot counts as correct when it is the main answer or listed in `also`. */
export function checkPlace(round: SentenceBuilderPlaceRound, slot: number): PlaceResult {
    if (slot === round.answer) return { correct: true };
    const alt = round.also?.find((a) => a.slot === slot);
    return alt ? { correct: true, note: alt.note } : { correct: false };
}

/** The sentence's words with `word` inserted at `slot`. */
export function placeWord(round: SentenceBuilderPlaceRound, slot: number): string[] {
    const words = round.words.slice();
    if (slot === 0) {
        const first = words[0];
        if (first && first !== "I" && !first.startsWith("I'")) {
            words[0] = first.charAt(0).toLowerCase() + first.slice(1);
        }
        return [capitalize(round.word), ...words];
    }
    if (slot === words.length) {
        // At the end, the sentence's final punctuation moves onto the new word.
        const last = words[words.length - 1];
        const punct = last.match(/[.!?]+$/)?.[0] ?? "";
        words[words.length - 1] = last.slice(0, last.length - punct.length);
        return [...words, round.word + punct];
    }
    words.splice(slot, 0, round.word);
    return words;
}

export function isBlank(part: string | SentenceBuilderBlank): part is SentenceBuilderBlank {
    return typeof part !== "string";
}

export function blankAccepts(blank: SentenceBuilderBlank, choice: number | undefined): boolean {
    if (choice === undefined) return false;
    return choice === blank.answer || (blank.also ?? []).includes(choice);
}

/**
 * Checks every gap. `selections` is indexed by blank order (0 = first gap).
 * Returns the indexes of the gaps that are wrong or still empty.
 */
export function checkPick(round: SentenceBuilderPickRound, selections: (number | undefined)[]): { correct: boolean; wrong: number[] } {
    const wrong: number[] = [];
    round.parts.filter(isBlank).forEach((blank, i) => {
        if (!blankAccepts(blank, selections[i])) wrong.push(i);
    });
    return { correct: wrong.length === 0, wrong };
}

export function fillTemplate(round: SentenceBuilderTrueRound, choice: string): string {
    return round.template.replace("{choice}", choice);
}

function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function shuffle<T>(arr: readonly T[], random: () => number): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

/**
 * Deals one game: a mix of round kinds (about 3 place, 3 pick, 2 true out of
 * 8), topped up from whatever kinds the deck has. Rule rounds are shuffled
 * together and one "make it true" round always ends the game, so every
 * learner finishes by saying a sentence about themselves.
 */
export function dealRounds(
    rounds: readonly SentenceBuilderRound[],
    size: number = DEFAULT_SENTENCE_BUILDER_ROUND_SIZE,
    random: () => number = Math.random
): SentenceBuilderRound[] {
    const total = Math.min(size, rounds.length);
    const byKind = {
        place: shuffle(rounds.filter((r) => r.kind === "place"), random),
        pick: shuffle(rounds.filter((r) => r.kind === "pick"), random),
        true: shuffle(rounds.filter((r) => r.kind === "true"), random),
    };
    const wantTrue = Math.min(byKind.true.length, Math.max(1, Math.round(total / 4)));
    const wantPlace = Math.min(byKind.place.length, Math.ceil((total - wantTrue) / 2));
    const wantPick = Math.min(byKind.pick.length, total - wantTrue - wantPlace);

    const picked = [
        ...byKind.place.slice(0, wantPlace),
        ...byKind.pick.slice(0, wantPick),
        ...byKind.true.slice(0, wantTrue),
    ];
    const leftovers = shuffle(
        [...byKind.place.slice(wantPlace), ...byKind.pick.slice(wantPick), ...byKind.true.slice(wantTrue)],
        random
    );
    picked.push(...leftovers.slice(0, total - picked.length));

    const ending = picked.filter((r) => r.kind === "true");
    const last = ending.pop();
    const body = shuffle(
        picked.filter((r) => r !== last),
        random
    );
    return last ? [...body, last] : body;
}
