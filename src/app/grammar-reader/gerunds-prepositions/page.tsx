import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsPrepositionsContent } from "@/content/grammar/gerunds-prepositions";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Gerunds After Prepositions - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master gerunds after prepositions: interested in, good at, by + -ing, thank you for. Essential patterns for job applications and professional communication.",
};

export default async function GerundsPrepositionsPage() {
    const activityId = await getActivityIdSafely(
        "Gerunds After Prepositions Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={gerundsPrepositionsContent}
                completionKey="gerunds-prepositions"
                activityId={activityId}
            />
        </div>
    );
}
