import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { partsOfSpeechContent } from "@/content/grammar/parts-of-speech";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Parts of Speech - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master the building blocks of English: nouns, verbs, adjectives, and adverbs. Learn to identify and use parts of speech with color-coding and real-world examples for adult learners.",
};

export default async function PartsOfSpeechPage() {
    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Parts of Speech Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={partsOfSpeechContent}
                completionKey="parts-of-speech"
                activityId={activityId}
            />
        </div>
    );
}
