'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    timeLeft > 10 ? 'text-green-600' : timeLeft > 5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200"
      >
        <p className="text-lg font-semibold text-gray-700">Speed Challenge</p>
        <motion.div
          animate={{
            scale: timeLeft <= 5 ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: timeLeft <= 5 ? 0.6 : 0,
            repeat: timeLeft <= 5 ? Infinity : 0
          }}
          className={`text-3xl font-bold ${timerColor}`}
        >
          {timeLeft}s
        </motion.div>
      </motion.div>

      {/* Base Verb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200"
      >
        <p className="text-sm text-gray-600 mb-2">Find the correct forms for:</p>
        <p className="text-3xl font-bold text-indigo-900">{exercise.verb.base}</p>
      </motion.div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectOption(option)}
              disabled={submitted || !timerActive}
              className={`p-4 rounded-lg font-bold transition-all border-2 ${
                submitted
                  ? option === selectedOption
                    ? correct
                      ? 'bg-green-100 border-green-400 text-green-900 shadow-lg'
                      : 'bg-red-100 border-red-400 text-red-900 shadow-lg'
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                  : 'bg-white border-indigo-300 text-indigo-900 hover:border-indigo-500 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center font-bold text-indigo-900">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{option}</span>
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
          className={`p-4 rounded-lg text-center font-semibold ${
            correct
              ? 'bg-green-100 border-2 border-green-400 text-green-900'
              : 'bg-red-100 border-2 border-red-400 text-red-900'
          }`}
        >
          {feedback}
          {correct && timeLeft > 0 && (
            <p className="text-sm mt-1 opacity-80">Bonus: {Math.max(0, Math.floor((timeLeft / 15) * 5))} speed points!</p>
          )}
        </motion.div>
      )}

      {/* Time up message */}
      {!timerActive && !submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-red-100 border-2 border-red-400 text-center font-semibold text-red-900"
        >
          Time's up! Moving to next exercise...
        </motion.div>
      )}
    </div>
  );
}
