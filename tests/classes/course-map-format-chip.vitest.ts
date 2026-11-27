import { describe, expect, it } from "vitest";
import { Gamepad2 } from "lucide-react";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { COURSE_MAP_UNITS } from "@/lib/course-map-data";
import { formatNextUpActivityTitle } from "@/lib/course-map-hero";

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

    // Every week: no game on the map falls back to the shared gamepad, whether the
    // title is raw or shortened, and different games in a week never look the same.
    const weeks = COURSE_MAP_UNITS.flatMap((unit) => unit.weeks)
        .map((week) => [week.id, week.items.filter((item) => item.activityType === "game" && !item.vocabUi)] as const)
        .filter(([, games]) => games.length > 0);
    it.each(weeks)("gives every game in %s its own look", (_id, games) => {
        const looks = new Map<string, string>();
        for (const game of games) {
            for (const title of [game.title, formatNextUpActivityTitle(game.title)]) {
                expect(getCourseMapActivityFormat("game", undefined, title).icon, title).not.toBe(Gamepad2);
            }
            const format = getCourseMapActivityFormat("game", undefined, game.title);
            // One game family (Word Sort: Nouns / Verbs, Timeline Check / Timeline Tenses) may match.
            looks.set(game.title.split(/[\s:]/)[0].toLowerCase(), `${format.tone}/${format.icon.displayName ?? String(format.icon)}`);
        }
        expect(new Set(looks.values()).size).toBe(looks.size);
    });
});
