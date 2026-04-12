'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelineCanvas } from '../TimelineCanvas';
import { highlightSentenceFeatures } from '../highlightUtils';
import type { TimeSignalGroup } from '@/data/timeline-time-expressions';

interface TimeSignalsExploreProps {
  group: TimeSignalGroup;
}

export function TimeSignalsExplore({ group }: TimeSignalsExploreProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const entry = group.expressions[index];
  const total = group.expressions.length;
  const examples = entry.commonExamples ?? [
    { sentence: entry.exampleSentence, verbPhrase: entry.verbPhrase },
  ];

  function go(delta: 1 | -1) {
    setDirection(delta);
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {group.expressions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? `w-5 h-2 ${group.activeBg}`
                : 'w-2 h-2 bg-border/40 hover:bg-border'
            }`}
            aria-label={`Expression ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-5"
        >
          {/* Word chip */}
          <div className="text-center">
            <span
              className={`inline-block px-5 py-2 rounded-full text-2xl font-black border-2 ${group.border} ${group.tone} bg-white dark:bg-[#162b3d]`}
            >
              {entry.word}
            </span>
          </div>

          {/* Meaning */}
          <div className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-2">
              What it means
            </p>
            <p className="text-base font-semibold text-text leading-snug">{entry.meaning}</p>
          </div>

          {/* Timeline visualization */}
          <div className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-4 text-center">
              On the timeline
            </p>
            <TimelineCanvas elements={entry.timelineElements} showLabels={true} />
          </div>

          {/* Common examples */}
          <div className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-3">
              Common examples
            </p>
            <div className="flex flex-col gap-3">
              {examples.map((example, exampleIndex) => (
                <p key={`${entry.word}-${exampleIndex}`} className="text-xl font-display font-bold text-text leading-snug">
                  &ldquo;{highlightSentenceFeatures(example.sentence, example.verbPhrase)}&rdquo;
                </p>
              ))}
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className={`rounded-2xl border p-4 ${group.border} ${group.iconBg}`}>
              <div className="flex items-start gap-2.5">
                <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${group.activeBg} text-white mt-0.5`}>
                  Tip
                </span>
                <p className={`text-sm font-medium leading-snug ${group.tone}`}>{entry.notes}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => go(-1)}
          disabled={total <= 1}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/60 bg-white dark:bg-white/5 text-text-muted hover:text-text hover:border-border transition-all text-sm font-semibold disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-sm font-bold text-text-muted/50">
          {index + 1} / {total}
        </span>
        <button
          onClick={() => go(1)}
          disabled={total <= 1}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/60 bg-white dark:bg-white/5 text-text-muted hover:text-text hover:border-border transition-all text-sm font-semibold disabled:opacity-30"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
