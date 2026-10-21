import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/database/prisma", () => ({ prisma: {} }));
import { buildWeeklyQuizCatchUp, calendarDaysUntil, formatQuizDay, pickWeeklyQuizStatus, weeklyQuizDueEvents } from "@/lib/learner/weekly-quiz-status";
import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";

const week4 = getWeeklyQuizSchedule(4)!;
const week5 = getWeeklyQuizSchedule(5)!;
const quiz = (n: number) => ({ id: `q${n}`, content: JSON.stringify({ type: "weekly-quiz", weekNumber: n }) });
const joinedAt = new Date("2026-09-01T00:00:00Z");
const after = (date: Date, hours: number) => new Date(date.getTime() + hours * 3_600_000);
const pick = (now: Date, done: [string, Date][] = [], quizzes: { id: string; content: string; assignmentId?: string }[] = [quiz(4), quiz(5)]) =>
    pickWeeklyQuizStatus({ quizzes, completedAtById: new Map(done), joinedAt, now });

describe("weekly quiz home bar status", () => {
    it("is open from Thursday until Tuesday's due time", () => {
        const status = pick(after(week4.opensAt, 1));
        expect(status).toMatchObject({ state: "open", activityId: "q4", weekNumber: 4, href: "/activity/q4" });
        expect(pick(after(week4.dueAt, -1))?.state).toBe("open");
    });

    it("is late after Tuesday until the next quiz opens Thursday", () => {
        expect(pick(after(week4.dueAt, 1))).toMatchObject({ state: "late", activityId: "q4" });
        expect(pick(after(week5.opensAt, -1))?.activityId).toBe("q4");
        expect(pick(after(week5.opensAt, 1))).toMatchObject({ state: "open", activityId: "q5" });
    });

    it("shows done for a day after submitting, then goes away until the next quiz", () => {
        const finished = after(week4.opensAt, 2);
        const status = pick(after(finished, 23), [["q4", finished]]);
        expect(status?.state).toBe("done");
        expect(status?.nextOpensAt).toEqual(week5.opensAt);
        expect(pick(after(finished, 25), [["q4", finished]])).toBeNull();
        expect(pick(after(week5.opensAt, 1), [["q4", finished]])?.activityId).toBe("q5");
    });

    it("shows nothing before any quiz opens or for students who joined after it was due", () => {
        expect(pick(after(week4.opensAt, -1))).toBeNull();
        expect(pickWeeklyQuizStatus({ quizzes: [quiz(4)], completedAtById: new Map(), joinedAt: after(week4.dueAt, 1), now: after(week4.dueAt, 2) })).toBeNull();
    });

    it("links through the class assignment when there is one", () => {
        const status = pick(after(week4.opensAt, 1), [], [{ ...quiz(4), assignmentId: "a1" }]);
        expect(status?.href).toBe("/activity/q4?assignment=a1");
    });

    it("formats the deadline in class time", () => {
        expect(formatQuizDay(week4.dueAt)).toBe("Tuesday, 6 PM");
        expect(calendarDaysUntil(week4.dueAt, week4.opensAt)).toBe(5);
    });
});

describe("weekly quiz catch-up on the profile", () => {
    const week3 = getWeeklyQuizSchedule(3)!;
    const catchUp = (now: Date, done: [string, number | null][], joined = joinedAt) =>
        buildWeeklyQuizCatchUp({
            quizzes: [quiz(3), quiz(4), quiz(5)],
            doneById: new Map(done.map(([id, score]) => [id, { score }])),
            joinedAt: joined,
            now,
        });

    it("lists past-due unfinished quizzes as missing, oldest first, but not the open one", () => {
        const result = catchUp(after(week5.opensAt, 1), []);
        expect(result.missing.map((q) => q.activityId)).toEqual(["q3", "q4"]);
        expect(result.missing[0].dueAt).toEqual(week3.dueAt);
    });

    it("lists finished quizzes under 100% for a retake, lowest score first", () => {
        const result = catchUp(after(week5.opensAt, 1), [["q3", 100], ["q4", 60], ["q5", 80]]);
        expect(result.missing).toEqual([]);
        expect(result.notPerfect.map((q) => [q.activityId, q.score])).toEqual([["q4", 60], ["q5", 80]]);
    });

    it("does not count quizzes due before the student joined as missing", () => {
        const result = catchUp(after(week5.opensAt, 1), [], after(week3.dueAt, 1));
        expect(result.missing.map((q) => q.activityId)).toEqual(["q4"]);
    });
});

describe("weekly quiz calendar due dates", () => {
    it("adds a quiz due event on each quiz's Tuesday due time", () => {
        expect(weeklyQuizDueEvents([{ ...quiz(4), title: "Week 4 Quiz" }])).toEqual([
            { date: week4.dueAt, endDate: null, type: "quiz", title: "Quiz due: Week 4 Quiz" },
        ]);
    });

    it("skips quizzes whose class assignment already has a due date", () => {
        expect(weeklyQuizDueEvents([quiz(4), quiz(5)], ["q4"]).map((e) => e.date)).toEqual([week5.dueAt]);
    });
});
