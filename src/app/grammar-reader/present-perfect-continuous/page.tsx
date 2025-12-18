import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentPerfectContinuousContent } from "@/content/grammar/present-perfect-continuous";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Present Perfect Continuous correctly.",
};

export default async function PresentPerfectContinuousPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Present Perfect Continuous Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentPerfectContinuousContent}
                completionKey="present-perfect-continuous"
                activityId={activity?.id}
            />
        </div>
    );
}
