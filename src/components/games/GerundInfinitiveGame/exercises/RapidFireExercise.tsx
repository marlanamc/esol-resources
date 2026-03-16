'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GIExercise, RapidFireItem } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function checkCorrect(item: RapidFireItem, answer: string): boolean {
  const correct = Array.isArray(item.correctAnswer)
    ? item.correctAnswer
    : [item.correctAnswer];
  return correct.some(c => normalize(c) === normalize(answer));
}

export function RapidFireExercise({ exercise, onAnswer, answered }: Props) {
  const items = exercise.rapidFireItems ?? [];
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const current = items[index];
  const isLast = index >= items.length - 1;

  const handleSelect = (opt: string) => {
    if (!current || selected) return;
    const correct = checkCorrect(current, opt);
    setSelected(opt);
    setResults(prev => [...prev, correct]);

    if (isLast) {
      const correctCount = [...results, correct].filter(Boolean).length;
      const pass = correctCount / items.length >= 0.8;
      onAnswer(pass);
    } else {
      setTimeout(() => {
        setIndex(prev => prev + 1);
        setSelected(null);
      }, 400);
    }
  };

  if (items.length === 0) return null;

  const options = current?.options ?? [];

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-xs font-medium">
        Quick fire — {index + 1} of {items.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="font-display text-xl text-text text-center leading-relaxed">
            {current?.prompt}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, i) => {
              const isSelectedOpt = selected === opt;
              const isCorrectOpt = checkCorrect(current!, opt);
              let stateClass = 'border-border bg-white dark:bg-[#162b3d]';
              if (selected) {
                if (isSelectedOpt && isCorrectOpt) stateClass = 'border-secondary bg-secondary/10';
                else if (isSelectedOpt && !isCorrectOpt) stateClass = 'border-error bg-error/10';
                else if (isCorrectOpt) stateClass = 'border-secondary/50 bg-secondary/5';
              }
              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={!!selected}
                  whileHover={!selected ? { scale: 1.02 } : {}}
                  whileTap={!selected ? { scale: 0.98 } : {}}
                  className={`p-4 rounded-2xl border-2 text-center font-medium transition-all ${stateClass}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
