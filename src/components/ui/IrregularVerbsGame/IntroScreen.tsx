'use client';

import { motion } from 'framer-motion';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import type { VerbGroup } from '@/types/irregular-verbs';

interface IntroScreenProps {
  group: VerbGroup;
  onStartChallenge: () => void;
  onBack?: () => void;
}

export function IntroScreen({ group, onStartChallenge, onBack }: IntroScreenProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-border text-text-muted hover:text-text flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide font-semibold text-text-muted">Pattern Preview</p>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-text truncate">{group.title}</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border sm:border-2 p-4 sm:p-7"
      >
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
        className="bg-white rounded-2xl border border-border p-5 sm:p-6"
      >
        <h3 className="font-semibold text-text mb-3">Verbs in this group</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {group.verbs.map((verb) => (
            <div
              key={verb.base}
              className="px-3 py-2 rounded-lg bg-bg-light border border-border/60 text-sm sm:text-base"
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
          Start Challenge
        </span>
      </motion.button>
    </div>
  );
}
