import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentSimpleContent } from "@/content/grammar/present-simple";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Simple tense with exercises, examples, and practice. Learn when and how to use Present Simple correctly.",
};

export default async function PresentSimplePage() {
    // Fetch the activity ID for progress tracking
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Present Simple Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentSimpleContent}
                completionKey="present-simple"
                activityId={activity?.id}
            />
        </div>
    );
}
