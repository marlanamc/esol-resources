import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { askingRightQuestionsHousingContent } from "@/content/grammar/asking-right-questions-housing";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Asking the Right Questions About Housing - Interactive Guide | Class Companion",
    description: "Learn information questions and indirect questions in English using real housing situations: calling landlords, asking about rent, utilities, and whether children are allowed.",
};

export default async function AskingRightQuestionsHousingPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Asking the Right Questions About Housing",
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
                content={askingRightQuestionsHousingContent}
                completionKey="asking-right-questions-housing"
                activityId={activityId}
            />
        </div>
    );
}
