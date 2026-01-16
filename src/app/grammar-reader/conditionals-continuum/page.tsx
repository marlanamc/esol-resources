import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsContinuumContent } from "@/content/grammar/conditionals-continuum";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Conditionals Continuum - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Follow zero, first, and second conditionals in one guide so you can talk about routines, job plans, and community possibilities with clarity.",
};

export default async function ConditionalsContinuumPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Conditionals Continuum Guide",
        "guide",
        "grammar"
    );

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
                content={conditionalsContinuumContent}
                completionKey="conditionals-continuum"
                activityId={activityId}
            />
        </div>
    );
}
