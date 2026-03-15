'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface PrepositionChoiceExerciseProps {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function PrepositionChoiceExercise({
  exercise,
  onAnswer,
  answered,
}: PrepositionChoiceExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { prompt, options = [] } = exercise;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    const correct = validateAnswer(exercise, option);
    onAnswer(correct);
  };

  return (
    <div className="space-y-5">
      <p className="font-display text-xl sm:text-2xl text-text text-center leading-relaxed px-2">
        {prompt}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = validateAnswer(exercise, option);
          let stateClass =
            'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 hover:shadow-sm cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect)
              stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect)
              stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={!selected ? { scale: 1.02 } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`min-w-[4rem] px-5 py-3 rounded-xl border-2 font-semibold text-base transition-all duration-200 ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
