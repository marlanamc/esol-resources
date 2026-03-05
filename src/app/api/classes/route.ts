import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueClassCode, isValidClassCodeFormat } from "@/lib/generateClassCode";
import { canManageClass, classOwnershipWhere, ensureTeacher } from "@/lib/policies";

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
        console.error("Error fetching classes:", error);
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
        const { name, description, code, sourceClassId, copyAssignments = true } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 });
        }

        if (name.length > 200) {
            return NextResponse.json({ error: "Class name too long" }, { status: 400 });
        }

        if (sourceClassId && typeof sourceClassId !== "string") {
            return NextResponse.json({ error: "sourceClassId must be a string" }, { status: 400 });
        }

        if (typeof copyAssignments !== "boolean") {
            return NextResponse.json({ error: "copyAssignments must be a boolean" }, { status: 400 });
        }

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
            const newClass = await prisma.class.create({
                data: {
                    name,
                    description: description || null,
                    code: classCode,
                    teacherId: session.user.id,
                    sectionGroupId: randomUUID(),
                },
            });

            return NextResponse.json(newClass);
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
            };
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error("Error creating class:", error);
        // SECURITY: Don't expose internal error details to user
        return NextResponse.json(
            { error: "Failed to create class. Please try again." },
            { status: 500 }
        );
    }
}






