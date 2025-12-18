import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { perfectContinuousTensesReviewContent } from "@/content/grammar/perfect-continuous-tenses-review";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Perfect Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Comprehensive review of Present Perfect Continuous, Past Perfect Continuous, and Future Perfect Continuous tenses with practice exercises.",
};

export default async function PerfectContinuousTensesReviewPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Perfect Continuous Tenses Review - Complete Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={perfectContinuousTensesReviewContent}
                completionKey="perfect-continuous-tenses-review"
                activityId={activity?.id}
            />
        </div>
    );
}
