import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { isAdmin } from "@/lib/auth/roles";
import { handleApiError } from "@/lib/api/response";
import { logger } from "@/lib/shared/logger";
import { checkStudentDeletable } from "@/lib/admin/student-deletion";

/**
 * DELETE /api/admin/users/[userId]
 *
 * Permanently deletes a student account that never engaged — a roster entry for
 * someone who never showed up. Not every User relation cascades in the
 * database: enrollments and writing-session rows are ON DELETE RESTRICT, so a
 * rostered student can't be deleted until those rows are removed first. A
 * never-engaged student can still have them (the teacher enrolled them or put
 * them in a writing group), so they are cleared in the same transaction.
 *
 * Students who did any work are rejected here, not merely hidden in the UI.
 * Use the class roster's remove/graduate actions for them instead.
 */
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdmin(session.user)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { userId } = await params;

        if (userId === session.user.id) {
            return NextResponse.json(
                { error: "You cannot delete your own account." },
                { status: 400 }
            );
        }

        const user = await withPrismaReadRetry(() =>
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    points: true,
                    isSystemAccount: true,
                    _count: {
                        select: {
                            submissions: true,
                            activityProgress: true,
                            pointsLedger: true,
                            achievements: true,
                            quizResponses: true,
                            speakingSubmissions: true,
                            writingSubmissions: true,
                        },
                    },
                },
            })
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const check = checkStudentDeletable({
            points: user.points,
            isSystemAccount: user.isSystemAccount,
            role: user.role,
            counts: {
                submissions: user._count.submissions,
                activityProgress: user._count.activityProgress,
                pointsLedger: user._count.pointsLedger,
                achievements: user._count.achievements,
                quizResponses: user._count.quizResponses,
                speakingSubmissions: user._count.speakingSubmissions,
                writingSubmissions: user._count.writingSubmissions,
            },
        });

        if (!check.deletable) {
            return NextResponse.json({ error: check.reason }, { status: 409 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.classEnrollment.deleteMany({ where: { studentId: userId } });
            await tx.writingGroupMember.deleteMany({ where: { studentId: userId } });
            await tx.writingSessionCheckIn.deleteMany({ where: { studentId: userId } });
            await tx.writingGroupVote.deleteMany({ where: { voterId: userId } });
            await tx.writingClassVote.deleteMany({ where: { voterId: userId } });
            await tx.user.delete({ where: { id: userId } });
        });

        logger.warn("Admin deleted a never-engaged student account", {
            deletedUserId: user.id,
            deletedUsername: user.username,
            byUserId: session.user.id,
        });

        return NextResponse.json({
            success: true,
            deleted: { id: user.id, username: user.username },
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to delete user",
            userId: session.user.id,
            path: "/api/admin/users/[userId]",
        });
    }
}
