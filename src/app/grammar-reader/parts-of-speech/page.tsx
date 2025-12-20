import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { partsOfSpeechContent } from "@/content/grammar/parts-of-speech";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Parts of Speech - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master the building blocks of English: nouns, verbs, adjectives, and adverbs. Learn to identify and use parts of speech with color-coding and real-world examples for adult learners.",
};

export default async function PartsOfSpeechPage() {
    // Fetch the activity ID for progress tracking
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Parts of Speech Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={partsOfSpeechContent}
                completionKey="parts-of-speech"
                activityId={activity?.id}
            />
        </div>
    );
}
