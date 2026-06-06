import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { passiveVoiceWhatWasDoneContent } from "@/content/grammar/passive-voice-what-was-done";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Passive Voice: What Was Done - Interactive Guide | Class Companion",
    description: "Learn passive voice in English using real workplace scenarios: job ads, first-day paperwork, and schedule changes.",
};

export default async function PassiveVoiceWhatWasDonePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Passive Voice: What Was Done",
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
                content={passiveVoiceWhatWasDoneContent}
                completionKey="passive-voice-what-was-done"
                activityId={activityId}
            />
        </div>
    );
}
