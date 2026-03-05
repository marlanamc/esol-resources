import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageActivity, canManageClass, ensureTeacher } from "@/lib/policies";

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
        const { classId, activityId, title, instructions, dueDate, syncToSectionGroup = true } = body;

        if (!classId || !activityId) {
            return NextResponse.json(
                { error: "Class ID and Activity ID are required" },
                { status: 400 }
            );
        }

        if (typeof syncToSectionGroup !== "boolean") {
            return NextResponse.json(
                { error: "syncToSectionGroup must be a boolean" },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // Verify teacher owns the class
        const classItem = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        if (!canManageClass(session.user, admin, classItem.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Verify activity exists
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        if (!canManageActivity(session.user, admin, activity.createdBy)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const assignmentData = {
            activityId,
            title: title || null,
            instructions: instructions || null,
            dueDate: dueDate ? new Date(dueDate) : null,
            isFeatured: true,
        };

        const assignment = await prisma.$transaction(async (tx) => {
            const created = await tx.assignment.create({
                data: {
                    classId,
                    ...assignmentData,
                },
            });

            if (syncToSectionGroup && classItem.sectionGroupId) {
                const siblingSections = await tx.class.findMany({
                    where: {
                        sectionGroupId: classItem.sectionGroupId,
                        teacherId: classItem.teacherId,
                        id: { not: classItem.id },
                    },
                    select: { id: true },
                });

                if (siblingSections.length > 0) {
                    await tx.assignment.createMany({
                        data: siblingSections.map((section) => ({
                            classId: section.id,
                            ...assignmentData,
                        })),
                    });
                }
            }

            return created;
        });

        return NextResponse.json(assignment);
    } catch (error: unknown) {
        console.error("Error creating assignment:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create assignment" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
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
        const { assignmentId, isFeatured } = body;

        if (!assignmentId || typeof isFeatured !== 'boolean') {
            return NextResponse.json(
                { error: "Assignment ID and isFeatured boolean are required" },
                { status: 400 }
            );
        }

        // Verify teacher owns the class that the assignment belongs to
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { class: true }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        if (!canManageClass(session.user, admin, assignment.class.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: { isFeatured },
        });

        return NextResponse.json(updatedAssignment);
    } catch (error: unknown) {
        console.error("Error updating assignment:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update assignment" },
            { status: 500 }
        );
    }
}
