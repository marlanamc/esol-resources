import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { phrasalVerbsAtWorkContent } from "@/content/grammar/phrasal-verbs-at-work";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Phrasal Verbs at Work - Interactive Grammar Guide | Class Companion",
    description: "Learn essential workplace phrasal verbs: clock in, fill out, call in sick, cover for, hand in, and more. Real work scenarios for ESOL learners.",
};

export default async function PhrasalVerbsAtWorkPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Phrasal Verbs at Work",
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
                content={phrasalVerbsAtWorkContent}
                completionKey="phrasal-verbs-at-work"
                activityId={activityId}
            />
        </div>
    );
}
