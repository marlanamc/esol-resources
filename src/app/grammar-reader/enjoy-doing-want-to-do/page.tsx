import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { enjoyDoingWantToDoContent } from "@/content/grammar/enjoy-doing-want-to-do";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Enjoy Doing vs. Want to Do - Interactive Grammar Guide | Class Companion",
    description: "Learn which verbs take a gerund and which take an infinitive, using real conversations about work and career goals.",
};

export default async function EnjoyDoingWantToDoPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Enjoy Doing vs. Want to Do",
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
                content={enjoyDoingWantToDoContent}
                completionKey="enjoy-doing-want-to-do"
                activityId={activityId}
            />
        </div>
    );
}
