import { describe, expect, it } from "vitest";
import {
    checkStudentDeletable,
    isStudentDeletable,
    summarizeEngagement,
    type StudentEngagementCounts,
} from "@/lib/admin/student-deletion";

const noEngagement: StudentEngagementCounts = {
    submissions: 0,
    activityProgress: 0,
    pointsLedger: 0,
    achievements: 0,
    quizResponses: 0,
    speakingSubmissions: 0,
    writingSubmissions: 0,
};

const neverEngagedStudent = {
    points: 0,
    isSystemAccount: false,
    role: "student",
    counts: noEngagement,
};

describe("checkStudentDeletable", () => {
    it("allows deleting a rostered student who never showed up", () => {
        expect(checkStudentDeletable(neverEngagedStudent)).toEqual({ deletable: true });
    });

    it("refuses a student who has earned points", () => {
        const check = checkStudentDeletable({ ...neverEngagedStudent, points: 1134 });
        expect(check.deletable).toBe(false);
        expect(check).toHaveProperty("reason", expect.stringContaining("1134 points"));
    });

    // Each engagement signal on its own must block deletion, so a student with
    // work in only one place can never be wiped.
    const signals: Array<keyof StudentEngagementCounts> = [
        "submissions",
        "activityProgress",
        "pointsLedger",
        "achievements",
        "quizResponses",
        "speakingSubmissions",
        "writingSubmissions",
    ];

    for (const signal of signals) {
        it(`refuses a student with ${signal}`, () => {
            const check = checkStudentDeletable({
                ...neverEngagedStudent,
                counts: { ...noEngagement, [signal]: 1 },
            });
            expect(check.deletable).toBe(false);
        });
    }

    it("refuses system accounts", () => {
        const check = checkStudentDeletable({ ...neverEngagedStudent, isSystemAccount: true });
        expect(check).toMatchObject({ deletable: false });
        expect(check).toHaveProperty("reason", expect.stringContaining("System accounts"));
    });

    it("refuses teachers and admins", () => {
        for (const role of ["teacher", "admin", "teacher_admin"]) {
            const check = checkStudentDeletable({ ...neverEngagedStudent, role });
            expect(check.deletable).toBe(false);
        }
    });

    it("treats a missing role as a deletable student", () => {
        expect(isStudentDeletable({ ...neverEngagedStudent, role: null })).toBe(true);
    });
});

describe("summarizeEngagement", () => {
    it("is empty for a student with no activity", () => {
        expect(summarizeEngagement(noEngagement)).toEqual([]);
    });

    it("lists every kind of work the student has", () => {
        const parts = summarizeEngagement({
            ...noEngagement,
            submissions: 3,
            achievements: 1,
        });
        expect(parts).toHaveLength(2);
        expect(parts.join(" ")).toContain("3 submission(s)");
        expect(parts.join(" ")).toContain("1 achievement(s)");
    });
});
