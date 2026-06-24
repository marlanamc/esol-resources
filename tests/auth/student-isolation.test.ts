/**
 * Student Isolation Tests
 *
 * Verifies that learner type is derived only from active class enrollment state.
 *
 * Run with: npx tsx scripts/tests/student-isolation.test.ts
 */

import { prisma } from "@/lib/prisma";
import { getLearnerState, buildIndependentLearnerWhere } from "@/lib/learner-mode";
import { getTimeframedLeaderboard } from "@/lib/gamification";
import { enrollStudentInClass, graduateStudentFromClass } from "@/lib/learner-transitions";

const TEST_PREFIX = "test_isolation_";

async function cleanup() {
    await prisma.classEnrollment.deleteMany({
        where: { student: { username: { startsWith: TEST_PREFIX } } },
    });
    await prisma.userPreferences.deleteMany({
        where: { user: { username: { startsWith: TEST_PREFIX } } },
    });
    await prisma.pointsLedger.deleteMany({
        where: { user: { username: { startsWith: TEST_PREFIX } } },
    });
    await prisma.class.deleteMany({
        where: { code: { startsWith: TEST_PREFIX } },
    });
    await prisma.user.deleteMany({
        where: { username: { startsWith: TEST_PREFIX } },
    });
}

async function createStudent(username: string, name: string, points: number) {
    return prisma.user.create({
        data: {
            username,
            password: "test123",
            role: "student",
            name,
            mustChangePassword: false,
            points,
            weeklyPoints: points,
        },
    });
}

async function main() {
    await cleanup();

    const teacher = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}teacher`,
            password: "test123",
            role: "teacher",
            name: "Test Teacher",
            mustChangePassword: false,
        },
    });
    const testClass = await prisma.class.create({
        data: {
            name: "Test Class",
            code: `${TEST_PREFIX}class`,
            teacherId: teacher.id,
        },
    });

    const activeStudent = await createStudent(`${TEST_PREFIX}active`, "Active Student", 50);
    const independentStudent = await createStudent(`${TEST_PREFIX}independent`, "Independent Student", 75);
    const graduatedStudent = await createStudent(`${TEST_PREFIX}graduated`, "Graduated Student", 100);
    const exitedStudent = await createStudent(`${TEST_PREFIX}exited`, "Exited Student", 25);

    await enrollStudentInClass({ prisma, studentId: activeStudent.id, classId: testClass.id });
    await enrollStudentInClass({ prisma, studentId: graduatedStudent.id, classId: testClass.id });
    await graduateStudentFromClass({
        prisma,
        studentId: graduatedStudent.id,
        classId: testClass.id,
        note: "Completed test class",
    });
    await prisma.classEnrollment.create({
        data: {
            studentId: exitedStudent.id,
            classId: testClass.id,
            status: "exited",
            statusChangedAt: new Date(),
            statusNote: "Stopped attending",
        },
    });

    const activeState = await getLearnerState(prisma, activeStudent.id);
    const independentState = await getLearnerState(prisma, independentStudent.id);
    const graduatedState = await getLearnerState(prisma, graduatedStudent.id);
    const exitedState = await getLearnerState(prisma, exitedStudent.id);

    if (activeState.mode !== "classroom") throw new Error("Active enrollment should resolve as classroom");
    if (independentState.mode !== "independent") throw new Error("No enrollment should resolve as independent");
    if (graduatedState.mode !== "independent") throw new Error("Graduated-only enrollment should resolve as independent");
    if (exitedState.mode !== "independent") throw new Error("Exited-only enrollment should resolve as independent");

    const independentUsers = await prisma.user.findMany({
        where: {
            username: { startsWith: TEST_PREFIX },
            ...buildIndependentLearnerWhere(),
        },
        select: { username: true },
    });
    const independentUsernames = independentUsers.map((user) => user.username).sort();
    for (const expected of [independentStudent.username, graduatedStudent.username, exitedStudent.username]) {
        if (!independentUsernames.includes(expected)) {
            throw new Error(`${expected} should be in independent learner query`);
        }
    }
    if (independentUsernames.includes(activeStudent.username)) {
        throw new Error("Active classroom student should not be in independent learner query");
    }

    await prisma.pointsLedger.createMany({
        data: [activeStudent, independentStudent, graduatedStudent, exitedStudent].map((user) => ({
            userId: user.id,
            points: 10,
            source: "activity",
            reason: "Test points",
        })),
    });

    const classLeaderboard = await getTimeframedLeaderboard("week", 20, testClass.id);
    const independentLeaderboard = await getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true });
    if (!classLeaderboard.some((entry) => entry.id === activeStudent.id)) {
        throw new Error("Active student should appear in class leaderboard");
    }
    if (classLeaderboard.some((entry) => entry.id === graduatedStudent.id || entry.id === exitedStudent.id)) {
        throw new Error("Graduated/exited students should not appear in class leaderboard");
    }
    if (!independentLeaderboard.some((entry) => entry.id === graduatedStudent.id && entry.id !== activeStudent.id)) {
        throw new Error("Graduated student should appear in independent leaderboard");
    }

    await cleanup();
    console.log("✅ Student isolation checks passed");
}

main()
    .catch(async (error) => {
        console.error(error);
        await cleanup();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
