import { describe, expect, it } from "vitest";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";

describe("course map format chips", () => {
    it.each([
        ["game", "flashcards", "Words", "Flash cards"],
        ["game", "matching", "Words", "Match pairs"],
        ["game", "fill-blank", "Words", "Complete sentences"],
        ["game", undefined, "Word Sort: Verbs", "Sort words"],
        ["game", undefined, "Action or Description?", "Game"],
        ["guide", undefined, "Parts of Speech Guide", "Read & practice"],
        ["unknown", undefined, "New activity", "Practice"],
    ])("labels %s / %s / %s as %s", (type, vocabUi, title, expected) => {
        expect(getCourseMapActivityFormat(type, vocabUi, title).label).toBe(expected);
    });

    it("gives named games their own icon and color", () => {
        const tense = getCourseMapActivityFormat("game", undefined, "Tense Path: Timeline Tenses");
        const sound = getCourseMapActivityFormat("game", undefined, "Sound Path: -ed Endings");
        const time = getCourseMapActivityFormat("game", undefined, "Time Words: Which Verb?");
        const other = getCourseMapActivityFormat("game", undefined, "Action or Description?");
        expect(new Set([tense.icon, sound.icon, time.icon, other.icon]).size).toBe(4);
        expect(new Set([tense.tone, sound.tone, time.tone]).size).toBe(3);
    });
});
