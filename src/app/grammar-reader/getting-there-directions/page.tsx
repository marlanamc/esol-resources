import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gettingThereDirectionsContent } from "@/content/grammar/getting-there-directions";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Getting There: Directions + Imperatives - Interactive Guide | Class Companion",
    description:
        "Learn affirmative and negative imperatives plus prepositions of location to give and follow directions in your neighborhood.",
};

export default async function GettingThereDirectionsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Getting There: Directions + Imperatives",
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
                content={gettingThereDirectionsContent}
                completionKey="getting-there-directions"
                activityId={activityId}
            />
        </div>
    );
}
