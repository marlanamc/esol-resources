import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectContinuousContent } from "@/content/grammar/past-perfect-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Past Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Past Perfect Continuous correctly.",
};

export default async function PastPerfectContinuousPage() {
    const activityId = await getActivityIdSafely(
        "Past Perfect Continuous Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastPerfectContinuousContent}
                completionKey="past-perfect-continuous"
                activityId={activityId}
            />
        </div>
    );
}
