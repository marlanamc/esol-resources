"use client";

import { Search } from "lucide-react";
import { useLearnerSearch } from "@/components/search/LearnerSearchProvider";

type Props = {
    variant?: "icon" | "menu";
    className?: string;
    label?: string;
    onTriggered?: () => void;
};

export function LearnerSearchTrigger({ variant = "icon", className = "", label = "Search", onTriggered }: Props) {
    const { openSearch } = useLearnerSearch();

    if (variant === "menu") {
        return (
            <button
                type="button"
                onClick={() => {
                    onTriggered?.();
                    openSearch();
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-text transition-colors active:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
            >
                <Search className="h-5 w-5 text-[#c06d52]" aria-hidden />
                <span>{label}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => {
                onTriggered?.();
                openSearch();
            }}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className}`}
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
            aria-label="Open search"
        >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
