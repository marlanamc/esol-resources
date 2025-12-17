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
        const { name, description, code } = body;

        if (!name) {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 });
        }

        const userId = (session.user as any)?.id;

        // Generate code if not provided
        let classCode = code;
        if (!classCode) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let generated = "";
            for (let i = 0; i < 6; i++) {
                generated += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            classCode = generated;
        }

        // Check if code already exists
        const existingClass = await prisma.class.findUnique({
            where: { code: classCode },
        });

        if (existingClass) {
            return NextResponse.json({ error: "Class code already exists" }, { status: 400 });
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description: description || null,
                code: classCode,
                teacherId: userId,
            },
        });

        return NextResponse.json(newClass);
    } catch (error: any) {
        console.error("Error creating class:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create class" },
            { status: 500 }
        );
    }
}











