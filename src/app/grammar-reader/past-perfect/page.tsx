import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectContent } from "@/content/grammar/past-perfect";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Past Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Perfect tense with exercises, examples, and practice. Learn the TWO-VERB rule and how to show which action happened first.",
};

export default async function PastPerfectPage() {
    const activityId = await getActivityIdSafely(
        "Past Perfect Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastPerfectContent}
                completionKey="past-perfect"
                activityId={activityId}
            />
        </div>
    );
}
