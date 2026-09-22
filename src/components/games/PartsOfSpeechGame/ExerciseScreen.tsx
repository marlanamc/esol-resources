'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, AlertCircle, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { SCREEN_FADE } from './transitions';
import { PatternChoiceExercise } from './exercises/PatternChoiceExercise';
import { SentenceCompletionExercise } from './exercises/SentenceCompletionExercise';
import { POSTaggingExercise } from './exercises/POSTaggingExercise';
import { PatternSortingExercise } from './exercises/PatternSortingExercise';
import { OddOneOutExercise } from './exercises/OddOneOutExercise';
import { WordFamilyBuilderExercise } from './exercises/WordFamilyBuilderExercise';
import { MadLibsExercise } from './exercises/MadLibsExercise';
import { WordTransformExercise } from './exercises/WordTransformExercise';
import { FunctionMatchExercise } from './exercises/FunctionMatchExercise';
import { MinimalPairExercise } from './exercises/MinimalPairExercise';
import { SentenceBuilderExercise } from './exercises/SentenceBuilderExercise';
import { PhotoSortExercise } from './exercises/PhotoSortExercise';
import { ErrorCorrectionExercise } from './exercises/ErrorCorrectionExercise';
import { ContrastPairExercise } from './exercises/ContrastPairExercise';
import { SwipeSortExercise } from './exercises/SwipeSortExercise';
import { SentenceDiagramExercise } from './exercises/SentenceDiagramExercise';
import { SpeakButton } from './SpeakButton';
import type { POSAnswerDetail, POSGroup, POSExercise, POSExerciseType, POSRoundMode, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_LABELS } from '@/types/parts-of-speech';

const EXERCISE_TYPE_LABELS: Record<string, string> = {
  'pattern-choice': 'Identify the Part of Speech',
  'sentence-completion': 'Complete the Sentence',
  'pos-tagging': 'Tag the Word',
  'pattern-sorting': 'Sort into Buckets',
  'odd-one-out': 'Odd One Out',
  'word-family': 'Word Families',
  'mad-libs': 'Mini Mad Libs',
  'word-transform': 'Word Transform',
  'function-match': 'Grammatical Function',
  'minimal-pair': 'Compare Sentences',
  'sentence-builder': 'Build a Sentence',
  'photo-sort': 'Photo Match',
  'error-correction': 'Fix the Common Error',
  'contrast-pair': 'Choose the Best Fit',
  'swipe-sort': 'Swipe to Sort',
  'sentence-diagram': 'Label the Sentence',
};

// Student-friendly one-liner explaining what to do.
const EXERCISE_TYPE_SUBTITLE: Record<string, string> = {
  'pattern-choice': 'Which part of speech is the highlighted word?',
  'sentence-completion': 'Pick the word that fits best in the blank.',
  'pos-tagging': 'Tap the word and choose its part of speech.',
  'pattern-sorting': 'Drag each word into the right bucket.',
  'odd-one-out': 'Find the word that doesn\u2019t belong.',
  'word-family': 'Pick the correct form of the word family.',
  'mad-libs': 'Fill each blank with a word that matches the label.',
  'word-transform': 'Change the word into the requested form.',
  'function-match': 'What job does the highlighted word do in the sentence?',
  'minimal-pair': 'Compare the two sentences and answer the question.',
  'sentence-builder': 'Drag the words into order to build the sentence.',
  'photo-sort': 'Drag each photo into the matching category.',
  'error-correction': 'One word is wrong. Pick the correct one.',
  'contrast-pair': 'Which word fits the sentence better?',
  'swipe-sort': 'Swipe each card into the correct category.',
  'sentence-diagram': 'Label each part of the sentence with its role.',
};

// Pretty-print the correct answer, mapping POS slugs to friendly labels.
function formatCorrectAnswer(answer: string | string[]): string {
  const labelize = (v: string) => {
    const trimmed = v.trim();
    // Exact POS slug?
    if ((POS_LABELS as Record<string, string>)[trimmed]) {
      return POS_LABELS[trimmed as PartOfSpeech];
    }
    return trimmed;
  };
  if (Array.isArray(answer)) {
    const mapped = answer.map(labelize);
    if (mapped.length === 1) return mapped[0];
    if (mapped.length === 2) return `${mapped[0]} or ${mapped[1]}`;
    return `${mapped.slice(0, -1).join(', ')}, or ${mapped[mapped.length - 1]}`;
  }
  return labelize(answer);
}

