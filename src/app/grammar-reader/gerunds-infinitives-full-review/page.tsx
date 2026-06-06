import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsInfinitivesFullReviewContent } from "@/content/grammar/gerunds-infinitives-full-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gerunds + Infinitives: Full Review - Interactive Guide | Class Companion",
  description: "Review gerunds after prepositions, infinitives after verbs, gerund verbs, and meaning-change pairs through one packed survival week with Marisol.",
};

export default async function GerundsInfinitivesFullReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "Gerunds + Infinitives: Full Review",
    "guide",
    "grammar"
  );

  if (session.user.role === "student" && activityId) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { isReleased: true },
    });
    if (!activity?.isReleased) redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg">
      <GrammarReader
        content={gerundsInfinitivesFullReviewContent}
        completionKey="gerunds-infinitives-full-review"
        activityId={activityId}
      />
    </div>
  );
}
