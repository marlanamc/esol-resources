import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { imperativesDeclarativesContent } from "@/content/grammar/imperatives-declaratives";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Imperatives vs Declaratives - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Understand the difference between commands (imperatives) and statements (declaratives). Master tone and politeness in medical and professional communication.",
};

export default async function ImperativesDeclarativesPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Imperatives vs Declaratives Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={imperativesDeclarativesContent}
                completionKey="imperatives-declaratives"
                activityId={activity?.id}
            />
        </div>
    );
}