function getRoundBadgeColor(roundMode: POSRoundMode): string {
  switch (roundMode) {
    case 'round1': return 'bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300';
    case 'round2': return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    case 'round3': return 'bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300';
    case 'round4': return 'bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300';
    case 'round5': return 'bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300';
    case 'review': return 'bg-accent/10 border border-accent/20 text-primary-dark';
    case 'final': return 'bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300';
    default: return 'bg-bg-gray border border-border text-text-muted';
  }
}

function getRoundLabel(roundMode: POSRoundMode): string {
  const labels: Record<POSRoundMode, string> = {
    round1: 'Round 1 · Notice', round2: 'Round 2 · Sort',
    round3: 'Round 3 · Connect', round4: 'Round 4 · Build',
    round5: 'Round 5 · Master', review: 'Review', final: 'Final',
  };
  return labels[roundMode] ?? '';
}

interface ExerciseRendererProps {
  exercise: POSExercise;
  onAnswer: (correct: boolean, detail?: POSAnswerDetail) => void;
  answered: boolean;
}

/**
 * Every exercise type's renderer, keyed by type.
 *
 * Typed as a total Record so adding a POSExerciseType without a renderer is a
 * compile error rather than a silent fallback. It replaced a switch whose
 * `default` arm rendered PatternChoiceExercise for anything unrecognised —
 * which meant a mistyped or newly added type shipped looking plausible.
 * Exported so tests can assert renderer/union parity without rendering.
 */
export const EXERCISE_RENDERERS: Record<POSExerciseType, ComponentType<ExerciseRendererProps>> = {
  'pattern-choice': PatternChoiceExercise,
  'sentence-completion': SentenceCompletionExercise,
  'pos-tagging': POSTaggingExercise,
  'pattern-sorting': PatternSortingExercise,
  'odd-one-out': OddOneOutExercise,
  'word-family': WordFamilyBuilderExercise,
  'mad-libs': MadLibsExercise,
  'word-transform': WordTransformExercise,
  'function-match': FunctionMatchExercise,
  'minimal-pair': MinimalPairExercise,
  'sentence-builder': SentenceBuilderExercise,
  'photo-sort': PhotoSortExercise,
  'error-correction': ErrorCorrectionExercise,
  'contrast-pair': ContrastPairExercise,
  'swipe-sort': SwipeSortExercise,
  'sentence-diagram': SentenceDiagramExercise,
};

function renderExercise(
  exercise: POSExercise,
  onAnswer: (correct: boolean, detail?: POSAnswerDetail) => void,
  answered: boolean,
) {
  const Renderer = EXERCISE_RENDERERS[exercise.type];
  if (!Renderer) return null;
  return <Renderer exercise={exercise} onAnswer={onAnswer} answered={answered} />;
}

// Exercises whose content is a word, a picture or a drag target rather than a
// sentence have nothing worth reading aloud.
const SILENT_EXERCISE_TYPES: POSExerciseType[] = [
  'photo-sort', 'pattern-sorting', 'odd-one-out', 'word-family',
  'sentence-builder', 'swipe-sort', 'sentence-diagram',
];

// Exercises that grade several items behind one report and show their own
// per-item feedback. The shell banner reports on `correctAnswer`, which for a
// multi-card deck is the deck's theme -- "The answer is Verb" to a learner who
// missed two nouns -- so it has to stay out of their way.
const SELF_FEEDBACK_EXERCISE_TYPES: POSExerciseType[] = ['swipe-sort'];

