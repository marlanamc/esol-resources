import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { stopTakingOrStopToTakeContent } from "@/content/grammar/stop-taking-or-stop-to-take";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Stop Taking It or Stop to Take It? - Interactive Guide | Class Companion",
    description: "Master meaning-change verb pairs: stop doing vs. stop to do, try doing vs. try to do, remember doing vs. remember to do — using real pharmacy scenarios.",
};

export default async function StopTakingOrStopToTakePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Stop Taking It or Stop to Take It?",
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
                content={stopTakingOrStopToTakeContent}
                completionKey="stop-taking-or-stop-to-take"
                activityId={activityId}
            />
        </div>
    );
}
