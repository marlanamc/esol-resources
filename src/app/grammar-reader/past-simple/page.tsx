import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastSimpleContent } from "@/content/grammar/past-simple";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Past Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Simple tense with exercises, examples, and practice. Learn when and how to use Past Simple correctly.",
};

export default function PastSimplePage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={pastSimpleContent} completionKey="past-simple" />
        </div>
    );
}
