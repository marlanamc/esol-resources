import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { superlativesQuantifiersContent } from "@/content/grammar/superlatives-quantifiers";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Superlatives & Quantifiers - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master comparisons and quantities in English: superlatives (most/least/-est), quantifiers (many/much, few/little, fewer/less). Learn to compare apartments, jobs, and make better decisions with clear examples.",
};

export default async function SuperlativesQuantifiersPage() {
    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Superlatives & Quantifiers Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={superlativesQuantifiersContent}
                completionKey="superlatives-quantifiers"
                activityId={activityId}
            />
        </div>
    );
}
