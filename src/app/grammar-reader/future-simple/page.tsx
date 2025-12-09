import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureSimpleContent } from "@/content/grammar/future-simple";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Future Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Simple tense with exercises, examples, and practice. Learn when and how to use Future Simple correctly.",
};

export default function FutureSimplePage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={futureSimpleContent} completionKey="future-simple" />
        </div>
    );
}
