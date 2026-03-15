import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { requireAuth, type SessionUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 2000;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const user = session!.user as SessionUser;
  const userId = user.id;

  if (user.role !== "student") {
    return ApiErrors.forbidden("Teacher accounts must contact support to delete");
  }

  let body: { reason?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", 400);
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (reason.length < MIN_REASON_LENGTH) {
    return apiError(`Please provide a reason (at least ${MIN_REASON_LENGTH} characters)`, 400);
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return apiError("Reason is too long", 400);
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  });

  if (!dbUser) {
    return ApiErrors.notFound("User", userId);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.accountDeletionRecord.create({
        data: {
          username: dbUser.username,
          role: dbUser.role,
          reason,
        },
      });

      await tx.pointsLedger.deleteMany({ where: { userId } });
      await tx.activityProgress.deleteMany({ where: { userId } });
      await tx.userAchievement.deleteMany({ where: { userId } });
      await tx.submission.deleteMany({ where: { userId } });
      await tx.classEnrollment.deleteMany({ where: { studentId: userId } });
      await tx.feedback.deleteMany({ where: { userId } });
      await tx.quizResponse.deleteMany({ where: { userId } });
      await tx.speakingSubmission.deleteMany({ where: { userId } });
      await tx.pushSubscription.deleteMany({ where: { userId } });
      await tx.userVocabReviewState.deleteMany({ where: { userId } });
      await tx.dailyHabitCompletion.deleteMany({ where: { userId } });
      await tx.userPreferences.deleteMany({ where: { userId } });

      await tx.user.delete({
        where: { id: userId },
      });
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: "Failed to delete account",
    });
  }

  return NextResponse.json({ ok: true });
}
