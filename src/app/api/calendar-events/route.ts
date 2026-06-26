import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass, ensureTeacher } from "@/lib/policies";
import { CalendarEventPostBodySchema, parseApiBody } from "@/lib/api-schemas";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const validated = parseApiBody(CalendarEventPostBodySchema, body);
        if (!validated.ok) return validated.response;
        const { classId, title, date, endDate, type, description, syncToSectionGroup } = validated.data;

        // Parse YYYY-MM-DD strings into local dates to avoid TZ shifting back a day.
        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
        };

        const start = parseDateOnly(date);
        const end = endDate ? parseDateOnly(endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return apiError("Invalid date values", 400);
        }
        if (end.getTime() < start.getTime()) {
            return apiError("End date cannot be before start date", 400);
        }

        // Verify ownership
        const classItem = await prisma.class.findUnique({
            where: { id: classId },
            select: { id: true, teacherId: true, sectionGroupId: true },
        });
        if (!classItem) {
            return ApiErrors.notFound("Class", classId);
        }
        if (!canManageClass(session.user, admin, classItem.teacherId)) {
            return ApiErrors.forbidden();
        }

        const created = await prisma.$transaction(async (tx) => {
            const eventData = {
                title,
                description: description || null,
                date: start,
                endDate: end,
                type,
                createdById: session.user.id,
            };

            const primaryEvent = await tx.calendarEvent.create({
                data: {
                    classId,
                    ...eventData,
                },
            });

            let createdCount = 1;
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
                    await tx.calendarEvent.createMany({
                        data: siblingSections.map((section) => ({
                            classId: section.id,
                            ...eventData,
                        })),
                    });
                    createdCount += siblingSections.length;
                }
            }

            return { primaryEvent, createdCount };
        });

        return NextResponse.json({
            ...created.primaryEvent,
            createdCount: created.createdCount,
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to create calendar event",
            path: request.url,
        });
    }
}

export async function DELETE(request: NextRequest) {
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

        const body = await request.json();
        const { id } = body || {};
        if (!id) {
            return apiError("id is required", 400);
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            select: { id: true, class: { select: { teacherId: true } } },
        });

        if (!event) {
            return ApiErrors.notFound("Event", id);
        }

        if (!canManageClass(session.user, admin, event.class.teacherId)) {
            return ApiErrors.forbidden();
        }

        await prisma.calendarEvent.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to delete calendar event",
            path: request.url,
        });
    }
}

export async function PATCH(request: NextRequest) {
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

        const body = await request.json();
        const { id, title, date, endDate, type = "holiday", description } = body || {};
        if (!id || !title || !date) {
            return apiError("id, title, and date are required", 400);
        }

        const allowedTypes = ["holiday", "event", "due", "reminder", "quiz"];
        if (!allowedTypes.includes(type)) {
            return apiError("Invalid event type", 400);
        }

        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
        };

        const start = parseDateOnly(date);
        const end = endDate ? parseDateOnly(endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return apiError("Invalid date values", 400);
        }
        if (end.getTime() < start.getTime()) {
            return apiError("End date cannot be before start date", 400);
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            select: { id: true, class: { select: { teacherId: true } } },
        });
        if (!event) {
            return ApiErrors.notFound("Event", id);
        }

        if (!canManageClass(session.user, admin, event.class.teacherId)) {
            return ApiErrors.forbidden();
        }

        const updated = await prisma.calendarEvent.update({
            where: { id },
            data: {
                title,
                description: description || null,
                date: start,
                endDate: end,
                type,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to update calendar event",
            path: request.url,
        });
    }
}
