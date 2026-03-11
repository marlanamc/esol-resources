import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { getVocabReviewSummaryForUser } from "@/lib/vocab-review";

function noStoreJson<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const authErr = requireAuth(session);
  if (authErr) return authErr;
  const userId = (session!.user as { id: string }).id;

  try {
    const summary = await getVocabReviewSummaryForUser(prisma, userId);
    return noStoreJson(summary);
  } catch (error) {
    console.error("Failed to load vocab review summary", error);
    return noStoreJson({ error: "Failed to load review summary" }, 500);
  }
}
