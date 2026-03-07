'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import type { VerbGroup } from '@/types/irregular-verbs';

interface PatternHintProps {
  group: VerbGroup;
  showHint: boolean;
}

export function PatternHint({ group, showHint }: PatternHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!showHint) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border/60 bg-[var(--color-surface-elevated)] shadow-sm"
    >
      {/* Compact Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--color-surface-overlay)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/30">
            <Lightbulb size={16} className="text-primary-dark" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text">{group.title}</p>
            <p className="text-xs text-text-muted">
              {group.patternExample.split('→').map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1">→</span>}
                  <span className={i === 0 ? 'text-primary' : ''}>{part.trim()}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-border/60 px-4 pb-4 pt-2">
              {/* Pattern Description */}
              <p className="text-sm text-text-muted mb-3">{group.pattern}</p>

              {/* Sample Verbs - Compact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.verbs.map(verb => (
                  <div
                    key={verb.base}
                    className="rounded-lg bg-[var(--color-surface-overlay)] px-3 py-2 text-center"
                  >
                    <div className="text-xs text-text-muted mb-0.5">
                      V1 → V2 → V3
                    </div>
                    <div className="text-sm font-medium text-text">
                      {verb.base} → {verb.past} → {verb.pastParticiple}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