interface ExerciseScreenProps {
  group: POSGroup;
  exercises: POSExercise[];
  currentIndex: number;
  roundMode: POSRoundMode;
  onAnswer: (correct: boolean, exercise: POSExercise, detail?: POSAnswerDetail) => void;
  onBack: () => void;
  /**
   * A Course Map wrapper pinned to one round is a single exercise repeated, so
   * the round badge, the question counter, the type label and the card shell
   * are all constants the learner has to read past. Strip them and leave the
   * exercise itself.
   */
  minimalChrome?: boolean;
  /**
   * Shown instead of the group title. A Course Map step is named on the tile
   * the learner tapped, so the screen should carry that name rather than a
   * second, different one.
   */
  titleOverride?: string;
}

export function ExerciseScreen({
  group,
  exercises,
  currentIndex,
  roundMode,
  onAnswer,
  onBack,
  minimalChrome = false,
  titleOverride,
}: ExerciseScreenProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const { resolvedTheme } = useTheme();

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const remaining = exercises.length - currentIndex - 1;
  const isLight = resolvedTheme === 'light';
  const showListenButton =
    !!currentExercise?.prompt && !SILENT_EXERCISE_TYPES.includes(currentExercise.type);

  const backButtonClass = isLight
    ? 'bg-white border-border text-text-muted hover:text-text'
    : 'bg-[#162b3d] border-white/10 text-text-muted hover:text-text';
  const shellClass = isLight ? 'bg-white border-border shadow-lg' : 'bg-[#162b3d] border-white/10 shadow-lg';
  const shellHeaderClass = isLight ? 'border-border/50 bg-bg-light/50' : 'border-white/10 bg-white/5';

  useEffect(() => {
    setAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowWhy(false);
  }, [currentIndex]);

  const currentPattern = currentExercise
    ? group.patterns.find(p => p.id === currentExercise.patternId)
    : undefined;
  const selfFeedback = SELF_FEEDBACK_EXERCISE_TYPES.includes(currentExercise.type);
  /**
   * Word Sort owns its own horizontal padding. The shell's `mx-3` and `p-3`
   * stack on top of the game's own `px-*`, which cost it 36px per side on a
   * 390px phone -- enough to squeeze the two category boxes below the width
   * their own definition text needs.
   */
  const isSwipeSort = currentExercise.type === 'swipe-sort';
  /**
   * Below sm, Word Sort fills the height left under the header instead of
   * floating at its natural size -- PartsOfSpeechGame stops the page scrolling
   * for it, so every wrapper from here to the grid has to pass a real height
   * down (flex-1 + min-h-0) rather than a min-height.
   */
  const fill = isSwipeSort ? 'max-sm:flex-1 max-sm:min-h-0' : '';
  const hasExplanation = Boolean(
    currentExercise?.explanation || currentPattern?.errorExplanation || currentPattern?.memoryTrick
  );

  if (!currentExercise) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-text-muted">No exercises available for this group.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white dark:bg-[#162b3d] px-4 py-2 text-sm font-medium text-text hover:border-primary"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    );
  }

  const handleAnswer = (correct: boolean, detail?: POSAnswerDetail) => {
    // Every renderer is meant to stop accepting input once it has reported,
    // but that is 16 components' worth of discipline and a lapse silently
    // double-counts toward correctCount and the streak. Hold the invariant here
    // too, where the score actually lives.
    if (answered) return;
    setAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    // Suppressed banner means no Next button, and the wrong-answer path below
    // relies on that button to advance -- without this the round would sit on a
    // finished deck with no way forward. Keep the streak bookkeeping, then move.
    if (SELF_FEEDBACK_EXERCISE_TYPES.includes(currentExercise.type)) {
      setStreak(prev => (correct ? prev + 1 : 0));
      setShowFeedback(false);
      // Long enough to read the deck's own "4 / 6 correct" summary. The
      // crossfade below adds to this, so it does not need to carry the whole
      // pause on its own.
      setTimeout(() => onAnswer(correct, currentExercise, detail), 700);
      return;
    }

    if (correct) {
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= 3 && newStreak % 3 === 0) {
          setShowStreakAnimation(true);
          setTimeout(() => setShowStreakAnimation(false), 1500);
        }
        return newStreak;
      });
      // Give students a beat longer to read feedback; require tap if there is an insight to share.
      const hasInsight = Boolean(currentExercise.explanation || currentPattern?.memoryTrick);
      if (!hasInsight) {
        setTimeout(() => {
          setShowFeedback(false);
          onAnswer(correct, currentExercise);
        }, 2400);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setShowWhy(false);
    onAnswer(isCorrect, currentExercise);
  };

  return (
    <div className={`flex min-h-full flex-1 flex-col ${isSwipeSort ? 'max-sm:min-h-0' : ''}`}>
      {/* Streak animation */}
      <AnimatePresence>
        {showStreakAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="bg-gradient-to-br from-accent to-primary text-white px-8 py-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <Zap size={32} className="text-white" />
                <div>
                  <div className="text-3xl font-display font-bold">{streak} Streak!</div>
                  <div className="text-sm opacity-90">You&apos;re on fire!</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Sticky header. No entrance animation: it is the fixed frame of the play
        screen, and the phase crossfade in PartsOfSpeechGame already brings it
        in. It used to drop in from y:-20 at the same moment the play area slid
        in from the right.
      */}
      <header
        className="sticky top-0 z-30 px-3 sm:px-0 py-2 sm:py-3 bg-bg/98 backdrop-blur-md border-b border-border/50 sm:relative sm:bg-transparent sm:backdrop-blur-0 sm:border-0"
      >
        {/* Mobile layout */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onBack}
            aria-label="Go back"
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${backButtonClass}`}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-base font-semibold text-text truncate">{titleOverride ?? group.title}</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              {!minimalChrome && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold ${getRoundBadgeColor(roundMode)}`}>
                  {getRoundLabel(roundMode)}
                </span>
              )}
              {/* "N left" only restates Q x/y, and the bar below already shows it. */}
              {!minimalChrome && <span>Q{currentIndex + 1}/{exercises.length}</span>}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {streak > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-600/50">
                <Zap size={12} className="text-orange-500" />
                <span className="text-xs font-bold text-orange-700 dark:text-orange-200">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
              <Target size={12} className="text-secondary" />
              <span className="text-xs font-bold text-secondary-dark">{correctCount}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 sm:hidden h-1.5 bg-bg-gray rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              aria-label="Back"
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${backButtonClass}`}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-text truncate">{titleOverride ?? group.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                {!minimalChrome && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getRoundBadgeColor(roundMode)}`}>
                    {getRoundLabel(roundMode)}
                  </span>
                )}
                {!minimalChrome && (
                  <p className="text-sm text-text-muted">Question {currentIndex + 1} of {exercises.length}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200">
                  <Zap size={14} className="text-orange-500" />
                  <span className="text-sm font-bold text-orange-700">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                <Target size={14} className="text-secondary" />
                <span className="text-sm font-bold text-secondary-dark">{correctCount}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 bg-bg-gray rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>{Math.round(progress)}% complete</span>
              <span>{remaining} remaining</span>
            </div>
          </div>
        </div>
      </header>

      {/*
        Exercise card. A plain frame that stays put between exercises: it was
        keyed per exercise and slid in from the right every time, on top of
        the inner crossfade below. Only the content inside it changes.
      */}
      <div
        className={
          minimalChrome
            // my-auto, not justify-center on the parent: auto margins centre
            // this block in the leftover space while the sticky header stays
            // where it is at the top.
            ? `${isSwipeSort ? 'mx-0' : 'mx-3'} my-auto flex flex-col overflow-hidden sm:mx-0 ${fill}`
            : `mx-3 mt-2 flex flex-col overflow-hidden rounded-xl border sm:mx-0 sm:mt-6 sm:rounded-2xl sm:border-2 ${shellClass} ${fill}`
        }
      >
        {/*
          Exercise type badge + friendly subtitle + optional listen button.

          minimalChrome drops the label and subtitle, but never the listen
          button: the row collapses only when there is no audio in it. A sort
          game has none today, so nothing shows — but a preset pinned to a
          sentence-based type would otherwise lose its audio silently.
        */}
        {(!minimalChrome || showListenButton) && (
        <div className={minimalChrome ? 'flex justify-end px-3 pt-2 sm:px-6' : `border-b px-3 py-2 sm:px-6 sm:py-3 flex items-start gap-3 ${shellHeaderClass}`}>
          {!minimalChrome && (
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-text font-semibold">
                {EXERCISE_TYPE_LABELS[currentExercise.type] ?? 'Exercise'}
              </p>
              {EXERCISE_TYPE_SUBTITLE[currentExercise.type] && (
                <p className="mt-0.5 text-xs sm:text-sm text-text-muted leading-snug">
                  {EXERCISE_TYPE_SUBTITLE[currentExercise.type]}
                </p>
              )}
            </div>
          )}
          {showListenButton && (
            <SpeakButton text={currentExercise.prompt!.replace('___', typeof currentExercise.correctAnswer === 'string' ? currentExercise.correctAnswer : '')} size="sm" />
          )}
        </div>
        )}

        {/* Content */}
        <div className={isSwipeSort ? `px-0 py-1 sm:p-6 max-sm:flex max-sm:flex-col ${fill}` : 'p-3 sm:p-6'}>
          {/* Polite live region for screen readers */}
          <div className="sr-only" role="status" aria-live="polite">
            {showFeedback && !selfFeedback
              ? isCorrect
                ? `Correct. ${streak >= 2 ? `${streak} in a row.` : ''}`
                : `Incorrect. The answer is ${formatCorrectAnswer(currentExercise.correctAnswer)}.`
              : ''}
          </div>

          <AnimatePresence>
            {showFeedback && !selfFeedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-3 rounded-xl border text-sm overflow-hidden ${
                  isCorrect
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'bg-error/5 border-error/30'
                }`}
              >
                <div className={`flex items-center gap-2 px-3 py-2.5 font-semibold ${
                  isCorrect ? 'text-[#3d6b47] dark:text-secondary' : 'text-error'
                }`}>
                  <span className="text-lg leading-none">{isCorrect ? '✓' : '✗'}</span>
                  <span className="flex-1">
                    {isCorrect
                      ? (streak >= 2 ? `Correct \u2014 ${streak} in a row!` : 'Correct!')
                      : <>The answer is <span className="font-bold">{formatCorrectAnswer(currentExercise.correctAnswer)}</span>.</>
                    }
                  </span>
                  {hasExplanation && (
                    <button
                      type="button"
                      onClick={() => setShowWhy(prev => !prev)}
                      aria-expanded={showWhy}
                      className="inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-0.5 text-xs font-semibold opacity-80 hover:opacity-100 transition"
                    >
                      <HelpCircle size={12} />
                      {showWhy ? 'Hide why' : 'Why?'}
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {showWhy && hasExplanation && (
                    <motion.div
                      key="why-drawer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-current/10 bg-white/60 dark:bg-white/5"
                    >
                      <div className="p-3 sm:p-4 space-y-2 text-text">
                        {currentExercise.explanation && (
                          <div className="flex gap-2 items-start">
                            <AlertCircle size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{currentExercise.explanation}</p>
                          </div>
                        )}
                        {currentPattern?.errorExplanation && (
                          <div className="flex gap-2 items-start">
                            <AlertCircle size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{currentPattern.errorExplanation}</p>
                          </div>
                        )}
                        {currentPattern?.memoryTrick && (
                          <div className="flex gap-2 items-start">
                            <span aria-hidden className="text-sm flex-shrink-0 mt-0.5">💡</span>
                            <p className="text-sm leading-relaxed italic">{currentPattern.memoryTrick}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next button inside feedback shell */}
                <div className="flex justify-end border-t border-current/10 px-3 py-2 bg-white/40 dark:bg-white/5">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white px-4 py-1.5 text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`exercise-${currentIndex}`}
              // A quiet crossfade from one exercise to the next -- opacity
              // only. mode="wait" pays it twice, so it stays short.
              {...SCREEN_FADE}
              className={isSwipeSort ? `max-sm:flex max-sm:flex-col ${fill}` : undefined}
            >
              {renderExercise(currentExercise, handleAnswer, answered)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
