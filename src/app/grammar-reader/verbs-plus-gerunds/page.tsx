import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { verbsPlusGerundsContent } from "@/content/grammar/verbs-plus-gerunds";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Verbs + Gerunds - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master verbs that take gerunds: avoid, enjoy, finish, keep, stop, quit, and more. Essential for discussing habits and wellness goals.",
};

export default async function VerbsPlusGerundsPage() {
    const activityId = await getActivityIdSafely(
        "Verbs + Gerunds Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={verbsPlusGerundsContent}
                completionKey="verbs-plus-gerunds"
                activityId={activityId}
            />
        </div>
    );
}
