import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { handleApiError } from "@/lib/api-response";
import { parseApiBody } from "@/lib/api/schemas";

const ExcludeLeaderboardBodySchema = z.object({
  excluded: z.boolean({ message: "excluded must be a boolean" }),
});

/**
 * PATCH /api/admin/users/[userId]/exclude-leaderboard
 * Toggle a user's excludeFromLeaderboard flag
 * Requires admin role
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canAccess = isAdmin(session.user);
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId } = await params;

    const rawBody = await req.json().catch(() => null);
    const parsed = parseApiBody(ExcludeLeaderboardBodySchema, rawBody);
    if (!parsed.ok) {
      return parsed.response;
    }
    const { excluded } = parsed.data;

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
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: "Failed to update leaderboard exclusion",
      userId: session.user.id,
      path: "/api/admin/users/exclude-leaderboard",
    });
  }
}
