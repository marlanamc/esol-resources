import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsPrepositionsContent } from "@/content/grammar/gerunds-prepositions";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Gerunds After Prepositions - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master gerunds after prepositions: interested in, good at, by + -ing, thank you for. Essential patterns for job applications and professional communication.",
};

export default async function GerundsPrepositionsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Gerunds After Prepositions Guide",
        "guide",
        "grammar"
    );

    // SECURITY: Block student access to unreleased guides
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
                content={gerundsPrepositionsContent}
                completionKey="gerunds-prepositions"
                activityId={activityId}
            />
        </div>
    );
}
