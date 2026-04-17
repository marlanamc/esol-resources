'use client';

import { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { DragEndEvent } from '@dnd-kit/core';
import type { POSExercise } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import { PosDndProvider, DraggableWord, DroppableSlot, useDragFeedback } from '../dnd';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const BANK_ID = '__bank__';

function shuffleOnce<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const SentenceBuilderExercise = memo(function SentenceBuilderExercise({ exercise, onAnswer }: Props) {
  const { builderSlots = [], prompt } = exercise;
  const playFeedback = useDragFeedback();

  // Stable unique ids for draggable words (support duplicates like "the the").
  const wordEntries = useMemo(() => {
    return builderSlots
      .filter(s => !s.isProvided)
      .map((s, idx) => ({ wordId: `w-${idx}-${s.correctWord}`, word: s.correctWord }));
  }, [builderSlots]);

  const [shuffledBank] = useState<string[]>(() => shuffleOnce(wordEntries.map(w => w.wordId)));

  // Map of wordId -> slotId or BANK_ID
  const [placement, setPlacement] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const w of wordEntries) m[w.wordId] = BANK_ID;
    return m;
  });
  const [submitted, setSubmitted] = useState(false);

  const wordById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of wordEntries) m.set(e.wordId, e.word);
    return m;
  }, [wordEntries]);

  const bankIds = shuffledBank.filter(id => placement[id] === BANK_ID);

  const slotValues: Record<string, string | null> = useMemo(() => {
    const out: Record<string, string | null> = {};
    for (const slot of builderSlots) {
      if (slot.isProvided) {
        out[slot.id] = slot.correctWord;
      } else {
        const found = Object.entries(placement).find(([, loc]) => loc === slot.id);
        out[slot.id] = found ? wordById.get(found[0]) ?? null : null;
      }
    }
    return out;
  }, [builderSlots, placement, wordById]);

  const allFilled = builderSlots.every(s => slotValues[s.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted) return;
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) return;

    setPlacement(prev => {
      const next = { ...prev };

      if (overId === BANK_ID) {
        next[activeId] = BANK_ID;
        return next;
      }

      const slot = builderSlots.find(s => s.id === overId);
      if (!slot || slot.isProvided) return prev;

      // If slot already occupied, swap the occupant back to bank.
      const currentOccupant = Object.entries(prev).find(([id, loc]) => loc === overId && id !== activeId);
      if (currentOccupant) next[currentOccupant[0]] = BANK_ID;
      next[activeId] = overId;
      return next;
    });
    playFeedback('drop');
  };

  const handleSubmit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const correct = builderSlots.every(s => slotValues[s.id] === s.correctWord);
    playFeedback(correct ? 'correct' : 'wrong');
    onAnswer(correct);
  };

  return (
    <PosDndProvider
      onDragEnd={handleDragEnd}
      onDragStart={() => playFeedback('pick')}
      renderOverlay={(id) => (
        <span className="px-4 py-2 rounded-xl border-2 border-primary bg-primary text-white text-sm font-semibold shadow-xl">
          {wordById.get(id) ?? ''}
        </span>
      )}
    >
      <div className="space-y-6">
        <p className="text-sm text-text-muted text-center">{prompt}</p>

        {/* Sentence slots */}
        <div className="bg-white dark:bg-[#162b3d] p-5 rounded-2xl border-2 border-border">
          <div className="flex flex-wrap gap-2 justify-center items-end">
            {builderSlots.map((slot) => {
              const value = slotValues[slot.id];
              const isCorrectSlot = submitted && value === slot.correctWord;
              const isWrongSlot = submitted && value !== slot.correctWord;
              const posLabel = slot.partOfSpeech ? POS_LABELS[slot.partOfSpeech] : 'Word';
              const posTextClass = slot.partOfSpeech
                ? POS_COLORS[slot.partOfSpeech].split(' ')[1]
                : 'text-text-muted';

              if (slot.isProvided) {
                return (
                  <div key={slot.id} className="flex flex-col items-center gap-1">
                    <div className="min-w-[72px] px-3 py-2 rounded-xl border-2 bg-bg-gray border-border text-sm font-semibold text-text text-center">
                      {slot.correctWord}
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${posTextClass}`}>{posLabel}</span>
                  </div>
                );
              }

              // Dropped word inside a slot is also draggable, so students can swap.
              const placedEntry = Object.entries(placement).find(([, loc]) => loc === slot.id);
              const placedWordId = placedEntry?.[0];

              return (
                <div key={slot.id} className="flex flex-col items-center gap-1">
                  <DroppableSlot
                    id={slot.id}
                    disabled={submitted}
                    ariaLabel={`${posLabel} slot`}
                    className={`min-w-[88px] h-11 px-3 rounded-xl border-2 text-sm font-semibold text-center transition-all flex items-center justify-center ${
                      value
                        ? isCorrectSlot
                          ? 'bg-secondary/10 border-secondary text-secondary'
                          : isWrongSlot
                          ? 'bg-error/10 border-error text-error'
                          : 'bg-primary/10 border-primary text-primary'
                        : 'bg-bg-gray border-border/60 border-dashed text-text-muted/50'
                    }`}
                    activeClassName="!bg-primary/20 !border-primary ring-4 ring-primary/20"
                  >
                    {value && placedWordId && !submitted ? (
                      <DraggableWord
                        id={placedWordId}
                        className="w-full text-sm font-semibold text-current"
                        ariaLabel={`${value}, placed in ${posLabel} slot. Drag to reorder.`}
                      >
                        {value}
                      </DraggableWord>
                    ) : (
                      <span className="pointer-events-none">{value || '____'}</span>
                    )}
                  </DroppableSlot>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${posTextClass}`}>{posLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Word bank */}
        {!submitted && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted text-center">Drag each word into a slot to build the sentence.</p>
            <DroppableSlot
              id={BANK_ID}
              ariaLabel="Word bank"
              className="flex flex-wrap gap-2 justify-center min-h-[64px] p-3 rounded-2xl border-2 border-dashed border-border/60 bg-bg-gray/30 transition-colors"
              activeClassName="!border-primary/60 !bg-primary/5"
            >
              {bankIds.map(id => {
                const word = wordById.get(id) ?? '';
                return (
                  <DraggableWord
                    key={id}
                    id={id}
                    className="px-4 py-2 rounded-xl border-2 border-border bg-white dark:bg-[#162b3d] text-text text-sm font-semibold shadow-sm hover:border-primary/40 transition-colors data-[dragging=true]:opacity-30"
                    ariaLabel={`${word}, draggable word`}
                  >
                    {word}
                  </DraggableWord>
                );
              })}
              {bankIds.length === 0 && (
                <p className="text-xs text-text-muted/60 italic self-center">All words placed — ready to check!</p>
              )}
            </DroppableSlot>
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
            className={`p-4 rounded-xl border text-sm ${
              builderSlots.every(s => slotValues[s.id] === s.correctWord)
                ? 'bg-secondary/5 border-secondary/30'
                : 'bg-error/5 border-error/20'
            }`}
          >
            <p
              className={`font-semibold ${
                builderSlots.every(s => slotValues[s.id] === s.correctWord) ? 'text-secondary' : 'text-error'
              }`}
            >
              {builderSlots.every(s => slotValues[s.id] === s.correctWord)
                ? '✓ Perfect sentence!'
                : `✗ The correct sentence: ${builderSlots.map(s => s.correctWord).join(' ')}`}
            </p>
          </motion.div>
        )}
      </div>
    </PosDndProvider>
  );
});
