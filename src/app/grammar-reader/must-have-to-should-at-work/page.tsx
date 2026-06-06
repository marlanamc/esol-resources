import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { mustHaveToShouldAtWorkContent } from "@/content/grammar/must-have-to-should-at-work";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Must, Have to, Should at Work - Interactive Guide | Class Companion",
    description: "Learn when to use must, have to, and should for workplace rules, employer requirements, and job advice.",
};

export default async function MustHaveToShouldAtWorkPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Must, Have to, Should at Work",
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
                content={mustHaveToShouldAtWorkContent}
                completionKey="must-have-to-should-at-work"
                activityId={activityId}
            />
        </div>
    );
}
