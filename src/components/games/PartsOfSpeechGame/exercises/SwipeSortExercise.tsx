'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform, AnimatePresence, animate } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Hand } from 'lucide-react';
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

/*
  Gesture tuning.

  The card used to be dragged with `dragConstraints={{left: 0, right: 0}}` and
  `dragElastic={0.6}`. Zero-width constraints do not pin the card -- they make
  every pixel of the drag pass through a constant 0.6x gain, so at the old 90px
  threshold the card had moved 54px and the finger and the card were 36px apart
  and diverging. That gap is what read as lag; nothing was actually dropping
  frames. With the constraints gone the card tracks the pointer exactly, so
  these numbers are now both the finger distance and the distance a learner
  sees.
*/

/** Finger travel that commits a card. */
const SWIPE_DISTANCE = 64;
/** A fast flick commits even when it is short, in px/s. */
const SWIPE_VELOCITY = 500;
/** Floor under the flick path so a jittery tap cannot commit. */
const FLICK_MIN_DISTANCE = 20;
/**
 * Window for our own release-speed estimate, in ms. Framer's `info.velocity`
 * averages over ~100ms including the slow start of the gesture, so a quick
 * 30px flick came back as ~60px/s and silently snapped home.
 */
const FLICK_WINDOW_MS = 60;

/**
 * How far off centre the card flies. It is fully faded well before it lands, so
 * this only has to clear the card box rather than the viewport.
 */
const EXIT_TRAVEL = 320;
/** Mobile fly-out overshoots the bucket's centre by this much past the card edge. */
const STACKED_EXIT_EXTRA = 40;
/** How small the card gets as it lands in a bucket on a phone. */
const STACKED_LANDING_SCALE = 0.6;
/** How far the card has shrunk by the time a swipe is armed. */
const STACKED_ARMED_SCALE = 0.92;
/** Correct card -> next card. The card is invisible from ~130ms. */
const EXIT_MS = 150;
/** Miss -> correction panel. The one card that still costs a beat, on purpose. */
const MISS_MS = 260;
const REDUCED_MISS_MS = 120;
/** Must outlive MISS_MS so the learner still sees which bucket took the word. */
const FLASH_MS = 600;

const FLY_OUT = { type: 'spring', stiffness: 520, damping: 34, mass: 0.6 } as const;
const SNAP_BACK = { type: 'spring', stiffness: 700, damping: 40, mass: 0.5 } as const;
const CARD_IN = {
  opacity: { duration: 0.11 },
  scale: { type: 'spring', stiffness: 700, damping: 40, mass: 0.6 },
} as const;
const CARD_OUT = {
  opacity: { duration: 0.13, ease: 'easeOut' },
  scale: { duration: 0.15 },
} as const;
const STACK_IN = { type: 'spring', stiffness: 600, damping: 34, mass: 0.7 } as const;
const PANEL_IN = {
  opacity: { duration: 0.14 },
  y: { type: 'spring', stiffness: 500, damping: 34 },
} as const;

/** 'a' vs 'an' for the parts of speech that start with a vowel sound. */
const VOWEL_POS: PartOfSpeech[] = ['adjective', 'adverb', 'article'];
const articleFor = (pos: PartOfSpeech) => (VOWEL_POS.includes(pos) ? 'an' : 'a');

/**
 * Speed over the last FLICK_WINDOW_MS of a drag, in px/s. A finger that stops
 * and then lifts has no sample inside the window, so it measures against the
 * last one it left and reads 0 -- a pause before release is not a flick.
 */
function releaseSpeed(samples: Array<[number, number]>, travel: number, now: number): number {
  const first = samples.find(([t]) => now - t <= FLICK_WINDOW_MS) ?? samples[samples.length - 1];
  if (!first) return 0;
  const dt = Math.max(now - first[0], 8);
  return ((travel - first[1]) / dt) * 1000;
}

