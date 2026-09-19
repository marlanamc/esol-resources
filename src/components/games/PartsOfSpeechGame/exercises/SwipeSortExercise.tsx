'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PanInfo } from 'framer-motion';
import type { POSExercise, POSSwipeSortCard, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import { useDragFeedback } from '../dnd';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const SWIPE_THRESHOLD = 90;

interface Result {
  card: POSSwipeSortCard;
  chosen: PartOfSpeech;
  correct: boolean;
}

export const SwipeSortExercise = memo(function SwipeSortExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.swipeSortData;
  const playFeedback = useDragFeedback();

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const animatingRef = useRef(false);
  const finishedRef = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  // These drive the two bucket buttons, so at rest they must both be fully
  // legible -- the old [-200, 0] -> [1, 0.35] mapping bottomed out at 0.35 with
  // the card untouched, which read as "disabled" once the headers became the
  // controls. Now dragging dims the side the learner is moving away from.
  const leftOpacity = useTransform(x, [-200, 0, 200], [1, 1, 0.4]);
  const rightOpacity = useTransform(x, [-200, 0, 200], [0.4, 1, 1]);

  const cards = data?.cards ?? [];
  const total = cards.length;
  const current = cards[index];
  const leftBucket = data?.leftBucket;
  const rightBucket = data?.rightBucket;

  const summaryCorrect = useMemo(() => results.filter(r => r.correct).length, [results]);

  if (!data || !leftBucket || !rightBucket || total === 0) return null;

  const finish = (final: Result[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const correctCount = final.filter(r => r.correct).length;
    const pass = correctCount / total >= 0.7;
    playFeedback(pass ? 'correct' : 'wrong');
    onAnswer(pass);
  };

  const commit = (direction: 'left' | 'right') => {
    // `answered` means the round has already taken this exercise's result.
    // Without it the last card stayed live after finish(), and every further
    // tap re-reported a correct answer -- inflating the streak and the round
    // accuracy that decides whether points are awarded.
    if (animatingRef.current || !current || answered || finishedRef.current) return;
    animatingRef.current = true;
    const chosen = direction === 'left' ? leftBucket : rightBucket;
    const correct = chosen === current.correctBucket;
    const newResults = [...results, { card: current, chosen, correct }];
    setResults(newResults);
    setExitDir(direction);
    playFeedback(correct ? 'correct' : 'wrong');

    const delay = reducedMotion.current ? 80 : 240;
    setTimeout(() => {
      x.set(0);
      setExitDir(null);
      if (index + 1 >= total) {
        // Advance past the last card so `done` turns true: that swaps the card
        // for the summary and removes the bucket buttons.
        setIndex(total);
        animatingRef.current = false;
        finish(newResults);
      } else {
        setIndex(i => i + 1);
        animatingRef.current = false;
      }
    }, delay);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) commit('left');
    else if (info.offset.x >= SWIPE_THRESHOLD) commit('right');
    else x.set(0);
  };

  const done = index >= total;

  return (
    <div className="space-y-5">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1">
        {cards.map((c, i) => {
          const result = results[i];
          const state = result ? (result.correct ? 'ok' : 'bad') : i === index && !done ? 'active' : 'idle';
          return (
            <span
              key={c.id}
              className={`h-1.5 rounded-full transition-all ${
                state === 'active'
                  ? 'w-6 bg-primary'
                  : state === 'ok'
                  ? 'w-3 bg-secondary'
                  : state === 'bad'
                  ? 'w-3 bg-error'
                  : 'w-3 bg-border'
              }`}
            />
          );
        })}
      </div>

      {/*
        One row, not two. These used to be decorative headers with a second,
        identical-looking row of real buttons underneath, which left the learner
        guessing which pair to press. They are the swipe targets, so they are
        also the tap targets -- and they keep the drag-direction feedback.

        The colour lives on an inner span rather than the button: globals.css
        carries an unlayered `button { border: none; background: none; color:
        inherit }`, and unlayered rules beat Tailwind's layered utilities, so a
        POS_COLORS class set directly on the button renders as bare text.
      */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        <motion.button
          type="button"
          onClick={() => commit('left')}
          disabled={done || answered}
          aria-label={`Sort this word as ${POS_LABELS[leftBucket]}`}
          style={{ opacity: leftOpacity }}
          className="block transition-transform active:scale-[0.98] disabled:pointer-events-none"
        >
          <span className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-solid px-2 py-2 text-sm font-black uppercase tracking-widest ${POS_COLORS[leftBucket]}`}>
            <ChevronLeft size={16} /> {POS_LABELS[leftBucket]}
          </span>
        </motion.button>
        <motion.button
          type="button"
          onClick={() => commit('right')}
          disabled={done || answered}
          aria-label={`Sort this word as ${POS_LABELS[rightBucket]}`}
          style={{ opacity: rightOpacity }}
          className="block transition-transform active:scale-[0.98] disabled:pointer-events-none"
        >
          <span className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-solid px-2 py-2 text-sm font-black uppercase tracking-widest ${POS_COLORS[rightBucket]}`}>
            {POS_LABELS[rightBucket]} <ChevronRight size={16} />
          </span>
        </motion.button>
      </div>

      {/* Card stack */}
      <div className="relative h-44 sm:h-52 flex items-center justify-center select-none">
        {/* Peek card (next) */}
        <AnimatePresence>
          {!done && cards[index + 1] && (
            <motion.div
              key={`peek-${cards[index + 1].id}`}
              initial={{ scale: 0.92, y: 10, opacity: 0.5 }}
              animate={{ scale: 0.94, y: 8, opacity: 0.55 }}
              className="absolute inset-x-6 h-full rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {!done && current && (
            <motion.div
              key={current.id}
              drag={exitDir ? false : 'x'}
              style={exitDir ? undefined : { x, rotate }}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              onDragStart={() => playFeedback('pick')}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={exitDir ? { x: exitDir === 'left' ? -400 : 400, opacity: 0, rotate: exitDir === 'left' ? -20 : 20 } : { scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="absolute inset-x-4 h-full rounded-3xl border-2 border-primary/40 bg-white dark:bg-[#1c3a52] shadow-xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
            >
              <span className="text-[11px] uppercase tracking-widest font-bold text-text-muted">Card {index + 1} of {total}</span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-text">{current.word}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-4 h-full rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm flex flex-col items-center justify-center gap-1"
          >
            <p className="text-sm text-text-muted">All done</p>
            <p className="text-2xl font-display font-bold text-text">{summaryCorrect} / {total} correct</p>
          </motion.div>
        )}
      </div>

    </div>
  );
});
