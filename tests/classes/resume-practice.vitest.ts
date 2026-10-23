import { describe, expect, it } from "vitest";
import { describePractice, pickResumePractice, type PracticeProgressRow } from "@/lib/dashboard/resume-practice";

function row(overrides: Partial<PracticeProgressRow> = {}, ui = "irregular-verbs"): PracticeProgressRow {
    return {
        activityId: "irregular-verbs", assignmentId: null, progress: 25, status: "in_progress",
        categoryData: null, updatedAt: new Date("2026-10-23T12:00:00Z"),
        activity: { title: "Irregular Verbs Pattern Game", type: "game", category: "games", ui, content: "", deletedAt: null, isReleased: true },
        ...overrides,
    };
}

describe("homepage return to practice", () => {
    it("uses real pattern progress rather than inventing a verb count", () => {
        expect(describePractice(row())).toMatchObject({ detail: "25% of patterns unlocked", progress: 25, action: "Continue practicing" });
    });
    it("recognizes unsuccessful but meaningful round attempts at zero percent", () => {
        expect(describePractice(row({ progress: 0, categoryData: JSON.stringify({ first: { attempts: 1, exercisesCompleted: 10, completed: false } }) }))).not.toBeNull();
    });
    it("does not present a visit or initialized groups as practice", () => {
        expect(describePractice(row({ progress: 0, categoryData: JSON.stringify({ first: { attempts: 0, locked: false } }) }))).toBeNull();
        expect(describePractice(row({ progress: 0, categoryData: "broken json" }))).toBeNull();
    });
    it("retains mastery practice after all first rounds have passed", () => {
        expect(describePractice(row({ progress: 100, status: "completed" }))).toMatchObject({ progress: null, detail: "Patterns unlocked · keep building mastery" });
    });
    it("never invents a completion target for free play", () => {
        expect(describePractice(row({ progress: 100, status: "completed" }, "emotion-spin-wheel"))).toMatchObject({ progress: null, action: "Continue playing", detail: "Free play · practice at your own pace" });
    });
    it("makes clear that a saved verb forms round starts a new round", () => {
        expect(describePractice(row({ progress: 100, status: "completed" }, "verb-forms"))).toMatchObject({ progress: null, action: "Play another round", note: "Completed practice saved · new rounds start fresh" });
    });
    it("omits completed finite games and Word Lab's duplicate entry", () => {
        expect(describePractice(row({ progress: 100, status: "completed" }, "matching"))).toBeNull();
        expect(describePractice(row({}, "word-rescue"))).toBeNull();
    });
    it("filters deleted or learner-hidden activities", () => {
        const deleted = row(); deleted.activity.deletedAt = new Date();
        const hidden = row(); hidden.activity.category = "speaking";
        expect(pickResumePractice([deleted, hidden])).toBeNull();
    });
    it("preserves assignment context and returns to the homepage", () => {
        const item = describePractice(row({ assignmentId: "class assignment" }));
        const url = new URL(item!.href, "https://example.test");
        expect(url.searchParams.get("assignment")).toBe("class assignment");
        expect(url.searchParams.get("returnTo")).toBe("/dashboard");
    });
    it("selects the most recent meaningful save, independent of Featured", () => {
        const older = row({ activityId: "older" });
        const recent = row({ activityId: "recent", updatedAt: new Date("2026-10-23T13:00:00Z") });
        expect(pickResumePractice([older, recent])?.href).toContain("/activity/recent?");
    });
    it("does not revive stale incomplete progress after later completion", () => {
        const old = row({}, "matching");
        const latest = row({ progress: 100, status: "completed", updatedAt: new Date("2026-10-23T13:00:00Z") }, "matching");
        expect(pickResumePractice([old, latest])).toBeNull();
    });
    it("hides the section when there is no practice", () => {
        expect(pickResumePractice([])).toBeNull();
    });
    it("prioritizes older unfinished work over a newer completed round", () => {
        const unfinished = row({ activityId: "unfinished" });
        const completed = row({ activityId: "completed", progress: 100, status: "completed", updatedAt: new Date("2026-10-23T14:00:00Z") }, "verb-forms");
        expect(pickResumePractice([completed, unfinished])?.href).toContain("/activity/unfinished?");
    });
    it("uses the newest completed repeatable game only when nothing is unfinished", () => {
        const older = row({ activityId: "older", progress: 100, status: "completed" });
        const newer = row({ activityId: "newer", progress: 100, status: "completed", updatedAt: new Date("2026-10-23T14:00:00Z") }, "verb-forms");
        expect(pickResumePractice([older, newer])?.href).toContain("/activity/newer?");
    });
    it("does not let free play displace a game with unfinished work", () => {
        const freePlay = row({ activityId: "free-play", progress: 20, updatedAt: new Date("2026-10-23T14:00:00Z") }, "emotion-spin-wheel");
        const unfinished = row({ activityId: "unfinished" });
        expect(pickResumePractice([freePlay, unfinished])?.href).toContain("/activity/unfinished?");
        expect(pickResumePractice([freePlay])?.href).toContain("/activity/free-play?");
    });
    it.each([
        { status: "completed", progress: 25 },
        { status: "submitted", progress: 25 },
        { status: "in_progress", progress: 100 },
    ])("respects completion evidence %j instead of reviving older unfinished data", completion => {
        const old = row({ activityId: "same-game" });
        const latest = row({ activityId: "same-game", ...completion, updatedAt: new Date("2026-10-23T14:00:00Z") });
        const unfinished = row({ activityId: "other-game", updatedAt: new Date("2026-10-22T12:00:00Z") });
        expect(pickResumePractice([old, latest, unfinished])?.href).toContain("/activity/other-game?");
    });
});
