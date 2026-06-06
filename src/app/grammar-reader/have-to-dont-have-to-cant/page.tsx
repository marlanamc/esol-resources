import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { haveToDontHaveToCantContent } from "@/content/grammar/have-to-dont-have-to-cant";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Have to, Don't Have to, Can't - Interactive Guide | Class Companion",
    description: "Learn obligation and prohibition modals through real tenant rights scenarios in East Boston.",
};

export default async function HaveToDontHaveToCantPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Have to, Don't Have to, Can't",
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
                content={haveToDontHaveToCantContent}
                completionKey="have-to-dont-have-to-cant"
                activityId={activityId}
            />
        </div>
    );
}
