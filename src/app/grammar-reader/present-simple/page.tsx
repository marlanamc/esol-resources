import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentSimpleContent } from "@/content/grammar/present-simple";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Present Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Simple tense with exercises, examples, and practice. Learn when and how to use Present Simple correctly.",
};

export default function PresentSimplePage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={presentSimpleContent} completionKey="present-simple" />
        </div>
    );
}
