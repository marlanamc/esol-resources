import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsZeroFirstContent } from "@/content/grammar/conditionals-zero-first";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Zero & First Conditionals - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Compare and master zero conditional (always true facts/habits) vs first conditional (real future possibilities) with wellness goals and action plans.",
};

export default async function ConditionalsZeroFirstPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Zero & First Conditionals Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={conditionalsZeroFirstContent}
                completionKey="conditionals-zero-first"
                activityId={activity?.id}
            />
        </div>
    );
}
