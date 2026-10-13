import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/database/prisma", () => ({ prisma: {} }));
import { buildQuizCompletion } from "@/lib/teach/quiz-completion";
import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";

const week4 = getWeeklyQuizSchedule(4)!;
const week5 = getWeeklyQuizSchedule(5)!;
const quiz = (n: number) => ({
    id: `q${n}`,
    title: `Week ${n} Quiz`,
    content: JSON.stringify({ type: "weekly-quiz", weekNumber: n }),
});
const classCreatedAt = new Date("2026-09-01T00:00:00Z");
const student = (id: string, name: string, joinedAt = classCreatedAt) => ({
    id,
    name,
    username: id,
    joinedAt,
});
const done = (userId: string, activityId: string, status = "completed") => ({
    userId,
    activityId,
    status,
    completedAt: week4.dueAt,
    updatedAt: week4.dueAt,
});

describe("teacher quiz completion", () => {
    const students = [student("b", "Bea"), student("a", "Ana"), student("c", "Cruz")];

    it("lists open quizzes, newest first, with students still missing them", () => {
        const now = new Date(week5.opensAt.getTime() + 1000);
        const [w5, w4] = buildQuizCompletion({
            quizzes: [quiz(4), quiz(5)],
            students,
            submissions: [done("a", "q4"), done("b", "q4", "graded"), done("c", "q4", "pending")],
            classCreatedAt,
            now,
        });
        expect(w5.title).toBe("Week 5 Quiz");
        expect(w5.missing.map((s) => s.name)).toEqual(["Ana", "Bea", "Cruz"]);
        expect(w4.expected).toBe(3);
        expect(w4.missing.map((s) => s.name)).toEqual(["Cruz"]);
    });

    it("hides quizzes that have not opened yet", () => {
        const now = new Date(week5.opensAt.getTime() - 1000);
        expect(
            buildQuizCompletion({ quizzes: [quiz(5)], students, submissions: [], classCreatedAt, now }),
        ).toEqual([]);
    });

    it("does not expect a quiz from students who joined after it was due", () => {
        const late = student("d", "Dee", new Date(week4.dueAt.getTime() + 1000));
        const [w4] = buildQuizCompletion({
            quizzes: [quiz(4)],
            students: [...students, late],
            submissions: [],
            classCreatedAt,
            now: new Date(week5.dueAt),
        });
        expect(w4.expected).toBe(3);
        expect(w4.missing.map((s) => s.id)).not.toContain("d");
    });
});
