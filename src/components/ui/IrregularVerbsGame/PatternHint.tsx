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
      className="bg-white rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Compact Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center">
            <Lightbulb size={16} className="text-primary-dark" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-text text-sm">{group.title}</p>
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
            <div className="px-4 pb-4 pt-2 border-t border-border">
              {/* Pattern Description */}
              <p className="text-sm text-text-muted mb-3">{group.pattern}</p>

              {/* Sample Verbs - Compact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.verbs.map(verb => (
                  <div
                    key={verb.base}
                    className="px-3 py-2 bg-bg-light rounded-lg text-center"
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
