import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { allVerbTensesOverviewContent } from "@/content/grammar/all-verb-tenses-overview";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "All Verb Tenses Overview - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master all 12 English verb tenses with a complete timeline and usage guide. Perfect for comprehensive review and final presentations.",
};

export default async function AllVerbTensesOverviewPage() {
    const activityId = await getActivityIdSafely(
        "All Verb Tenses Overview Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={allVerbTensesOverviewContent}
                completionKey="all-verb-tenses-overview"
                activityId={activityId}
            />
        </div>
    );
}
