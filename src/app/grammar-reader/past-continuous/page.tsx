import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastContinuousContent } from "@/content/grammar/past-continuous";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Past Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Continuous tense with exercises, examples, and practice. Learn when and how to use Past Continuous correctly.",
};

export default function PastContinuousPage() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={pastContinuousContent} />
        </div>
    );
}
