import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;

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

        const activityIds = Array.from(new Set(featuredAssignments.map((a) => a.activityId)));
        const progressRows =
            activityIds.length === 0
                ? []
                : await prisma.activityProgress.findMany({
                    where: {
                        userId,
                        activityId: { in: activityIds },
                    },
                      select: { activityId: true, progress: true, status: true },
                  });

        const progressMap = new Map<string, { progress: number; status: string }>(
            (progressRows as Array<{ activityId: string; progress: number; status: string }>).map((p) => [
                p.activityId,
                { progress: p.progress, status: p.status },
            ])
        );

        const withProgress = featuredAssignments.map((a) => {
            const p = progressMap.get(a.activityId);
            return {
                ...a,
                progress: p?.progress ?? 0,
                progressStatus: p?.status ?? "in_progress",
            };
        });

        return NextResponse.json(withProgress);
    } catch (error: unknown) {
        console.error("Error fetching featured assignments:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to fetch featured assignments" },
            { status: 500 }
        );
    }
}
