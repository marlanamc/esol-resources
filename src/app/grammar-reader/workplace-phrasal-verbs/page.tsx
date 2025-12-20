import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { workplacePhrasalVerbsContent } from "@/content/grammar/workplace-phrasal-verbs";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Workplace Phrasal Verbs - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master essential workplace phrasal verbs: clock in/out, fill out forms, call back, cover for, and more. Learn the secret language of professional communication.",
};

export default async function WorkplacePhrasalVerbsPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Workplace Phrasal Verbs Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={workplacePhrasalVerbsContent}
                completionKey="workplace-phrasal-verbs"
                activityId={activity?.id}
            />
        </div>
    );
}
