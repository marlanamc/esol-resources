'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props { exercise: GIExercise; onAnswer: (correct: boolean) => void; answered: boolean; }

export function RuleApplicationExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { prompt, options = [], highlightedWord } = exercise;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    onAnswer(validateAnswer(exercise, option));
  };

  const sentenceParts = highlightedWord && prompt.includes('___')
    ? prompt.split('___')
    : null;

  // Extract the word immediately before the highlighted word (the "trigger") and underline it
  const beforePart = sentenceParts?.[0] ?? '';
  const triggerMatch = beforePart.match(/(.*?)(\S+)\s*$/);
  const textBeforeTrigger = triggerMatch ? triggerMatch[1] : '';
  const triggerWord = triggerMatch ? triggerMatch[2] : '';

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-text-muted font-semibold mb-3">What type of word comes <strong className="font-bold text-text">before</strong> the highlighted word?</p>
        <p className="font-display text-xl sm:text-2xl text-text leading-relaxed px-2">
          {sentenceParts ? (
            <>
              {textBeforeTrigger}
              {triggerWord ? (
                <span className="underline decoration-2 underline-offset-2 decoration-primary">{triggerWord}</span>
              ) : (
                beforePart
              )}
              {triggerWord ? ' ' : null}
              <span className="bg-primary/20 text-primary px-1 rounded font-semibold">{highlightedWord}</span>
              {sentenceParts[1]}
            </>
          ) : (
            prompt
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={!selected ? { scale: 1.01 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`p-3 sm:p-4 rounded-xl border-2 text-sm font-medium text-center transition-all ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
