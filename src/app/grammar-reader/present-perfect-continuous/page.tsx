import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentPerfectContinuousContent } from "@/content/grammar/present-perfect-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Present Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Present Perfect Continuous correctly.",
};

export default async function PresentPerfectContinuousPage() {
    const activityId = await getActivityIdSafely(
        "Present Perfect Continuous Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentPerfectContinuousContent}
                completionKey="present-perfect-continuous"
                activityId={activityId}
            />
        </div>
    );
}
