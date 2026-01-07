import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { reportedSpeechContent } from "@/content/grammar/reported-speech";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Reported Speech - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master reported speech (indirect speech) for communicating messages from MyChart, phone calls, and medical appointments. Learn say vs tell and tense backshifting.",
};

export default async function ReportedSpeechPage() {
    const activityId = await getActivityIdSafely(
        "Reported Speech Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={reportedSpeechContent}
                completionKey="reported-speech"
                activityId={activityId}
            />
        </div>
    );
}
