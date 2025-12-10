import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { continuousTensesReviewContent } from "@/content/grammar/continuous-tenses-review";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Continuous Tenses Review tense with exercises, examples, and practice. Learn when and how to use Continuous Tenses Review correctly.",
};

export default async function ContinuousTensesReviewPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Continuous Tenses Review", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={continuousTensesReviewContent}
                completionKey="continuous-tenses-review"
                activityId={activity?.id}
            />
        </div>
    );
}
