'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise, SortingItem } from '@/types/gerund-infinitive';

interface Props { exercise: GIExercise; onAnswer: (correct: boolean) => void; answered: boolean; }

export function PatternSortingExercise({ exercise, onAnswer, answered }: Props) {
  const { sortingItems = [], prompt } = exercise;
  const [buckets, setBuckets] = useState<{ gerund: SortingItem[]; infinitive: SortingItem[] }>({ gerund: [], infinitive: [] });
  const [remaining, setRemaining] = useState<SortingItem[]>(sortingItems);

  const handleDrop = (bucket: 'gerund' | 'infinitive', item: SortingItem) => {
    if (answered) return;
    setRemaining(prev => prev.filter(r => r.phrase !== item.phrase));
    setBuckets(prev => ({ ...prev, [bucket]: [...prev[bucket], item] }));
  };

  const handleSubmit = () => {
    if (answered || remaining.length > 0) return;
    const allItems = [...buckets.gerund, ...buckets.infinitive];
    const correctCount = allItems.filter(item => {
      const isInGerund = buckets.gerund.some(i => i.phrase === item.phrase);
      return isInGerund ? item.correctBucket === 'gerund' : item.correctBucket === 'infinitive';
    }).length;
    onAnswer(correctCount / allItems.length >= 0.7); // 70% to pass
  };

  const getBadgeClass = (item: SortingItem, bucket: 'gerund' | 'infinitive') => {
    if (!answered) return 'bg-white dark:bg-[#162b3d] border-border shadow-sm';
    return item.correctBucket === bucket
      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
      : 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-700 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-text-muted text-sm font-medium">{prompt}</p>
        <p className="text-xs text-text-muted/60">Tap a bucket to sort the active word</p>
      </div>

      {/* Remaining items to sort */}
      <div className="flex flex-wrap gap-3 justify-center min-h-[64px] p-4 bg-bg-gray/50 rounded-2xl border-2 border-dashed border-border/60 relative overflow-hidden">
        {remaining.length > 0 ? (
          remaining.map((item, idx) => (
            <motion.span
              key={item.phrase}
              layoutId={item.phrase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: idx === 0 ? 1.1 : 1, 
                opacity: 1,
                y: idx === 0 ? -2 : 0,
              }}
              className={`text-sm font-bold rounded-xl px-4 py-2 border transition-all duration-300 ${
                idx === 0 
                  ? 'bg-white dark:bg-[#1c3a52] border-primary text-primary shadow-lg ring-4 ring-primary/10 z-10 scale-110' 
                  : 'bg-white/80 dark:bg-[#162b3d]/80 border-border text-text-muted opacity-80'
              }`}
            >
              {idx === 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-sm ring-2 ring-white dark:ring-[#1c3a52]">
                  ★
                </span>
              )}
              {item.phrase}
            </motion.span>
          ))
        ) : !answered ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary font-bold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ready to check!
          </motion.div>
        ) : null}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 gap-4">
        {(['gerund', 'infinitive'] as const).map(bucket => (
          <div key={bucket} className="space-y-3">
            <h3 className={`text-center text-xs font-black uppercase tracking-widest p-2.5 rounded-xl border ${
              bucket === 'gerund' 
                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 border-orange-200 dark:border-orange-800/30' 
                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-800/30'
            }`}>
              {bucket === 'gerund' ? 'Gerund (-ing)' : 'Infinitive (to + verb)'}
            </h3>
            <motion.div
              layout
              whileHover={remaining.length > 0 ? { scale: 1.02, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' } : {}}
              whileTap={remaining.length > 0 ? { scale: 0.98 } : {}}
              className={`min-h-[140px] p-3 rounded-2xl border-2 border-dashed transition-colors flex flex-wrap gap-2 content-start cursor-pointer hover:border-primary/40 ${
                remaining.length > 0 ? 'border-border bg-white dark:bg-[#162b3d]/30' : 'border-border/40 bg-bg-gray/20'
              }`}
              onClick={() => remaining.length > 0 && handleDrop(bucket, remaining[0])}
            >
              {buckets[bucket].map(item => (
                <motion.span 
                  key={item.phrase} 
                  layoutId={item.phrase}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-bold border rounded-lg px-3 py-1.5 ${getBadgeClass(item, bucket)}`}
                >
                  {item.phrase}
                </motion.span>
              ))}
              {buckets[bucket].length === 0 && !answered && (
                <div className="flex flex-col items-center justify-center w-full h-full py-8 text-text-muted/40">
                   <svg className="w-8 h-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                   </svg>
                   <span className="text-[10px] font-bold uppercase tracking-tight">Tap to place</span>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Submit */}
      {!answered && remaining.length === 0 && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          Check My Answers
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      )}

      {answered && (
        <div className="text-center p-4 rounded-2xl bg-bg-gray border border-border">
          <p className="text-sm font-medium text-text-muted">
            Round Complete!
          </p>
        </div>
      )}
    </div>
  );
}
