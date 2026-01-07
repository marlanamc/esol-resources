import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentSimpleContent } from "@/content/grammar/present-simple";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Present Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Simple tense with exercises, examples, and practice. Learn when and how to use Present Simple correctly.",
};

export default async function PresentSimplePage() {
    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Present Simple Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentSimpleContent}
                completionKey="present-simple"
                activityId={activityId}
            />
        </div>
    );
}
