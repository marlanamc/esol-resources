'use client';

import { motion } from 'framer-motion';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import type { VerbGroup, VerbRoundMode } from '@/types/irregular-verbs';

interface IntroScreenProps {
  group: VerbGroup;
  roundMode: VerbRoundMode;
  onStartChallenge: () => void;
  onBack?: () => void;
}

const ROUND_COPY: Record<VerbRoundMode, { eyebrow: string; title: string; description: string; cta: string }> = {
  round1: {
    eyebrow: 'Round 1',
    title: 'Discover the Pattern',
    description: 'This first pass introduces the pattern family and gives you a broad look at the verbs in this group.',
    cta: 'Start Round 1'
  },
  round2: {
    eyebrow: 'Round 2',
    title: 'Lock It In',
    description: 'This round is shorter and more targeted. You will see productive practice focused on the verbs that need reinforcement.',
    cta: 'Start Lock It In'
  },
  review: {
    eyebrow: 'Review',
    title: 'Mixed Retrieval',
    description: 'This review round revisits passed patterns so the verb forms stay active and accurate.',
    cta: 'Start Review'
  }
};

export function IntroScreen({ group, roundMode, onStartChallenge, onBack }: IntroScreenProps) {
  const copy = ROUND_COPY[roundMode];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-[var(--color-surface-elevated)] text-text-muted hover:text-text"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide font-semibold text-text-muted">{copy.eyebrow}</p>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-text truncate">{group.title}</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/60 bg-[var(--color-surface-elevated)] p-4 sm:border-2 sm:p-7"
      >
        <p className="text-sm sm:text-lg text-text-muted mb-3">{copy.title}</p>
        <p className="text-sm sm:text-base text-text-muted mb-4">{copy.description}</p>
        <p className="text-sm sm:text-lg text-text-muted mb-4">{group.pattern}</p>

        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-accent/20 border border-accent/40">
          <span className="text-xs sm:text-sm text-primary-dark font-semibold">Example:</span>
          <span className="font-display text-base sm:text-lg text-text">{group.patternExample}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border/60 bg-[var(--color-surface-elevated)] p-5 sm:p-6"
      >
        <h3 className="font-semibold text-text mb-3">Verbs in this group</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {group.verbs.map((verb) => (
            <div
              key={verb.base}
              className="rounded-lg border border-border/60 bg-[var(--color-surface-overlay)] px-3 py-2 text-sm sm:text-base"
            >
              {verb.base} {'\u2192'} {verb.past} {'\u2192'} {verb.pastParticiple}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onStartChallenge}
        className="w-full py-4 rounded-xl bg-primary text-white border-2 border-primary-dark font-semibold text-lg shadow-lg"
      >
        <span className="inline-flex items-center gap-2">
          <PlayCircle size={20} />
          {copy.cta}
        </span>
      </motion.button>
    </div>
  );
}
