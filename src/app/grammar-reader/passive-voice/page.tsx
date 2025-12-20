import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { passiveVoiceContent } from "@/content/grammar/passive-voice";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Passive Voice - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master passive voice (is/are/was/were + past participle) for understanding medical instructions, clinic procedures, and formal communication.",
};

export default async function PassiveVoicePage() {
    const activity = await prisma.activity.findFirst({
        where: {
            title: "Passive Voice Guide",
            type: "guide",
            category: "grammar"
        },
        select: { id: true }
    });

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={passiveVoiceContent}
                completionKey="passive-voice"
                activityId={activity?.id}
            />
        </div>
    );
}
