'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import type { PanInfo } from 'framer-motion';
import type { POSAnswerDetail, POSExercise, POSSwipeSortCard, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_LABELS, POS_COLORS, POS_DEFINITIONS } from '@/types/parts-of-speech';
import { useDragFeedback } from '../dnd';
import { isAlternate, recordCard, summarize, type DeckState } from './swipeSortDeck';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean, detail?: POSAnswerDetail) => void;
  answered: boolean;
}

const SWIPE_THRESHOLD = 90;

/** 'a' vs 'an' for the parts of speech that start with a vowel sound. */
const VOWEL_POS: PartOfSpeech[] = ['adjective', 'adverb', 'article'];
const articleFor = (pos: PartOfSpeech) => (VOWEL_POS.includes(pos) ? 'an' : 'a');

interface Correction {
  card: POSSwipeSortCard;
  chosen: PartOfSpeech;
  /** The learner's answer was defensible, just not the bucket this deck wanted. */
  alternate: boolean;
}

export const SwipeSortExercise = memo(function SwipeSortExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.swipeSortData;
  const playFeedback = useDragFeedback();

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<DeckState>([]);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [flash, setFlash] = useState<'left' | 'right' | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const animatingRef = useRef(false);
  const finishedRef = useRef(false);
  const continueRef = useRef<HTMLButtonElement | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  // Listen rather than read once: a learner can turn the setting on mid-session,
  // and the one-shot read left the old value in place for the rest of the deck.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(
    () => () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    },
    [],
  );

  // Pull focus to the continue button so a keyboard or switch user is not
  // stranded on a panel that has taken over the card area.
  useEffect(() => {
    if (correction) continueRef.current?.focus();
  }, [correction]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  // These drive the two bucket buttons, so at rest they must both be fully
  // legible -- the old [-200, 0] -> [1, 0.35] mapping bottomed out at 0.35 with
  // the card untouched, which read as "disabled" once the headers became the
  // controls. Now dragging dims the side the learner is moving away from.
  const leftOpacity = useTransform(x, [-200, 0, 200], [1, 1, 0.4]);
  const rightOpacity = useTransform(x, [-200, 0, 200], [0.4, 1, 1]);

  const cards = useMemo(() => data?.cards ?? [], [data]);
  const total = cards.length;
  const current = cards[index];
  const leftBucket = data?.leftBucket;
  const rightBucket = data?.rightBucket;

  const summaryCorrect = useMemo(() => results.filter(r => r.correct).length, [results]);

  const finish = useCallback(
    (final: DeckState) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const { pass, ...detail } = summarize(final, total);
      playFeedback(pass ? 'correct' : 'wrong');
      onAnswer(pass, detail);
    },
    [onAnswer, playFeedback, total],
  );

  /** Move past the card just resolved, or report the deck if that was the last one. */
  const advance = useCallback(
    (nextResults: DeckState) => {
      x.set(0);
      setExitDir(null);
      setCorrection(null);
      setIndex(i => {
        const next = i + 1;
        if (next >= total) {
          // Land on the summary tile, which also removes the bucket buttons.
          finish(nextResults);
          return total;
        }
        return next;
      });
      animatingRef.current = false;
    },
    [finish, total, x],
  );

  if (!data || !leftBucket || !rightBucket || total === 0) return null;

  const commit = (direction: 'left' | 'right') => {
    // `answered` means the round has already taken this exercise's result.
    // Without it the last card stayed live after finish(), and every further
    // tap re-reported a correct answer -- inflating the streak and the round
    // accuracy that decides whether points are awarded.
    if (animatingRef.current || !current || answered || finishedRef.current || correction) return;
    animatingRef.current = true;
    const chosen = direction === 'left' ? leftBucket : rightBucket;
    const newResults = recordCard(results, current, chosen);
    const outcome = newResults[newResults.length - 1];
    const correct = outcome?.correct ?? false;
    setResults(newResults);
    setExitDir(direction);
    playFeedback(correct ? 'correct' : 'wrong');

    if (!correct) {
      setFlash(direction);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setFlash(null), 500);
    }

    const delay = reducedMotion ? 80 : 240;
    setTimeout(() => {
      // A miss stops the deck. The correction panel is the whole point of the
      // rework: right answers stay instant, wrong ones cost a beat and name the
      // answer. That asymmetry is what does the teaching.
      if (!correct || isAlternate(current, chosen)) {
        x.set(0);
        setExitDir(null);
        setCorrection({ card: current, chosen, alternate: isAlternate(current, chosen) });
        animatingRef.current = false;
        return;
      }
      advance(newResults);
    }, delay);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x <= -SWIPE_THRESHOLD) commit('left');
    else if (info.offset.x >= SWIPE_THRESHOLD) commit('right');
    else x.set(0);
  };

  const done = index >= total;
  const buttonsDisabled = done || answered || !!correction;

  const hint = isDragging ? 'Let go to choose.' : 'Tap a box. Or swipe the card.';
  const correctLabel = correction ? POS_LABELS[correction.card.correctBucket] : '';
  const announcement = correction
    ? correction.alternate
      ? `Both work. "${correction.card.word}" can be ${articleFor(correction.chosen)} ${POS_LABELS[correction.chosen]} or ${articleFor(correction.card.correctBucket)} ${correctLabel}.`
      : `Not quite. "${correction.card.word}" is ${articleFor(correction.card.correctBucket)} ${correctLabel}.`
    : '';

  /** Words already sorted into a bucket, newest last so the stack grows downward. */
  const sortedInto = (bucket: PartOfSpeech) =>
    results.filter(r => r.chosen === bucket);

  const renderBucket = (side: 'left' | 'right') => {
    const bucket = side === 'left' ? leftBucket : rightBucket;
    const opacity = side === 'left' ? leftOpacity : rightOpacity;
    const stack = sortedInto(bucket);
    const isFlashing = flash === side;

    return (
      <motion.button
        type="button"
        onClick={() => commit(side)}
        disabled={buttonsDisabled}
        aria-label={`Sort this word as ${POS_LABELS[bucket]}`}
        style={{ opacity: correction ? 0.6 : opacity }}
        className="group block h-full w-full text-left transition-transform active:scale-[0.99] disabled:pointer-events-none"
      >
        {/*
          The colour lives on this span rather than the button: globals.css
          carries an unlayered `button { border: none; background: none; color:
          inherit }`, and unlayered rules beat Tailwind's layered utilities, so
          a POS_COLORS class set directly on the button renders as bare text.
        */}
        <span
          className={`flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl border-2 border-solid transition-colors sm:min-h-[320px] ${
            isFlashing ? 'border-error bg-error/10' : POS_COLORS[bucket]
          }`}
        >
          <span className="flex items-center justify-center gap-1.5 border-b-2 border-solid border-current/20 px-2 py-2.5 text-xs font-black uppercase tracking-widest sm:text-sm">
            {side === 'left' && <ChevronLeft size={15} className="shrink-0 opacity-70" />}
            {POS_LABELS[bucket]}
            {side === 'right' && <ChevronRight size={15} className="shrink-0 opacity-70" />}
          </span>

          {/* The stack. Empty buckets say what goes in them rather than sitting blank. */}
          <span className="flex flex-1 flex-col items-center gap-1.5 overflow-hidden px-2 py-2.5">
            {stack.length === 0 ? (
              <span className="m-auto px-1 text-center text-[11px] font-medium leading-snug opacity-50">
                {POS_DEFINITIONS[bucket]}
              </span>
            ) : (
              <AnimatePresence initial={false}>
                {stack.slice(-5).map(r => (
                  <motion.span
                    key={r.card.id}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className={`flex w-full items-center justify-center gap-1 rounded-lg border border-solid px-2 py-1 text-sm font-bold sm:text-base ${
                      r.correct
                        ? 'border-current/25 bg-white/70 dark:bg-white/10'
                        : 'border-error/40 bg-error/10 text-error line-through decoration-2'
                    }`}
                  >
                    {r.card.word}
                  </motion.span>
                ))}
              </AnimatePresence>
            )}
          </span>
        </span>
      </motion.button>
    );
  };

  return (
    <div className="space-y-3 px-3 sm:px-0">
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
        The only instructions this activity has. Word Sort runs as a pinned
        course-map round, so ExerciseScreen's title and subtitle are both hidden
        by minimalChrome and the directions banner is gone by the time the
        learner is playing -- which left the screen with no text at all saying
        what to do, or that tapping works as well as swiping.
      */}
      <div className="flex min-h-[20px] items-center justify-center gap-1.5 text-center">
        {!done && !correction && (
          <>
            <Hand size={14} className="shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-xs font-medium text-text-muted sm:text-sm">{hint}</p>
          </>
        )}
      </div>

      {/*
        Buckets flank the card so a sorted word visibly lands in one of them.
        They were a pair of bare labels with nothing under them, which gave the
        learner no sense of progress and left the screen mostly empty.
        They are the swipe targets, so they are also the tap targets.
      */}
      <div className="mx-auto grid max-w-3xl grid-cols-[minmax(84px,1fr)_minmax(0,1.5fr)_minmax(84px,1fr)] items-stretch gap-2 sm:gap-3">
        {renderBucket('left')}

        {/* Card stack */}
        <div className="relative flex min-h-[240px] items-center justify-center select-none sm:min-h-[320px]">
          {/* Peek card (next) */}
          <AnimatePresence>
            {!done && !correction && cards[index + 1] && (
              <motion.div
                key={`peek-${cards[index + 1].id}`}
                initial={{ scale: 0.92, y: 10, opacity: 0.5 }}
                animate={{ scale: 0.94, y: 8, opacity: 0.55 }}
                className="absolute inset-x-2 h-[86%] rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm pointer-events-none"
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!done && !correction && current && (
              <motion.div
                key={current.id}
                drag={exitDir ? false : 'x'}
                style={exitDir ? undefined : { x, rotate }}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                onDragStart={() => {
                  setIsDragging(true);
                  playFeedback('pick');
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={exitDir ? { x: exitDir === 'left' ? -400 : 400, opacity: 0, rotate: exitDir === 'left' ? -20 : 20 } : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="absolute inset-x-0 h-[92%] rounded-3xl border-2 border-primary/40 bg-white dark:bg-[#1c3a52] shadow-xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
              >
                {/* No "Card 1 of 6" here -- the dots above already show it, and a
                    counter on the card competes with the one word it exists to show. */}
                <span className="px-2 text-center text-3xl font-display font-bold leading-tight text-text sm:text-5xl">
                  {current.word}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/*
            Correction panel. Takes over the card area rather than opening a
            modal -- at up to 18 cards a round, a dialog per miss would be
            unbearable. No retry: with two buckets, "try again" has exactly one
            compliant answer, and learners quickly find that tapping either box
            and switching beats thinking about the word.
          */}
          <AnimatePresence>
            {correction && (
              <motion.div
                key="correction"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`absolute -inset-x-[94px] z-20 h-full rounded-3xl border-2 bg-white px-3 py-3 shadow-xl dark:bg-[#1c3a52] sm:inset-x-0 ${
                  correction.alternate ? 'border-secondary/50' : 'border-error/50'
                } flex flex-col items-center justify-center gap-2 text-center`}
              >
                <p
                  className={`text-[11px] font-black uppercase tracking-widest sm:text-xs ${
                    correction.alternate ? 'text-secondary' : 'text-error'
                  }`}
                >
                  {correction.alternate ? '\u2713 Both work!' : '\u2717 Not quite'}
                </p>

                {correction.alternate ? (
                  <p className="text-sm font-display font-bold leading-snug text-text sm:text-lg">
                    &ldquo;{correction.card.word}&rdquo; works as both.
                  </p>
                ) : (
                  <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm font-display font-bold leading-snug text-text sm:text-lg">
                    <span>
                      &ldquo;{correction.card.word}&rdquo; is {articleFor(correction.card.correctBucket)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-lg border-2 border-solid px-2 py-0.5 text-[10px] font-black uppercase tracking-widest sm:text-xs ${
                        POS_COLORS[correction.card.correctBucket]
                      }`}
                    >
                      {correctLabel}
                    </span>
                  </p>
                )}

                {/*
                  An authored note when the word has one, otherwise the
                  definition of the category. The definition describes the
                  category, never this particular word, so it cannot be wrong --
                  which matters because the deck is generated and nothing here
                  knows the word.
                */}
                <p className="line-clamp-3 max-w-[280px] text-[11px] leading-snug text-text-muted sm:max-w-none sm:text-sm">
                  {correction.card.explanation ?? POS_DEFINITIONS[correction.card.correctBucket]}
                </p>

                <button
                  ref={continueRef}
                  type="button"
                  onClick={() => advance(results)}
                  className="mt-0.5 block w-full max-w-[220px]"
                >
                  <span className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-solid border-primary bg-primary px-3 py-2 text-sm font-bold text-white">
                    {index + 1 >= total ? 'See results' : 'Next word'}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-x-0 h-full rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm flex flex-col items-center justify-center gap-1"
            >
              <p className="text-xs text-text-muted sm:text-sm">All done</p>
              <p className="text-xl font-display font-bold text-text sm:text-3xl">
                {summaryCorrect} / {total}
              </p>
              <p className="text-[11px] text-text-muted sm:text-xs">correct</p>
            </motion.div>
          )}
        </div>

        {renderBucket('right')}
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
});
