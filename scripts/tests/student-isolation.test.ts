/**
 * Student Isolation Tests
 *
 * Verifies that the independent learner feature does NOT impact existing classroom students.
 * Tests the complete isolation between classroom and independent modes.
 *
 * Run with: npx tsx scripts/tests/student-isolation.test.ts
 */

import { prisma } from "@/lib/prisma";
import { resolveLearnerMode, buildIndependentLearnerWhere } from "@/lib/learner-mode";
import { buildLeaderboardEligibleUserWhere, buildIndependentLeaderboardUserWhere } from "@/lib/gamification/leaderboard-filter";
import { getTimeframedLeaderboard } from "@/lib/gamification";

const TEST_PREFIX = "test_isolation_";

type TestUser = {
    id: string;
    username: string;
    role: string;
};

type TestClass = {
    id: string;
    name: string;
    code: string;
};

async function cleanup() {
    console.log("🧹 Cleaning up previous test data...");

    // Delete in correct order to respect foreign keys
    await prisma.classEnrollment.deleteMany({
        where: { student: { username: { startsWith: TEST_PREFIX } } }
    });
    await prisma.userPreferences.deleteMany({
        where: { user: { username: { startsWith: TEST_PREFIX } } }
    });
    await prisma.pointsLedger.deleteMany({
        where: { user: { username: { startsWith: TEST_PREFIX } } }
    });
    await prisma.class.deleteMany({
        where: { code: { startsWith: TEST_PREFIX } }
    });
    await prisma.user.deleteMany({
        where: { username: { startsWith: TEST_PREFIX } }
    });
}

