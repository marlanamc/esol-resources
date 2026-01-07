import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { perfectTensesReviewContent } from "@/content/grammar/perfect-tenses-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Perfect Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Comprehensive review of Present Perfect, Past Perfect, and Future Perfect tenses with commonly confused tense comparisons and practice exercises.",
};

export default async function PerfectTensesReviewPage() {
    const activityId = await getActivityIdSafely(
        "Perfect Tenses Review - Complete Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={perfectTensesReviewContent}
                completionKey="perfect-tenses-review"
                activityId={activityId}
            />
        </div>
    );
}
