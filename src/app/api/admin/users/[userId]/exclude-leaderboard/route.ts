import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTeacherAdmin } from "@/lib/roles";

/**
 * PATCH /api/admin/users/[userId]/exclude-leaderboard
 * Toggle a user's excludeFromLeaderboard flag
 * Requires teacher_admin role
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canAccess = session.user.role === "teacher" && isTeacherAdmin(session.user);
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  const body = await req.json();
  const { excluded } = body;

  if (typeof excluded !== "boolean") {
    return NextResponse.json(
      { error: "Invalid request body: excluded must be a boolean" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { excludeFromLeaderboard: excluded },
    select: {
      id: true,
      username: true,
      excludeFromLeaderboard: true,
    },
  });

  return NextResponse.json({
    success: true,
    user: updated,
  });
}
