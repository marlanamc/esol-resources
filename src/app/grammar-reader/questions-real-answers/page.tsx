import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { questionsRealAnswersContent } from "@/content/grammar/questions-real-answers";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Questions That Get Real Answers - Interactive Guide | Class Companion",
    description:
        "Learn how to form information questions with who, what, where, when, why, and how in real East Boston conversations.",
};

export default async function QuestionsRealAnswersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Questions That Get Real Answers",
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
                content={questionsRealAnswersContent}
                completionKey="questions-real-answers"
                activityId={activityId}
            />
        </div>
    );
}
