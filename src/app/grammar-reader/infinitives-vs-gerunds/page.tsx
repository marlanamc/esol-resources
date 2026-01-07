import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { infinitivesVsGerundsContent } from "@/content/grammar/infinitives-vs-gerunds";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Infinitives vs Gerunds - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master when to use infinitives (to + verb) vs gerunds (-ing): decide to, enjoy -ing, stop meanings. Essential for job applications and professional communication.",
};

export default async function InfinitivesVsGerundsPage() {
    const activityId = await getActivityIdSafely(
        "Infinitives vs Gerunds Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={infinitivesVsGerundsContent}
                completionKey="infinitives-vs-gerunds"
                activityId={activityId}
            />
        </div>
    );
}
