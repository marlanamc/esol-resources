import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { classOwnershipWhere, ensureTeacher } from "@/lib/policies";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;

        if (user.role === "student") {
            const enrollments = await prisma.classEnrollment.findMany({
                where: { studentId: user.id },
                select: {
                    class: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    joinedAt: true,
                },
                orderBy: { joinedAt: "desc" },
            });

            const classes = enrollments.map((entry) => entry.class);
            return NextResponse.json({
                classes,
                defaultClassId: classes[0]?.id || null,
            });
        }

        const teacherCheck = ensureTeacher(user);
        if (!teacherCheck.ok) {
            return NextResponse.json({ error: teacherCheck.error }, { status: teacherCheck.status });
        }

        const classes = await prisma.class.findMany({
            where: classOwnershipWhere(user, teacherCheck.admin),
            select: {
                id: true,
                name: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            classes,
            defaultClassId: classes[0]?.id || null,
        });
    } catch (error) {
        console.error("[Leaderboard Context] Error:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard context" }, { status: 500 });
    }
}

