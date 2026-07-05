'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, AlertCircle, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
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
import type { POSGroup, POSExercise, POSRoundMode, PartOfSpeech } from '@/types/parts-of-speech';
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

function renderExercise(exercise: POSExercise, onAnswer: (correct: boolean) => void, answered: boolean) {
  const props = { exercise, onAnswer, answered };
  switch (exercise.type) {
    case 'pattern-choice':     return <PatternChoiceExercise {...props} />;
    case 'sentence-completion': return <SentenceCompletionExercise {...props} />;
    case 'pos-tagging':        return <POSTaggingExercise {...props} />;
    case 'pattern-sorting':    return <PatternSortingExercise {...props} />;
    case 'odd-one-out':        return <OddOneOutExercise {...props} />;
    case 'word-family':        return <WordFamilyBuilderExercise {...props} />;
    case 'mad-libs':           return <MadLibsExercise {...props} />;
    case 'word-transform':     return <WordTransformExercise {...props} />;
    case 'function-match':     return <FunctionMatchExercise {...props} />;
    case 'minimal-pair':       return <MinimalPairExercise {...props} />;
    case 'sentence-builder':   return <SentenceBuilderExercise {...props} />;
    case 'photo-sort':         return <PhotoSortExercise {...props} />;
    case 'error-correction':   return <ErrorCorrectionExercise {...props} />;
    case 'contrast-pair':      return <ContrastPairExercise {...props} />;
    case 'swipe-sort':         return <SwipeSortExercise {...props} />;
    case 'sentence-diagram':   return <SentenceDiagramExercise {...props} />;
    default: return <PatternChoiceExercise {...props} />;
  }
}

interface ExerciseScreenProps {
  group: POSGroup;
  exercises: POSExercise[];
  currentIndex: number;
  roundMode: POSRoundMode;
  onAnswer: (correct: boolean, exercise: POSExercise) => void;
  onBack: () => void;
}

export function ExerciseScreen({ group, exercises, currentIndex, roundMode, onAnswer, onBack }: ExerciseScreenProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const remaining = exercises.length - currentIndex - 1;
  const isLight = theme === 'light' || (theme === 'system' && resolvedTheme === 'light');

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

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
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
    <div className="flex min-h-full flex-col">
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

      {/* Sticky header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
            <h2 className="font-display text-sm font-semibold text-text truncate">{group.title}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${getRoundBadgeColor(roundMode)}`}>
                {getRoundLabel(roundMode)}
              </span>
              <span>Q{currentIndex + 1}/{exercises.length}</span>
              <span className="text-border">·</span>
              <span>{remaining} left</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {streak > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-600/50">
                <Zap size={10} className="text-orange-500" />
                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-200">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
              <Target size={10} className="text-secondary" />
              <span className="text-[10px] font-bold text-secondary-dark">{correctCount}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 sm:hidden h-1.5 bg-bg-gray rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-500 ease-out"
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
              <h2 className="font-display text-2xl text-text truncate">{group.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getRoundBadgeColor(roundMode)}`}>
                  {getRoundLabel(roundMode)}
                </span>
                <p className="text-sm text-text-muted">Question {currentIndex + 1} of {exercises.length}</p>
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
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>{Math.round(progress)}% complete</span>
              <span>{remaining} remaining</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Exercise card */}
      <motion.div
        key={currentExercise.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`mx-3 mt-2 flex flex-col overflow-hidden rounded-xl border sm:mx-0 sm:mt-6 sm:rounded-2xl sm:border-2 ${shellClass}`}
      >
        {/* Exercise type badge + friendly subtitle + optional listen button */}
        <div className={`border-b px-3 py-2 sm:px-6 sm:py-3 flex items-start gap-3 ${shellHeaderClass}`}>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-text font-semibold">
              {EXERCISE_TYPE_LABELS[currentExercise.type] ?? 'Exercise'}
            </p>
            {EXERCISE_TYPE_SUBTITLE[currentExercise.type] && (
              <p className="mt-0.5 text-[11px] sm:text-xs text-text-muted leading-snug">
                {EXERCISE_TYPE_SUBTITLE[currentExercise.type]}
              </p>
            )}
          </div>
          {/* Show listen button for sentence-based exercises */}
          {currentExercise.prompt && !['photo-sort', 'pattern-sorting', 'odd-one-out', 'word-family', 'sentence-builder', 'swipe-sort', 'sentence-diagram'].includes(currentExercise.type) && (
            <SpeakButton text={currentExercise.prompt.replace('___', typeof currentExercise.correctAnswer === 'string' ? currentExercise.correctAnswer : '')} size="sm" />
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          {/* Polite live region for screen readers */}
          <div className="sr-only" role="status" aria-live="polite">
            {showFeedback
              ? isCorrect
                ? `Correct. ${streak >= 2 ? `${streak} in a row.` : ''}`
                : `Incorrect. The answer is ${formatCorrectAnswer(currentExercise.correctAnswer)}.`
              : ''}
          </div>

          <AnimatePresence>
            {showFeedback && (
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
                      className="inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-semibold opacity-80 hover:opacity-100 transition"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderExercise(currentExercise, handleAnswer, answered)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
