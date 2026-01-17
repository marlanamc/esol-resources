import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectJobsContent } from "@/content/grammar/past-perfect-jobs";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Perfect: Jobs - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Perfect tense with exercises, examples, and practice. Learn to describe professional experience, career timelines, and workplace accomplishments.",
};

export default async function PastPerfectJobsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Past Perfect: Jobs Guide",
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
                content={pastPerfectJobsContent}
                completionKey="past-perfect-jobs"
                activityId={activityId}
            />
        </div>
    );
}
