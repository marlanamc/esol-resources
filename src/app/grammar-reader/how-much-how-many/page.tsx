import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { howMuchHowManyContent } from "@/content/grammar/how-much-how-many";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "How Much / How Many: Countable + Uncountable - Interactive Guide | Class Companion",
    description: "Learn to use much, many, a lot of, a few, and a little when shopping on a budget and feeding a family.",
};

export default async function HowMuchHowManyPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "How Much / How Many: Countable + Uncountable",
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
                content={howMuchHowManyContent}
                completionKey="how-much-how-many"
                activityId={activityId}
            />
        </div>
    );
}
