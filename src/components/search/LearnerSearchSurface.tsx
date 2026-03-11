"use client";

import { useEffect, useRef, useState, startTransition, type RefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { LearnerSearchFilterBar } from "@/components/search/LearnerSearchFilterBar";
import { LearnerSearchResults } from "@/components/search/LearnerSearchResults";
import { trackLearnerSearchEvent } from "@/lib/learner-search/client-analytics";
import type {
    LearnerSearchContext,
    LearnerSearchFilter,
    LearnerSearchResponse,
    LearnerSearchResult,
} from "@/lib/learner-search/types";

type Props = {
    context: LearnerSearchContext;
    initialResponse: LearnerSearchResponse;
    initialQuery: string;
    initialFilter: LearnerSearchFilter;
    limit: number;
    syncUrl?: boolean;
    alwaysFetchInitial?: boolean;
    onClose?: () => void;
    inputRef?: RefObject<HTMLInputElement | null>;
};

export function LearnerSearchSurface({
    context,
    initialResponse,
    initialQuery,
    initialFilter,
    limit,
    syncUrl = false,
    alwaysFetchInitial = false,
    onClose,
    inputRef,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const localInputRef = useRef<HTMLInputElement | null>(null);
    const resolvedInputRef = inputRef ?? localInputRef;
    const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const [query, setQuery] = useState(initialQuery);
    const [committedQuery, setCommittedQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState<LearnerSearchFilter>(initialFilter);
    const [response, setResponse] = useState(initialResponse);
    const [isLoading, setIsLoading] = useState(false);
    const initialKey = `${initialQuery}::${initialFilter}`;

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setCommittedQuery(query);
        }, 220);

        return () => window.clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const nextKey = `${committedQuery}::${activeFilter}`;
        if (!alwaysFetchInitial && nextKey === initialKey) {
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);
        trackLearnerSearchEvent({
            type: "query",
            context,
            query: committedQuery,
            filter: activeFilter,
        });

        if (syncUrl) {
            const params = new URLSearchParams();
            if (committedQuery.trim()) {
                params.set("q", committedQuery.trim());
            }
            if (activeFilter !== "all") {
                params.set("filter", activeFilter);
            }
            startTransition(() => {
                router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
            });
        }

        void fetch(`/api/search/learner?q=${encodeURIComponent(committedQuery)}&filter=${activeFilter}&limit=${limit}&context=${context}`, {
            signal: controller.signal,
            credentials: "same-origin",
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to search");
                }
                return res.json() as Promise<LearnerSearchResponse>;
            })
            .then((data) => {
                setResponse(data);
                if (data.totalCount === 0 && committedQuery.trim().length > 0) {
                    trackLearnerSearchEvent({
                        type: "zero_results",
                        context,
                        query: committedQuery,
                        filter: activeFilter,
                    });
                }
            })
            .catch((error) => {
                if (controller.signal.aborted) {
                    return;
                }
                console.error("Learner search failed", error);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [activeFilter, alwaysFetchInitial, committedQuery, context, initialKey, limit, pathname, router, syncUrl]);

    const handleFilterSelect = (filter: LearnerSearchFilter) => {
        setActiveFilter(filter);
        trackLearnerSearchEvent({
            type: "select_filter",
            context,
            query: committedQuery,
            filter,
        });
    };

    const handleResultClick = (result: LearnerSearchResult) => {
        trackLearnerSearchEvent({
            type: "click_result",
            context,
            query: committedQuery,
            filter: activeFilter,
            resultId: result.id,
            href: result.href,
        });
        onClose?.();
    };

    const moveFocusToResult = (index: number, direction: 1 | -1) => {
        const nextIndex = Math.max(0, Math.min(resultRefs.current.length - 1, index + direction));
        resultRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="space-y-4">
            <div className="rounded-[28px] border px-4 py-3 shadow-sm sm:px-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
                <label htmlFor={`${context}-learner-search`} className="sr-only">Search learner content</label>
                <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-text-muted" aria-hidden />
                    <input
                        id={`${context}-learner-search`}
                        ref={resolvedInputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "ArrowDown" && response.results.length > 0) {
                                event.preventDefault();
                                resultRefs.current[0]?.focus();
                            }
                            if (event.key === "Escape" && onClose) {
                                event.preventDefault();
                                onClose();
                            }
                        }}
                        placeholder="Search lessons, grammar, speaking, and tools"
                        className="h-12 w-full bg-transparent text-base text-text outline-none placeholder:text-text-muted"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                    {query.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-black/5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" aria-hidden />
                        </button>
                    ) : null}
                </div>
            </div>

            <LearnerSearchFilterBar
                activeFilter={activeFilter}
                filters={response.availableFilters}
                onSelect={handleFilterSelect}
            />

            {isLoading ? (
                <p className="text-sm text-text-muted" aria-live="polite">Searching…</p>
            ) : null}

            <LearnerSearchResults
                context={context}
                query={committedQuery}
                results={response.results}
                resultRefs={resultRefs}
                totalCount={response.totalCount}
                onResultClick={handleResultClick}
                onResultKeyMove={moveFocusToResult}
                showSuggestions={committedQuery.trim().length === 0}
            />
        </div>
    );
}
