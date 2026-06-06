import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { moreLessTheMostContent } from "@/content/grammar/more-less-the-most";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "More, Less, the Most: Comparatives + Superlatives - Interactive Guide | Class Companion",
    description: "Compare prices, phone plans, and apartment listings using comparatives and superlatives in real East Boston situations.",
};

export default async function MoreLessTheMostPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "More, Less, the Most: Comparatives + Superlatives",
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
                content={moreLessTheMostContent}
                completionKey="more-less-the-most"
                activityId={activityId}
            />
        </div>
    );
}
