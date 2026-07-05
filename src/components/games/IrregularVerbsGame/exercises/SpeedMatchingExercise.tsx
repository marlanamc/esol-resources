'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { VerbExercise } from '@/types/irregular-verbs';
import { validateAnswer, getExerciseFeedback } from '@/data/irregular-verbs-exercises';

interface SpeedMatchingExerciseProps {
  exercise: VerbExercise;
  onAnswer: (correct: boolean) => void;
  showFeedback: boolean;
  showPattern: boolean;
}

export function SpeedMatchingExercise({
  exercise,
  onAnswer,
  showFeedback,
  showPattern
}: SpeedMatchingExerciseProps) {
  void showPattern;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(15); // 15 second timer
  const [timerActive, setTimerActive] = useState(true);
  const { theme, resolvedTheme } = useTheme();

  const handleTimeUp = () => {
    if (!submitted) {
      setSubmitted(true);
      setFeedback('Time\'s up! Try again on the next one.');
      setTimeout(() => {
        onAnswer(false);
      }, 1000);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!timerActive || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, submitted]);

  const handleSelectOption = (option: string) => {
    if (!submitted && timerActive) {
      setSelectedOption(option);
      checkAnswer(option);
    }
  };

  const checkAnswer = (option: string) => {
    const isCorrect = validateAnswer(exercise, option);
    setCorrect(isCorrect);
    setFeedback(getExerciseFeedback(exercise, isCorrect));
    setSubmitted(true);
    setTimerActive(false);

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const options = exercise.options || [];
  const timerColor =
    timeLeft > 10 ? 'text-green-600 dark:text-green-400' : timeLeft > 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const isLightMode = theme === 'light' || (theme === 'system' && resolvedTheme === 'light');
  const promptCardClassName = isLightMode
    ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
    : 'bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-indigo-700/50';
  const promptTextClassName = isLightMode ? 'text-gray-600' : 'text-indigo-200';
  const baseVerbClassName = isLightMode ? 'text-indigo-900' : 'text-indigo-100';
  const idleOptionClassName = isLightMode
    ? 'bg-white border-indigo-200 text-indigo-900 hover:border-indigo-400'
    : 'bg-[#162b3d] border-indigo-600/50 text-indigo-100 hover:border-indigo-500';
  const optionIndexBadgeClassName = isLightMode
    ? 'from-indigo-200 to-purple-200 text-indigo-900'
    : 'from-indigo-700 to-purple-700 text-indigo-100';

  return (
    <div className="flex flex-col h-full min-h-[300px] sm:min-h-0 sm:block space-y-3 sm:space-y-4">
      {/* Timer + Base Verb - Combined compact header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border p-3 sm:p-4 ${promptCardClassName}`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className={`text-xs sm:text-sm ${promptTextClassName}`}>Find the correct forms for:</p>
          <motion.div
            animate={{
              scale: timeLeft <= 5 ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: timeLeft <= 5 ? 0.6 : 0,
              repeat: timeLeft <= 5 ? Infinity : 0
            }}
            className={`text-xl sm:text-2xl font-bold ${timerColor}`}
          >
            {timeLeft}s
          </motion.div>
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${baseVerbClassName}`}>{exercise.verb.base}</p>
      </motion.div>

      {/* Options - Compact */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectOption(option)}
              disabled={submitted || !timerActive}
              className={`w-full p-3 sm:p-4 rounded-lg font-bold transition-all border ${
                submitted
                  ? option === selectedOption
                    ? correct
                      ? 'bg-secondary/20 border-secondary text-secondary-dark'
                      : 'bg-error/20 border-error text-error'
                    : 'bg-bg-light border-border text-text-muted'
                  : `${idleOptionClassName} active:scale-[0.98]`
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${optionIndexBadgeClassName}`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm sm:text-base">{option}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      {submitted && showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center font-semibold text-sm ${
            correct
              ? 'bg-secondary/20 border border-secondary text-secondary-dark'
              : 'bg-error/20 border border-error text-error'
          }`}
        >
          {feedback}
          {correct && timeLeft > 0 && (
            <p className="text-xs mt-1 opacity-80">Bonus: {Math.max(0, Math.floor((timeLeft / 15) * 5))} speed points!</p>
          )}
        </motion.div>
      )}

      {/* Time up message */}
      {!timerActive && !submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-error/20 border border-error text-center font-semibold text-sm text-error"
        >
          Time's up! Moving to next exercise...
        </motion.div>
      )}
    </div>
  );
}
