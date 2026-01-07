import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futurePerfectContinuousContent } from "@/content/grammar/future-perfect-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Future Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Future Perfect Continuous correctly.",
};

export default async function FuturePerfectContinuousPage() {
    const activityId = await getActivityIdSafely(
        "Future Perfect Continuous Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futurePerfectContinuousContent}
                completionKey="future-perfect-continuous"
                activityId={activityId}
            />
        </div>
    );
}
