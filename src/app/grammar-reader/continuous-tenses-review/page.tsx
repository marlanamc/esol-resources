import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { continuousTensesReviewContent } from "@/content/grammar/continuous-tenses-review";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Continuous Tenses Review tense with exercises, examples, and practice. Learn when and how to use Continuous Tenses Review correctly.",
};

export default function ContinuousTensesReviewPage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={continuousTensesReviewContent} completionKey="continuous-tenses-review" />
        </div>
    );
}
