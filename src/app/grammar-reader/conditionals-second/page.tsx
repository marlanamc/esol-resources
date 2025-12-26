import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { conditionalsSecondContent } from "@/content/grammar/conditionals-second";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Second Conditional - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Express hypothetical and unlikely situations using if + past, would + verb. Perfect for dreams, advice, and 'what if' scenarios.",
};

export default async function ConditionalsSecondPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Second Conditional Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={conditionalsSecondContent}
                completionKey="conditionals-second"
                activityId={activity?.id}
            />
        </div>
    );
}
