import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { iUsedToButNowIContent } from "@/content/grammar/i-used-to-but-now-i";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "I Used to, but Now I... - Interactive Guide | Class Companion",
  description: "Learn used to and didn't use to for past habits that changed, through a life-before-and-after-Boston scenario.",
};

export default async function IUsedToButNowIPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "I Used to, but Now I...",
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
        content={iUsedToButNowIContent}
        completionKey="i-used-to-but-now-i"
        activityId={activityId}
      />
    </div>
  );
}
