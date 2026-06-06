import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { haveYouEverContent } from "@/content/grammar/have-you-ever";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Have You Ever...? - Interactive Guide | Class Companion",
    description: "Learn to use 'Have you ever...?' for life experiences, contrast it with past simple, and practice short answers in real East Boston community situations.",
};

export default async function HaveYouEverPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Have You Ever...?",
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
                content={haveYouEverContent}
                completionKey="have-you-ever"
                activityId={activityId}
            />
        </div>
    );
}
