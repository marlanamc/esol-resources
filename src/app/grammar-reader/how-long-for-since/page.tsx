import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { howLongForSinceContent } from "@/content/grammar/how-long-for-since";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "How Long + For and Since - Interactive Guide | Class Companion",
    description: "Learn to talk about duration using the present perfect with 'for' and 'since' in real East Boston situations: leases, jobs, phone plans, and the holiday season.",
};

export default async function HowLongForSincePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "How Long + For and Since",
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
                content={howLongForSinceContent}
                completionKey="how-long-for-since"
                activityId={activityId}
            />
        </div>
    );
}
