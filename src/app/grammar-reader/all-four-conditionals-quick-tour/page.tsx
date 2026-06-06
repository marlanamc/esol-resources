import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { allFourConditionalsQuickTourContent } from "@/content/grammar/all-four-conditionals-quick-tour";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "All Four Conditionals: A Quick Tour - Interactive Guide | Class Companion",
  description: "Review zero, first, second, and third conditionals side by side through one worker's bad week of lifting injuries, clinic visits, and missed shifts.",
};

export default async function AllFourConditionalsQuickTourPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "All Four Conditionals: A Quick Tour",
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
        content={allFourConditionalsQuickTourContent}
        completionKey="all-four-conditionals-quick-tour"
        activityId={activityId}
      />
    </div>
  );
}
