import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futurePerfectContent } from "@/content/grammar/future-perfect";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Future Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Perfect tense with exercises, examples, and practice. Learn when and how to use Future Perfect correctly.",
};

export default async function FuturePerfectPage() {
    const activityId = await getActivityIdSafely(
        "Future Perfect Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futurePerfectContent}
                completionKey="future-perfect"
                activityId={activityId}
            />
        </div>
    );
}
