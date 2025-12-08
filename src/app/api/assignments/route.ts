import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { classId, activityId, title, instructions, dueDate } = body;

        if (!classId || !activityId) {
            return NextResponse.json(
                { error: "Class ID and Activity ID are required" },
                { status: 400 }
            );
        }

        const userId = (session.user as any)?.id;

        // Verify teacher owns the class
        const classItem = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        if (classItem.teacherId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Verify activity exists
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        const assignment = await prisma.assignment.create({
            data: {
                classId,
                activityId,
                title: title || null,
                instructions: instructions || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                isFeatured: true, // Auto-feature new assignments
            },
        });

        return NextResponse.json(assignment);
    } catch (error: any) {
        console.error("Error creating assignment:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create assignment" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { assignmentId, isFeatured } = body;

        if (!assignmentId || typeof isFeatured !== 'boolean') {
            return NextResponse.json(
                { error: "Assignment ID and isFeatured boolean are required" },
                { status: 400 }
            );
        }

        const userId = (session.user as any)?.id;

        // Verify teacher owns the class that the assignment belongs to
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { class: true }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        if (assignment.class.teacherId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: { isFeatured },
        });

        return NextResponse.json(updatedAssignment);
    } catch (error: any) {
        console.error("Error updating assignment:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update assignment" },
            { status: 500 }
        );
    }
}


