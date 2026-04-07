"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { useEffect } from "react";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unit: PublicLevel1VocabularyUnit | null;
}

export function ThemeDrawer({ isOpen, onClose, unit }: ThemeDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!unit) return null;

  const { hasPlayableUnitMatching } = getUnitMatchingAvailability(unit);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[var(--tone-vocabulary-border)] bg-[var(--color-bg)] shadow-2xl sm:w-[450px]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="relative border-b border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface)] p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-[var(--tone-vocabulary-accent-strong)] transition-colors hover:bg-[var(--tone-vocabulary-accent)]/10"
                  aria-label="Close drawer"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--tone-vocabulary-chip-text)]">
                    {unit.slug.replace("-", " ")}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold text-text sm:text-3xl">
                    {unit.title.replace(/^Unit \d+:\s*/, "")}
                  </h2>
                  <p className="mt-2 text-sm text-text-muted">
                    {unit.theme}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-[var(--tone-vocabulary-accent-strong)]">
                      <BookOpen size={14} />
                      <span>{unit.totalCards} words</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[var(--tone-vocabulary-accent)]/20">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  Choose a Theme to Practice
                </h3>


                <div className="mt-6 space-y-4">
                  {unit.themes?.map((theme) => (
                    <Link
                      key={theme.id}
                      href={`/vocab/level-1/${unit.slug}/${theme.id}/wordlist`}
                      className="group flex items-center gap-4 rounded-2xl border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-4 transition-all hover:-translate-y-1 hover:border-[var(--tone-vocabulary-accent)]/50 hover:shadow-lg active:scale-[0.98]"
                    >
                      {/* Theme Icon */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--tone-vocabulary-accent)]/15 to-[var(--tone-vocabulary-accent)]/5 text-3xl shadow-sm ring-1 ring-[var(--tone-vocabulary-accent)]/20">
                        {theme.icon}
                      </div>

                      {/* Theme Info */}
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-text group-hover:text-[var(--tone-vocabulary-accent-strong)]">
                          {theme.title}
                        </h4>
                        <p className="line-clamp-1 text-sm text-text-muted">
                          {theme.description}
                        </p>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--tone-vocabulary-accent-strong)]">
                          <span>{theme.cards.length} words</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-5 w-5 text-[var(--tone-vocabulary-accent)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  ))}

                </div>

                {/* Unit Matching Review Game (Bottom Version) */}
                {hasPlayableUnitMatching && (
                  <div className="mt-8 space-y-3">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.1em] text-[var(--tone-vocabulary-accent-strong)]/60">
                      Finish your unit with a game! 🧩
                    </p>
                    <Link
                      href={`/vocab/level-1/${unit.slug}/matching`}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--tone-vocabulary-accent)]/30 bg-[var(--tone-vocabulary-accent)]/5 p-6 transition-all hover:border-[var(--tone-vocabulary-accent)]/60 hover:bg-[var(--tone-vocabulary-accent)]/10 group active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tone-vocabulary-accent)] text-white shadow-md transition-transform group-hover:scale-110">
                        <span className="text-xl">🧩</span>
                      </div>
                      <div className="text-center">
                        <h4 className="font-display font-bold text-text text-lg">Unit Review Game</h4>
                        <p className="text-xs text-text-muted">Match picture words from this unit</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Decoration */}
              <div className="bg-[var(--color-bg-light)] p-6 pt-0">
                <div className="flex items-center justify-center rounded-2xl bg-white/50 p-4 text-center text-xs text-text-muted border border-[var(--color-card-border)]">
                  Pick a theme above to start learning! 🚀
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
