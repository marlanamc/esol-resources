"use client";

import type { SkillCategory, SkillCategoryStats } from "@/lib/independent-progress";
import { getSkillCategoryLabel } from "@/lib/independent-progress";

type FilterValue = SkillCategory | "all";

interface SkillCategoryFilterProps {
    selectedCategory: FilterValue;
    onCategoryChange: (category: FilterValue) => void;
    categoryStats: Map<SkillCategory, SkillCategoryStats>;
    /** Only show categories that have activities */
    hideEmpty?: boolean;
}

const SKILL_ORDER: SkillCategory[] = ["grammar", "vocabulary", "listening", "speaking", "reading", "pronunciation"];

// Color mapping for each skill
const SKILL_COLORS: Record<SkillCategory, { surface: string; accent: string; border: string }> = {
    grammar: {
        surface: "var(--tone-grammar-surface)",
        accent: "var(--tone-grammar-accent)",
        border: "var(--tone-grammar-border)",
    },
    vocabulary: {
        surface: "var(--tone-vocab-surface)",
        accent: "var(--tone-vocab-accent)",
        border: "var(--tone-vocab-border)",
    },
    listening: {
        surface: "var(--tone-speaking-surface)",
        accent: "var(--tone-speaking-accent)",
        border: "var(--tone-speaking-border)",
    },
    speaking: {
        surface: "var(--tone-speaking-surface)",
        accent: "var(--tone-speaking-accent)",
        border: "var(--tone-speaking-border)",
    },
    reading: {
        surface: "var(--tone-grammar-surface)",
        accent: "var(--tone-grammar-accent)",
        border: "var(--tone-grammar-border)",
    },
    pronunciation: {
        surface: "var(--tone-quizzes-surface)",
        accent: "var(--tone-quizzes-accent)",
        border: "var(--tone-quizzes-border)",
    },
};

export function SkillCategoryFilter({
    selectedCategory,
    onCategoryChange,
    categoryStats,
    hideEmpty = true,
}: SkillCategoryFilterProps) {
    // Filter to skills with activities
    const visibleSkills = hideEmpty
        ? SKILL_ORDER.filter((skill) => {
              const stats = categoryStats.get(skill);
              return stats && stats.total > 0;
          })
        : SKILL_ORDER;

    // Calculate total for "All" option
    const totalStats = {
        completed: 0,
        total: 0,
    };
    for (const stats of categoryStats.values()) {
        totalStats.completed += stats.completed;
        totalStats.total += stats.total;
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {/* All option */}
            <button
                onClick={() => onCategoryChange("all")}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "all"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-subtle text-text-muted hover:bg-surface-contrast"
                }`}
            >
                All
                <span className="ml-1.5 text-xs opacity-75">
                    {totalStats.completed}/{totalStats.total}
                </span>
            </button>

            {/* Skill options */}
            {visibleSkills.map((skill) => {
                const stats = categoryStats.get(skill);
                const isSelected = selectedCategory === skill;
                const colors = SKILL_COLORS[skill];

                return (
                    <button
                        key={skill}
                        onClick={() => onCategoryChange(skill)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                            isSelected ? "shadow-sm" : "hover:shadow-sm"
                        }`}
                        style={{
                            background: isSelected
                                ? `linear-gradient(135deg, ${colors.surface} 0%, color-mix(in srgb, ${colors.surface} 60%, var(--dashboard-surface-end)) 100%)`
                                : "var(--surface-base)",
                            borderColor: isSelected ? colors.border : "var(--border-subtle)",
                            color: isSelected ? colors.accent : "var(--text-color-muted)",
                        }}
                    >
                        {getSkillCategoryLabel(skill)}
                        {stats && (
                            <span className="ml-1.5 text-xs opacity-75">
                                {stats.completed}/{stats.total}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
