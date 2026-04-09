'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import { POS_LABELS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function MinimalPairExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { minimalPair, options = [] } = exercise;

  if (!minimalPair) return null;

  const {
    sentence1,
    sentence2,
    changedWord1,
    changedWord2,
    question,
    correctAnswer,
  } = minimalPair;

  const handleSelect = (opt: string) => {
    if (answered || selected) return;
    setSelected(opt);
    onAnswer(validatePOSAnswer(exercise, opt));
  };

  const highlightInSentence = (sentence: string, word: string) => {
    if (!sentence.includes(word)) return <span>{sentence}</span>;
    const parts = sentence.split(word);
    return (
      <>
        {parts[0]}
        <span className="bg-accent/30 text-primary-dark font-bold px-1 rounded">{word}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Compare these two sentences
      </p>

      {/* Two sentences side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#162b3d] p-5 rounded-2xl border-2 border-border">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Sentence A</div>
          <p className="font-display text-lg text-text leading-relaxed">
            {highlightInSentence(sentence1, changedWord1)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#162b3d] p-5 rounded-2xl border-2 border-border">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Sentence B</div>
          <p className="font-display text-lg text-text leading-relaxed">
            {highlightInSentence(sentence2, changedWord2)}
          </p>
        </div>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold text-text text-center">{question}</p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const posKey = opt as PartOfSpeech;
          const isSelected = selected === opt;
          const isCorrect = validatePOSAnswer(exercise, opt);

          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-40 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={!selected ? { scale: 1.02 } : {}}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`p-4 rounded-2xl border-2 text-center font-semibold text-sm transition-all duration-200 ${stateClass}`}
            >
              {POS_LABELS[posKey] ?? opt}
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-sm ${validatePOSAnswer(exercise, selected) ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`font-semibold ${validatePOSAnswer(exercise, selected) ? 'text-secondary' : 'text-error'}`}>
            {validatePOSAnswer(exercise, selected)
              ? `✓ Correct! The answer is ${POS_LABELS[correctAnswer as PartOfSpeech] ?? correctAnswer}.`
              : `✗ The answer is ${POS_LABELS[correctAnswer as PartOfSpeech] ?? correctAnswer}.`}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Notice how the same word can be different parts of speech depending on how it&apos;s used.
          </p>
        </motion.div>
      )}
    </div>
  );
}