async function createTestData() {
    console.log("📦 Creating test data...");

    // Create a teacher
    const teacher = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}teacher`,
            password: "test123",
            role: "teacher",
            name: "Test Teacher",
            mustChangePassword: false,
        }
    });

    // Create a class
    const testClass = await prisma.class.create({
        data: {
            name: "Test Class",
            code: `${TEST_PREFIX}class_001`,
            teacherId: teacher.id,
        }
    });

    // Create classroom student (enrolled, no preference set)
    const classroomStudent1 = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}classroom_student_1`,
            password: "test123",
            role: "student",
            name: "Classroom Student 1",
            mustChangePassword: false,
            points: 50,
            weeklyPoints: 25,
        }
    });

    // Enroll classroom student
    await prisma.classEnrollment.create({
        data: {
            classId: testClass.id,
            studentId: classroomStudent1.id,
        }
    });

    // Create classroom student with explicit classroom preference
    const classroomStudent2 = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}classroom_student_2`,
            password: "test123",
            role: "student",
            name: "Classroom Student 2",
            mustChangePassword: false,
            points: 100,
            weeklyPoints: 50,
        }
    });

    await prisma.classEnrollment.create({
        data: {
            classId: testClass.id,
            studentId: classroomStudent2.id,
        }
    });

    await prisma.userPreferences.create({
        data: {
            userId: classroomStudent2.id,
            learnerMode: "classroom",
        }
    });

    // Create independent student (not enrolled, explicit independent preference)
    const independentStudent1 = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}independent_student_1`,
            password: "test123",
            role: "student",
            name: "Independent Student 1",
            mustChangePassword: false,
            points: 75,
            weeklyPoints: 30,
        }
    });

    await prisma.userPreferences.create({
        data: {
            userId: independentStudent1.id,
            learnerMode: "independent",
        }
    });

    // Create independent student (not enrolled, no preference - should default to classroom)
    const unenrolledStudent = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}unenrolled_student`,
            password: "test123",
            role: "student",
            name: "Unenrolled Student",
            mustChangePassword: false,
            points: 20,
            weeklyPoints: 10,
        }
    });

    // Create transitioning student (was enrolled, now removed, switched to independent)
    const transitioningStudent = await prisma.user.create({
        data: {
            username: `${TEST_PREFIX}transitioning_student`,
            password: "test123",
            role: "student",
            name: "Transitioning Student",
            mustChangePassword: false,
            points: 200,
            weeklyPoints: 100,
        }
    });

    await prisma.userPreferences.create({
        data: {
            userId: transitioningStudent.id,
            learnerMode: "independent",
        }
    });

    // Add points ledger entries for leaderboard testing
    const now = new Date();
    for (const student of [classroomStudent1, classroomStudent2, independentStudent1, transitioningStudent]) {
        await prisma.pointsLedger.create({
            data: {
                userId: student.id,
                points: student.weeklyPoints,
                reason: "Test points",
                source: "activity",
                createdAt: now,
            }
        });
    }

    return {
        teacher,
        testClass,
        classroomStudent1,
        classroomStudent2,
        independentStudent1,
        unenrolledStudent,
        transitioningStudent,
    };
}

async function testResolveLearnerMode(data: Awaited<ReturnType<typeof createTestData>>) {
    console.log("\n🧪 Test 1: resolveLearnerMode behavior...");
    let passed = 0;
    let failed = 0;

    // Test 1a: Classroom student with no preferences defaults to classroom
    const classroomPref1 = await prisma.userPreferences.findUnique({
        where: { userId: data.classroomStudent1.id }
    });
    const mode1 = resolveLearnerMode({
        storedMode: classroomPref1?.learnerMode ?? null,
        enrollmentCount: 1,
    });
    if (mode1 === "classroom") {
        console.log("  ✅ Enrolled student with no preference → classroom");
        passed++;
    } else {
        console.log(`  ❌ Enrolled student with no preference → ${mode1} (expected classroom)`);
        failed++;
    }

    // Test 1b: Classroom student with explicit preference stays classroom
    const classroomPref2 = await prisma.userPreferences.findUnique({
        where: { userId: data.classroomStudent2.id }
    });
    const mode2 = resolveLearnerMode({
        storedMode: classroomPref2?.learnerMode ?? null,
        enrollmentCount: 1,
    });
    if (mode2 === "classroom") {
        console.log("  ✅ Enrolled student with classroom preference → classroom");
        passed++;
    } else {
        console.log(`  ❌ Enrolled student with classroom preference → ${mode2} (expected classroom)`);
        failed++;
    }

    // Test 1c: Independent student stays independent
    const independentPref = await prisma.userPreferences.findUnique({
        where: { userId: data.independentStudent1.id }
    });
    const mode3 = resolveLearnerMode({
        storedMode: independentPref?.learnerMode ?? null,
        enrollmentCount: 0,
    });
    if (mode3 === "independent") {
        console.log("  ✅ Independent student with explicit preference → independent");
        passed++;
    } else {
        console.log(`  ❌ Independent student with explicit preference → ${mode3} (expected independent)`);
        failed++;
    }

    // Test 1d: Unenrolled student with no preference defaults to classroom
    const unenrolledPref = await prisma.userPreferences.findUnique({
        where: { userId: data.unenrolledStudent.id }
    });
    const mode4 = resolveLearnerMode({
        storedMode: unenrolledPref?.learnerMode ?? null,
        enrollmentCount: 0,
    });
    if (mode4 === "classroom") {
        console.log("  ✅ Unenrolled student with no preference → classroom (safe default)");
        passed++;
    } else {
        console.log(`  ❌ Unenrolled student with no preference → ${mode4} (expected classroom)`);
        failed++;
    }

    return { passed, failed };
}

async function testLeaderboardIsolation(data: Awaited<ReturnType<typeof createTestData>>) {
    console.log("\n🧪 Test 2: Leaderboard isolation...");
    let passed = 0;
    let failed = 0;

    // Test 2a: Class leaderboard should only include enrolled students
    const classLeaderboard = await getTimeframedLeaderboard("week", 20, data.testClass.id);
    const classUsernames = classLeaderboard.map(e => e.name);

    const hasClassroomStudents = classUsernames.includes("Classroom Student 1") &&
                                  classUsernames.includes("Classroom Student 2");
    const hasIndependentStudents = classUsernames.includes("Independent Student 1") ||
                                    classUsernames.includes("Transitioning Student");

    if (hasClassroomStudents && !hasIndependentStudents) {
        console.log("  ✅ Class leaderboard includes only enrolled classroom students");
        passed++;
    } else {
        console.log(`  ❌ Class leaderboard has wrong students: ${classUsernames.join(", ")}`);
        failed++;
    }

    // Test 2b: Independent leaderboard should only include independent learners
    const independentLeaderboard = await getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true });
    const independentUsernames = independentLeaderboard.map(e => e.name);

    // Independent leaderboard should include: independentStudent1, transitioningStudent, and unenrolledStudent (no enrollment)
    const hasIndependentInLeaderboard = independentUsernames.some(name =>
        name === "Independent Student 1" ||
        name === "Transitioning Student" ||
        name === "Unenrolled Student"
    );
    const hasClassroomInIndependent = independentUsernames.includes("Classroom Student 1") ||
                                       independentUsernames.includes("Classroom Student 2");

    if (hasIndependentInLeaderboard && !hasClassroomInIndependent) {
        console.log("  ✅ Independent leaderboard excludes enrolled classroom students");
        passed++;
    } else {
        console.log(`  ❌ Independent leaderboard has wrong students: ${independentUsernames.join(", ")}`);
        failed++;
    }

    return { passed, failed };
}

async function testDatabaseFilters(data: Awaited<ReturnType<typeof createTestData>>) {
    console.log("\n🧪 Test 3: Database filter queries...");
    let passed = 0;
    let failed = 0;

    // Test 3a: buildIndependentLearnerWhere should match independent and unenrolled users
    const independentWhere = buildIndependentLearnerWhere();
    const independentUsers = await prisma.user.findMany({
        where: {
            ...independentWhere,
            username: { startsWith: TEST_PREFIX },
        },
        select: { username: true, name: true },
    });
    const independentNames = independentUsers.map(u => u.name);

    // Should include: independent_student_1 (explicit independent), unenrolled_student (no classes), transitioning_student (explicit independent)
    // Should NOT include: classroom_student_1, classroom_student_2 (enrolled)
    const correctIndependent = independentNames.includes("Independent Student 1") &&
                               independentNames.includes("Unenrolled Student") &&
                               independentNames.includes("Transitioning Student");
    const wronglyIncludesClassroom = independentNames.includes("Classroom Student 1") ||
                                      independentNames.includes("Classroom Student 2");

    if (correctIndependent && !wronglyIncludesClassroom) {
        console.log("  ✅ buildIndependentLearnerWhere correctly filters users");
        passed++;
    } else {
        console.log(`  ❌ buildIndependentLearnerWhere returned: ${independentNames.join(", ")}`);
        failed++;
    }

    // Test 3b: buildLeaderboardEligibleUserWhere with class filter
    const classFilter = { classes: { some: { classId: data.testClass.id } } };
    const classroomWhere = buildLeaderboardEligibleUserWhere(classFilter);
    const classroomUsers = await prisma.user.findMany({
        where: {
            ...classroomWhere,
            username: { startsWith: TEST_PREFIX },
        },
        select: { username: true, name: true },
    });
    const classroomNames = classroomUsers.map(u => u.name);

    const correctClassroom = classroomNames.includes("Classroom Student 1") &&
                             classroomNames.includes("Classroom Student 2");
    const wronglyIncludesIndependent = classroomNames.includes("Independent Student 1") ||
                                        classroomNames.includes("Transitioning Student");

    if (correctClassroom && !wronglyIncludesIndependent) {
        console.log("  ✅ buildLeaderboardEligibleUserWhere with class filter works correctly");
        passed++;
    } else {
        console.log(`  ❌ Class filter returned: ${classroomNames.join(", ")}`);
        failed++;
    }

    return { passed, failed };
}

async function testStudentTransition(data: Awaited<ReturnType<typeof createTestData>>) {
    console.log("\n🧪 Test 4: Student transition from classroom to independent...");
    let passed = 0;
    let failed = 0;

    // Simulate the transition process:
    // 1. Remove student from class enrollment
    // 2. Update learnerMode preference to independent

    // First, verify classroom_student_1 is currently in classroom mode
    const enrollment = await prisma.classEnrollment.findFirst({
        where: {
            studentId: data.classroomStudent1.id,
            classId: data.testClass.id,
        }
    });

    if (enrollment) {
        console.log("  📋 Starting transition: Classroom Student 1 is currently enrolled");

        // Step 1: Remove enrollment
        await prisma.classEnrollment.delete({
            where: { id: enrollment.id }
        });

        // Step 2: Set learnerMode to independent
        await prisma.userPreferences.upsert({
            where: { userId: data.classroomStudent1.id },
            update: { learnerMode: "independent" },
            create: {
                userId: data.classroomStudent1.id,
                learnerMode: "independent",
            }
        });

        // Verify the student is now in independent mode
        const newPref = await prisma.userPreferences.findUnique({
            where: { userId: data.classroomStudent1.id }
        });
        const newEnrollmentCount = await prisma.classEnrollment.count({
            where: { studentId: data.classroomStudent1.id }
        });

        const newMode = resolveLearnerMode({
            storedMode: newPref?.learnerMode ?? null,
            enrollmentCount: newEnrollmentCount,
        });

        if (newMode === "independent") {
            console.log("  ✅ Transitioned student is now in independent mode");
            passed++;
        } else {
            console.log(`  ❌ Transitioned student is in ${newMode} mode (expected independent)`);
            failed++;
        }

        // Verify they now appear in independent leaderboard
        const independentLeaderboard = await getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true });
        const appearsInIndependent = independentLeaderboard.some(e => e.name === "Classroom Student 1");

        if (appearsInIndependent) {
            console.log("  ✅ Transitioned student appears in independent leaderboard");
            passed++;
        } else {
            console.log("  ❌ Transitioned student does NOT appear in independent leaderboard");
            failed++;
        }

        // Verify they no longer appear in class leaderboard
        const classLeaderboard = await getTimeframedLeaderboard("week", 20, data.testClass.id);
        const appearsInClass = classLeaderboard.some(e => e.name === "Classroom Student 1");

        if (!appearsInClass) {
            console.log("  ✅ Transitioned student no longer appears in class leaderboard");
            passed++;
        } else {
            console.log("  ❌ Transitioned student still appears in class leaderboard");
            failed++;
        }
    } else {
        console.log("  ⚠️ Skipping transition test - student not enrolled");
        failed++;
    }

    return { passed, failed };
}

async function testExistingStudentsUnaffected(data: Awaited<ReturnType<typeof createTestData>>) {
    console.log("\n🧪 Test 5: Existing classroom students remain unaffected...");
    let passed = 0;
    let failed = 0;

    // Verify classroom_student_2 (who has explicit classroom preference) is unaffected
    const pref = await prisma.userPreferences.findUnique({
        where: { userId: data.classroomStudent2.id }
    });
    const enrollmentCount = await prisma.classEnrollment.count({
        where: { studentId: data.classroomStudent2.id }
    });

    const mode = resolveLearnerMode({
        storedMode: pref?.learnerMode ?? null,
        enrollmentCount,
    });

    if (mode === "classroom" && pref?.learnerMode === "classroom") {
        console.log("  ✅ Classroom student with explicit preference remains in classroom mode");
        passed++;
    } else {
        console.log(`  ❌ Classroom student is in ${mode} mode with pref ${pref?.learnerMode}`);
        failed++;
    }

    // Verify they still appear in class leaderboard
    const classLeaderboard = await getTimeframedLeaderboard("week", 20, data.testClass.id);
    const appearsInClass = classLeaderboard.some(e => e.name === "Classroom Student 2");

    if (appearsInClass) {
        console.log("  ✅ Classroom student appears in class leaderboard");
        passed++;
    } else {
        console.log("  ❌ Classroom student does NOT appear in class leaderboard");
        failed++;
    }

    // Verify they do NOT appear in independent leaderboard
    const independentLeaderboard = await getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true });
    const appearsInIndependent = independentLeaderboard.some(e => e.name === "Classroom Student 2");

    if (!appearsInIndependent) {
        console.log("  ✅ Classroom student does NOT appear in independent leaderboard");
        passed++;
    } else {
        console.log("  ❌ Classroom student incorrectly appears in independent leaderboard");
        failed++;
    }

    return { passed, failed };
}

async function main() {
    console.log("🚀 Student Isolation Test Suite");
    console.log("================================\n");

    let totalPassed = 0;
    let totalFailed = 0;

    try {
        await cleanup();
        const data = await createTestData();

        const test1 = await testResolveLearnerMode(data);
        totalPassed += test1.passed;
        totalFailed += test1.failed;

        const test2 = await testLeaderboardIsolation(data);
        totalPassed += test2.passed;
        totalFailed += test2.failed;

        const test3 = await testDatabaseFilters(data);
        totalPassed += test3.passed;
        totalFailed += test3.failed;

        const test4 = await testStudentTransition(data);
        totalPassed += test4.passed;
        totalFailed += test4.failed;

        const test5 = await testExistingStudentsUnaffected(data);
        totalPassed += test5.passed;
        totalFailed += test5.failed;

    } finally {
        await cleanup();
        await prisma.$disconnect();
    }

    console.log("\n================================");
    console.log(`📊 Results: ${totalPassed} passed, ${totalFailed} failed`);

    if (totalFailed > 0) {
        console.log("\n❌ Some tests failed!");
        process.exit(1);
    } else {
        console.log("\n✅ All tests passed!");
        process.exit(0);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
