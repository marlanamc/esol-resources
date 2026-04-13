'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POS_LABELS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function MadLibsExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.madLibsData;
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [blankValue, setBlankValue] = useState<string | null>(null);

  if (!data) return null;

  const blankPart = data.sentenceParts.find(p => p.isBlank);
  const requiredPOS = blankPart?.requiredPOS;

  const handleWordSelect = (word: string) => {
    if (answered) return;
    if (blankValue === word) {
      setBlankValue(null);
      setSelectedWord(null);
      return;
    }

    setSelectedWord(word);
    setBlankValue(word);
    // This exercise only uses one blank, so selecting a word should place it immediately.
    onAnswer(word === blankPart?.correctWord);
  };

  const handleSlotSelect = () => {
    if (answered) return;
    if (blankValue) {
      setBlankValue(null);
      setSelectedWord(null);
    }
  };

  const availableWords = data.wordBank.map(w => w.word).filter(w => w !== blankValue);

  return (
    <div className="space-y-6">
      <p className="font-display text-lg text-text-muted text-center">
        Complete the sentence with a <strong>{requiredPOS ? POS_LABELS[requiredPOS] : ''}</strong>!
      </p>

      {/* Sentence Area */}
      <div className="p-6 rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] text-center leading-loose">
        <p className="font-display text-xl text-text inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
          {data.sentenceParts.map((part, i) => {
            if (!part.isBlank) {
              return <span key={i}>{part.text}</span>;
            }

            return (
              <button
                key={i}
                onClick={handleSlotSelect}
                className={`min-w-[6rem] px-4 py-1.5 rounded-xl border-b-4 border-2 font-bold transition-colors inline-flex justify-center items-center
                  ${answered
                    ? blankValue === part.correctWord
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-error bg-error/10 text-error'
                    : blankValue
                      ? 'border-primary bg-primary/10 text-primary'
                      : selectedWord
                        ? 'border-primary border-b-primary bg-primary/5 shadow-inner'
                        : 'border-border border-b-border bg-bg-gray text-text-muted/50'
                  }
                `}
                disabled={answered}
              >
                {blankValue ? blankValue : <span className="text-[10px] uppercase tracking-widest">{requiredPOS ? POS_LABELS[requiredPOS] : 'word'}</span>}
              </button>
            );
          })}
        </p>
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap justify-center gap-3 min-h-[4rem]">
        <AnimatePresence>
          {availableWords.map((word) => (
            <motion.button
              key={word}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={!answered ? { scale: 1.05 } : {}}
              whileTap={!answered ? { scale: 0.95 } : {}}
              onClick={() => handleWordSelect(word)}
              disabled={answered}
              className={`px-4 py-2 rounded-xl border-2 font-display font-bold text-base transition-colors
                ${selectedWord === word 
                  ? 'border-primary bg-primary text-white shadow-md' 
                  : 'border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/40'
                }
              `}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
