import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any)?.id;

        // Get student's enrolled classes
        const enrollments: { classId: string }[] = await prisma.classEnrollment.findMany({
            where: { studentId: userId },
            select: { classId: true }
        });

        const classIds = enrollments.map((enrollment) => enrollment.classId);

        // Get featured assignments for those classes
        const featuredAssignments = classIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                isFeatured: true,
                // ensure the activity still exists; prevents "ghost" featured cards
                activity: { id: { not: "" } }
            },
            include: {
                activity: true,
                class: true,
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        completedAt: true,
                        score: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(featuredAssignments);
    } catch (error: any) {
        console.error("Error fetching featured assignments:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch featured assignments" },
            { status: 500 }
        );
    }
}
