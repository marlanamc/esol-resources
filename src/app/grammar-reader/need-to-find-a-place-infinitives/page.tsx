import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { needToFindAPlaceInfinitivesContent } from "@/content/grammar/need-to-find-a-place-infinitives";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "I Need to Find a Place: Infinitives - Interactive Guide | Class Companion",
    description: "Learn infinitives after want, need, hope, plan, and would like — in a real housing search scenario.",
};

export default async function NeedToFindAPlaceInfinitivesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "I Need to Find a Place: Infinitives",
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
                content={needToFindAPlaceInfinitivesContent}
                completionKey="need-to-find-a-place-infinitives"
                activityId={activityId}
            />
        </div>
    );
}
