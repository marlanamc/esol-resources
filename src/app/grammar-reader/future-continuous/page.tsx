import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureContinuousContent } from "@/content/grammar/future-continuous";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Continuous tense with exercises, examples, and practice. Learn when and how to use Future Continuous correctly.",
};

export default async function FutureContinuousPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Future Continuous Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futureContinuousContent}
                completionKey="future-continuous"
                activityId={activity?.id}
            />
        </div>
    );
}
