import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { informationQuestionsContent } from "@/content/grammar/information-questions";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Information Questions - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master WH-questions in English: who, what, when, where, why, how. Learn question word order, how much vs how many, and essential housing and workplace questions for real-life situations.",
};

export default async function InformationQuestionsPage() {
    // Fetch the activity ID for progress tracking
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Information Questions Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={informationQuestionsContent}
                completionKey="information-questions"
                activityId={activity?.id}
            />
        </div>
    );
}
