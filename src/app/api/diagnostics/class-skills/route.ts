import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type MiniQuizQuestionMeta = {
    question: string;
    skillTag?: string;
    difficulty?: string;
};

type StudentIdentity = {
    id: string;
    name: string | null;
    username: string;
};

function parseMiniQuizLookup(content: string): Map<string, MiniQuizQuestionMeta> {
    try {
        const parsed = JSON.parse(content) as { miniQuiz?: unknown };
        if (!Array.isArray(parsed?.miniQuiz)) return new Map();
        const entries = (parsed.miniQuiz as Array<Record<string, unknown>>)
            .map((q) => {
                const id = typeof q.id === "string" ? q.id : null;
                const question = typeof q.question === "string" ? q.question : null;
                if (!id || !question) return null;
                return [
                    id,
                    {
                        question,
                        skillTag: typeof q.skillTag === "string" ? q.skillTag : undefined,
                        difficulty: typeof q.difficulty === "string" ? q.difficulty : undefined,
                    },
                ] as const;
            })
            .filter(Boolean) as Array<readonly [string, MiniQuizQuestionMeta]>;
        return new Map(entries);
    } catch {
        return new Map();
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    if (user.role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const activityId = searchParams.get("activityId");
    const difficulty = searchParams.get("difficulty");

    if (!classId || !activityId) {
        return NextResponse.json(
            { error: "Missing classId or activityId" },
            { status: 400 }
        );
    }

    // Verify the teacher owns this class
    const classData = await prisma.class.findFirst({
        where: {
            id: classId,
            teacherId: user.id,
        },
    });

    if (!classData) {
        return NextResponse.json(
            { error: "Class not found or access denied" },
            { status: 404 }
        );
    }

    // Get student IDs in class
    const enrollments = await prisma.classEnrollment.findMany({
        where: {
            classId,
            student: {
                isSystemAccount: false,
            },
        },
        select: { studentId: true },
    });
    const studentIds = enrollments.map((e) => e.studentId);
    const students = await prisma.user.findMany({
        where: {
            id: { in: studentIds },
            isSystemAccount: false,
        },
        select: { id: true, name: true, username: true },
    });
    const studentById = new Map<string, StudentIdentity>(
        students.map((student) => [student.id, student])
    );

    if (studentIds.length === 0) {
        return NextResponse.json({
            classId,
            activityId,
            totalStudents: 0,
            skills: [],
        });
    }

    // Build where clause for difficulty filter
    const whereClause: {
        userId: { in: string[] };
        activityId: string;
        skillTag: { not: null };
        difficulty?: string;
    } = {
        userId: { in: studentIds },
        activityId,
        skillTag: { not: null },
    };

    if (difficulty && difficulty !== "all") {
        whereClause.difficulty = difficulty;
    }

    const activity = await prisma.activity.findUnique({
        where: { id: activityId },
        select: { content: true },
    });
    const miniQuizLookup = parseMiniQuizLookup(activity?.content || "");

    // Get individual responses to calculate skill/question diagnostics and trend.
    const allResponses = await prisma.quizResponse.findMany({
        where: whereClause,
        select: {
            userId: true,
            skillTag: true,
            isCorrect: true,
            questionId: true,
            difficulty: true,
            createdAt: true,
        },
    });

    const attemptedStudentsSet = new Set(allResponses.map((r) => r.userId));
    const totalResponses = allResponses.length;
    const totalCorrect = allResponses.filter((r) => r.isCorrect).length;

    const now = Date.now();
    const last7dStart = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const prev7dStart = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const recentResponses = allResponses.filter((r) => r.createdAt >= last7dStart);
    const previousResponses = allResponses.filter(
        (r) => r.createdAt >= prev7dStart && r.createdAt < last7dStart
    );

    const recentAccuracy = recentResponses.length
        ? Math.round((recentResponses.filter((r) => r.isCorrect).length / recentResponses.length) * 100)
        : null;
    const previousAccuracy = previousResponses.length
        ? Math.round((previousResponses.filter((r) => r.isCorrect).length / previousResponses.length) * 100)
        : null;

    const skillMap = new Map<
        string,
        {
            totalAttempts: number;
            correctAttempts: number;
            studentScores: Map<string, { correct: number; total: number }>;
        }
    >();

    const questionMap = new Map<
        string,
        {
            questionId: string;
            question: string;
            skillTag: string;
            difficulty: string;
            totalAttempts: number;
            correctAttempts: number;
            studentScores: Map<string, { correct: number; total: number }>;
        }
    >();

    allResponses.forEach((r) => {
        const skillTag = r.skillTag || miniQuizLookup.get(r.questionId)?.skillTag;
        if (!skillTag) return;

        const skill = skillMap.get(skillTag) || {
            totalAttempts: 0,
            correctAttempts: 0,
            studentScores: new Map<string, { correct: number; total: number }>(),
        };
        skill.totalAttempts++;
        if (r.isCorrect) skill.correctAttempts++;

        const studentSkill = skill.studentScores.get(r.userId) || { correct: 0, total: 0 };
        studentSkill.total++;
        if (r.isCorrect) studentSkill.correct++;
        skill.studentScores.set(r.userId, studentSkill);
        skillMap.set(skillTag, skill);

        const questionMeta = miniQuizLookup.get(r.questionId);
        const questionLabel = questionMeta?.question || r.questionId;
        const questionDifficulty = r.difficulty || questionMeta?.difficulty || "unknown";
        const question = questionMap.get(r.questionId) || {
            questionId: r.questionId,
            question: questionLabel,
            skillTag,
            difficulty: questionDifficulty,
            totalAttempts: 0,
            correctAttempts: 0,
            studentScores: new Map<string, { correct: number; total: number }>(),
        };
        question.totalAttempts++;
        if (r.isCorrect) question.correctAttempts++;

        const studentQuestion = question.studentScores.get(r.userId) || { correct: 0, total: 0 };
        studentQuestion.total++;
        if (r.isCorrect) studentQuestion.correct++;
        question.studentScores.set(r.userId, studentQuestion);
        questionMap.set(r.questionId, question);
    });

    const skills = Array.from(skillMap.entries()).map(([skillTag, data]) => {
        const percentCorrect =
            data.totalAttempts > 0
                ? Math.round((data.correctAttempts / data.totalAttempts) * 100)
                : 0;

        let studentsStruggling = 0;
        const strugglingStudents: Array<{
            id: string;
            name: string;
            username: string;
            percentCorrect: number;
        }> = [];
        data.studentScores.forEach((studentScore, studentId) => {
            const studentPercent =
                studentScore.total > 0
                    ? (studentScore.correct / studentScore.total) * 100
                    : 0;
            if (studentPercent < 60) {
                studentsStruggling++;
                const student = studentById.get(studentId);
                if (student) {
                    strugglingStudents.push({
                        id: student.id,
                        name: student.name || student.username,
                        username: student.username,
                        percentCorrect: Math.round(studentPercent),
                    });
                }
            }
        });
        strugglingStudents.sort((a, b) => a.percentCorrect - b.percentCorrect);

        return {
            skillTag,
            totalAttempts: data.totalAttempts,
            correctAttempts: data.correctAttempts,
            percentCorrect,
            studentsStruggling,
            studentsSeen: data.studentScores.size,
            strugglingStudents,
        };
    });

    skills.sort((a, b) => a.percentCorrect - b.percentCorrect);

    const questions = Array.from(questionMap.values())
        .map((q) => {
            const percentCorrect = q.totalAttempts
                ? Math.round((q.correctAttempts / q.totalAttempts) * 100)
                : 0;
            let studentsStruggling = 0;
            const strugglingStudents: Array<{
                id: string;
                name: string;
                username: string;
                percentCorrect: number;
            }> = [];
            q.studentScores.forEach((studentScore, studentId) => {
                const studentPercent =
                    studentScore.total > 0 ? (studentScore.correct / studentScore.total) * 100 : 0;
                if (studentPercent < 60) {
                    studentsStruggling++;
                    const student = studentById.get(studentId);
                    if (student) {
                        strugglingStudents.push({
                            id: student.id,
                            name: student.name || student.username,
                            username: student.username,
                            percentCorrect: Math.round(studentPercent),
                        });
                    }
                }
            });
            strugglingStudents.sort((a, b) => a.percentCorrect - b.percentCorrect);
            return {
                questionId: q.questionId,
                question: q.question,
                skillTag: q.skillTag,
                difficulty: q.difficulty,
                totalAttempts: q.totalAttempts,
                correctAttempts: q.correctAttempts,
                percentCorrect,
                studentsStruggling,
                strugglingStudents,
            };
        })
        .sort((a, b) => {
            if (a.percentCorrect !== b.percentCorrect) return a.percentCorrect - b.percentCorrect;
            return b.totalAttempts - a.totalAttempts;
        });

    const latestAttemptAt = allResponses.length
        ? allResponses.reduce(
              (latest, row) => (row.createdAt > latest ? row.createdAt : latest),
              allResponses[0]!.createdAt
          )
        : null;

    return NextResponse.json({
        classId,
        activityId,
        totalStudents: studentIds.length,
        studentsAttempted: attemptedStudentsSet.size,
        attemptRate: studentIds.length
            ? Math.round((attemptedStudentsSet.size / studentIds.length) * 100)
            : 0,
        totalResponses,
        overallAccuracy: totalResponses ? Math.round((totalCorrect / totalResponses) * 100) : 0,
        latestAttemptAt,
        trend: {
            recentAccuracy,
            previousAccuracy,
            delta:
                recentAccuracy !== null && previousAccuracy !== null
                    ? recentAccuracy - previousAccuracy
                    : null,
            recentResponses: recentResponses.length,
            previousResponses: previousResponses.length,
        },
        skills,
        questions,
    });
}
