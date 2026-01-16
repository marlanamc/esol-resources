import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsReviewContent } from "@/content/grammar/conditionals-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Conditionals Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master all conditional types (zero, first, second) with side-by-side comparisons and decision tools to choose the right one.",
};

export default async function ConditionalsReviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Conditionals Review Guide",
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
                content={conditionalsReviewContent}
                completionKey="conditionals-review"
                activityId={activityId}
            />
        </div>
    );
}
