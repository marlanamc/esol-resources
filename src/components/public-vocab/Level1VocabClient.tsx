"use client";

import { useState } from "react";
import { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { ThemeDrawer } from "./ThemeDrawer";
import { BookOpen, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Level1VocabClientProps {
  units: PublicLevel1VocabularyUnit[];
}

export function Level1VocabClient({ units }: Level1VocabClientProps) {
  const [selectedUnit, setSelectedUnit] = useState<PublicLevel1VocabularyUnit | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUnitClick = (unit: PublicLevel1VocabularyUnit) => {
    setSelectedUnit(unit);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit, index) => {
          const themeCount = unit.themes?.length || 0;
          const hasThemes = themeCount > 0;

          return (
            <motion.button
              key={unit.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleUnitClick(unit)}
              className="group relative flex flex-col text-left rounded-[1.5rem] border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--tone-vocabulary-accent)]/50 hover:shadow-lg active:scale-[0.98]"
            >
              {/* Unit Number Badge */}
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--tone-vocabulary-chip-text)]">
                {unit.slug.replace(/-/g, " ")}
              </div>

              {/* Title */}
              <h2 className="font-display text-xl font-bold text-text transition-colors group-hover:text-[var(--tone-vocabulary-accent-strong)] sm:text-2xl">
                {unit.title.replace(/^Unit \d+:\s*/, "")}
              </h2>

              {/* Theme Description */}
              <p className="mt-2 text-sm leading-relaxed text-text-muted flex-1">
                {unit.theme}
              </p>

              {/* Stats */}
              <div className="mt-5 flex items-center gap-4 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl" aria-hidden><BookOpen size={18} className="text-[var(--tone-vocabulary-accent-strong)]" /></span>
                  <span className="font-semibold tabular-nums text-[var(--tone-vocabulary-accent-strong)]">
                    {unit.totalCards}
                  </span>
                  <span className="text-text-muted">words</span>
                </div>
                {hasThemes && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl" aria-hidden><Target size={18} className="text-[var(--tone-vocabulary-accent-strong)]" /></span>
                    <span className="font-semibold tabular-nums text-[var(--tone-vocabulary-accent-strong)]">
                      {themeCount}
                    </span>
                    <span className="text-text-muted">
                      {themeCount === 1 ? "theme" : "themes"}
                    </span>
                  </div>
                )}
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-6 right-6 text-[var(--tone-vocabulary-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <ThemeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        unit={selectedUnit}
      />
    </>
  );
}
