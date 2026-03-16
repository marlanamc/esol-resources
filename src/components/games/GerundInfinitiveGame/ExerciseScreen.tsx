'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Lightbulb, AlertCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { getExerciseTypeLabel } from '@/data/gerund-infinitive-exercises';
import { PatternChoiceExercise } from './exercises/PatternChoiceExercise';
import { PatternIdentifierExercise } from './exercises/PatternIdentifierExercise';
import { PrepositionChoiceExercise } from './exercises/PrepositionChoiceExercise';
import { RuleApplicationExercise } from './exercises/RuleApplicationExercise';
import { SentenceCompletionExercise } from './exercises/SentenceCompletionExercise';
import { PatternSortingExercise } from './exercises/PatternSortingExercise';
import { ErrorCorrectionExercise } from './exercises/ErrorCorrectionExercise';
import { MeaningDistinctionExercise } from './exercises/MeaningDistinctionExercise';
import { ComboChallengeExercise } from './exercises/ComboChallengeExercise';
import { MatchPairExercise } from './exercises/MatchPairExercise';
import { DragOrderExercise } from './exercises/DragOrderExercise';
import { DialogueCompletionExercise } from './exercises/DialogueCompletionExercise';
import { ScenarioChoiceExercise } from './exercises/ScenarioChoiceExercise';
import { ChainSentencesExercise } from './exercises/ChainSentencesExercise';
import { SwipeChoiceExercise } from './exercises/SwipeChoiceExercise';
import { MemoryMatchExercise } from './exercises/MemoryMatchExercise';
import { RapidFireExercise } from './exercises/RapidFireExercise';
import { PersonalResponseExercise } from './exercises/PersonalResponseExercise';
import type { GerundInfinitiveGroup, GIExercise } from '@/types/gerund-infinitive';

interface ExerciseScreenProps {
  group: GerundInfinitiveGroup;
  exercises: GIExercise[];
  currentIndex: number;
  roundMode?: 'round1' | 'round2' | 'review' | 'final';
  onAnswer: (correct: boolean, exercise: GIExercise) => void;
  onBack: () => void;
}

