"use client";

import type { LearnerSearchFilter, LearnerSearchFilterOption } from "@/lib/learner-search/types";
import { getLearnerCategoryTone } from "@/lib/learner-theme";

type Props = {
    activeFilter: LearnerSearchFilter;
    filters: LearnerSearchFilterOption[];
    onSelect: (filter: LearnerSearchFilter) => void;
};

export function LearnerSearchFilterBar({ activeFilter, filters, onSelect }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Search filters">
            {filters.map((filter) => {
                const active = filter.key === activeFilter;
                const tone = filter.key === "all"
                    ? null
                    : getLearnerCategoryTone(filter.key === "quizzes" ? "quizzes" : filter.key);
                return (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => onSelect(filter.key)}
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-[background-color,color,border-color]"
                        style={{
                            backgroundColor: filter.key === "all"
                                ? active
                                    ? "var(--primary-color)"
                                    : "var(--surface-elevated)"
                                : active
                                    ? tone?.accentStrong
                                    : tone?.surfaceMuted,
                            color: active
                                ? "#ffffff"
                                : filter.key === "all"
                                    ? "var(--color-text)"
                                    : tone?.accentStrong,
                            borderColor: filter.key === "all"
                                ? active
                                    ? "var(--primary-color)"
                                    : "var(--border-subtle)"
                                : tone?.border,
                        }}
                        aria-pressed={active}
                    >
                        <span>{filter.label}</span>
                        <span
                            className="rounded-full px-2 py-0.5 text-xs"
                            style={{
                                backgroundColor: active
                                    ? "rgba(255,255,255,0.18)"
                                    : filter.key === "all"
                                        ? "rgba(0,0,0,0.08)"
                                        : tone?.chipBg,
                                color: active
                                    ? "#ffffff"
                                    : filter.key === "all"
                                        ? "var(--color-text)"
                                        : tone?.chipText,
                            }}
                            aria-hidden
                        >
                            {filter.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
