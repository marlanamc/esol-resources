import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { cycleOneReviewContent } from "@/content/grammar/cycle-1-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Cycle 1 Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "A gentle flow through Cycle 1 grammar: simple, continuous, parts of speech, frequency, comparatives, and connectors with a final mini-quiz.",
};

export default async function Cycle1ReviewPage() {
    const activityId = await getActivityIdSafely(
        "Cycle 1 Review",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={cycleOneReviewContent}
                completionKey="cycle-1-review"
                activityId={activityId}
            />
        </div>
    );
}
