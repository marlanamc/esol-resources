import { afterEach, describe, expect, it, vi } from "vitest";
import { readCourseMapSessionState, resolveInitialMapOpenWeek } from "@/lib/course-map-session-state";

afterEach(() => vi.unstubAllGlobals());

function rememberedWeek3() {
    vi.stubGlobal("window", {});
    vi.stubGlobal("sessionStorage", {
        getItem: (key: string) => key === "course-map:last-week" ? "3" : "900",
    });
}

const monday = { initialWeek: null, hashWeek: null, progressWeek: 2, restoreSession: false };

describe("map entry selection", () => {
    it("ignores a remembered upcoming week on classroom entry", () => {
        rememberedWeek3();
        expect(readCourseMapSessionState()).toEqual({ week: 3, scrollY: 900 });
        expect(resolveInitialMapOpenWeek(monday)).toBe(2);
    });

    it("honors an explicit activity-return week ahead of the classroom week", () => {
        rememberedWeek3();
        expect(resolveInitialMapOpenWeek({ ...monday, initialWeek: 3 })).toBe(3);
        expect(resolveInitialMapOpenWeek({ ...monday, hashWeek: 3 })).toBe(3);
        expect(resolveInitialMapOpenWeek({ ...monday, initialWeek: 1, hashWeek: 3 })).toBe(1);
    });

    it("switches to the scheduled week on Tuesday despite remembered browsing", () => {
        rememberedWeek3();
        expect(resolveInitialMapOpenWeek({ ...monday, progressWeek: 3 })).toBe(3);
    });

    it("preserves independent learner session restoration and progress fallback", () => {
        rememberedWeek3();
        expect(resolveInitialMapOpenWeek({ ...monday, restoreSession: true })).toBe(3);
        vi.stubGlobal("sessionStorage", { getItem: () => null });
        expect(resolveInitialMapOpenWeek({ ...monday, restoreSession: true })).toBe(2);
    });
});
