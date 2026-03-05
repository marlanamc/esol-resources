import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageActivity, ensureTeacher } from "@/lib/policies";

interface Props {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
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

        const { id } = await params;
        const body = await request.json();
        const { title, description, type, category, level, content } = body;

        if (!title || !type || !content) {
            return NextResponse.json(
                { error: "Title, type, and content are required" },
                { status: 400 }
            );
        }

        // Verify activity exists
        const existingActivity = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!existingActivity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        if (!canManageActivity(session.user, admin, existingActivity.createdBy)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update activity
        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
            },
        });

        return NextResponse.json(activity);
    } catch (error: unknown) {
        console.error("Error updating activity:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update activity" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: Props) {
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

        const { id } = await params;

        // Verify activity exists
        const activity = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        if (!canManageActivity(session.user, admin, activity.createdBy)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Soft-delete activity to preserve historical submissions and recoverability.
        await prisma.activity.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isReleased: false,
            },
        });

        return NextResponse.json({ message: "Activity archived successfully" });
    } catch (error: unknown) {
        console.error("Error deleting activity:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to delete activity" },
            { status: 500 }
        );
    }
}





