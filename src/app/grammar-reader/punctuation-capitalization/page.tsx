import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { punctuationCapitalizationContent } from "@/content/grammar/punctuation-capitalization";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Punctuation & Capitalization - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master punctuation and capitalization rules for professional writing. Learn commas, apostrophes, quotation marks, and capital letters.",
};

export default async function PunctuationCapitalizationPage() {
    const activityId = await getActivityIdSafely(
        "Punctuation & Capitalization Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={punctuationCapitalizationContent}
                completionKey="punctuation-capitalization"
                activityId={activityId}
            />
        </div>
    );
}
