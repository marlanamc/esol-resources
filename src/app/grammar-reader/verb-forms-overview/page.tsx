import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { verbFormsOverviewContent } from "@/content/grammar/verb-forms-overview";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Verb Forms Overview - Interactive Guide | ESOL Teacher Resources",
    description:
        "Learn the five verb form codes (V1, V1-3rd, V1-ing, V2, V3) used on weekly verb quizzes. Bite-sized intro before your first quiz.",
};

export default async function VerbFormsOverviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Verb Forms Overview",
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
                content={verbFormsOverviewContent}
                completionKey="verb-forms-overview"
                activityId={activityId}
            />
        </div>
    );
}
