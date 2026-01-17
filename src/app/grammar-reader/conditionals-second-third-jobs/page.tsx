import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsSecondThirdContent } from "@/content/grammar/conditionals-second-third";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Second & Third Conditionals: Jobs - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Second & Third Conditionals with exercises and examples. Learn to use second conditional for career advice and third conditional for reflecting on past job decisions.",
};

export default async function ConditionalsSecondThirdJobsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Second & Third Conditionals: Jobs Guide",
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
                content={conditionalsSecondThirdContent}
                completionKey="conditionals-second-third-jobs"
                activityId={activityId}
            />
        </div>
    );
}
