import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { itWasHappeningWhenContent } from "@/content/grammar/it-was-happening-when";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "It Was Happening When: Past Tenses in Housing Stories - Interactive Guide | Class Companion",
    description: "Practice past simple and past continuous in a real housing emergency — pipe burst at midnight, telling the landlord what was happening.",
};

export default async function ItWasHappeningWhenPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "It Was Happening When: Past Tenses in Housing Stories",
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
                content={itWasHappeningWhenContent}
                completionKey="it-was-happening-when"
                activityId={activityId}
            />
        </div>
    );
}
