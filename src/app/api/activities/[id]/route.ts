import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Only teachers can edit activities" }, { status: 403 });
        }

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
        const existingActivity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!existingActivity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
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
    } catch (error: any) {
        console.error("Error updating activity:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update activity" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Only teachers can delete activities" }, { status: 403 });
        }

        const { id } = await params;

        // Verify activity exists
        const activity = await prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        // Delete activity
        await prisma.activity.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Activity deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting activity:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete activity" },
            { status: 500 }
        );
    }
}








