import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsPrepositionsContent } from "@/content/grammar/gerunds-prepositions";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Gerunds After Prepositions - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master gerunds after prepositions: interested in, good at, by + -ing, thank you for. Essential patterns for job applications and professional communication.",
};

export default async function GerundsPrepositionsPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Gerunds After Prepositions Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={gerundsPrepositionsContent}
                completionKey="gerunds-prepositions"
                activityId={activity?.id}
            />
        </div>
    );
}
