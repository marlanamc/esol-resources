'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import type { POSExercise, PhotoSortItem } from '@/types/parts-of-speech';
import { SpeakButton } from '../SpeakButton';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

/**
 * Photo Sort exercise — a 2×2 grid of photo cards.
 * Students tap the card(s) whose word matches the target POS.
 *
 * - Single-select (multiSelect: false): tapping immediately grades (no Check button)
 * - Multi-select (multiSelect: true): tap to select/deselect, press Check to submit
 *
 * Photos only used for nouns and action verbs — never adjectives/adverbs/articles
 * (abstract POS would make students focus on the noun in the photo, not the concept).
 */
export function PhotoSortExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.photoSortData;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;

  const { items, targetPOS, multiSelect, correctIds } = data;

  const handleTap = (item: PhotoSortItem) => {
    if (answered || submitted) return;

    if (!multiSelect) {
      // Single-select: immediate grading
      const correct = correctIds.includes(item.id);
      onAnswer(correct);
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
    }
  };

  const handleCheck = () => {
    if (submitted || selectedIds.size === 0) return;
    setSubmitted(true);
    const selected = [...selectedIds].sort();
    const correct = [...correctIds].sort();
    const isCorrect = selected.length === correct.length && selected.every((id, i) => id === correct[i]);
    onAnswer(isCorrect);
  };

  const isItemCorrect = (item: PhotoSortItem) => correctIds.includes(item.id);
  const isItemSelected = (item: PhotoSortItem) => selectedIds.has(item.id);

  const getCardStyle = (item: PhotoSortItem) => {
    if (!answered && !submitted) {
      // Pre-answer state
      if (multiSelect && isItemSelected(item)) {
        return 'ring-4 ring-primary border-primary shadow-lg scale-[1.02]';
      }
      return 'border-border hover:border-primary/50 hover:shadow-md cursor-pointer';
    }
    // Post-answer state
    if (isItemCorrect(item)) {
      return 'ring-4 ring-secondary border-secondary shadow-lg';
    }
    if (isItemSelected(item) && !isItemCorrect(item)) {
      return 'ring-4 ring-error border-error shadow-lg';
    }
    return 'border-border opacity-60';
  };

  return (
    <div className="space-y-5">
      {/* Prompt */}
      <div className="text-center space-y-1">
        <p className="font-display text-sm text-text-muted uppercase tracking-wider">
          {multiSelect ? 'Tap ALL the' : 'Which photo shows a'}
        </p>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-lg font-bold border-2 ${POS_COLORS[targetPOS]}`}>
          {POS_LABELS[targetPOS]}
        </span>
        {multiSelect && (
          <p className="text-xs text-text-muted">Then press Check</p>
        )}
      </div>

      {/* 2×2 photo grid */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => handleTap(item)}
            disabled={answered || submitted}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={!answered && !submitted ? { scale: 0.96 } : {}}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${getCardStyle(item)}`}
          >
            <Image
              src={item.imageUrl}
              alt={item.altText}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 44vw, 240px"
              unoptimized
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Label strip */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 pb-3 px-3">
              {item.subcategoryLabel && (
                <p className="text-xs font-bold text-[#f8fafc]/80 uppercase tracking-wider leading-none mb-1">
                  {item.subcategoryLabel}
                </p>
              )}
              <p className="text-base font-bold text-[#f8fafc] leading-tight">{item.word}</p>
            </div>

            {/* Speak button */}
            <div className="absolute bottom-2 right-2" onClick={e => e.stopPropagation()}>
              <SpeakButton text={item.word} size="sm" />
            </div>

            {/* Correct/wrong badge after answer */}
            <AnimatePresence>
              {(answered || submitted) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 left-2"
                >
                  {isItemCorrect(item) ? (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow-md">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  ) : isItemSelected(item) ? (
                    <div className="w-7 h-7 rounded-full bg-error flex items-center justify-center shadow-md">
                      <XCircle size={16} className="text-white" />
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Multi-select checkmark overlay while selecting */}
            <AnimatePresence>
              {multiSelect && !submitted && !answered && isItemSelected(item) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-2 left-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <CheckCircle2 size={16} className="text-[#ffffff]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Check button for multi-select */}
      {multiSelect && !submitted && !answered && (
        <motion.button
          type="button"
          onClick={handleCheck}
          disabled={selectedIds.size === 0}
          whileHover={selectedIds.size > 0 ? { scale: 1.02 } : {}}
          whileTap={selectedIds.size > 0 ? { scale: 0.98 } : {}}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            selectedIds.size > 0
              ? 'bg-primary text-white shadow-sm hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          Check my answer
        </motion.button>
      )}

      {/* Post-answer feedback */}
      <AnimatePresence>
        {(answered || submitted) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl border text-sm"
          >
            <p className="font-semibold text-text-muted">
              <span className={`font-bold ${POS_COLORS[targetPOS].split(' ')[1]}`}>
                {POS_LABELS[targetPOS]}
              </span>
              {' '}= {items.filter(i => isItemCorrect(i)).map(i => `"${i.word}"`).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
