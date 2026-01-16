import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsZeroFirstContent } from "@/content/grammar/conditionals-zero-first";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Zero & First Conditionals - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Compare and master zero conditional (always true facts/habits) vs first conditional (real future possibilities) with wellness goals and action plans.",
};

export default async function ConditionalsZeroFirstPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Zero & First Conditionals Guide",
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
                content={conditionalsZeroFirstContent}
                completionKey="conditionals-zero-first"
                activityId={activityId}
            />
        </div>
    );
}
