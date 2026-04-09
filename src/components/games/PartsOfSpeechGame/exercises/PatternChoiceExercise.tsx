'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function PatternChoiceExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { prompt, options = [], highlightedWord } = exercise;

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    onAnswer(validatePOSAnswer(exercise, option));
  };

  // Render sentence with highlighted word
  const renderSentence = () => {
    if (!highlightedWord || !prompt.includes(highlightedWord)) {
      return <span>{prompt}</span>;
    }
    const parts = prompt.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className="bg-primary/20 text-primary font-semibold px-1 rounded">
          {highlightedWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        What part of speech is the highlighted word?
      </p>

      <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="font-display text-lg sm:text-2xl text-text text-center leading-relaxed">
          {renderSentence()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = validatePOSAnswer(exercise, option);
          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 hover:shadow-sm cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed';
          }

          const posKey = option as PartOfSpeech;
          const colorClass = POS_COLORS[posKey] ?? '';

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={!selected ? { scale: 1.02 } : {}}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full p-4 rounded-2xl border-2 text-center font-medium text-sm transition-all duration-200 ${selected ? stateClass : colorClass + ' cursor-pointer hover:shadow-sm'}`}
            >
              {POS_LABELS[posKey] ?? option}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${validatePOSAnswer(exercise, selected) ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`text-sm font-semibold ${validatePOSAnswer(exercise, selected) ? 'text-secondary' : 'text-error'}`}>
            {validatePOSAnswer(exercise, selected) ? '✓ Correct!' : `✗ Not quite — it\'s a ${POS_LABELS[exercise.correctAnswer as PartOfSpeech] ?? exercise.correctAnswer}`}
          </p>
          {exercise.highlightedWord && (
            <p className="text-xs text-text-muted mt-1">
              &ldquo;{exercise.highlightedWord}&rdquo; — {POS_LABELS[exercise.correctAnswer as PartOfSpeech] ?? exercise.correctAnswer}
            </p>
          )}
          {exercise.explanation && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed border-t border-border/50 pt-1">
              {exercise.explanation}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
