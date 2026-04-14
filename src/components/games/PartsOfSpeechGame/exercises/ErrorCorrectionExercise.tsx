'use client';

import { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import type { POSExercise } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const ErrorCorrectionExercise = memo(function ErrorCorrectionExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const data = exercise.errorCorrection;

  const { sentence, correctWord, wrongWords } = data ?? { sentence: '', correctWord: '', wrongWords: [] };
  const explanation = data?.explanation ?? exercise.explanation;
  const options = exercise.options ?? [correctWord, ...wrongWords];

  const sentenceParts = useMemo(() => {
    const token = correctWord;
    const clean = token.trim();
    if (!clean) return [sentence, '', ''];
    const idx = sentence.toLowerCase().indexOf(clean.toLowerCase());
    if (idx === -1) return [sentence, '', ''];
    return [
      sentence.slice(0, idx),
      clean,
      sentence.slice(idx + clean.length),
    ];
  }, [sentence, correctWord]);

  if (!data) return null;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    onAnswer(validatePOSAnswer(exercise, option));
  };

  const isAnswered = !!selected;
  const isCorrect = isAnswered && validatePOSAnswer(exercise, selected);

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Spot and fix the common mistake
      </p>

      <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="font-display text-base sm:text-xl text-text leading-relaxed">
          {sentenceParts[0]}
          {!isAnswered ? (
            <span className="inline-block border-b-2 border-primary mx-1 min-w-[88px]">&nbsp;</span>
          ) : (
            <span className="inline-block rounded px-1 font-bold mx-1">
              {correctWord}
            </span>
          )}
          {sentenceParts[2]}
        </p>
      </div>

      <p className="text-sm text-text-muted leading-relaxed text-center px-1">
        {data.commonError}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isOptionCorrect = validatePOSAnswer(exercise, option);

          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 hover:shadow-sm cursor-pointer';
          if (isAnswered) {
            if (isSelected && isOptionCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isOptionCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isOptionCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed text-text-muted';
          }

          return (
            <motion.button
              key={`${option}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border-2 text-center font-semibold transition-all duration-200 ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${isCorrect ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`text-sm font-semibold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
          </p>
          {explanation && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {explanation}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
});

