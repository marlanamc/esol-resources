'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface PatternIdentifierExerciseProps {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function PatternIdentifierExercise({
  exercise,
  onAnswer,
  answered,
}: PatternIdentifierExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { prompt, options = [], triggerText } = exercise;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    const correct = validateAnswer(exercise, option);
    onAnswer(correct);
  };

  // Extract the parts of the sentence
  // Prompt format: "She recommends ___ the fish at the restaurant."
  const blankIndex = prompt.indexOf('___');
  if (blankIndex === -1) {
    return <div className="text-center text-text-muted">Invalid exercise format</div>;
  }

  const beforeBlank = prompt.slice(0, blankIndex).trim();
  const afterBlank = prompt.slice(blankIndex + 3).trim();

  const normalizedBeforeBlank = beforeBlank.replace(/\s+/g, ' ').trim();
  const normalizedTriggerText = triggerText?.replace(/\s+/g, ' ').trim();
  const hasExactTrigger =
    !!normalizedTriggerText &&
    normalizedBeforeBlank.toLowerCase().endsWith(normalizedTriggerText.toLowerCase());

  const triggerWord = hasExactTrigger
    ? normalizedTriggerText!
    : normalizedBeforeBlank.split(/\s+/).pop() ?? '';

  const beforeTrigger = hasExactTrigger
    ? normalizedBeforeBlank.slice(0, normalizedBeforeBlank.length - normalizedTriggerText!.length).trimEnd()
    : normalizedBeforeBlank.slice(0, Math.max(0, normalizedBeforeBlank.length - triggerWord.length)).trimEnd();

  return (
    <div className="space-y-6">
      {/* Sentence with highlighted and underlined elements */}
      <div className="space-y-3">
        <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
          What part of speech is before the highlighted word?
        </p>

        <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
          <p className="font-display text-lg sm:text-2xl text-text text-center leading-relaxed">
            {beforeTrigger ? `${beforeTrigger} ` : null}
            <span className="underline decoration-2 underline-offset-2 decoration-primary font-semibold">
              {triggerWord}
            </span>
            {' '}
            <span className="bg-primary/20 text-primary font-semibold px-1 rounded">
              {exercise.highlightedWord}
            </span>
            {' '}
            {afterBlank}
          </p>
        </div>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = validateAnswer(exercise, option);
          let stateClass =
            'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 hover:shadow-sm cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect)
              stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={!selected ? { scale: 1.01 } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-center font-medium text-base transition-all duration-200 ${stateClass}`}
            >
              <span className="text-sm text-text-muted font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
