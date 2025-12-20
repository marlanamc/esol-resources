import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { paragraphFormatContent } from "@/content/grammar/paragraph-format";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Paragraph Format - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master paragraph structure: topic sentence, supporting details, and conclusion. Essential for academic and professional writing.",
};

export default async function ParagraphFormatPage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Paragraph Format Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={paragraphFormatContent}
                completionKey="paragraph-format"
                activityId={activity?.id}
            />
        </div>
    );
}
