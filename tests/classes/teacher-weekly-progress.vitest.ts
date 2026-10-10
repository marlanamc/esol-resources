import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CourseMapActivity } from "@/lib/course-map";

const mocks = vi.hoisted(() => ({ visibleMap: vi.fn(), progress: vi.fn() }));
vi.mock("@/lib/database/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/course-map", () => ({ getVisibleMap: mocks.visibleMap }));
vi.mock("@/lib/learner-preview", () => ({
    getEffectiveLearnerMode: async () => "classroom",
}));
vi.mock("@/lib/course-map-progress.server", () => ({
    enrichCourseMapUnitsWithGrammarIds: async (units: unknown) => units,
    loadCourseMapProgressState: mocks.progress,
}));
import { getStudentCourseMapStatus } from "@/lib/course-map-week";

const activity = (
    id: string,
    status: CourseMapActivity["status"] = "available",
): CourseMapActivity => ({
    id,
    activityId: id,
    title: id,
    activityType: "quiz",
    status,
});
const sunday = new Date("2026-09-21T03:59:00Z");
const monday = new Date("2026-09-21T04:00:00Z");
function setWeeks(first = [activity("a"), activity("b")]) {
    mocks.visibleMap.mockResolvedValue({
        units: [
            {
                unitNumber: 1,
                unitTitle: "Unit",
                month: "September",
                levels: [
                    {
                        levelNumber: 1,
                        levelTitle: "First week",
                        requiredActivities: first,
                    },
                    {
                        levelNumber: 2,
                        levelTitle: "Second week",
                        requiredActivities: [activity("c")],
                    },
                ],
            },
        ],
    });
}
beforeEach(() => {
    setWeeks();
    mocks.progress.mockResolvedValue({
        a: { status: "completed", categoryData: null },
    });
});
describe("teacher weekly roster progress", () => {
    it("reports partial current-week progress separately from overall progress", async () => {
        const status = await getStudentCourseMapStatus(
            { id: "student" },
            { now: sunday },
        );
        expect(status?.currentWeek).toEqual({
            number: 1,
            title: "First week",
            done: 1,
            total: 2,
            percent: 50,
        });
        expect(status?.overall.percent).toBe(33);
        expect(status?.weekComplete).toBe(false);
    });
    it("recognizes completion without including early-access work", async () => {
        mocks.progress.mockResolvedValue({
            a: { status: "completed" },
            b: { status: "completed" },
        });
        const status = await getStudentCourseMapStatus(
            { id: "student" },
            { now: sunday },
        );
        expect(status?.currentWeek.percent).toBe(100);
        expect(status?.weekComplete).toBe(true);
        expect(status?.overall.percent).toBe(67);
    });
    it("switches at the calendar boundary and preserves completed weeks", async () => {
        mocks.progress.mockResolvedValue({
            a: { status: "completed" },
            b: { status: "completed" },
        });
        const status = await getStudentCourseMapStatus(
            { id: "student" },
            { now: monday },
        );
        expect(status?.currentWeek).toEqual({
            number: 2,
            title: "Second week",
            done: 0,
            total: 1,
            percent: 0,
        });
        expect(status?.completedWeeksCount).toBe(1);
    });
    it("does not count planned or locked activities in weekly totals", async () => {
        setWeeks([
            activity("a"),
            activity("b", "planned"),
            activity("c", "locked"),
        ]);
        expect(
            (
                await getStudentCourseMapStatus(
                    { id: "student" },
                    { now: sunday },
                )
            )?.currentWeek.total,
        ).toBe(1);
    });
    it("returns a zero denominator without marking an empty week complete", async () => {
        setWeeks([]);
        const status = await getStudentCourseMapStatus(
            { id: "student" },
            { now: sunday },
        );
        expect(status?.currentWeek).toMatchObject({
            done: 0,
            total: 0,
            percent: 0,
        });
        expect(status?.weekComplete).toBe(false);
    });
    it("returns no status when there is no visible map", async () => {
        mocks.visibleMap.mockResolvedValue({ units: [] });
        expect(
            await getStudentCourseMapStatus({ id: "student" }, { now: sunday }),
        ).toBeNull();
    });
});
