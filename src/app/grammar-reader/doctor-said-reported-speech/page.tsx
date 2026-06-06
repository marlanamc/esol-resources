import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { doctorSaidReportedSpeechContent } from "@/content/grammar/doctor-said-reported-speech";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "The Doctor Said: Reported Speech - Interactive Guide | Class Companion",
  description: "Learn reported speech through a real clinic call about a child's asthma inhaler.",
};

export default async function DoctorSaidReportedSpeechPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activityId = await getActivityIdSafely(
    "The Doctor Said: Reported Speech",
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
        content={doctorSaidReportedSpeechContent}
        completionKey="doctor-said-reported-speech"
        activityId={activityId}
      />
    </div>
  );
}
