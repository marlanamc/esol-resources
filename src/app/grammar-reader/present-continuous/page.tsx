import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentContinuousContent } from "@/content/grammar/present-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Present Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Continuous tense with exercises, examples, and practice. Learn when and how to use Present Continuous correctly.",
};

export default async function PresentContinuousPage() {
    const activityId = await getActivityIdSafely(
        "Present Continuous Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentContinuousContent}
                completionKey="present-continuous"
                activityId={activityId}
            />
        </div>
    );
}
