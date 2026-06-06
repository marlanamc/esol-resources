import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { shouldShouldntHealthAdviceContent } from "@/content/grammar/should-shouldnt-health-advice";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "You Should, You Shouldn't: Health Advice - Interactive Guide | Class Companion",
  description: "Learn advice modals — should, shouldn't, ought to, and had better — through a real clinic visit scenario.",
};

export default async function ShouldShouldntHealthAdvicePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "You Should, You Shouldn't: Health Advice",
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
        content={shouldShouldntHealthAdviceContent}
        completionKey="should-shouldnt-health-advice"
        activityId={activityId}
      />
    </div>
  );
}
