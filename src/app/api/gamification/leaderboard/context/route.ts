import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { classOwnershipWhere, ensureTeacher } from "@/lib/policies";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";
import { getLearnerState } from "@/lib/learner-mode";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return ApiErrors.unauthorized();
        }

        const user = session.user;

        if (user.role === "student") {
            const [enrollments, learnerState] = await Promise.all([
                prisma.classEnrollment.findMany({
                    where: { studentId: user.id, status: "active" },
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
                }),
                getLearnerState(prisma, user.id),
            ]);

            const classes = enrollments.map((entry) => entry.class);
            const learnerMode = learnerState.mode;
            return NextResponse.json({
                viewerRole: user.role,
                learnerMode,
                classes,
                defaultClassId: classes[0]?.id || null,
                defaultScope: learnerMode === "independent" ? "independent" : "section",
            });
        }

        const teacherCheck = ensureTeacher(user);
        if (!teacherCheck.ok) {
            return apiError(teacherCheck.error, teacherCheck.status);
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
            viewerRole: user.role,
            isAdmin: teacherCheck.admin,
            classes,
            defaultClassId: classes[0]?.id || null,
            defaultScope: "section",
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to fetch leaderboard context",
        });
    }
}