export function ExerciseScreen({ group, exercises, currentIndex, roundMode, onAnswer, onBack }: ExerciseScreenProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const remaining = exercises.length - currentIndex - 1;
  const isLightMode = theme === 'light' || (theme === 'system' && resolvedTheme === 'light');

  // Theme-based classes (matching IrregularVerbsGame)
  const backButtonClassName = isLightMode
    ? 'bg-white border-border text-text-muted hover:text-text'
    : 'bg-[#162b3d] border-white/10 text-text-muted hover:text-text';
  const exerciseShellClassName = isLightMode
    ? 'bg-white border-border shadow-lg'
    : 'bg-[#162b3d] border-white/10 shadow-lg';
  const exerciseShellHeaderClassName = isLightMode
    ? 'border-border/50 bg-bg-light/50'
    : 'border-white/10 bg-white/5';
  const keyboardHintKbdClassName = isLightMode
    ? 'bg-bg-gray border-border'
    : 'bg-white/10 border-white/20';

  // Reset state when exercise changes
  useEffect(() => {
    setAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
  }, [currentIndex]);

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
      // Correct: auto-advance after 1.6s
      setTimeout(() => {
        setShowFeedback(false);
        onAnswer(correct, currentExercise);
      }, 1600);
    } else {
      setStreak(0);
      // Wrong: wait for user to click Next (no auto-advance)
    }
  };

  const handleNextAfterWrong = () => {
    setShowFeedback(false);
    onAnswer(false, currentExercise);
  };

  // Get error explanation for the pattern if answer is wrong
  // Note: Memory tricks removed per user request - rely on pattern exposure instead
  const getPatternHelp = () => {
    if (isCorrect) return { errorExplanation: null };
    const pattern = group.patterns.find(p => p.id === currentExercise.patternId);
    return {
      errorExplanation: pattern?.errorExplanation || null,
    };
  };

  const { errorExplanation } = showFeedback ? getPatternHelp() : { errorExplanation: null };

  // Build full correct sentence for pattern-choice, error-correction, etc. (show on both correct & wrong)
  const getFullCorrectSentence = (): string | null => {
    const ex = currentExercise;
    const correctStr = Array.isArray(ex.correctAnswer) ? ex.correctAnswer[0] : ex.correctAnswer;
    if (!correctStr) return null;
    // Prompt with single blank: replace ___ with correct answer
    if (ex.prompt?.includes('___')) {
      const blankCount = (ex.prompt.match(/___/g) || []).length;
      if (blankCount === 1) return ex.prompt.replace('___', correctStr);
    }
    // Error-correction: build from tokens
    if (ex.type === 'error-correction' && ex.errorTokens?.length) {
      return ex.errorTokens.map(t => t.isError ? correctStr : t.text).join('');
    }
    return null;
  };
  const fullCorrectSentence = showFeedback ? getFullCorrectSentence() : null;

  return (
    <div className="flex min-h-full flex-col">
      {/* Streak Animation Overlay */}
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

      {/* Sticky Header - Compact on mobile */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 px-3 sm:px-0 py-2 sm:py-3 bg-bg/98 backdrop-blur-md border-b border-border/50 sm:relative sm:bg-transparent sm:backdrop-blur-0 sm:border-0"
      >
        {/* Mobile: Compact single-row layout with back button */}
        <div className="flex items-center gap-2 sm:hidden">
          {/* Back button */}
          <button
            onClick={onBack}
            aria-label="Go back"
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${backButtonClassName}`}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Title - truncated */}
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-sm font-semibold text-text truncate leading-tight">
              {group.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
              {roundMode && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${getRoundBadgeColor(roundMode)}`}>
                  {getRoundLabel(roundMode)}
                </span>
              )}
              <span>Q{currentIndex + 1}/{exercises.length}</span>
              <span className="text-border">·</span>
              <span>{remaining} left</span>
            </div>
          </div>

          {/* Stats - compact */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border border-orange-200 dark:border-orange-600/50"
              >
                <Zap size={10} className="text-orange-500 dark:text-orange-400" />
                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-200">{streak}</span>
              </motion.div>
            )}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
              <Target size={10} className="text-secondary" />
              <span className="text-[10px] font-bold text-secondary-dark">{correctCount}</span>
            </div>
          </div>
        </div>

        {/* Mobile: Slim progress bar */}
        <div className="mt-2 sm:hidden">
          <div className="relative h-1.5 bg-bg-gray rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
            />
          </div>
        </div>

        {/* Desktop: Full header layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              aria-label="Back to level intro"
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${backButtonClassName}`}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-text truncate">
                {group.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {roundMode && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getRoundBadgeColor(roundMode)}`}>
                    {getRoundLabel(roundMode)}
                  </span>
                )}
                <p className="text-sm text-text-muted">
                  Question {currentIndex + 1} of {exercises.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border border-orange-200 dark:border-orange-600/50"
                >
                  <Zap size={14} className="text-orange-500 dark:text-orange-400" />
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-200">{streak}</span>
                </motion.div>
              )}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                <Target size={14} className="text-secondary" />
                <span className="text-sm font-bold text-secondary-dark">{correctCount}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 mt-3"
          >
            <div className="relative">
              <div className="h-2 bg-bg-gray rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                />
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0">
                {exercises.map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      scale: idx === currentIndex ? 1.3 : 1,
                      backgroundColor: idx < currentIndex
                        ? 'var(--color-secondary)'
                        : idx === currentIndex
                          ? 'var(--color-primary)'
                          : 'var(--color-border)'
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx <= currentIndex ? 'ring-2 ring-white' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{Math.round(progress)}% complete</span>
              <span>{remaining} remaining</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Exercise Card */}
      <motion.div
        key={currentExercise.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`mx-3 mt-2 flex flex-col overflow-hidden rounded-xl border sm:mx-0 sm:mt-6 sm:rounded-2xl sm:border-2 ${exerciseShellClassName}`}
      >
        {/* Exercise Type Badge */}
        <div className={`border-b px-3 py-2 sm:px-6 sm:py-3 ${exerciseShellHeaderClassName}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted">
            <ExerciseTypeIcon type={currentExercise.type} />
            <span className="font-medium">{getExerciseTypeLabel(currentExercise.type)}</span>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="p-3 sm:p-6">
          {/* Feedback flash */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 p-3 rounded-xl text-center font-semibold border text-sm ${
                  isCorrect
                    ? 'bg-secondary/10 border-secondary/30 text-[#3d6b47] dark:text-secondary'
                    : 'bg-error/10 border-error/30 text-error'
                }`}
              >
                {isCorrect
                  ? (streak >= 2 ? `✓ Correct! ${streak} in a row!` : '✓ Correct!')
                  : `✗ The answer is: ${Array.isArray(currentExercise.correctAnswer) ? currentExercise.correctAnswer.join(' or ') : currentExercise.correctAnswer}`}
                {fullCorrectSentence && (
                  <p className="mt-2 text-base font-normal text-text">
                    {fullCorrectSentence}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error explanation on wrong answer (memory tricks removed) */}
          <AnimatePresence>
            {showFeedback && !isCorrect && errorExplanation && (
              <motion.div
                key="help-section"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-4 rounded-xl bg-accent/10 border border-accent/30"
              >
                <div className="flex gap-3 items-start">
                  <AlertCircle size={18} className="text-text-muted flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Why This Happens</p>
                    <p className="text-sm text-text">{errorExplanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button when wrong - lets students read feedback at their own pace */}
          <AnimatePresence>
            {showFeedback && !isCorrect && (
              <motion.div
                key="next-after-wrong"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex justify-center"
              >
                <button
                  onClick={handleNextAfterWrong}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercise component */}
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

      {/* Keyboard Shortcut Hint - Desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex items-center justify-center gap-2 text-sm text-text-light mt-4"
      >
        <Lightbulb size={14} />
        <span>Press <kbd className={`rounded border px-1.5 py-0.5 text-xs font-mono ${keyboardHintKbdClassName}`}>Enter</kbd> to submit quickly</span>
      </motion.div>
    </div>
  );
}

// Exercise Type Icon Component
function ExerciseTypeIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4";

  switch (type) {
    case 'pattern-choice':
    case 'preposition-choice':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" />
          <line x1="13" y1="7" x2="21" y2="7" />
          <line x1="13" y1="17" x2="21" y2="17" />
        </svg>
      );
    case 'sentence-completion':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="14" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      );
    case 'rule-application':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <line x1="8" y1="15" x2="16" y2="15" strokeDasharray="3 2" />
        </svg>
      );
    case 'pattern-identifier':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
        </svg>
      );
    case 'pattern-sorting':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'error-correction':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'meaning-distinction':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case 'combo-challenge':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return <Target className={iconClass} />;
  }
}

function renderExercise(
  exercise: GIExercise,
  onAnswer: (correct: boolean) => void,
  answered: boolean
): React.ReactNode {
  const props = { exercise, onAnswer, answered };

  switch (exercise.type) {
    case 'pattern-choice':     return <PatternChoiceExercise {...props} />;
    case 'pattern-identifier': return <PatternIdentifierExercise {...props} />;
    case 'preposition-choice': return <PrepositionChoiceExercise {...props} />;
    case 'rule-application':   return <RuleApplicationExercise {...props} />;
    case 'sentence-completion': return <SentenceCompletionExercise {...props} />;
    case 'pattern-sorting':    return <PatternSortingExercise {...props} />;
    case 'error-correction':   return <ErrorCorrectionExercise {...props} />;
    case 'meaning-distinction': return <MeaningDistinctionExercise {...props} />;
    case 'combo-challenge':    return <ComboChallengeExercise {...props} />;
    case 'match-pair':         return <MatchPairExercise {...props} />;
    case 'drag-order':         return <DragOrderExercise {...props} />;
    case 'dialogue-completion': return <DialogueCompletionExercise {...props} />;
    case 'scenario-choice':    return <ScenarioChoiceExercise {...props} />;
    case 'chain-sentences':    return <ChainSentencesExercise {...props} />;
    case 'swipe-choice':       return <SwipeChoiceExercise {...props} />;
    case 'memory-match':       return <MemoryMatchExercise {...props} />;
    case 'rapid-fire':         return <RapidFireExercise {...props} />;
    case 'personal-response':  return <PersonalResponseExercise {...props} />;
    default: return <PatternChoiceExercise {...props} />;
  }
}

function getRoundLabel(roundMode: 'round1' | 'round2' | 'review' | 'final'): string {
  const labels: Record<string, string> = {
    'round1': 'Round 1',
    'round2': 'Round 2',
    'review': 'Review',
    'final': 'Final Challenge'
  };
  return labels[roundMode] || '';
}

function getRoundBadgeColor(roundMode: 'round1' | 'round2' | 'review' | 'final'): string {
  switch (roundMode) {
    case 'round1':
      return 'bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300';
    case 'round2':
      return 'bg-secondary/10 border border-secondary/20 text-secondary-dark';
    case 'review':
      return 'bg-accent/10 border border-accent/20 text-primary-dark';
    case 'final':
      return 'bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300';
    default:
      return '';
  }
}
