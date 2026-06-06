import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { iveBeenWorkingContent } from "@/content/grammar/ive-been-working";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "I've Been Working: Present Perfect Continuous - Interactive Guide | Class Companion",
    description: "Learn the Present Perfect Continuous with real workplace scenes: construction sites, bus stops, hotel housekeeping, and job fairs.",
};

export default async function IveBeenWorkingPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "I've Been Working: Present Perfect Continuous",
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
                content={iveBeenWorkingContent}
                completionKey="ive-been-working"
                activityId={activityId}
            />
        </div>
    );
}
