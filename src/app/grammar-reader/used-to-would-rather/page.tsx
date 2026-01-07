import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { usedToWouldRatherContent } from "@/content/grammar/used-to-would-rather";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Used To & Would Rather - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master past habits with 'used to' and 'would', and express preferences with 'would rather'. Essential for discussing health changes, work history, and lifestyle goals.",
};

export default async function UsedToWouldRatherPage() {
    const activityId = await getActivityIdSafely(
        "Used To & Would Rather Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={usedToWouldRatherContent}
                completionKey="used-to-would-rather"
                activityId={activityId}
            />
        </div>
    );
}
