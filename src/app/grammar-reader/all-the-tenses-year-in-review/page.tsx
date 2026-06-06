import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { allTheTensesYearInReviewContent } from "@/content/grammar/all-the-tenses-year-in-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "All the Tenses: A Year in Review - Interactive Guide | Class Companion",
  description:
    "Review all eleven Level 3 tenses through Rosa's real year of restaurant shifts, evening class, kids' school, and the 121 bus home.",
};

export default async function AllTheTensesYearInReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "All the Tenses: A Year in Review",
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
        content={allTheTensesYearInReviewContent}
        completionKey="all-the-tenses-year-in-review"
        activityId={activityId}
      />
    </div>
  );
}
