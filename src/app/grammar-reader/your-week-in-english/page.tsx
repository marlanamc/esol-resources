import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { yourWeekInEnglishContent } from "@/content/grammar/your-week-in-english";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Your Week in English - Interactive Guide | Class Companion",
    description: "Learn adverbs of frequency, present simple for routines, and time expressions to talk about your weekly schedule in English.",
};

export default async function YourWeekInEnglishPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Your Week in English",
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
                content={yourWeekInEnglishContent}
                completionKey="your-week-in-english"
                activityId={activityId}
            />
        </div>
    );
}
