'use client';

import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import type { VerbGroup } from '@/types/irregular-verbs';

interface IntroScreenProps {
  group: VerbGroup;
  onStartChallenge: () => void;
}

export function IntroScreen({ group, onStartChallenge }: IntroScreenProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-border p-5 sm:p-7"
      >
        <p className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Pattern Preview</p>
        <h2 className="font-display text-3xl sm:text-4xl text-text mb-2">{group.title}</h2>
        <p className="text-base sm:text-lg text-text-muted mb-4">{group.pattern}</p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 border border-accent/40">
          <span className="text-sm text-primary-dark font-semibold">Example:</span>
          <span className="font-display text-lg text-text">{group.patternExample}</span>
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
