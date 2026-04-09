'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function POSTaggingExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const { options = [], highlightedWord, taggingTokens } = exercise;

  if (!taggingTokens || !highlightedWord) {
    return <div className="text-text-muted text-center">Invalid exercise</div>;
  }

  const handleWordTap = () => {
    if (answered || selected) return;
    setShowOptions(true);
  };

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    setShowOptions(false);
    onAnswer(validatePOSAnswer(exercise, option));
  };

  const isCorrect = selected ? validatePOSAnswer(exercise, selected) : null;

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Tap the highlighted word to identify its part of speech
      </p>

      {/* Sentence with tappable highlighted word */}
      <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="font-display text-lg sm:text-2xl text-text text-center leading-relaxed flex flex-wrap justify-center gap-1">
          {taggingTokens.map((token, i) => {
            if (token.isTarget) {
              const tagColor = selected
                ? isCorrect
                  ? 'bg-secondary/20 text-secondary border-secondary/40'
                  : 'bg-error/20 text-error border-error/30'
                : 'bg-primary/20 text-primary border-primary/40 cursor-pointer hover:bg-primary/30';

              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={handleWordTap}
                  whileHover={!selected ? { scale: 1.05 } : {}}
                  whileTap={!selected ? { scale: 0.95 } : {}}
                  className={`px-2 py-0.5 rounded-lg border-2 font-semibold transition-all ${tagColor}`}
                >
                  {token.word.replace(/[.,!?]/, '')}
                  {token.word.match(/[.,!?]/) && <span className="text-text-muted">{token.word.match(/[.,!?]/)?.[0]}</span>}
                </motion.button>
              );
            }
            return (
              <span key={i} className={token.isPunctuation ? 'text-text' : ''}>
                {token.word}{' '}
              </span>
            );
          })}
        </p>
      </div>

      {/* Tap hint */}
      {!selected && !showOptions && (
        <p className="text-xs text-text-muted text-center">
          Tap <strong>&ldquo;{highlightedWord}&rdquo;</strong> to choose its part of speech
        </p>
      )}

      {/* POS Options panel */}
      <AnimatePresence>
        {showOptions && !selected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="grid grid-cols-2 gap-3"
          >
            {options.map((option, i) => {
              const posKey = option as PartOfSpeech;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(option)}
                  className={`p-4 rounded-2xl border-2 text-center font-semibold text-sm transition-all cursor-pointer ${POS_COLORS[posKey]}`}
                >
                  {POS_LABELS[posKey] ?? option}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result feedback */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${isCorrect ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`text-sm font-semibold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
            {isCorrect
              ? `✓ Correct! "${highlightedWord}" is a ${POS_LABELS[exercise.correctAnswer as PartOfSpeech]}.`
              : `✗ "${highlightedWord}" is a ${POS_LABELS[exercise.correctAnswer as PartOfSpeech] ?? exercise.correctAnswer}, not a ${POS_LABELS[selected as PartOfSpeech] ?? selected}.`}
          </p>
        </motion.div>
      )}
    </div>
  );
}
