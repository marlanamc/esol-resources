import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { requireAuth, type SessionUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 2000;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;

  const user = session!.user as SessionUser;
  const userId = user.id;

  if (user.role !== "student") {
    return NextResponse.json(
      { error: "Teacher accounts must contact support to delete" },
      { status: 403 }
    );
  }

  let body: { reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (reason.length < MIN_REASON_LENGTH) {
    return NextResponse.json(
      { error: `Please provide a reason (at least ${MIN_REASON_LENGTH} characters)` },
      { status: 400 }
    );
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return NextResponse.json(
      { error: "Reason is too long" },
      { status: 400 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
