import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { zeroFirstConditionalContent } from "@/content/grammar/zero-first-conditional";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Zero + First Conditional: If This, Then That - Interactive Guide | Class Companion",
    description: "Learn Zero and First Conditionals through real workplace scenarios: shift rules, pay policies, and holiday overtime decisions.",
};

export default async function ZeroFirstConditionalPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Zero + First Conditional: If This, Then That",
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
                content={zeroFirstConditionalContent}
                completionKey="zero-first-conditional"
                activityId={activityId}
            />
        </div>
    );
}
