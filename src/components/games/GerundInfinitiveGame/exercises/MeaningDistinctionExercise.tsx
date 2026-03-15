'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props { exercise: GIExercise; onAnswer: (correct: boolean) => void; answered: boolean; }

export function MeaningDistinctionExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { prompt, options = [], meaningContext } = exercise;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    onAnswer(validateAnswer(exercise, option));
  };

  return (
    <div className="space-y-5">
      {/* Meaning context */}
      {meaningContext && (
        <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-bg-gray border border-border text-xs">
          <div>
            <p className="font-semibold text-primary mb-0.5">Gerund (-ing)</p>
            <p className="text-text-muted">{exercise.meaningContext?.gerundMeaning || ''}</p>
          </div>
          <div>
            <p className="font-semibold text-secondary mb-0.5">Infinitive (to + verb)</p>
            <p className="text-text-muted">{exercise.meaningContext?.infinitiveMeaning || ''}</p>
          </div>
        </div>
      )}

      <p className="font-display text-xl sm:text-2xl text-text text-center leading-relaxed">{prompt}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = validateAnswer(exercise, option);
          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={!selected ? { scale: 1.01 } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full p-4 rounded-2xl border-2 text-center font-semibold text-base transition-all duration-200 ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
