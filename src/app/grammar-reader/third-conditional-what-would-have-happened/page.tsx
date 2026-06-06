import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { thirdConditionalWhatWouldHaveHappenedContent } from "@/content/grammar/third-conditional-what-would-have-happened";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Third Conditional: What Would Have Happened - Interactive Guide | Class Companion",
  description: "Learn third conditional for past regrets through a real health and missed-shifts scenario.",
};

export default async function ThirdConditionalWhatWouldHaveHappenedPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "Third Conditional: What Would Have Happened",
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
        content={thirdConditionalWhatWouldHaveHappenedContent}
        completionKey="third-conditional-what-would-have-happened"
        activityId={activityId}
      />
    </div>
  );
}
