"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDocumentScrollLock } from "@/hooks/useDocumentScrollLock";
import { LearnerSearchSurface } from "@/components/search/LearnerSearchSurface";
import type { LearnerSearchFilter, LearnerSearchResponse } from "@/lib/learner-search/types";

type LearnerSearchContextValue = {
    openSearch: (options?: { query?: string; filter?: LearnerSearchFilter }) => void;
    closeSearch: () => void;
};

const LearnerSearchContext = createContext<LearnerSearchContextValue | undefined>(undefined);

function createInitialResponse(filter: LearnerSearchFilter): LearnerSearchResponse {
    return {
        query: "",
        appliedFilter: filter,
        results: [],
        availableFilters: [
            { key: "all", label: "All", count: 0 },
            { key: "grammar", label: "Grammar", count: 0 },
            { key: "vocabulary", label: "Vocab", count: 0 },
            { key: "games", label: "Games", count: 0 },
            { key: "pronunciation", label: "Pronunciation", count: 0 },
            { key: "speaking", label: "Speaking", count: 0 },
            { key: "reading", label: "Reading", count: 0 },
            { key: "writing", label: "Writing", count: 0 },
            { key: "quizzes", label: "Quiz", count: 0 },
        ],
        totalCount: 0,
    };
}

export function LearnerSearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState("");
    const [initialFilter, setInitialFilter] = useState<LearnerSearchFilter>("all");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    useDocumentScrollLock(isOpen);

    const closeSearch = () => setIsOpen(false);

    const openSearch = (options?: { query?: string; filter?: LearnerSearchFilter }) => {
        previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setInitialQuery(options?.query || "");
        setInitialFilter(options?.filter || "all");
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) {
            previousFocusRef.current?.focus?.();
            return;
        }

        const timeoutId = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeSearch();
            }

            if (event.key !== "Tab" || !dialogRef.current) {
                return;
            }

            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey && activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(timeoutId);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <LearnerSearchContext.Provider value={{ openSearch, closeSearch }}>
            {children}
            {isOpen ? (
                <div className="fixed inset-0 z-[360]">
                    <div
                        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                        onClick={() => {
                            if (typeof window !== "undefined" && window.innerWidth >= 768) {
                                closeSearch();
                            }
                        }}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top,0px)+8px)] sm:inset-0 sm:flex sm:items-start sm:justify-center sm:px-4 sm:pt-[12vh]">
                        <div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Learner search"
                            className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] rounded-b-none border px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4 shadow-2xl sm:h-auto sm:max-h-[78vh] sm:rounded-[32px] sm:px-6 sm:pb-6"
                            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-bg)" }}
                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Quick Search</p>
                                    <h2 className="text-xl font-bold text-text">Find what you need</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-text transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                    style={{ borderColor: "var(--border-subtle)" }}
                                    aria-label="Close search"
                                >
                                    <X className="h-5 w-5" aria-hidden />
                                </button>
                            </div>
                            <div
                                className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                <LearnerSearchSurface
                                    context="quick-open"
                                    initialResponse={createInitialResponse(initialFilter)}
                                    initialQuery={initialQuery}
                                    initialFilter={initialFilter}
                                    limit={8}
                                    alwaysFetchInitial
                                    onClose={closeSearch}
                                    inputRef={inputRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </LearnerSearchContext.Provider>
    );
}

export function useLearnerSearch() {
    const context = useContext(LearnerSearchContext);
    if (!context) {
        throw new Error("useLearnerSearch must be used within LearnerSearchProvider");
    }
    return context;
}
