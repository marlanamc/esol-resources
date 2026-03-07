import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS } from "@/lib/auth-config";
import { generateUniqueClassCode, isValidClassCodeFormat } from "@/lib/generateClassCode";
import { canManageClass, classOwnershipWhere, ensureTeacher } from "@/lib/policies";
import { logger } from "@/lib/logger";
import { ClassesPostBodySchema, parseApiBody } from "@/lib/api-schemas";
import type { Prisma } from "@prisma/client";

function getTestStudentPassword(): string {
    const fromEnv = process.env.TEST_STUDENT_DEFAULT_PASSWORD;
    if (fromEnv) return fromEnv;
    if (process.env.NODE_ENV === "production") {
        throw new Error(
            "TEST_STUDENT_DEFAULT_PASSWORD must be set when creating classes with test students in production"
        );
    }
    return "password123";
}

async function createSystemTestStudentForClass(tx: Prisma.TransactionClient, classItem: { id: string; code: string }) {
    const password = getTestStudentPassword();
    const username = `student_${classItem.code}`.toLowerCase();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const student = await tx.user.upsert({
        where: { username },
        update: {
            role: "student",
            name: `Test Student (${classItem.code})`,
            password: passwordHash,
            mustChangePassword: false,
            isSystemAccount: true,
        },
        create: {
            username,
            role: "student",
            name: `Test Student (${classItem.code})`,
            password: passwordHash,
            mustChangePassword: false,
            isSystemAccount: true,
        },
        select: { id: true, username: true },
    });

    await tx.classEnrollment.upsert({
        where: {
            classId_studentId: {
                classId: classItem.id,
                studentId: student.id,
            },
        },
        create: {
            classId: classItem.id,
            studentId: student.id,
        },
        update: {},
    });

    return {
        username: student.username,
        password,
    };
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return NextResponse.json({ error: teacherCheck.error }, { status: teacherCheck.status });
        }

        const admin = teacherCheck.admin;

        const classes = await prisma.class.findMany({
            where: classOwnershipWhere(session.user, admin),
            include: {
                assignments: {
                    include: {
                        activity: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(classes);
    } catch (error: unknown) {
        logger.error("Error fetching classes", error);
        return NextResponse.json(
            { error: "Failed to fetch classes" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return NextResponse.json({ error: teacherCheck.error }, { status: teacherCheck.status });
        }
        const admin = teacherCheck.admin;

        const body = await request.json();
        const validated = parseApiBody(ClassesPostBodySchema, body);
        if (!validated.ok) return validated.response;
        const { name, description, code, sourceClassId, copyAssignments } = validated.data;

        // SECURITY: Generate cryptographically secure code or validate provided code
        let classCode: string;

        if (code) {
            // If teacher provides custom code, validate format
            if (!isValidClassCodeFormat(code)) {
                return NextResponse.json({
                    error: "Invalid class code format. Must be 6 uppercase alphanumeric characters (no 0, O, 1, I, L)"
                }, { status: 400 });
            }

            // Check if code already exists
            const existingClass = await prisma.class.findUnique({
                where: { code: code.toUpperCase() },
            });

            if (existingClass) {
                return NextResponse.json({ error: "Class code already exists" }, { status: 400 });
            }

            classCode = code.toUpperCase();
        } else {
            // Generate cryptographically secure unique code
            classCode = await generateUniqueClassCode();
        }

        // Normal class creation: starts a new section group.
        if (!sourceClassId) {
            const result = await prisma.$transaction(async (tx) => {
                const newClass = await tx.class.create({
                    data: {
                        name,
                        description: description || null,
                        code: classCode,
                        teacherId: session.user.id,
                        sectionGroupId: randomUUID(),
                    },
                });
                const testStudent = await createSystemTestStudentForClass(tx, newClass);
                return {
                    ...newClass,
                    testStudent,
                };
            });

            return NextResponse.json(result);
        }

        // Section creation from an existing class.
        const sourceClass = await prisma.class.findUnique({
            where: { id: sourceClassId },
            include: {
                assignments: {
                    select: {
                        activityId: true,
                        title: true,
                        instructions: true,
                        dueDate: true,
                        isFeatured: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!sourceClass) {
            return NextResponse.json({ error: "Source class not found" }, { status: 404 });
        }

        if (!canManageClass(session.user, admin, sourceClass.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const sectionGroupId = sourceClass.sectionGroupId || randomUUID();

        const result = await prisma.$transaction(async (tx) => {
            if (!sourceClass.sectionGroupId) {
                await tx.class.update({
                    where: { id: sourceClass.id },
                    data: { sectionGroupId },
                });
            }

            const newClass = await tx.class.create({
                data: {
                    name,
                    description: description || null,
                    code: classCode,
                    teacherId: sourceClass.teacherId,
                    sectionGroupId,
                },
            });
            const testStudent = await createSystemTestStudentForClass(tx, newClass);

            let copiedAssignments = 0;
            if (copyAssignments && sourceClass.assignments.length > 0) {
                await tx.assignment.createMany({
                    data: sourceClass.assignments.map((assignment) => ({
                        classId: newClass.id,
                        activityId: assignment.activityId,
                        title: assignment.title,
                        instructions: assignment.instructions,
                        dueDate: assignment.dueDate,
                        isFeatured: assignment.isFeatured,
                    })),
                });
                copiedAssignments = sourceClass.assignments.length;
            }

            return {
                ...newClass,
                copiedAssignments,
                testStudent,
            };
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        logger.error("Error creating class", error);
        // SECURITY: Don't expose internal error details to user
        return NextResponse.json(
            { error: "Failed to create class. Please try again." },
            { status: 500 }
        );
    }
}




