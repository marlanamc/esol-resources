import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";

export async function GET() {
    const requestId = crypto.randomUUID();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

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
                            assignment: {
                                class: {
                                    teacherId: session.user.id,
                                },
                            },
                        },
                    })
                )
        );

        return NextResponse.json({ pendingReviews });
    } catch (error) {
        console.error("Failed to load teacher dashboard summary", error);
        return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
    }
}