/*
  Below `sm` the buckets stack and the card is swiped up/down. Read through
  useSyncExternalStore rather than useState(false) + an effect, so the first
  client render already has the right axis instead of arming a horizontal drag
  for one commit.
*/
const STACKED_QUERY = '(max-width: 639px)';
const subscribeStacked = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(STACKED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const getStacked = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(STACKED_QUERY).matches;
const getStackedOnServer = () => false;

interface Correction {
  card: POSSwipeSortCard;
  chosen: PartOfSpeech;
  /** The learner's answer was defensible, just not the bucket this deck wanted. */
  alternate: boolean;
}

export const SwipeSortExercise = memo(function SwipeSortExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.swipeSortData;
  // Build the AudioContext during idle time rather than inside the first
  // gesture -- see the note on `warmOnMount` in useDragFeedback.
  const playFeedback = useDragFeedback({ warmOnMount: true });

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<DeckState>([]);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [flash, setFlash] = useState<'left' | 'right' | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const animatingRef = useRef(false);
  const finishedRef = useRef(false);
  const continueRef = useRef<HTMLButtonElement | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const commitTimerRef = useRef<number | null>(null);
  const exitAnimRef = useRef<ReturnType<typeof animate> | null>(null);

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

  // Every deferred callback this component owns is cancelled here, so nothing
  // survives to setState on an unmounted component -- the commit timer now
  // drives advancement, so leaving it running would report a card after the
  // learner has already navigated away.
  useEffect(
    () => () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
      exitAnimRef.current?.stop();
    },
    [],
  );

  // Pull focus to the continue button so a keyboard or switch user is not
  // stranded on a panel that has taken over the card area.
  useEffect(() => {
    if (correction) continueRef.current?.focus();
  }, [correction]);

  // Below `sm` the buckets stack and the card is swiped up/down; from `sm` up
  // they flank the card and it is swiped left/right. Three columns cannot all
  // be comfortable on a 390px phone -- the buckets end up too narrow to hold
  // their own definition text -- so the axis follows the layout.
  const stacked = useSyncExternalStore(subscribeStacked, getStacked, getStackedOnServer);
  /** The card column, measured so a phone fly-out lands on the bucket. */
  const cardAreaRef = useRef<HTMLDivElement | null>(null);

  /**
   * Displacement along whichever axis is live. The sign convention is the same
   * either way: negative is the first bucket (left, or top), positive is the
   * second (right, or bottom), so nothing downstream has to know the axis.
   */
  const x = useMotionValue(0);
  // Tuned to the 1:1 travel above: against the old 0.6x-damped drag, a
  // [-200, 200] range put the card at 1.9deg when it was already committed,
  // which read as no feedback at all.
  const rotate = useTransform(x, [-140, 140], [-10, 10]);
  /*
    The "armed" state: every drag cue reaches its end value at SWIPE_DISTANCE,
    the exact point where letting go commits. The dim used to finish at 96px,
    32px past the commit, and nothing lit up on the side being chosen, so a
    release was a guess.

    These drive the two bucket buttons, so at rest they must both be fully
    legible. Dragging dims the side the learner is moving away from, and grows
    and outlines the side they are moving toward.
  */
  const leftOpacity = useTransform(x, [-SWIPE_DISTANCE, 0, SWIPE_DISTANCE], [1, 1, 0.4]);
  const rightOpacity = useTransform(x, [-SWIPE_DISTANCE, 0, SWIPE_DISTANCE], [0.4, 1, 1]);
  const leftScale = useTransform(x, [-SWIPE_DISTANCE, 0], [1.03, 1]);
  const rightScale = useTransform(x, [0, SWIPE_DISTANCE], [1, 1.03]);
  const leftRing = useTransform(x, [-SWIPE_DISTANCE, -SWIPE_DISTANCE / 2], [1, 0]);
  const rightRing = useTransform(x, [SWIPE_DISTANCE / 2, SWIPE_DISTANCE], [0, 1]);
  // Phone only: the vertical card has no tilt to show it is moving, so it
  // shrinks instead -- a little by the commit point, and on down to landing
  // size as the fly-out carries it into the bucket. One transform covers both
  // the drag and the exit, so there is no hand-off between them.
  const stackedScale = useTransform(
    x,
    [-EXIT_TRAVEL, -SWIPE_DISTANCE, 0, SWIPE_DISTANCE, EXIT_TRAVEL],
    [STACKED_LANDING_SCALE, STACKED_ARMED_SCALE, 1, STACKED_ARMED_SCALE, STACKED_LANDING_SCALE],
  );

  // A haptic tick each time the drag crosses the commit line, either way, so
  // the learner can feel the point of no return (Android; iOS has no
  // vibration API). Tracked in a ref so the drag never re-renders.
  const armedRef = useRef(false);
  const draggingRef = useRef(false);
  /** Recent [time, offset] samples along the live axis, for the flick speed. */
  const samplesRef = useRef<Array<[number, number]>>([]);
  useMotionValueEvent(x, 'change', latest => {
    if (!draggingRef.current) return;
    const armed = Math.abs(latest) >= SWIPE_DISTANCE;
    if (armed !== armedRef.current) {
      armedRef.current = armed;
      if (armed) playFeedback('arm');
    }
  });

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
      exitAnimRef.current?.stop();
      exitAnimRef.current = null;
      // `jump`, not `set`: it also clears the velocity history, so the next
      // card's first drag does not inherit the fly-out's speed. It runs
      // synchronously, so the incoming card's first render already builds its
      // transform from 0 -- keep this before setIndex.
      x.jump(0);
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

  const commit = (direction: 'left' | 'right', velocity = 0) => {
    // `answered` means the round has already taken this exercise's result.
    // Without it the last card stayed live after finish(), and every further
    // tap re-reported a correct answer -- inflating the streak and the round
    // accuracy that decides whether points are awarded.
    if (animatingRef.current || !current || answered || finishedRef.current || correction) return;
    animatingRef.current = true;
    const card = current;
    const chosen = direction === 'left' ? leftBucket : rightBucket;
    const newResults = recordCard(results, card, chosen);
    // By id, not by last index: recordCard is idempotent per card, so on a
    // duplicate it returns the same array and the last entry is the *previous*
    // card's outcome.
    const outcome = newResults.find(r => r.card.id === card.id);
    const correct = outcome?.correct ?? false;
    const alternate = isAlternate(card, chosen);
    /** A miss and an "alternate" both stop the deck on the correction panel. */
    const stops = !correct || alternate;

    setResults(newResults);
    setExitDir(direction);
    playFeedback(correct ? 'correct' : 'wrong');

    if (!correct) {
      setFlash(direction);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setFlash(null), FLASH_MS);
    }

    const settle = () => {
      commitTimerRef.current = null;
      exitAnimRef.current?.stop();
      exitAnimRef.current = null;
      // A miss stops the deck. The correction panel is the whole point of the
      // rework: right answers stay instant, wrong ones cost a beat and name the
      // answer. That asymmetry is what does the teaching.
      if (stops) {
        x.jump(0);
        setExitDir(null);
        setCorrection({ card, chosen, alternate });
        animatingRef.current = false;
        return;
      }
      advance(newResults);
    };

    if (reducedMotion) {
      x.jump(0);
      commitTimerRef.current = window.setTimeout(settle, stops ? REDUCED_MISS_MS : 0);
      return;
    }

    // Drive the fly-out on the motion value rather than the `animate` prop.
    // `style` stays bound to `x` for the card's whole life: unbinding it (the
    // old `style={exitDir ? undefined : {x, rotate}}`) made framer drop the
    // value, paint one frame at dead centre, and then animate out from 0 --
    // a visible snap back to the middle on every single card.
    // On a phone, fly to the bucket rather than a flat distance: half the card
    // area puts the card's centre on the area's edge, and the extra carries it
    // onto the bucket, where stackedScale has shrunk it to landing size.
    const travel =
      stacked && cardAreaRef.current
        ? Math.min(cardAreaRef.current.offsetHeight / 2 + STACKED_EXIT_EXTRA, EXIT_TRAVEL)
        : EXIT_TRAVEL;
    exitAnimRef.current?.stop();
    exitAnimRef.current = animate(x, direction === 'left' ? -travel : travel, {
      ...FLY_OUT,
      velocity,
    });
    commitTimerRef.current = window.setTimeout(settle, stops ? MISS_MS : EXIT_MS);
  };

  // Times come from the events themselves: `timeStamp` is on the same clock
  // as performance.now() and keeps these handlers pure for the React compiler.
  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // No state here: a setState on drag start re-rendered the whole exercise,
    // bucket stacks and all, on the first frame of the gesture.
    draggingRef.current = true;
    armedRef.current = false;
    samplesRef.current = [[event.timeStamp, 0]];
    // A frame later: the pick blip is decoration, the first frame of the drag
    // is not.
    requestAnimationFrame(() => playFeedback('pick'));
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const now = event.timeStamp;
    const samples = samplesRef.current;
    samples.push([now, stacked ? info.offset.y : info.offset.x]);
    // Keep one sample older than the window so the estimate always spans it.
    while (samples.length > 2 && now - samples[1][0] > FLICK_WINDOW_MS) samples.shift();
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    draggingRef.current = false;
    armedRef.current = false;
    const travel = stacked ? info.offset.y : info.offset.x;
    const framerSpeed = stacked ? info.velocity.y : info.velocity.x;
    const ownSpeed = releaseSpeed(samplesRef.current, travel, event.timeStamp);
    samplesRef.current = [];
    // Whichever reads faster: ours catches the short flick, framer's the long
    // steady throw.
    const speed = Math.abs(ownSpeed) > Math.abs(framerSpeed) ? ownSpeed : framerSpeed;
    const dragged = Math.abs(travel) >= SWIPE_DISTANCE;
    const flicked = Math.abs(speed) >= SWIPE_VELOCITY && Math.abs(travel) >= FLICK_MIN_DISTANCE;

    if (dragged || flicked) {
      // On a flick the travel can be tiny, so let the throw pick the direction.
      const dir = (flicked && !dragged ? speed : travel) < 0 ? 'left' : 'right';
      commit(dir, speed);
      return;
    }
    // Sub-threshold: spring home on our own timing. `x.set(0)` would teleport.
    exitAnimRef.current?.stop();
    exitAnimRef.current = animate(x, 0, SNAP_BACK);
  };

  const done = index >= total;
  const buttonsDisabled = done || answered || !!correction;

  const hint = 'Tap a box. Or swipe the card.';
  const correctLabel = correction ? POS_LABELS[correction.card.correctBucket] : '';
  const announcement = correction
    ? correction.alternate
      ? `Both work. "${correction.card.word}" can be ${articleFor(correction.chosen)} ${POS_LABELS[correction.chosen]} or ${articleFor(correction.card.correctBucket)} ${correctLabel}.`
      : `Not quite. "${correction.card.word}" is ${articleFor(correction.card.correctBucket)} ${correctLabel}.`
    : '';

  /** Words already sorted into a bucket, newest last: they stack downward beside
   *  the card on desktop, and flow across the bar on a phone. */
  const sortedInto = (bucket: PartOfSpeech) =>
    results.filter(r => r.chosen === bucket);

  const renderBucket = (side: 'left' | 'right') => {
    const bucket = side === 'left' ? leftBucket : rightBucket;
    const opacity = side === 'left' ? leftOpacity : rightOpacity;
    const scale = side === 'left' ? leftScale : rightScale;
    const ring = side === 'left' ? leftRing : rightRing;
    const stack = sortedInto(bucket);
    const isFlashing = flash === side;
    // Written out rather than interpolated -- Tailwind cannot see a class name
    // built from a variable.
    // Stacked rows on a phone, flanking columns from sm up. Written out
    // rather than interpolated -- Tailwind cannot see a class name built from
    // a variable.
    const placement =
      side === 'left'
        ? 'row-start-1 sm:col-start-1 sm:row-start-1'
        : 'row-start-3 sm:col-start-3 sm:row-start-1';

    return (
      <motion.button
        type="button"
        onClick={() => commit(side)}
        disabled={buttonsDisabled}
        aria-label={`Sort this word as ${POS_LABELS[bucket]}`}
        style={{ opacity: correction ? 0.6 : opacity, scale }}
        className={`group ${placement} col-start-1 block h-full w-full text-left transition-[scale] active:scale-[0.99] disabled:pointer-events-none`}
      >
        {/*
          The colour lives on this span rather than the button: globals.css
          carries an unlayered `button { border: none; background: none; color:
          inherit }`, and unlayered rules beat Tailwind's layered utilities, so
          a POS_COLORS class set directly on the button renders as bare text.

          Height comes from --stage on the grid, declared once and read by the
          two buckets, the card column and the correction panel, so they cannot
          drift apart the way the old pair of min-h literals did.
        */}
        <span
          className={`relative flex h-full min-h-[76px] flex-row overflow-hidden rounded-2xl border-2 border-solid transition-colors sm:min-h-[var(--stage)] sm:flex-col ${
            isFlashing ? 'border-error bg-error/10' : POS_COLORS[bucket]
          }`}
        >
          {/* The armed outline, in the bucket's own colour. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: ring }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-4 ring-inset ring-current/45"
          />
          {/*
            Sentence case on mobile, caps only from sm up. Caps are harder to
            read -- more so with low vision, and these are language learners --
            and "Conjunction" in caps does not fit the rail at 320px once the
            Large Text setting is on. Sizes here and below are rem-based on
            purpose: that setting scales the root font size (globals.css,
            html[data-font-size="large"]), which an absolute text-[11px]
            silently ignored.
          */}
          <span className="flex w-auto min-w-[88px] max-w-[48%] shrink-0 flex-col items-center justify-center gap-0.5 border-r-2 sm:min-w-0 sm:max-w-none sm:flex-row sm:gap-1.5 border-solid border-current/20 px-2 py-2 text-center text-sm font-black leading-tight sm:w-auto sm:border-r-0 sm:border-b-2 sm:px-2 sm:py-2.5 sm:text-sm sm:uppercase sm:tracking-widest">
            {side === 'left' && (
              <>
                <ChevronUp className="h-3.5 w-3.5 shrink-0 opacity-70 sm:hidden" aria-hidden="true" />
                <ChevronLeft className="hidden h-[15px] w-[15px] shrink-0 opacity-70 sm:block" aria-hidden="true" />
              </>
            )}
            {/*
              The label needs its own box to wrap in: as a bare text node it was
              an anonymous flex item that could not shrink below its min-content
              width, so "Conjunction" and "Preposition" were silently clipped by
              the overflow-hidden above. `anywhere` rather than `break-word`
              because only the former actually lowers min-content.
            */}
            <span className="min-w-0 [overflow-wrap:anywhere]">{POS_LABELS[bucket]}</span>
            {side === 'right' && (
              <>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70 sm:hidden" aria-hidden="true" />
                <ChevronRight className="hidden h-[15px] w-[15px] shrink-0 opacity-70 sm:block" aria-hidden="true" />
              </>
            )}
          </span>

          {/* The stack. Empty buckets say what goes in them rather than sitting blank. */}
          <span className="flex flex-1 flex-row flex-wrap items-center content-center justify-center gap-1.5 overflow-hidden px-2 py-2 sm:flex-col sm:flex-nowrap sm:py-2.5">
            {stack.length === 0 ? (
              <span className="m-auto px-0.5 text-center text-sm font-medium leading-snug text-balance opacity-60 sm:text-base">
                {POS_DEFINITIONS[bucket]}
              </span>
            ) : (
              <AnimatePresence initial={false}>
                {stack.slice(-5).map(r => (
                  <motion.span
                    key={r.card.id}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={STACK_IN}
                    className={`flex items-center justify-center gap-1 rounded-lg border border-solid px-2.5 py-1 text-base leading-tight font-bold break-words sm:w-full sm:text-lg ${
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
    <div className="flex flex-col gap-2 px-2 max-sm:min-h-0 max-sm:flex-1 max-sm:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-0">
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
            <p className="text-sm font-medium text-text-muted sm:text-base">{hint}</p>
          </>
        )}
      </div>

      {/*
        Buckets flank the card so a sorted word visibly lands in one of them.
        They were a pair of bare labels with nothing under them, which gave the
        learner no sense of progress and left the screen mostly empty.
        They are the swipe targets, so they are also the tap targets.

        On a phone the grid takes whatever height the flex column above it
        leaves (ExerciseScreen and PartsOfSpeechGame pass a real height down,
        and the page does not scroll), capped so a tall phone does not stretch
        it into a ribbon. It used to be a calc(100dvh - 10.5rem) guess at the
        header's height, which Large Text or a taller header overflowed by a
        few pixels -- enough to make the page scroll under a vertical swipe.
        From sm up, --stage pins the template to the 320px this screen has
        always used.

        Every child is placed explicitly so the correction panel can overlay
        the row instead of wrapping onto a second one.
      */}
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 max-sm:my-auto max-sm:max-h-[40rem] max-sm:min-h-0 max-sm:flex-1 grid-rows-[auto_minmax(0,1fr)_auto] items-stretch gap-2 sm:h-auto sm:grid-cols-[minmax(84px,1fr)_minmax(0,1.5fr)_minmax(84px,1fr)] sm:grid-rows-1 sm:gap-3 sm:[--stage:320px]">
        {renderBucket('left')}

        {/* Card stack */}
        {/*
          touch-none is on this wrapper, not the card: framer writes the card's
          own touch-action inline (pan-x for a vertical drag), and the effective
          value is the intersection with every ancestor. Left at pan-x, a
          slightly diagonal swipe could be claimed by the browser as a
          horizontal pan or a back-swipe and cancel the drag mid-gesture.

          z-10 keeps the card above the bottom bucket, a later sibling, while it
          flies into it.
        */}
        <div
          ref={cardAreaRef}
          className="relative z-10 col-start-1 row-start-2 flex touch-none items-center justify-center select-none sm:col-start-2 sm:row-start-1 sm:min-h-[var(--stage)]"
        >
          {/* Peek card (next) */}
          <AnimatePresence>
            {!done && !correction && cards[index + 1] && (
              <motion.div
                key={`peek-${cards[index + 1].id}`}
                initial={{ scale: 0.92, y: 10, opacity: 0.5 }}
                animate={{ scale: 0.94, y: 8, opacity: 0.55 }}
                className="absolute inset-0 m-auto aspect-[3/4] h-auto max-h-full w-[min(calc(100%-2rem),20rem)] sm:aspect-[4/7] sm:max-h-[86%] sm:w-[calc(100%-1rem)] rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm pointer-events-none"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!done && !correction && current && (
              <motion.div
                key={current.id}
                drag={exitDir ? false : stacked ? 'y' : 'x'}
                // No dragConstraints: with none, the card is origin + delta, so
                // it tracks the pointer 1:1. dragElastic is a no-op without
                // them and is set explicitly so a future re-add of constraints
                // cannot silently start damping the drag again.
                dragElastic={1}
                // Framer's own drag-end inertia would otherwise launch an
                // unconstrained card off on its own and fight the fly-out.
                dragMomentum={false}
                style={stacked ? { y: x, scale: stackedScale } : { x, rotate }}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                // Sized on a phone, not stretched across the whole row: a
                // 390x450 slab moved 64px barely looked like it had moved.
                // inset-0 + m-auto centres on both axes without a transform, so
                // it cannot fight the motion values.
                className="absolute inset-0 m-auto aspect-[3/4] h-auto max-h-full w-[min(calc(100%-2rem),20rem)] sm:aspect-[4/7] sm:max-h-[92%] sm:w-full cursor-grab active:cursor-grabbing"
              >
                {/*
                  Opacity and scale on an inner layer: the outer one's scale is
                  bound to the drag on a phone, and the animate prop cannot own
                  a value `style` already holds. The card is invisible before
                  the swap, which is what makes the advance timing independent
                  of where it is.
                */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={exitDir ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
                  transition={exitDir ? CARD_OUT : CARD_IN}
                  className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-3xl border-2 border-primary/40 bg-white shadow-xl dark:bg-[#1c3a52]"
                >
                  {/* No "Card 1 of 6" here -- the dots above already show it, and a
                      counter on the card competes with the one word it exists to show. */}
                  <span className="px-3 text-center text-[clamp(2rem,11vw,3.25rem)] font-display font-bold leading-tight break-words text-text sm:text-5xl">
                    {current.word}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 m-auto aspect-[3/4] h-auto max-h-full w-[min(calc(100%-2rem),20rem)] sm:aspect-[4/7] sm:w-full rounded-3xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm flex flex-col items-center justify-center gap-1"
            >
              <p className="text-sm text-text-muted sm:text-base">All done</p>
              <p className="text-xl font-display font-bold text-text sm:text-3xl">
                {summaryCorrect} / {total}
              </p>
              <p className="text-sm text-text-muted">correct</p>
            </motion.div>
          )}
        </div>

        {renderBucket('right')}

        {/*
          Correction panel. Takes over the play area rather than opening a
          modal -- at up to 18 cards a round, a dialog per miss would be
          unbearable. No retry: with two buckets, "try again" has exactly one
          compliant answer, and learners quickly find that tapping either box
          and switching beats thinking about the word.

          It is a grid child rather than an absolutely positioned overlay, so it
          spans all three columns on a phone at any width. It used to reach over
          the buckets with a hardcoded -inset-x-[94px], a number derived from
          the old column widths.
        */}
        <AnimatePresence>
          {correction && (
            <motion.div
              key="correction"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={PANEL_IN}
              className={`relative z-20 col-start-1 col-end-2 row-start-1 row-end-4 rounded-3xl border-2 bg-white px-3 py-3 shadow-xl dark:bg-[#1c3a52] sm:col-start-2 sm:col-end-3 sm:row-end-2 ${
                correction.alternate ? 'border-secondary/50' : 'border-error/50'
              } flex flex-col items-center justify-center gap-2 text-center`}
            >
              <p
                className={`text-xs font-black uppercase tracking-widest sm:text-sm ${
                  correction.alternate ? 'text-secondary' : 'text-error'
                }`}
              >
                {correction.alternate ? '✓ Both work!' : '✗ Not quite'}
              </p>

              {correction.alternate ? (
                <p className="text-lg font-display font-bold leading-snug text-text sm:text-xl">
                  &ldquo;{correction.card.word}&rdquo; works as both.
                </p>
              ) : (
                <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-lg font-display font-bold leading-snug text-text sm:text-xl">
                  <span>
                    &ldquo;{correction.card.word}&rdquo; is {articleFor(correction.card.correctBucket)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg border-2 border-solid px-2 py-0.5 text-xs font-black uppercase tracking-widest sm:text-sm ${
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
              <p className="line-clamp-3 max-w-[34ch] text-sm leading-snug text-text-muted sm:max-w-none sm:text-base">
                {correction.card.explanation ?? POS_DEFINITIONS[correction.card.correctBucket]}
              </p>

              <button
                ref={continueRef}
                type="button"
                onClick={() => advance(results)}
                className="mt-0.5 block w-full max-w-[220px]"
              >
                <span className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-solid border-primary bg-primary px-3 py-2 text-base font-bold text-white">
                  {index + 1 >= total ? 'See results' : 'Next word'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
});
