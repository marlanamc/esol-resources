'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, RotateCcw, ArrowLeft, Star, TrendingUp, ChevronDown, Check, X } from 'lucide-react';
import type { RoundResults } from './hooks/useTimelineTensesState';
import type { TimelineTensesQuestion } from '@/types/activity';

interface ResultsScreenProps {
  results: RoundResults;
  questions: TimelineTensesQuestion[];
  onRetry: () => void;
  onBack: () => void;
}

export function ResultsScreen({ results, questions, onRetry, onBack }: ResultsScreenProps) {
  const [showReview, setShowReview] = useState(false);
  const { accuracy, correctAnswers, totalQuestions, category, questionResults } = results;
  const isPerfect = accuracy === 100;
  const isPassing = accuracy >= 70;

  // Determine feedback message and icon
  const getFeedback = () => {
    if (isPerfect) {
      return {
        icon: Trophy,
        title: 'Perfect Score!',
        message: "You've mastered these tenses!",
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
      };
    }
    if (accuracy >= 80) {
      return {
        icon: Star,
        title: 'Excellent!',
        message: 'Great understanding of verb tenses!',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      };
    }
    if (accuracy >= 70) {
      return {
        icon: Target,
        title: 'Good Job!',
        message: 'You passed! Keep practicing to improve.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    }
    return {
      icon: TrendingUp,
      title: 'Keep Practicing!',
      message: 'Review the tenses and try again.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    };
  };

  const feedback = getFeedback();
  const FeedbackIcon = feedback.icon;

  // Category display name
  const categoryNames: Record<string, string> = {
    all: 'All Tenses',
    simple: 'Simple Tenses',
    continuous: 'Continuous Tenses',
    perfect: 'Perfect Tenses',
    'perfect-continuous': 'Perfect Continuous',
    mixed: 'Mixed Tenses',
  };

  // Get question content for review
  const getQuestionText = (question: TimelineTensesQuestion): string => {
    if (question.type === 'sentence-to-timeline') {
      return question.sentence;
    }
    // For timeline-to-verb, show the template
    return question.sentenceTemplate.replace(/___\[[^\]]+\]___/g, '___');
  };

  // Get correct answer summary for a question
  const getCorrectAnswerSummary = (question: TimelineTensesQuestion): string => {
    if (question.type === 'sentence-to-timeline') {
      return question.tenseName;
    }
    // For timeline-to-verb, show first valid answer for each blank
    return question.blanks
      .map((blank) => blank.validAnswers[0]?.answer || blank.baseVerb)
      .join(', ');
  };

  // Get explanation for a question
  const getExplanation = (question: TimelineTensesQuestion): string => {
    if (question.type === 'sentence-to-timeline') {
      return question.explanation;
    }
    // For timeline-to-verb, get first nuance
    const firstNuance = question.blanks[0]?.validAnswers[0]?.nuance;
    return firstNuance || 'Match the verb form to the timeline representation.';
  };

  // Count incorrect answers
  const incorrectCount = totalQuestions - correctAnswers;

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className={`w-24 h-24 mx-auto mb-4 rounded-full ${feedback.bgColor} flex items-center justify-center`}
        >
          <FeedbackIcon size={48} className={feedback.color} />
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-text mb-2">
          {feedback.title}
        </h1>
        <p className="text-text-muted text-lg">{feedback.message}</p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
      >
        {/* Category badge */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {categoryNames[category] || category}
          </span>
        </div>

        {/* Score display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-text mb-1">{accuracy}%</div>
          <div className="text-text-muted">
            {correctAnswers} of {totalQuestions} correct
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-4 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isPerfect
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                : isPassing
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`}
          />
        </div>

        {/* Pass/Fail indicator */}
        <div className="mt-4 text-center">
          {isPassing ? (
            <span className="text-green-600 dark:text-green-400 font-semibold">
              Passed (70% required)
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Need 70% to pass
            </span>
          )}
        </div>
      </motion.div>

      {/* Question Review Section */}
      {questionResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full py-3 px-4 bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 rounded-xl font-semibold flex items-center justify-between hover:bg-surface-elevated transition-colors"
          >
            <span className="flex items-center gap-2 text-text">
              Review Answers
              {incorrectCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  {incorrectCount} to review
                </span>
              )}
            </span>
            <motion.div
              animate={{ rotate: showReview ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-text-muted" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3">
                  {questionResults.map((result, index) => {
                    const question = questions.find((q) => q.id === result.questionId);
                    if (!question) return null;

                    return (
                      <motion.div
                        key={result.questionId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border ${
                          result.correct
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                            : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              result.correct
                                ? 'bg-green-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {result.correct ? <Check size={14} /> : <X size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text mb-1">
                              Q{index + 1}: {getQuestionText(question)}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  result.correct
                                    ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300'
                                    : 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {result.tenseName || getCorrectAnswerSummary(question)}
                              </span>
                            </div>
                            {!result.correct && (
                              <p className="text-xs text-text-muted">
                                {getExplanation(question)}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <button
          onClick={onRetry}
          className="w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <RotateCcw size={20} />
          {isPassing ? 'Start Next Level' : 'Try Again'}
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 px-6 bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-elevated transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Activities
        </button>
      </motion.div>
    </div>
  );
}
