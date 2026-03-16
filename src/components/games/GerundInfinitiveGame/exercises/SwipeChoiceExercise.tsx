'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function SwipeChoiceExercise({ exercise, onAnswer, answered }: Props) {
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const { prompt, options = [] } = exercise;

  // options: [gerund, infinitive] or [infinitive, gerund] - we need to map swipe to answer
  const gerundOpt = options.find(o => o.endsWith('ing') || o.startsWith('to ') === false && !o.includes(' to '));
  const infinitiveOpt = options.find(o => o.startsWith('to '));
  const isGerundCorrect = validateAnswer(exercise, gerundOpt ?? '');
  const isInfinitiveCorrect = validateAnswer(exercise, infinitiveOpt ?? '');

  const handleSwipe = (dir: 'left' | 'right') => {
    if (answered || swipeDir) return;
    setSwipeDir(dir);
    const chosen = dir === 'left' ? (gerundOpt ?? options[0]) : (infinitiveOpt ?? options[1]);
    const correct = validateAnswer(exercise, chosen);
    onAnswer(correct);
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-xs font-medium mb-2">
        Tap left for gerund (-ing) · Tap right for infinitive (to + verb)
      </p>
      <p className="font-display text-xl sm:text-2xl text-text text-center leading-relaxed px-2">
        {prompt}
      </p>
      <div className="flex gap-4 justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Gerund</span>
          <motion.button
            onClick={() => handleSwipe('left')}
            disabled={answered || !!swipeDir}
            whileHover={!swipeDir ? { scale: 1.05 } : {}}
            whileTap={!swipeDir ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-2 font-bold text-lg ${
              swipeDir === 'left'
                ? isGerundCorrect
                  ? 'border-secondary bg-secondary/20'
                  : 'border-error bg-error/20'
                : 'border-border bg-white dark:bg-[#162b3d] hover:border-primary'
            }`}
          >
            -ing
          </motion.button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Infinitive</span>
          <motion.button
            onClick={() => handleSwipe('right')}
            disabled={answered || !!swipeDir}
            whileHover={!swipeDir ? { scale: 1.05 } : {}}
            whileTap={!swipeDir ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-2 font-bold text-lg ${
              swipeDir === 'right'
                ? isInfinitiveCorrect
                  ? 'border-secondary bg-secondary/20'
                  : 'border-error bg-error/20'
                : 'border-border bg-white dark:bg-[#162b3d] hover:border-primary'
            }`}
          >
            to +
          </motion.button>
        </div>
      </div>
      {swipeDir && (
        <p className="text-center text-sm font-medium">
          {validateAnswer(exercise, swipeDir === 'left' ? (gerundOpt ?? '') : (infinitiveOpt ?? ''))
            ? '✓ Correct!'
            : `Correct: ${Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer[0] : exercise.correctAnswer}`}
        </p>
      )}
    </div>
  );
}
