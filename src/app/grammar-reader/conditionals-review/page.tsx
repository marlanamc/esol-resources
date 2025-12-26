import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsReviewContent } from "@/content/grammar/conditionals-review";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Conditionals Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master all conditional types (zero, first, second) with side-by-side comparisons and decision tools to choose the right one.",
};

export default async function ConditionalsReviewPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Conditionals Review Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={conditionalsReviewContent}
                completionKey="conditionals-review"
                activityId={activity?.id}
            />
        </div>
    );
}
