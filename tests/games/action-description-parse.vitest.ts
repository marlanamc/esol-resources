import { describe, expect, it } from "vitest";
import {
    detectMatchingGameMode,
    parseActionDescriptionRounds,
    parseVocabPairs,
} from "@/components/games/matching-game-parse";

const ACTION_DESCRIPTION_CONTENT = `[ROUND 1]
work :: Action - Something you DO. Use the verb by itself. :: She *works* at the hospital.
tired :: Description - A feeling, not an action. Use am / is / are. :: I *am* tired.

[ROUND 2]
NOTE: Tricky round! These are feelings, but they are still verbs.
know :: Action - "Know" happens in your head, but it is still a verb. Never BE. :: I *know* her name.
hungry :: Description - Careful! In English you ARE hungry. :: I *am* hungry.
`;

const COUNTABLE_CONTENT = `[ROUND 1]
phone :: Countable - you can count them (1 phone, 2 phones)
water :: Uncountable - a group word. You can't count it
`;

const TIME_INDICATOR_CONTENT = `[ROUND 1]
yesterday :: Specified - A specific past day. Use Past Simple.
ever :: Unspecified - At any time in your life. Use Present Perfect.
`;

const VERB_SOUNDS_RIGHT_CONTENT = `[ROUND 1]
She _____ to work every day. :: drives :: drive :: present-simple :: Third person singular takes -s.
`;

describe("detectMatchingGameMode", () => {
    it("detects the action/description sorting game", () => {
        expect(detectMatchingGameMode(ACTION_DESCRIPTION_CONTENT)).toBe("action-description");
    });

    it("still detects the other sorting modes", () => {
        expect(detectMatchingGameMode(COUNTABLE_CONTENT)).toBe("countable");
        expect(detectMatchingGameMode(TIME_INDICATOR_CONTENT)).toBe("time-indicators");
        expect(detectMatchingGameMode(VERB_SOUNDS_RIGHT_CONTENT)).toBe("verb-sounds-right");
    });

    it("does not treat three-field action lines as verb-sounds-right", () => {
        // Action/description lines also have three "::" fields, but no blank.
        expect(detectMatchingGameMode(ACTION_DESCRIPTION_CONTENT)).not.toBe("verb-sounds-right");
    });

    it("falls back to vocab without round markers", () => {
        expect(
            detectMatchingGameMode("work :: Action - Something you DO. :: She *works* here.")
        ).toBe("vocab");
    });
});

describe("parseActionDescriptionRounds", () => {
    const rounds = parseActionDescriptionRounds(ACTION_DESCRIPTION_CONTENT);

    it("splits into rounds and keeps every card", () => {
        expect(rounds).toHaveLength(2);
        expect(rounds[0].roundNumber).toBe(1);
        expect(rounds[0].words).toHaveLength(2);
        expect(rounds[1].words).toHaveLength(2);
    });

    it("keeps all three fields, including the sentence", () => {
        const [action, description] = rounds[0].words;

        expect(action.word).toBe("work");
        expect(action.category).toBe("action");
        expect(action.sentence).toBe("She *works* at the hospital.");

        expect(description.word).toBe("tired");
        expect(description.category).toBe("description");
        expect(description.sentence).toBe("I *am* tired.");
    });

    it("strips the category prefix from the explanation", () => {
        expect(rounds[0].words[0].explanation).toBe(
            "Something you DO. Use the verb by itself."
        );
        expect(rounds[0].words[1].explanation).toBe(
            "A feeling, not an action. Use am / is / are."
        );
    });

    it("captures a NOTE line as the round banner", () => {
        expect(rounds[0].note).toBeUndefined();
        expect(rounds[1].note).toBe(
            "Tricky round! These are feelings, but they are still verbs."
        );
    });

    it("sorts state verbs into the action bucket", () => {
        const know = rounds[1].words.find((w) => w.word === "know");
        expect(know?.category).toBe("action");
        expect(know?.sentence).toBe("I *know* her name.");
    });

    it("assigns ids that stay unique across rounds", () => {
        const ids = rounds.flatMap((round) => round.words.map((word) => word.id));
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("returns no rounds for unrelated content", () => {
        expect(parseActionDescriptionRounds("")).toEqual([]);
    });
});

describe("parseVocabPairs", () => {
    it("skips action/description sorting lines", () => {
        expect(parseVocabPairs(ACTION_DESCRIPTION_CONTENT)).toEqual([]);
    });

    it("still parses real vocab pairs", () => {
        expect(parseVocabPairs("doctor :: a person who treats sick people")).toEqual([
            { id: 1, term: "doctor", definition: "a person who treats sick people" },
        ]);
    });
});
