'use client';

import { motion } from 'framer-motion';
import { Eye, FlaskConical, Pencil, Shuffle } from 'lucide-react';
import type { TimelinePracticeMode } from './timelineTensesUtils';

interface PracticeModeBarProps {
  selectedPracticeMode: TimelinePracticeMode;
  onSelectPracticeMode: (practiceMode: TimelinePracticeMode) => void;
}

const PRACTICE_MODE_CONFIG: Array<{
  id: TimelinePracticeMode;
  label: string;
  description: string;
  icon: typeof Eye;
}> = [
  {
    id: 'read-the-timeline',
    label: 'Read the Timeline',
    description: 'See the timeline first, then choose the verb forms.',
    icon: Eye,
  },
  {
    id: 'build-the-timeline',
    label: 'Build the Timeline',
    description: 'Read the sentence, then place the timeline stamps.',
    icon: Pencil,
  },
  {
    id: 'mixed-practice',
    label: 'Mixed Review',
    description: 'Practice both modes in one round, easiest items first.',
    icon: Shuffle,
  },
  {
    id: 'lab',
    label: 'Timeline Lab',
    description: 'Free-play sandbox with live tense tags.',
    icon: FlaskConical,
  },
];

export function PracticeModeBar({
  selectedPracticeMode,
  onSelectPracticeMode,
}: PracticeModeBarProps) {
  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-semibold text-text mb-4 text-center">
        Choose a Practice Style
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PRACTICE_MODE_CONFIG.map((mode) => {
          const isSelected = selectedPracticeMode === mode.id;
          const Icon = mode.icon;

          return (
            <motion.button
              key={mode.id}
              onClick={() => onSelectPracticeMode(mode.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-white hover:border-primary/30 dark:border-white/10 dark:bg-[#162b3d]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-border/30 text-text-muted'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-text">{mode.label}</div>
                  <div className="mt-1 text-sm leading-relaxed text-text-muted">
                    {mode.description}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
