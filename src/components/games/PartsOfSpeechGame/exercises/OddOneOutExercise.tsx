'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import type { POSExercise } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const OddOneOutExercise = memo(function OddOneOutExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const data = exercise.oddOneOutData;

  if (!data) return null;

  const handleSelect = (word: string) => {
    if (answered || selected) return;
    setSelected(word);
    onAnswer(validatePOSAnswer(exercise, word));
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted text-center">
        Which word is the <strong className="text-primary">intruder</strong>? 
        <br/><span className="text-sm">(It belongs to a different part of speech)</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        {data.items.map((item, i) => {
          const isSelected = selected === item.word;
          const isCorrect = item.word === exercise.correctAnswer;
          
          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 cursor-pointer';
          if (answered) {
             if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
             else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
             else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
             else stateClass = 'border-border bg-bg-gray opacity-40 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(item.word)}
              disabled={answered}
              className={`p-6 rounded-2xl border-2 text-center font-display text-lg font-bold transition-all duration-200 ${stateClass}`}
            >
              {item.word}
            </motion.button>
          );
        })}
      </div>
      
      {answered && selected && (
        <motion.div
           initial={{ opacity: 0, y: 8 }}
           animate={{ opacity: 1, y: 0 }}
           className={`p-4 rounded-xl border text-sm text-center ${validatePOSAnswer(exercise, selected) ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
           <p className="font-semibold">{validatePOSAnswer(exercise, selected) ? '✓ Correct!' : '✗ Not quite.'}</p>
           <p className="mt-1 text-text-muted">
             <strong>{exercise.correctAnswer}</strong> is a {data.intruderPOS}, but the others are {data.majorityPOS}s.
           </p>
        </motion.div>
      )}
    </div>
  );
});
