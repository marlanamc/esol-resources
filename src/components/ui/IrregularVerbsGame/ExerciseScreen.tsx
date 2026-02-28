'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Clock, Lightbulb } from 'lucide-react';
import { FillInBlankExercise } from './exercises/FillInBlankExercise';
import { MultipleChoiceExercise } from './exercises/MultipleChoiceExercise';
import { SentenceCompletionExercise } from './exercises/SentenceCompletionExercise';
import { PatternSortingExercise } from './exercises/PatternSortingExercise';
import { SpeedMatchingExercise } from './exercises/SpeedMatchingExercise';
import type { VerbExercise, VerbGroup } from '@/types/irregular-verbs';

interface ExerciseScreenProps {
  group: VerbGroup;
  exercises: VerbExercise[];
  currentIndex: number;
  showPattern: boolean;
  onAnswer: (correct: boolean) => void;
}

export function ExerciseScreen({
  group,
  exercises,
  currentIndex,
  showPattern,
  onAnswer
}: ExerciseScreenProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  if (exercises.length === 0 || currentIndex >= exercises.length) {
    return null;
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;
  const remaining = exercises.length - currentIndex - 1;

  const handleAnswer = (correct: boolean) => {
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
    } else {
      setStreak(0);
    }
    onAnswer(correct);
  };

  const renderExercise = () => {
    const commonProps = {
      exercise: currentExercise,
      onAnswer: handleAnswer,
      showFeedback: true,
      showPattern
    };

    switch (currentExercise.type) {
      case 'fill-in-blank':
        return <FillInBlankExercise {...commonProps} />;
      case 'multiple-choice':
        return <MultipleChoiceExercise {...commonProps} />;
      case 'sentence-completion':
        return <SentenceCompletionExercise {...commonProps} />;
      case 'pattern-sorting':
        return <PatternSortingExercise {...commonProps} />;
      case 'speed-matching':
        return <SpeedMatchingExercise {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 pt-1 pb-32 sm:pb-0">
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
                  <div className="text-sm opacity-90">You're on fire!</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="-mx-3 sm:mx-0 px-3 sm:px-0 pt-2 pb-3 mb-1 bg-bg/95 backdrop-blur-sm border-b border-border/70"
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Title & Progress */}
          <div className="flex-1">
            <h2 className="font-display text-xl sm:text-2xl text-text truncate">
              {group.title}
            </h2>
            <p className="text-sm text-text-muted">
              Question {currentIndex + 1} of {exercises.length}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200"
              >
                <Zap size={14} className="text-orange-500" />
                <span className="text-sm font-bold text-orange-700">{streak}</span>
              </motion.div>
            )}

            {/* Correct Count */}
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
          {/* Progress Track */}
          <div className="relative">
            <div className="h-2 bg-bg-gray rounded-full overflow-hidden">
              <motion.div
                initial={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
                animate={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
              />
            </div>

            {/* Progress Dots */}
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

          {/* Progress Info */}
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>{Math.round(progress)}% complete</span>
            <span>{remaining} remaining</span>
          </div>
        </motion.div>
      </motion.header>

      {/* Exercise Card */}
      <motion.div
        key={currentExercise.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="-mx-3 sm:mx-0 bg-white border-y-2 sm:border-2 border-border sm:rounded-2xl rounded-none sm:shadow-lg overflow-hidden"
      >
        {/* Exercise Type Badge */}
        <div className="px-4 sm:px-6 py-3 border-b border-border bg-bg-light">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <ExerciseTypeIcon type={currentExercise.type} />
            <span className="font-medium">{getExerciseTypeLabel(currentExercise.type)}</span>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {renderExercise()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex items-center justify-center gap-2 text-sm text-text-light"
      >
        <Lightbulb size={14} />
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-bg-gray border border-border text-xs font-mono">Enter</kbd> to submit quickly</span>
      </motion.div>
    </div>
  );
}

// Exercise Type Icon Component
function ExerciseTypeIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4";

  switch (type) {
    case 'fill-in-blank':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <line x1="8" y1="15" x2="16" y2="15" strokeDasharray="3 2" />
        </svg>
      );
    case 'multiple-choice':
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
    case 'pattern-sorting':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'speed-matching':
      return <Clock className={iconClass} />;
    default:
      return <Target className={iconClass} />;
  }
}

// Helper function
function getExerciseTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'fill-in-blank': 'Fill in the Blank',
    'multiple-choice': 'Multiple Choice',
    'sentence-completion': 'Complete the Sentence',
    'pattern-sorting': 'Pattern Recognition',
    'speed-matching': 'Speed Match'
  };
  return labels[type] || 'Exercise';
}
