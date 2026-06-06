import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { canShouldMustContent } from "@/content/grammar/can-should-must";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Can, Should, Must - Interactive Guide | Class Companion",
    description: "Learn to use can, should, and must in real digital safety situations.",
};

export default async function CanShouldMustPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Can, Should, Must",
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
                content={canShouldMustContent}
                completionKey="can-should-must"
                activityId={activityId}
            />
        </div>
    );
}
