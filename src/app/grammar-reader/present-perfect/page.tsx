import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentPerfectContent } from "@/content/grammar/present-perfect";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Perfect - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Perfect tense with exercises, examples, and practice. Learn when and how to use Present Perfect correctly.",
};

export default async function PresentPerfectPage() {
    const activity = await prisma.activity.findFirst({
        where: { title: "Present Perfect Guide", type: "guide", category: "grammar" },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={presentPerfectContent}
                completionKey="present-perfect"
                activityId={activity?.id}
            />
        </div>
    );
}
