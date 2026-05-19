'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POS_LABELS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const WordFamilyBuilderExercise = memo(function WordFamilyBuilderExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.wordFamilyData;
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});

  if (!data) return null;

  const targetPOSList = Array.from(new Set(data.nodes.map(n => n.partOfSpeech)));
  const availableWords = data.nodes.map(n => n.word).filter(w => !Object.values(placements).includes(w));

  const handleWordSelect = (word: string) => {
    if (answered) return;
    setSelectedWord(selectedWord === word ? null : word);
  };

  const handleSlotSelect = (pos: PartOfSpeech) => {
    if (answered) return;
    if (selectedWord) {
      setPlacements(prev => {
        const next = { ...prev, [pos]: selectedWord };
        checkCompletion(next);
        return next;
      });
      setSelectedWord(null);
    } else if (placements[pos]) {
      // Remove word from slot
      setPlacements(prev => {
        const next = { ...prev };
        delete next[pos];
        return next;
      });
    }
  };

  const checkCompletion = (currentPlacements: Record<string, string>) => {
    if (Object.keys(currentPlacements).length === targetPOSList.length) {
      let allCorrect = true;
      for (const pos of targetPOSList) {
        const correctNode = data.nodes.find(n => n.partOfSpeech === pos && n.word === currentPlacements[pos]);
        if (!correctNode) allCorrect = false;
      }
      onAnswer(allCorrect);
    }
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-lg text-text-muted text-center">
        Match the word forms to their <strong>Parts of Speech</strong>.
      </p>

      {/* Target Slots */}
      <div className="space-y-3">
        {targetPOSList.map((pos, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d]">
            <span className="font-semibold text-text-muted uppercase tracking-wider text-xs w-1/3">
              {POS_LABELS[pos as PartOfSpeech] || pos}
            </span>
            <button
              onClick={() => handleSlotSelect(pos as PartOfSpeech)}
              className={`flex-1 min-h-[3rem] rounded-xl border-2 border-dashed transition-colors flex items-center justify-center font-display font-bold text-lg
                ${answered 
                  ? data.nodes.find(n => n.partOfSpeech === pos)?.word === placements[pos]
                    ? 'border-secondary bg-secondary/10 text-secondary border-solid'
                    : 'border-error bg-error/10 text-error border-solid'
                  : placements[pos] 
                    ? 'border-primary bg-primary/10 text-primary border-solid' 
                    : selectedWord ? 'border-primary/50 hover:bg-primary/5' : 'border-border'
                }
              `}
              disabled={answered}
            >
              {placements[pos] ? placements[pos] : <span className="opacity-0">___</span>}
            </button>
          </div>
        ))}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap justify-center gap-2 min-h-[4rem]">
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
              className={`px-4 py-2 rounded-xl border-2 font-display font-bold text-sm transition-colors
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

      {answered && (
        <motion.div
           initial={{ opacity: 0, y: 8 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-4 rounded-xl border text-sm text-center bg-secondary/5 border-secondary/30 mt-4"
        >
           <p className="font-semibold text-secondary">Great practice!</p>
           <p className="mt-1 text-text-muted text-xs">
             Understanding how words change shape helps you choose the correct form for your sentences.
           </p>
        </motion.div>
      )}
    </div>
  );
});
