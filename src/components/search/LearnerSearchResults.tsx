"use client";

import Link from "next/link";
import type { RefObject } from "react";
import type { LearnerSearchContext, LearnerSearchResult } from "@/lib/learner-search/types";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

type Props = {
    context: LearnerSearchContext;
    query: string;
    results: LearnerSearchResult[];
    resultRefs: RefObject<Array<HTMLAnchorElement | null>>;
    totalCount: number;
    onResultClick: (result: LearnerSearchResult) => void;
    onResultKeyMove: (index: number, direction: 1 | -1) => void;
    showSuggestions: boolean;
};

export function LearnerSearchResults({
    context,
    query,
    results,
    resultRefs,
    totalCount,
    onResultClick,
    onResultKeyMove,
    showSuggestions,
}: Props) {
    if (results.length === 0 && query.trim().length === 0) {
        return (
            <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
                <h2 className="text-lg font-bold text-text">Try a search like:</h2>
                <p className="mt-2 text-sm text-text-muted">Use simple words you remember. Search works best with topic names, activity names, and common classroom words.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {["present simple", "job interview", "doctor", "speaking", "grammar questions"].map((example) => (
                        <span
                            key={example}
                            className="rounded-full border px-3 py-1.5 text-sm"
                            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-subtle)" }}
                        >
                            {example}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
                <h2 className="text-lg font-bold text-text">No matches yet</h2>
                <p className="mt-2 text-sm text-text-muted">
                    Try a shorter phrase, a topic word like <span className="font-semibold text-text">grammar</span> or <span className="font-semibold text-text">work</span>, or switch filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-text-muted">
                    {showSuggestions ? "Suggested places to start" : `${totalCount} result${totalCount === 1 ? "" : "s"}`}
                </p>
                <p className="sr-only" aria-live="polite">
                    {totalCount} results available for {query || "search suggestions"} in {context}
                </p>
            </div>
            <div className="grid gap-3">
                {results.map((result, index) => (
                    (() => {
                        const tone = getLearnerCategoryTone(result.category);

                        return (
                    <Link
                        key={result.id}
                        href={result.href}
                        aria-label={result.title}
                        ref={(node) => {
                            resultRefs.current[index] = node;
                        }}
                        onClick={() => onResultClick(result)}
                        onKeyDown={(event) => {
                            if (event.key === "ArrowDown") {
                                event.preventDefault();
                                onResultKeyMove(index, 1);
                            }
                            if (event.key === "ArrowUp") {
                                event.preventDefault();
                                onResultKeyMove(index, -1);
                            }
                        }}
                        className="group rounded-2xl border p-4 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
                    >
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted">
                            {result.category ? (
                                <span
                                    className="rounded-full border px-2.5 py-1"
                                    style={{
                                        borderColor: tone.border,
                                        backgroundColor: tone.chipBg,
                                        color: tone.chipText,
                                    }}
                                >
                                    {result.category}
                                </span>
                            ) : null}
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-text transition-colors group-hover:text-primary">{result.title}</h3>
                        {result.description ? (
                            <p className="mt-2 text-sm leading-relaxed text-text-muted">
                                {result.description}
                            </p>
                        ) : null}
                    </Link>
                        );
                    })()
                ))}
            </div>
        </div>
    );
}
