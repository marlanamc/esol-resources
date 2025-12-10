import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastContinuousContent } from "@/content/grammar/past-continuous";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Continuous tense with exercises, examples, and practice. Learn when and how to use Past Continuous correctly.",
};

export default async function PastContinuousPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Past Continuous Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastContinuousContent}
                completionKey="past-continuous"
                activityId={activity?.id}
            />
        </div>
    );
}
