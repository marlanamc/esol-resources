import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass } from "@/lib/policies";
import { requireTeacher } from "@/lib/api-auth";
import { ApiErrors } from "@/lib/api-response";
import { logger } from "@/lib/logger";

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
            return NextResponse.json({ error: "Announcement must be a string or null" }, { status: 400 });
        }
        if (rawName !== undefined && typeof rawName !== "string") {
            return NextResponse.json({ error: "Class name must be a string" }, { status: 400 });
        }
        if (rawDescription !== undefined && rawDescription !== null && typeof rawDescription !== "string") {
            return NextResponse.json({ error: "Description must be a string or null" }, { status: 400 });
        }
        if (
            rawSectionSourceClassId !== undefined &&
            rawSectionSourceClassId !== null &&
            typeof rawSectionSourceClassId !== "string"
        ) {
            return NextResponse.json({ error: "sectionSourceClassId must be a string or null" }, { status: 400 });
        }
        if (rawAnnouncement === undefined && !hasClassMetaUpdate) {
            return NextResponse.json({ error: "No updates provided" }, { status: 400 });
        }

        const cleanedAnnouncement =
            typeof rawAnnouncement === "string" ? rawAnnouncement.trim() : null;
        const cleanedName = typeof rawName === "string" ? rawName.trim() : undefined;
        const cleanedDescription =
            typeof rawDescription === "string" ? rawDescription.trim() : rawDescription === null ? null : undefined;
        const normalizedSectionSourceClassId =
            typeof rawSectionSourceClassId === "string" ? rawSectionSourceClassId.trim() || null : rawSectionSourceClassId;

        if (cleanedAnnouncement && cleanedAnnouncement.length > MAX_ANNOUNCEMENT_LENGTH) {
            return NextResponse.json(
                { error: `Announcement is too long (max ${MAX_ANNOUNCEMENT_LENGTH} characters)` },
                { status: 400 }
            );
        }
        if (cleanedName !== undefined) {
            if (!cleanedName) {
                return NextResponse.json({ error: "Class name is required" }, { status: 400 });
            }
            if (cleanedName.length > MAX_CLASS_NAME_LENGTH) {
                return NextResponse.json({ error: "Class name too long" }, { status: 400 });
            }
        }
        if (id === normalizedSectionSourceClassId) {
            return NextResponse.json({ error: "A class cannot be its own section source" }, { status: 400 });
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
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "SOURCE_CLASS_NOT_FOUND") {
            return ApiErrors.notFound("Section source class");
        }
        if (error instanceof Error && error.message === "FORBIDDEN_SOURCE_CLASS") {
            return ApiErrors.forbidden();
        }
        logger.error("Error updating class", error);
        return ApiErrors.internal("Failed to update class");
    }
}
