import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { reportedSpeechContent } from "@/content/grammar/reported-speech";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Reported Speech - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Healthcare-themed reported speech (indirect speech): follow a clinic day with photos, dialogues, and mixed practice for MyChart, reception, exam rooms, pharmacy, and discharge. Say vs tell, tense backshift, and commands.",
};

export default async function ReportedSpeechPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Reported Speech Guide",
        "guide",
        "grammar"
    );

    // SECURITY: Block student access to unreleased guides
    if (session.user.role === "student" && activityId) {
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
                content={reportedSpeechContent}
                completionKey="reported-speech"
                activityId={activityId}
            />
        </div>
    );
}
