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

        const userRole = session.user?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Only teachers can create activities" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, type, category, level, content } = body;

        if (!title || !type || !content) {
            return NextResponse.json(
                { error: "Title, type, and content are required" },
                { status: 400 }
            );
        }

        const userId = session.user?.id;

        const activity = await prisma.activity.create({
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
                createdBy: userId,
            },
        });

        return NextResponse.json(activity);
    } catch (error: unknown) {
        console.error("Error creating activity:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create activity" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const activities = await prisma.activity.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(activities);
    } catch (error: unknown) {
        console.error("Error fetching activities:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to fetch activities" },
            { status: 500 }
        );
    }
}






