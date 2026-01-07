import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { imperativesDeclarativesContent } from "@/content/grammar/imperatives-declaratives";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Imperatives vs Declaratives - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Understand the difference between commands (imperatives) and statements (declaratives). Master tone and politeness in medical and professional communication.",
};

export default async function ImperativesDeclarativesPage() {
    const activityId = await getActivityIdSafely(
        "Imperatives vs Declaratives Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={imperativesDeclarativesContent}
                completionKey="imperatives-declaratives"
                activityId={activityId}
            />
        </div>
    );
}
