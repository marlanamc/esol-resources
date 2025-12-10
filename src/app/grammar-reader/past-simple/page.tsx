import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastSimpleContent } from "@/content/grammar/past-simple";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Simple tense with exercises, examples, and practice. Learn when and how to use Past Simple correctly.",
};

export default async function PastSimplePage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Past Simple Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastSimpleContent}
                completionKey="past-simple"
                activityId={activity?.id}
            />
        </div>
    );
}
