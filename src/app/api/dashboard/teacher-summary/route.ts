import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { isTeacherAdmin } from "@/lib/roles";
import { ApiErrors, handleApiError } from "@/lib/api-response";

export async function GET() {
    const requestId = crypto.randomUUID();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ApiErrors.unauthorized();
        }
        if (session.user.role !== "teacher") {
            return ApiErrors.forbidden();
        }
        const admin = isTeacherAdmin(session.user);

        const pendingReviews = await timedQuery(
            {
                route: "/api/dashboard/teacher-summary",
                queryLabel: "submission.count.pendingReviews",
                userRole: session.user.role,
                requestId,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.submission.count({
                        where: {
                            status: "pending",
                            user: {
                                isSystemAccount: false,
                            },
                            ...(admin
                                ? {}
                                : {
                                    assignment: {
                                        class: {
                                            teacherId: session.user.id,
                                        },
                                    },
                                }),
                        },
                    })
                )
        );

        return NextResponse.json({ pendingReviews });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to load teacher dashboard summary",
        });
    }
}
