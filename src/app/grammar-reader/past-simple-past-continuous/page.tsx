import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastSimplePastContinuousContent } from "@/content/grammar/past-simple-past-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Simple + Past Continuous: Telling the Story - Interactive Grammar Guide | Class Companion",
    description:
        "Learn past simple for finished actions and past continuous for what was in progress. Practice with when, while, and real East Boston commute stories.",
};

export default async function PastSimplePastContinuousPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Past Simple + Past Continuous: Telling the Story",
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
                content={pastSimplePastContinuousContent}
                completionKey="past-simple-past-continuous"
                activityId={activityId}
            />
        </div>
    );
}
