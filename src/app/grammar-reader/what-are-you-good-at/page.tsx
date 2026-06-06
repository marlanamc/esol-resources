import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { whatAreYouGoodAtContent } from "@/content/grammar/what-are-you-good-at";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "What Are You Good At? - Interactive Guide | Class Companion",
    description: "Learn gerunds after prepositions — good at, interested in, tired of, afraid of — through real job scenarios in East Boston.",
};

export default async function WhatAreYouGoodAtPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "What Are You Good At?",
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
                content={whatAreYouGoodAtContent}
                completionKey="what-are-you-good-at"
                activityId={activityId}
            />
        </div>
    );
}
