import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsSecondContent } from "@/content/grammar/conditionals-second";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Second Conditional - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Express hypothetical and unlikely situations using if + past, would + verb. Perfect for dreams, advice, and 'what if' scenarios.",
};

export default async function ConditionalsSecondPage() {
    const activityId = await getActivityIdSafely(
        "Second Conditional Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={conditionalsSecondContent}
                completionKey="conditionals-second"
                activityId={activityId}
            />
        </div>
    );
}
