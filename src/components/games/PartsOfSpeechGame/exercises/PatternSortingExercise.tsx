'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

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
  // POS color if it's a known PartOfSpeech
  if (POS_COLORS[bucket as PartOfSpeech]) return POS_COLORS[bucket as PartOfSpeech];
  // Subcategory color if known
  if (SUBCATEGORY_COLORS[bucket]) return SUBCATEGORY_COLORS[bucket];
  // Fallback
  return 'bg-bg-gray text-text border-border';
}

function getBucketLabel(bucket: string): string {
  return POS_LABELS[bucket as PartOfSpeech] ?? bucket;
}

export const PatternSortingExercise = memo(function PatternSortingExercise({ exercise, onAnswer, answered }: Props) {
  const { sortingItems = [], prompt } = exercise;

  const bucketKeys = [...new Set(sortingItems.map(i => i.correctBucket))];
  const [buckets, setBuckets] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(bucketKeys.map(k => [k, []]))
  );
  const [remaining, setRemaining] = useState<string[]>(sortingItems.map(i => i.phrase));
  const [submitted, setSubmitted] = useState(false);

  const handleDrop = (bucket: string) => {
    if (submitted || answered || remaining.length === 0) return;
    const word = remaining[0];
    setRemaining(prev => prev.slice(1));
    setBuckets(prev => ({ ...prev, [bucket]: [...(prev[bucket] ?? []), word] }));
  };

  const handleSubmit = () => {
    if (submitted || answered || remaining.length > 0) return;
    setSubmitted(true);
    let correct = 0;
    let total = 0;
    for (const bucket of bucketKeys) {
      for (const word of buckets[bucket] ?? []) {
        const item = sortingItems.find(i => i.phrase === word);
        if (item) {
          total++;
          if (item.correctBucket === bucket) correct++;
        }
      }
    }
    onAnswer(total > 0 && correct / total >= 0.7);
  };

  const getBadgeClass = (word: string, bucket: string) => {
    if (!submitted) return 'bg-white dark:bg-[#162b3d] border-border';
    const item = sortingItems.find(i => i.phrase === word);
    if (!item) return 'border-border';
    return item.correctBucket === bucket
      ? 'bg-secondary/10 border-secondary text-secondary'
      : 'bg-error/10 border-error text-error line-through';
  };

  const gridClass = bucketKeys.length === 2
    ? 'grid-cols-2'
    : bucketKeys.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2';

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        {prompt}
      </p>

      {/* Remaining pile */}
      <div className="flex flex-wrap gap-3 justify-center min-h-[64px] p-4 bg-bg-gray/50 rounded-2xl border-2 border-dashed border-border/60">
        {remaining.length > 0 ? (
          remaining.map((word, idx) => (
            <motion.span
              key={word}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: idx === 0 ? 1.08 : 1, opacity: 1 }}
              className={`text-sm font-bold rounded-xl px-4 py-2 border transition-all duration-200 ${
                idx === 0
                  ? 'bg-white dark:bg-[#1c3a52] border-primary text-primary shadow-md ring-4 ring-primary/10'
                  : 'bg-white/80 dark:bg-[#162b3d]/80 border-border text-text-muted opacity-60'
              }`}
            >
              {word}
            </motion.span>
          ))
        ) : !submitted ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-bold text-sm flex items-center gap-2">
            ✓ Ready to check!
          </motion.p>
        ) : null}
      </div>

      {/* Bucket columns */}
      <div className={`grid gap-4 ${gridClass}`}>
        {bucketKeys.map(bucket => (
          <div key={bucket} className="space-y-2">
            <h3 className={`text-center text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl border ${getBucketStyle(bucket)}`}>
              {getBucketLabel(bucket)}
            </h3>
            <motion.div
              layout
              whileHover={remaining.length > 0 ? { scale: 1.02 } : {}}
              whileTap={remaining.length > 0 ? { scale: 0.98 } : {}}
              onClick={() => handleDrop(bucket)}
              className={`min-h-[120px] p-3 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 content-start cursor-pointer transition-colors ${
                remaining.length > 0
                  ? 'hover:border-primary/40 border-border bg-white dark:bg-[#162b3d]/30'
                  : 'border-border/40 bg-bg-gray/20'
              }`}
            >
              {(buckets[bucket] ?? []).map(word => (
                <motion.span
                  key={word}
                  layoutId={word}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-bold border rounded-lg px-3 py-1.5 ${getBadgeClass(word, bucket)}`}
                >
                  {word}
                </motion.span>
              ))}
              {(buckets[bucket] ?? []).length === 0 && !submitted && (
                <div className="flex flex-col items-center justify-center w-full h-full py-6 text-text-muted/40">
                  <span className="text-[10px] font-bold uppercase tracking-tight">Tap to place</span>
                </div>
              )}
            </motion.div>
          </div>
        ))}
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
  );
});
