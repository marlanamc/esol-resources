import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsInfinitivesPatternsContent } from "@/content/grammar/gerunds-infinitives-patterns";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Gerunds & Infinitives Patterns - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Merge gerund and infinitive patterns so you solidify intention vs routine, practice verbs + prepositions, and talk about housing, jobs, and health with more confidence.",
};

export default async function GerundsInfinitivesPatternsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Gerunds & Infinitives Patterns Guide",
        "guide",
        "grammar"
    );

    if ((session.user as any).role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true }
        });

        if (!activity?.isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={gerundsInfinitivesPatternsContent}
                completionKey="gerunds-infinitives-patterns"
                activityId={activityId}
            />
        </div>
    );
}
