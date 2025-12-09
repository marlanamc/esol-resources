import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureContinuousContent } from "@/content/grammar/future-continuous";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Future Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Continuous tense with exercises, examples, and practice. Learn when and how to use Future Continuous correctly.",
};

export default function FutureContinuousPage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={futureContinuousContent} completionKey="future-continuous" />
        </div>
    );
}
