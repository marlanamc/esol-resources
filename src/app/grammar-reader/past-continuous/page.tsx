import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastContinuousContent } from "@/content/grammar/past-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Past Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Continuous tense with exercises, examples, and practice. Learn when and how to use Past Continuous correctly.",
};

export default async function PastContinuousPage() {
    const activityId = await getActivityIdSafely(
        "Past Continuous Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastContinuousContent}
                completionKey="past-continuous"
                activityId={activityId}
            />
        </div>
    );
}
