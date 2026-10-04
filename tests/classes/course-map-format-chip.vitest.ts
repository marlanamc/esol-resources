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
});
