import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { passiveVoiceContent } from "@/content/grammar/passive-voice";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Passive Voice - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master passive voice (is/are/was/were + past participle) for understanding medical instructions, clinic procedures, and formal communication.",
};

export default async function PassiveVoicePage() {
    const activityId = await getActivityIdSafely(
        "Passive Voice Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={passiveVoiceContent}
                completionKey="passive-voice"
                activityId={activityId}
            />
        </div>
    );
}
