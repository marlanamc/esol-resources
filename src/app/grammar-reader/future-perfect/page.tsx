import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futurePerfectContent } from "@/content/grammar/future-perfect";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Perfect tense with exercises, examples, and practice. Learn when and how to use Future Perfect correctly.",
};

export default async function FuturePerfectPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Future Perfect Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futurePerfectContent}
                completionKey="future-perfect"
                activityId={activity?.id}
            />
        </div>
    );
}
