import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectContinuousContent } from "@/content/grammar/past-perfect-continuous";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Past Perfect Continuous correctly.",
};

export default async function PastPerfectContinuousPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Past Perfect Continuous Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastPerfectContinuousContent}
                completionKey="past-perfect-continuous"
                activityId={activity?.id}
            />
        </div>
    );
}
