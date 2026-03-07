import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass, ensureTeacher } from "@/lib/policies";
import { CalendarEventPostBodySchema, parseApiBody } from "@/lib/api-schemas";

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
            return NextResponse.json({ error: "Invalid date values" }, { status: 400 });
        }
        if (end.getTime() < start.getTime()) {
            return NextResponse.json({ error: "End date cannot be before start date" }, { status: 400 });
        }

        // Verify ownership
        const classItem = await prisma.class.findUnique({ where: { id: classId } });
        if (!classItem) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }
        if (!canManageClass(session.user, admin, classItem.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    } catch (error: unknown) {
        console.error("Error creating calendar event:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create calendar event" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
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
        const { id } = body || {};
        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            include: { class: true },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (!canManageClass(session.user, admin, event.class.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.calendarEvent.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("Error deleting calendar event:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to delete calendar event" },
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
        const { id, title, date, endDate, type = "holiday", description } = body || {};
        if (!id || !title || !date) {
            return NextResponse.json({ error: "id, title, and date are required" }, { status: 400 });
        }

        const allowedTypes = ["holiday", "event", "due", "reminder", "quiz"];
        if (!allowedTypes.includes(type)) {
            return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
        }

        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
        };

        const start = parseDateOnly(date);
        const end = endDate ? parseDateOnly(endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date values" }, { status: 400 });
        }
        if (end.getTime() < start.getTime()) {
            return NextResponse.json({ error: "End date cannot be before start date" }, { status: 400 });
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            include: { class: true },
        });
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (!canManageClass(session.user, admin, event.class.teacherId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    } catch (error: unknown) {
        console.error("Error updating calendar event:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update calendar event" },
            { status: 500 }
        );
    }
}
