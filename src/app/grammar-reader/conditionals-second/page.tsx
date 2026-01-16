import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsSecondContent } from "@/content/grammar/conditionals-second";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Second Conditional - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Express hypothetical and unlikely situations using if + past, would + verb. Perfect for dreams, advice, and 'what if' scenarios.",
};

export default async function ConditionalsSecondPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Second Conditional Guide",
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
                content={conditionalsSecondContent}
                completionKey="conditionals-second"
                activityId={activityId}
            />
        </div>
    );
}
