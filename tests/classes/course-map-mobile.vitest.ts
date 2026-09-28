import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "node-html-parser";
import { MobileWeekCard } from "@/components/dashboard/course-path/mobile";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { CourseMapMobileWayfinding } from "@/components/dashboard/CourseMapMobileWayfinding";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import type { WeekSummary } from "@/components/dashboard/course-path/shared";

const level: CourseMapUnit["levels"][number] = {
    levelNumber: 2, levelTitle: "Parts of Speech", requiredActivities: [
        { id: "guide", activityId: "guide", title: "Parts of Speech Guide", activityType: "guide", status: "available" },
        { id: "flash", activityId: "flash", title: "Say It & Spell It: Flash Cards", activityType: "game", status: "available", vocabUi: "flashcards" },
        { id: "locked", title: "Later activity", activityType: "quiz", status: "locked" },
    ],
};
const progress: CourseMapProgressState = { guide: { status: "completed", categoryData: null } };
const week: WeekSummary = { unitNumber: 1, unitTitle: "Getting to Know You", unitMonth: "September", level, requiredDone: 1, requiredTotal: 2, hasCurrent: false, isDone: false };
const props = { week, isOpen: true, optionalOpen: false, currentId: "other-week", currentLabel: "Next up" as const, guidedAssignments: {}, guidedProgress: progress, onToggle: () => {}, onToggleOptional: () => {} };

describe("mobile course map", () => {
    it("marks the viewed week's next task even if progress points to an older week", () => {
        const html = parse(renderToStaticMarkup(createElement(MobileWeekCard, props)));
        const links = html.querySelectorAll("a");
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toContain("Done");
        expect(links[0].textContent).toContain("Read");
        expect(links[1].textContent).toContain("Continue");
        expect(links[1].textContent).toContain("Flash cardsNext");
        expect(links[1].getAttribute("href")).toContain("week%3D2");
        expect(html.querySelector('[aria-disabled="true"]')?.textContent).toContain("Locked");
    });

    it("shows no Next marker when all available work is finished", () => {
        const html = parse(renderToStaticMarkup(createElement(MobileWeekCard, {
            ...props, guidedProgress: { ...progress, flash: { status: "completed", categoryData: null } },
        })));
        expect(html.textContent).not.toContain("Next");
    });

    it("offers released weeks in the selector and keeps the hero launch in the viewed week", () => {
        const units: CourseMapUnit[] = [{ unitNumber: 1, unitTitle: "Getting to Know You", month: "September", levels: [level] }];
        const html = parse(renderToStaticMarkup(createElement(CourseMapMobileWayfinding, {
            units, weekProgress: [{ weekNumber: 2, unitNumber: 1, title: level.levelTitle, done: 1, total: 2, isDone: false }],
            currentWeek: { weekNumber: 2, unitNumber: 1, unitMonth: "September", unitTitle: "Getting to Know You" },
            overallPct: 50, completedLevels: 0, totalLevels: 1, guidedProgress: progress, pinnedWeekNumber: 2,
        })));
        expect(html.querySelectorAll("option")).toHaveLength(1);
        expect(html.querySelector("option")?.textContent).toContain("This week");
        expect(html.querySelector("a")?.textContent).toContain("Say It & Spell It: Flash Cards");
        expect(html.querySelector("a")?.textContent).toContain("Vocab");
        expect(html.querySelector("a")?.getAttribute("href")).toContain("week%3D2");
    });
});


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

    it("shows the next activity once when the header is embedded in the course card", () => {
        const header = renderToStaticMarkup(createElement(CourseMapMobileWayfinding, {
            units: [{ unitNumber: 1, unitTitle: "Getting to Know You", month: "September", levels: [level] }],
            weekProgress: [{ weekNumber: 2, unitNumber: 1, title: level.levelTitle, done: 0, total: 2, isDone: false }],
            currentWeek: { weekNumber: 2, unitNumber: 1, unitMonth: "September", unitTitle: "Getting to Know You" },
            overallPct: 0, completedLevels: 0, totalLevels: 1, embedded: true, pinnedWeekNumber: 2,
        }));
        const rows = renderToStaticMarkup(createElement(MobileWeekCard, { ...props, guidedProgress: {} }));
        const html = parse(header + rows);
        expect(html.querySelectorAll("a")).toHaveLength(2);
        expect(html.querySelectorAll("a").filter((link) => link.textContent.includes("Parts of Speech Guide"))).toHaveLength(1);
        expect(html.textContent).toContain("Work at your own pace. Start with one activity.");
        expect(html.querySelector("a")?.textContent).toContain("Start");
        expect(html.textContent).not.toContain("minutes");
    });
});
