import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureConditionalContent } from "@/content/grammar/future-conditional";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Conditional - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master first conditional (if + present, will + verb) for planning wellness goals, managing stress, and expressing cause-and-effect relationships.",
};

export default async function FutureConditionalPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Future Conditional Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={futureConditionalContent}
                completionKey="future-conditional"
                activityId={activity?.id}
            />
        </div>
    );
}
