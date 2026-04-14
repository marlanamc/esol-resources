import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageActivity, ensureTeacher } from "@/lib/policies";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";
import { getLearnerContentMetadata } from "@/lib/learner-visibility";
import { probeActivityIsReleasedInContentColumn } from "@/lib/prisma-field-support";

interface Props {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return ApiErrors.unauthorized();
        }
        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return apiError(teacherCheck.error, teacherCheck.status);
        }
        const admin = teacherCheck.admin;

        const { id } = await params;
        const body = await request.json();
        const { title, description, type, category, level, content } = body;

        if (!title || !type || !content) {
            return apiError("Title, type, and content are required", 400);
        }

        const hasReleasedColumn = await probeActivityIsReleasedInContentColumn();

        const existingActivity = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: { id: true, createdBy: true },
        });

        if (!existingActivity) {
            return ApiErrors.notFound("Activity", id);
        }

        if (!canManageActivity(session.user, admin, existingActivity.createdBy)) {
            return ApiErrors.forbidden();
        }

        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
                ...(hasReleasedColumn
                    ? { isReleasedInContent: getLearnerContentMetadata(content).releasedInContent }
                    : {}),
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                category: true,
                level: true,
                content: true,
                ui: true,
                isReleased: true,
                createdAt: true,
                updatedAt: true,
                ...(hasReleasedColumn ? { isReleasedInContent: true } : {}),
            },
        });

        return NextResponse.json(activity);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to update activity",
            path: request.url,
        });
    }
}

export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return ApiErrors.unauthorized();
        }
        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return apiError(teacherCheck.error, teacherCheck.status);
        }
        const admin = teacherCheck.admin;

        const { id } = await params;

        const activityToDelete = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: { id: true, createdBy: true },
        });

        if (!activityToDelete) {
            return ApiErrors.notFound("Activity", id);
        }

        if (!canManageActivity(session.user, admin, activityToDelete.createdBy)) {
            return ApiErrors.forbidden();
        }

        await prisma.activity.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isReleased: false,
            },
            select: { id: true },
        });

        return NextResponse.json({ message: "Activity archived successfully" });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to delete activity",
            path: request.url,
        });
    }
}





