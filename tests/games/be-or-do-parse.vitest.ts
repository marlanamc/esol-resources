import { describe, expect, it } from "vitest";
import {
    BE_OR_DO_GROUPS,
    detectMatchingGameMode,
    findBeOrDoGroup,
    parseBeOrDoRounds,
} from "@/components/games/matching-game-parse";
import { BE_OR_DO_CONTENT } from "@/content/games/be-or-do-questions";

const SAMPLE = `GAME: be-or-do

[ROUND 1]
NOTE: Find the verb.
___ you tired? :: Are :: reply: Yes, I am. :: hint: No verb.
___ you feel tired? :: Do :: verb: feel :: twin: Are you tired? :: why: Feel is a verb.
___ you happy? :: Was :: reply: unknown form, skipped
no blank here :: Do

[ROUND 2]
MODE: form
How old ___ you? :: are :: context: A form.
`;

describe("Be or Do? detection", () => {
    it("detects the GAME marker", () => {
        expect(detectMatchingGameMode(SAMPLE)).toBe("be-or-do");
        expect(detectMatchingGameMode(BE_OR_DO_CONTENT)).toBe("be-or-do");
    });

    it("does not claim other sorting games", () => {
        const verbSoundsRight = `[ROUND 1]\nShe _____ happy. :: is :: are :: present-simple :: She takes is.\n`;
        expect(detectMatchingGameMode(verbSoundsRight)).toBe("verb-sounds-right");
        expect(parseBeOrDoRounds(verbSoundsRight)).toEqual([]);
    });
});

describe("parseBeOrDoRounds", () => {
    const rounds = parseBeOrDoRounds(SAMPLE);

    it("reads rounds, notes, and modes", () => {
        expect(rounds).toHaveLength(2);
        expect(rounds[0]).toMatchObject({ roundNumber: 1, mode: "group", note: "Find the verb." });
        expect(rounds[1]).toMatchObject({ roundNumber: 2, mode: "form" });
    });

    it("keeps keyed fields and maps the answer to its family", () => {
        const [tired, feelTired] = rounds[0].cards;
        expect(tired).toMatchObject({ answer: "Are", groupId: "be", reply: "Yes, I am.", hint: "No verb." });
        expect(feelTired).toMatchObject({ answer: "Do", groupId: "do", verb: "feel", twin: "Are you tired?" });
        expect(rounds[1].cards[0]).toMatchObject({ answer: "are", groupId: "be", context: "A form." });
    });

    it("skips unknown forms and lines without a blank", () => {
        expect(rounds[0].cards).toHaveLength(2);
    });
});

describe("Week 5 Be or Do? content", () => {
    const rounds = parseBeOrDoRounds(BE_OR_DO_CONTENT);
    const cards = rounds.flatMap((r) => r.cards);
    const cardLines = BE_OR_DO_CONTENT.split("\n").filter((line) => line.includes("::"));

    it("has two BE-or-DO rounds, then a pick-the-form round", () => {
        expect(rounds.map((r) => r.mode)).toEqual(["group", "group", "form"]);
    });

    it("parses every card line", () => {
        expect(cards).toHaveLength(cardLines.length);
    });

    it("gives every card one blank, a reply, a reason, and a hint", () => {
        for (const card of cards) {
            expect(card.question.match(/___/g), card.question).toHaveLength(1);
            expect(card.reply, card.question).toBeTruthy();
            expect(card.why, card.question).toBeTruthy();
            expect(card.hint, card.question).toBeTruthy();
        }
    });

    it("only underlines verbs that are in the question", () => {
        for (const card of cards.filter((c) => c.verb)) {
            expect(card.question.replace("___", ""), card.question).toContain(card.verb);
        }
    });

    it("puts each twin right after its partner, with the other helper", () => {
        for (const round of rounds) {
            round.cards.forEach((card, i) => {
                if (!card.twin) return;
                const partner = round.cards[i - 1];
                expect(partner, card.question).toBeDefined();
                const filled = partner.question.replace("___", partner.answer);
                expect(card.twin).toBe(filled);
                expect(findBeOrDoGroup(card.twin.split(" ")[0])?.id).not.toBe(card.groupId);
            });
        }
    });

    it("uses only the BE and DO families for now", () => {
        const used = new Set(cards.map((c) => c.groupId));
        expect([...used].sort()).toEqual(BE_OR_DO_GROUPS.map((g) => g.id).sort());
    });
});
