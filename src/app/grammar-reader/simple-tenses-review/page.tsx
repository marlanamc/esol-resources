import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { simpleTensesReviewContent } from "@/content/grammar/simple-tenses-review";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Simple Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Simple Tenses Review tense with exercises, examples, and practice. Learn when and how to use Simple Tenses Review correctly.",
};

export default async function SimpleTensesReviewPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Simple Tenses Review", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={simpleTensesReviewContent}
                completionKey="simple-tenses-review"
                activityId={activity?.id}
            />
        </div>
    );
}
