import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { simpleTensesReviewContent } from "@/content/grammar/simple-tenses-review";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simple Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Simple Tenses Review tense with exercises, examples, and practice. Learn when and how to use Simple Tenses Review correctly.",
};

export default function SimpleTensesReviewPage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={simpleTensesReviewContent} />
        </div>
    );
}
