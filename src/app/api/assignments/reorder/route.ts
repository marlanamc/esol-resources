import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass } from "@/lib/policies";
import { parseApiBody } from "@/lib/api-schemas";
import { ApiErrors } from "@/lib/api-response";
import { requireTeacher } from "@/lib/api-auth";
import { logger } from "@/lib/logger";
import { z } from "zod";

const ReorderAssignmentsBodySchema = z.object({
    classId: z.string().min(1, "classId is required"),
    items: z
        .array(
            z.object({
                assignmentId: z.string().min(1),
                sequenceNumber: z.number().int().min(1),
                unitLabel: z.string().nullable().optional(),
            })
        )
        .min(1, "At least one item required"),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const admin = teacherCheck.admin;

        const body = await request.json();
        const validated = parseApiBody(ReorderAssignmentsBodySchema, body);
        if (!validated.ok) return validated.response;
        const { classId, items } = validated.data;

        const classItem = await prisma.class.findUnique({
            where: { id: classId },
            select: { id: true, teacherId: true },
        });

        if (!classItem) return ApiErrors.notFound("Class", classId);
        if (!canManageClass(teacherCheck.user, admin, classItem.teacherId)) {
            return ApiErrors.forbidden();
        }

        await prisma.$transaction(
            items.map(({ assignmentId, sequenceNumber, unitLabel }) =>
                prisma.assignment.update({
                    where: { id: assignmentId },
                    data: {
                        sequenceNumber,
                        ...(unitLabel !== undefined ? { unitLabel } : {}),
                    },
                })
            )
        );

        return NextResponse.json({ updated: items.length });
    } catch (error: unknown) {
        logger.error("Error reordering assignments", error);
        return ApiErrors.internal("Failed to reorder assignments");
    }
}
