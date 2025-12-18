import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futurePerfectContinuousContent } from "@/content/grammar/future-perfect-continuous";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Future Perfect Continuous correctly.",
};

export default async function FuturePerfectContinuousPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Future Perfect Continuous Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futurePerfectContinuousContent}
                completionKey="future-perfect-continuous"
                activityId={activity?.id}
            />
        </div>
    );
}
