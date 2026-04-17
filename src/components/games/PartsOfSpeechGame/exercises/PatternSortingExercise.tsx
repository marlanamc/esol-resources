'use client';

import { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { DragEndEvent } from '@dnd-kit/core';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import { PosDndProvider, DraggableWord, DroppableSlot, useDragFeedback } from '../dnd';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const PILE_ID = '__pile__';

// Colors for subcategory bucket headers (intra-POS sorting)
const SUBCATEGORY_COLORS: Record<string, string> = {
  'Action Verb':              'bg-red-100 text-red-800 border-red-300',
  'State Verb':               'bg-orange-100 text-orange-800 border-orange-300',
  'Helping Verb':             'bg-red-100 text-red-800 border-red-300',
  'Linking Verb':             'bg-orange-100 text-orange-800 border-orange-300',
  'Person':                   'bg-blue-100 text-blue-800 border-blue-300',
  'Place':                    'bg-sky-100 text-sky-800 border-sky-200',
  'Thing':                    'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Idea or Concept':          'bg-violet-100 text-violet-800 border-violet-300',
  'Subject (I / we)':         'bg-green-100 text-green-800 border-green-300',
  'Object (me / them)':       'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Possessive (my / their)':  'bg-teal-100 text-teal-800 border-teal-300',
  'Describes look or feel':   'bg-amber-100 text-amber-800 border-amber-300',
  'How many or how much':     'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Personal opinion':         'bg-amber-100 text-amber-800 border-amber-300',
  'How? (manner)':            'bg-purple-100 text-purple-800 border-purple-300',
  'How often?':               'bg-purple-100 text-purple-800 border-purple-300',
  'When?':                    'bg-purple-100 text-purple-800 border-purple-300',
  'Where?':                   'bg-teal-100 text-teal-800 border-teal-300',
  'When? (time)':             'bg-teal-100 text-teal-800 border-teal-300',
  'Which way?':               'bg-teal-100 text-teal-800 border-teal-300',
  'Joining (and, but, or)':   'bg-orange-100 text-orange-800 border-orange-300',
  'Explaining (because, when)': 'bg-orange-100 text-orange-800 border-orange-300',
};

function getBucketStyle(bucket: string): string {
  if (POS_COLORS[bucket as PartOfSpeech]) return POS_COLORS[bucket as PartOfSpeech];
  if (SUBCATEGORY_COLORS[bucket]) return SUBCATEGORY_COLORS[bucket];
  return 'bg-bg-gray text-text border-border';
}

function getBucketLabel(bucket: string): string {
  return POS_LABELS[bucket as PartOfSpeech] ?? bucket;
}

export const PatternSortingExercise = memo(function PatternSortingExercise({ exercise, onAnswer, answered }: Props) {
  const { sortingItems = [], prompt } = exercise;
  const playFeedback = useDragFeedback();

  const bucketKeys = useMemo(() => [...new Set(sortingItems.map(i => i.correctBucket))], [sortingItems]);

  // Give each sorting item a stable id (supports duplicate phrases).
  const entries = useMemo(
    () =>
      sortingItems.map((item, idx) => ({
        id: `s-${idx}-${item.phrase}`,
        phrase: item.phrase,
        correctBucket: item.correctBucket,
      })),
    [sortingItems],
  );

  const [placement, setPlacement] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const e of entries) m[e.id] = PILE_ID;
    return m;
  });
  const [submitted, setSubmitted] = useState(false);

  const remaining = entries.filter(e => placement[e.id] === PILE_ID);

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted || answered) return;
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) return;

    if (overId === PILE_ID) {
      setPlacement(prev => ({ ...prev, [activeId]: PILE_ID }));
      playFeedback('drop');
      return;
    }
    if (bucketKeys.includes(overId)) {
      setPlacement(prev => ({ ...prev, [activeId]: overId }));
      playFeedback('drop');
    }
  };

  const handleSubmit = () => {
    if (submitted || answered || remaining.length > 0) return;
    setSubmitted(true);
    let correct = 0;
    let total = 0;
    for (const e of entries) {
      if (placement[e.id] === e.correctBucket) correct++;
      total++;
    }
    const pass = total > 0 && correct / total >= 0.7;
    playFeedback(pass ? 'correct' : 'wrong');
    onAnswer(pass);
  };

  const getBadgeClass = (entryId: string, bucket: string) => {
    if (!submitted) return 'bg-white dark:bg-[#162b3d] border-border text-text';
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return 'border-border';
    return entry.correctBucket === bucket
      ? 'bg-secondary/10 border-secondary text-secondary'
      : 'bg-error/10 border-error text-error line-through';
  };

  const gridClass = bucketKeys.length === 2
    ? 'grid-cols-2'
    : bucketKeys.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2';

  return (
    <PosDndProvider
      onDragEnd={handleDragEnd}
      onDragStart={() => playFeedback('pick')}
      renderOverlay={(id) => {
        const phrase = entries.find(e => e.id === id)?.phrase;
        if (!phrase) return null;
        return (
          <span className="text-sm font-bold rounded-xl px-4 py-2 border-2 border-primary bg-primary text-white shadow-xl">
            {phrase}
          </span>
        );
      }}
    >
      <div className="space-y-6">
        <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
          {prompt}
        </p>

        {/* Remaining pile */}
        <DroppableSlot
          id={PILE_ID}
          ariaLabel="Word pile"
          className="flex flex-wrap gap-3 justify-center min-h-[72px] p-4 bg-bg-gray/50 rounded-2xl border-2 border-dashed border-border/60 transition-colors"
          activeClassName="!border-primary/60 !bg-primary/5"
        >
          {remaining.length > 0 ? (
            remaining.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <DraggableWord
                  id={entry.id}
                  disabled={submitted}
                  className={`text-sm font-bold rounded-xl px-4 py-2 border-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md bg-white dark:bg-[#1c3a52] border-primary/60 text-text data-[dragging=true]:opacity-30`}
                  ariaLabel={`${entry.phrase}, drag to a bucket`}
                >
                  {entry.phrase}
                </DraggableWord>
              </motion.div>
            ))
          ) : !submitted ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-bold text-sm flex items-center gap-2 self-center">
              ✓ All sorted — ready to check!
            </motion.p>
          ) : null}
        </DroppableSlot>

        {/* Bucket columns */}
        <div className={`grid gap-4 ${gridClass}`}>
          {bucketKeys.map(bucket => {
            const placedEntries = entries.filter(e => placement[e.id] === bucket);
            return (
              <div key={bucket} className="space-y-2">
                <h3 className={`text-center text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl border ${getBucketStyle(bucket)}`}>
                  {getBucketLabel(bucket)}
                </h3>
                <DroppableSlot
                  id={bucket}
                  ariaLabel={`${getBucketLabel(bucket)} bucket`}
                  className="min-h-[120px] p-3 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 content-start bg-white dark:bg-[#162b3d]/30 border-border transition-colors"
                  activeClassName="!border-primary !bg-primary/5 ring-4 ring-primary/10"
                >
                  {placedEntries.map(entry => (
                    <motion.div key={entry.id} layoutId={entry.id} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      {submitted ? (
                        <span className={`inline-flex text-xs font-bold border-2 rounded-lg px-3 py-1.5 ${getBadgeClass(entry.id, bucket)}`}>
                          {entry.phrase}
                        </span>
                      ) : (
                        <DraggableWord
                          id={entry.id}
                          className="text-xs font-bold rounded-lg px-3 py-1.5 border-2 bg-white dark:bg-[#162b3d] border-border text-text hover:border-primary/40 transition-colors data-[dragging=true]:opacity-30"
                          ariaLabel={`${entry.phrase}, placed in ${getBucketLabel(bucket)}. Drag to move.`}
                        >
                          {entry.phrase}
                        </DraggableWord>
                      )}
                    </motion.div>
                  ))}
                  {placedEntries.length === 0 && !submitted && (
                    <div className="flex flex-col items-center justify-center w-full h-full py-6 text-text-muted/40 pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-tight">Drop here</span>
                    </div>
                  )}
                </DroppableSlot>
              </div>
            );
          })}
        </div>

        {!submitted && remaining.length === 0 && (
          <motion.button
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
          >
            Check My Answers
          </motion.button>
        )}
      </div>
    </PosDndProvider>
  );
});
