'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { POSExercise, BuilderSlot } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const SentenceBuilderExercise = memo(function SentenceBuilderExercise({ exercise, onAnswer }: Props) {
  const { builderSlots = [], prompt } = exercise;

  // Collect word bank from non-provided slots (shuffled)
  const wordBank = builderSlots
    .filter(s => !s.isProvided)
    .map(s => s.correctWord);

  const [placed, setPlaced] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const slot of builderSlots) {
      if (slot.isProvided) initial[slot.id] = slot.correctWord;
    }
    return initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const usedWords = new Set(Object.values(placed).filter(Boolean));

  const allFilled = builderSlots.every(s => placed[s.id]);

  const handleSlotTap = (slot: BuilderSlot) => {
    if (submitted || slot.isProvided) return;
    if (placed[slot.id]) {
      // Remove word from slot, put back in bank
      const word = placed[slot.id];
      setPlaced(prev => {
        const next = { ...prev };
        delete next[slot.id];
        return next;
      });
      setActiveWord(word);
      return;
    }
    if (activeWord) {
      setPlaced(prev => ({ ...prev, [slot.id]: activeWord }));
      setActiveWord(null);
    }
  };

  const handleWordTap = (word: string) => {
    if (submitted) return;
    if (activeWord === word) {
      setActiveWord(null);
      return;
    }
    setActiveWord(word);
  };

  const handleSubmit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const correct = builderSlots.every(s => placed[s.id] === s.correctWord);
    onAnswer(correct);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted text-center">{prompt}</p>

      {/* Sentence slots */}
      <div className="bg-white dark:bg-[#162b3d] p-5 rounded-2xl border-2 border-border">
        <div className="flex flex-wrap gap-2 justify-center items-end">
          {builderSlots.map((slot) => {
            const value = placed[slot.id];
            const isCorrect = submitted && value === slot.correctWord;
            const isWrong = submitted && value !== slot.correctWord;

            return (
              <div key={slot.id} className="flex flex-col items-center gap-1">
                {/* Slot */}
                <motion.button
                  type="button"
                  onClick={() => handleSlotTap(slot)}
                  whileHover={!slot.isProvided && !submitted ? { scale: 1.03 } : {}}
                  className={`min-w-[72px] px-3 py-2 rounded-xl border-2 text-sm font-semibold text-center transition-all ${
                    slot.isProvided
                      ? 'bg-bg-gray border-border text-text cursor-default'
                      : value
                      ? isCorrect
                        ? 'bg-secondary/10 border-secondary text-secondary cursor-pointer'
                        : isWrong
                        ? 'bg-error/10 border-error text-error cursor-pointer'
                        : 'bg-primary/10 border-primary text-primary cursor-pointer'
                      : activeWord
                      ? 'bg-primary/5 border-primary border-dashed text-text-muted cursor-pointer animate-pulse'
                      : 'bg-bg-gray border-border/60 border-dashed text-text-muted/40 cursor-default'
                  }`}
                >
                  {value || '____'}
                </motion.button>
                {/* POS label under slot */}
                {slot.partOfSpeech ? (
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${POS_COLORS[slot.partOfSpeech].split(' ')[1]}`}>
                    {POS_LABELS[slot.partOfSpeech]}
                  </span>
                ) : (
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Word</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Word bank */}
      {!submitted && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted text-center">
            {activeWord ? `Selected: "${activeWord}" — tap a slot to place it` : 'Tap a word to select it'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {wordBank.map((word) => {
              const isUsed = usedWords.has(word) && activeWord !== word;
              const isActive = activeWord === word;
              return (
                <motion.button
                  key={word}
                  type="button"
                  onClick={() => !isUsed && handleWordTap(word)}
                  whileHover={!isUsed ? { scale: 1.04 } : {}}
                  whileTap={!isUsed ? { scale: 0.96 } : {}}
                  disabled={isUsed}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    isUsed
                      ? 'border-border/30 text-text-muted/30 bg-transparent cursor-not-allowed line-through'
                      : isActive
                      ? 'border-primary bg-primary text-white shadow-md scale-105'
                      : 'border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/40'
                  }`}
                >
                  {word}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      {allFilled && !submitted && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          Check Sentence
        </motion.button>
      )}

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-sm ${builderSlots.every(s => placed[s.id] === s.correctWord) ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`font-semibold ${builderSlots.every(s => placed[s.id] === s.correctWord) ? 'text-secondary' : 'text-error'}`}>
            {builderSlots.every(s => placed[s.id] === s.correctWord)
              ? '✓ Perfect sentence!'
              : `✗ The correct sentence: ${builderSlots.map(s => s.correctWord).join(' ')}`}
          </p>
        </motion.div>
      )}
    </div>
  );
});
