import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { welcomeBackTensesReviewContent } from "@/content/grammar/welcome-back-tenses-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Welcome Back: Tenses Review - Interactive Guide | Class Companion",
    description:
        "Review present and past simple and continuous tenses, then get a first look at V3 — the form you'll learn more about this year.",
};

export default async function WelcomeBackTensesReviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Welcome Back: Simple & Continuous Review + V3 Preview",
        "guide",
        "grammar"
    );

    if (session.user.role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true },
        });

        if (!activity?.isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={welcomeBackTensesReviewContent}
                completionKey="welcome-back-tenses-review"
                activityId={activityId}
            />
        </div>
    );
}
