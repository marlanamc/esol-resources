'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, RotateCcw, ArrowLeft, Star, TrendingUp, ChevronDown, Check, X } from 'lucide-react';
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation';
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
  const { accuracy, correctAnswers, totalQuestions, questionResults } = results;
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

  // Group incorrect answers by tense name
  const tensesToReview = useMemo(() => {
    const counts = new Map<string, number>();
    for (const result of questionResults) {
      if (!result.correct && result.tenseName) {
        counts.set(result.tenseName, (counts.get(result.tenseName) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(([, a], [, b]) => b - a);
  }, [questionResults]);

  const getTenseColor = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('future')) return 'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300';
    if (lower.includes('past')) return 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 relative pb-20">
      {(isPerfect || isPassing) && (
        <CelebrationAnimation trigger={true} type={isPerfect ? "stars" : "confetti"} />
      )}
      
      {/* Performance Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-2xl rounded-[3rem] border border-white/30 p-8 sm:p-12 mb-8 shadow-2xl relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 opacity-20 ${
          isPerfect ? 'bg-yellow-500' : isPassing ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className={`w-24 h-24 mx-auto mb-8 rounded-3xl ${feedback.bgColor} flex items-center justify-center shadow-lg relative`}
          >
            <FeedbackIcon size={48} className={feedback.color} />
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className={`absolute inset-0 rounded-3xl ${feedback.bgColor} blur-xl -z-10`} 
            />
          </motion.div>

          <div className="mb-8">
             <div className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-2">Session Complete</div>
             <h1 className="font-display text-4xl sm:text-5xl font-black text-text leading-tight tracking-tight">
               {feedback.title}
             </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/40 dark:bg-white/5 rounded-[2rem] p-6 border border-white/20">
              <div className="text-4xl sm:text-5xl font-black text-text mb-1 tracking-tighter">{accuracy}%</div>
              <div className="text-xs font-black text-text-muted/60 uppercase tracking-widest">Accuracy</div>
            </div>
            <div className="bg-white/40 dark:bg-white/5 rounded-[2rem] p-6 border border-white/20">
              <div className="text-4xl sm:text-5xl font-black text-text mb-1 tracking-tighter">{correctAnswers}/{totalQuestions}</div>
              <div className="text-xs font-black text-text-muted/60 uppercase tracking-widest">Score</div>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="h-4 bg-white/20 dark:bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className={`h-full rounded-full ${
                  isPerfect ? 'bg-yellow-400' : isPassing ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <div className="mt-4 text-xs font-black text-text-muted/40 uppercase tracking-widest flex justify-between items-center px-2">
              <span>Goal: 70%</span>
              <span className={isPassing ? 'text-emerald-500' : 'text-amber-500'}>
                {isPassing ? 'Goal Achieved' : 'Keep Practicing'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Answer Journey Review */}
      {questionResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full py-6 px-8 bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl border border-white/30 rounded-[2rem] font-black flex items-center justify-between hover:bg-white/60 dark:hover:bg-[#162b3d]/60 transition-all shadow-xl group"
          >
            <span className="flex items-center gap-4 text-text uppercase tracking-[0.2em] text-xs">
              Review Answers
              {incorrectCount > 0 && (
                <span className="px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {incorrectCount} Revisions
                </span>
              )}
            </span>
            <motion.div
              animate={{ rotate: showReview ? 180 : 0 }}
              className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors"
            >
              <ChevronDown size={24} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {questionResults.map((result, index) => {
                    const question = questions.find((q) => q.id === result.questionId);
                    if (!question) return null;

                    return (
                      <motion.div
                        key={result.questionId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-[2rem] border-2 transition-all ${
                          result.correct
                            ? 'bg-emerald-500/5 border-emerald-500/10 shadow-sm'
                            : 'bg-amber-500/5 border-amber-500/10 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-5">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            result.correct ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg' : 'bg-amber-500 text-white shadow-amber-500/20 shadow-lg'
                          }`}>
                            {result.correct ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-black text-text-muted/40 uppercase tracking-widest mb-1">Entry {index + 1}</div>
                            <p className="text-lg font-bold text-text mb-3 leading-snug tracking-tight">
                              "{getQuestionText(question)}"
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getTenseColor(result.tenseName || getCorrectAnswerSummary(question))}`}>
                                {result.tenseName || getCorrectAnswerSummary(question)}
                              </span>
                            </div>
                            {!result.correct && (
                              <div className="mt-4 pt-4 border-t border-amber-500/10">
                                <p className="text-xs font-medium text-text-muted leading-relaxed">
                                  {getExplanation(question)}
                                </p>
                              </div>
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

      {/* Tenses to Review */}
      {tensesToReview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2rem] border border-white/30 p-6 shadow-xl"
        >
          <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted/50 mb-4">
            Tenses to Review
          </div>
          <div className="flex flex-wrap gap-2">
            {tensesToReview.map(([tenseName, count]) => (
              <span
                key={tenseName}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border ${getTenseColor(tenseName)}`}
              >
                {tenseName}
                {count > 1 && (
                  <span className="w-5 h-5 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center text-[10px]">
                    {count}
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation Ecosystem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-2 gap-4"
      >
        <button
          onClick={onRetry}
          className="w-full py-6 px-10 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:shadow-[0_20px_32px_-12px_rgba(var(--primary-color-rgb),0.6)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
        >
          <RotateCcw size={24} />
          {isPassing ? 'Play Again' : 'Try Again'}
        </button>
        <button
          onClick={onBack}
          className="w-full py-6 px-10 bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl border border-white/30 text-text rounded-[1.5rem] font-black text-xl shadow-xl hover:bg-white/60 dark:hover:bg-[#162b3d]/60 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
        >
          <ArrowLeft size={24} />
          Back
        </button>
      </motion.div>
    </div>
  );
}
