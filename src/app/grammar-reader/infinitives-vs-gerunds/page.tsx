import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { infinitivesVsGerundsContent } from "@/content/grammar/infinitives-vs-gerunds";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Infinitives vs Gerunds - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master when to use infinitives (to + verb) vs gerunds (-ing): decide to, enjoy -ing, stop meanings. Essential for job applications and professional communication.",
};

export default async function InfinitivesVsGerundsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Infinitives vs Gerunds Guide",
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
                content={infinitivesVsGerundsContent}
                completionKey="infinitives-vs-gerunds"
                activityId={activityId}
            />
        </div>
    );
}
