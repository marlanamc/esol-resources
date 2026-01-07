import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsZeroFirstContent } from "@/content/grammar/conditionals-zero-first";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Zero & First Conditionals - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Compare and master zero conditional (always true facts/habits) vs first conditional (real future possibilities) with wellness goals and action plans.",
};

export default async function ConditionalsZeroFirstPage() {
    const activityId = await getActivityIdSafely(
        "Zero & First Conditionals Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={conditionalsZeroFirstContent}
                completionKey="conditionals-zero-first"
                activityId={activityId}
            />
        </div>
    );
}
