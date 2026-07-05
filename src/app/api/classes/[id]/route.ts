import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canManageClass } from "@/lib/auth/policies";
import { requireTeacher } from "@/lib/auth/api-auth";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

const MAX_ANNOUNCEMENT_LENGTH = 1000;
const MAX_CLASS_NAME_LENGTH = 200;

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const admin = teacherCheck.admin;

        const { id } = await params;
        const body = await request.json();
        const rawAnnouncement = body?.announcement;
        const rawName = body?.name;
        const rawDescription = body?.description;
        const rawSectionSourceClassId = body?.sectionSourceClassId;
        const hasClassMetaUpdate =
            rawName !== undefined || rawDescription !== undefined || rawSectionSourceClassId !== undefined;

        if (rawAnnouncement !== null && rawAnnouncement !== undefined && typeof rawAnnouncement !== "string") {
            return apiError("Announcement must be a string or null", 400);
        }
        if (rawName !== undefined && typeof rawName !== "string") {
            return apiError("Class name must be a string", 400);
        }
        if (rawDescription !== undefined && rawDescription !== null && typeof rawDescription !== "string") {
            return apiError("Description must be a string or null", 400);
        }
        if (
            rawSectionSourceClassId !== undefined &&
            rawSectionSourceClassId !== null &&
            typeof rawSectionSourceClassId !== "string"
        ) {
            return apiError("sectionSourceClassId must be a string or null", 400);
        }
        if (rawAnnouncement === undefined && !hasClassMetaUpdate) {
            return apiError("No updates provided", 400);
        }

        const cleanedAnnouncement =
            typeof rawAnnouncement === "string" ? rawAnnouncement.trim() : null;
        const cleanedName = typeof rawName === "string" ? rawName.trim() : undefined;
        const cleanedDescription =
            typeof rawDescription === "string" ? rawDescription.trim() : rawDescription === null ? null : undefined;
        const normalizedSectionSourceClassId =
            typeof rawSectionSourceClassId === "string" ? rawSectionSourceClassId.trim() || null : rawSectionSourceClassId;

        if (cleanedAnnouncement && cleanedAnnouncement.length > MAX_ANNOUNCEMENT_LENGTH) {
            return apiError(`Announcement is too long (max ${MAX_ANNOUNCEMENT_LENGTH} characters)`, 400);
        }
        if (cleanedName !== undefined) {
            if (!cleanedName) {
                return apiError("Class name is required", 400);
            }
            if (cleanedName.length > MAX_CLASS_NAME_LENGTH) {
                return apiError("Class name too long", 400);
            }
        }
        if (id === normalizedSectionSourceClassId) {
            return apiError("A class cannot be its own section source", 400);
        }

        const existingClass = await prisma.class.findUnique({
            where: { id },
            select: { id: true, teacherId: true, sectionGroupId: true },
        });

        if (!existingClass) {
            return ApiErrors.notFound("Class", id);
        }
        if (!canManageClass(teacherCheck.user, admin, existingClass.teacherId)) {
            return ApiErrors.forbidden();
        }

        const updatedClass = await prisma.$transaction(async (tx) => {
            let nextSectionGroupId: string | null | undefined;
            if (normalizedSectionSourceClassId !== undefined) {
                if (normalizedSectionSourceClassId === null) {
                    nextSectionGroupId = null;
                } else {
                    const sourceClass = await tx.class.findUnique({
                        where: { id: normalizedSectionSourceClassId },
                        select: { id: true, teacherId: true, sectionGroupId: true },
                    });
                    if (!sourceClass) {
                        throw new Error("SOURCE_CLASS_NOT_FOUND");
                    }
                    if (!canManageClass(teacherCheck.user, admin, sourceClass.teacherId)) {
                        throw new Error("FORBIDDEN_SOURCE_CLASS");
                    }

                    const sourceGroupId = sourceClass.sectionGroupId || randomUUID();
                    if (!sourceClass.sectionGroupId) {
                        await tx.class.update({
                            where: { id: sourceClass.id },
                            data: { sectionGroupId: sourceGroupId },
                        });
                    }
                    nextSectionGroupId = sourceGroupId;
                }
            }

            const data: {
                announcement?: string | null;
                name?: string;
                description?: string | null;
                sectionGroupId?: string | null;
            } = {};

            if (rawAnnouncement !== undefined) {
                data.announcement = cleanedAnnouncement || null;
            }
            if (cleanedName !== undefined) {
                data.name = cleanedName;
            }
            if (cleanedDescription !== undefined) {
                data.description = cleanedDescription || null;
            }
            if (normalizedSectionSourceClassId !== undefined) {
                data.sectionGroupId = normalizedSectionSourceClassId === null ? null : nextSectionGroupId;
            }

            return tx.class.update({
                where: { id },
                data,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    announcement: true,
                    sectionGroupId: true,
                    updatedAt: true,
                },
            });
        });

        return NextResponse.json(updatedClass);
    } catch (error) {
        if (error instanceof Error && error.message === "SOURCE_CLASS_NOT_FOUND") {
            return ApiErrors.notFound("Section source class");
        }
        if (error instanceof Error && error.message === "FORBIDDEN_SOURCE_CLASS") {
            return ApiErrors.forbidden();
        }
        return handleApiError(error, {
            defaultMessage: "Failed to update class",
            path: request.url,
        });
    }
}
