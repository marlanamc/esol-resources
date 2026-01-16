import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureConditionalContent } from "@/content/grammar/future-conditional";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Conditional - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master first conditional (if + present, will + verb) for planning wellness goals, managing stress, and expressing cause-and-effect relationships.",
};

export default async function FutureConditionalPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Future Conditional Guide",
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
                content={futureConditionalContent}
                completionKey="future-conditional"
                activityId={activityId}
            />
        </div>
    );
}
