import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { beUsedToGetUsedToContent } from "@/content/grammar/be-used-to-get-used-to";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Be Used to / Get Used to - Interactive Guide | Class Companion",
  description: "Learn be used to and get used to with gerunds through night shifts, winter commutes, school emails, and still adjusting to life in Boston.",
};

export default async function BeUsedToGetUsedToPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "Be Used to / Get Used to",
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
        content={beUsedToGetUsedToContent}
        completionKey="be-used-to-get-used-to"
        activityId={activityId}
      />
    </div>
  );
}
