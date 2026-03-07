import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageActivity, canManageClass } from "@/lib/policies";
import { AssignmentPatchBodySchema, AssignmentPostBodySchema, parseApiBody } from "@/lib/api-schemas";
import { ApiErrors } from "@/lib/api-response";
import { requireTeacher } from "@/lib/api-auth";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const admin = teacherCheck.admin;

        const body = await request.json();
        const validated = parseApiBody(AssignmentPostBodySchema, body);
        if (!validated.ok) return validated.response;
        const { classId, activityId, title, instructions, dueDate, syncToSectionGroup } = validated.data;

        // Verify teacher owns the class
        const classItem = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            return ApiErrors.notFound("Class", classId);
        }

        if (!canManageClass(teacherCheck.user, admin, classItem.teacherId)) {
            return ApiErrors.forbidden();
        }

        // Verify activity exists
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
        });

        if (!activity) {
            return ApiErrors.notFound("Activity", activityId);
        }

        if (!canManageActivity(teacherCheck.user, admin, activity.createdBy)) {
            return ApiErrors.forbidden();
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
        logger.error("Error creating assignment", error);
        return ApiErrors.internal("Failed to create assignment");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const admin = teacherCheck.admin;

        const body = await request.json();
        const validated = parseApiBody(AssignmentPatchBodySchema, body);
        if (!validated.ok) return validated.response;
        const { assignmentId, isFeatured, syncToSectionGroup } = validated.data;

        // Verify teacher owns the class that the assignment belongs to
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { class: true }
        });

        if (!assignment) {
            return ApiErrors.notFound("Assignment", assignmentId);
        }

        if (!canManageClass(teacherCheck.user, admin, assignment.class.teacherId)) {
            return ApiErrors.forbidden();
        }

        let updatedCount = 1;
        const updatedAssignment = await prisma.$transaction(async (tx) => {
            if (syncToSectionGroup && assignment.class.sectionGroupId) {
                const sectionIds = await tx.class.findMany({
                    where: {
                        sectionGroupId: assignment.class.sectionGroupId,
                        teacherId: assignment.class.teacherId,
                    },
                    select: { id: true },
                });

                const syncResult = await tx.assignment.updateMany({
                    where: {
                        classId: { in: sectionIds.map((section) => section.id) },
                        activityId: assignment.activityId,
                    },
                    data: { isFeatured },
                });
                updatedCount = syncResult.count;

                return tx.assignment.findUnique({
                    where: { id: assignmentId },
                });
            }

            return tx.assignment.update({
                where: { id: assignmentId },
                data: { isFeatured },
            });
        });

        if (!updatedAssignment) {
            return ApiErrors.notFound("Assignment", assignmentId);
        }

        return NextResponse.json({
            ...updatedAssignment,
            updatedCount,
        });
    } catch (error: unknown) {
        logger.error("Error updating assignment", error);
        return ApiErrors.internal("Failed to update assignment");
    }
}
