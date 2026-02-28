'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { VerbExercise } from '@/types/irregular-verbs';
import { validateAnswer, getExerciseFeedback } from '@/data/irregular-verbs-exercises';

interface MultipleChoiceExerciseProps {
  exercise: VerbExercise;
  onAnswer: (correct: boolean) => void;
  showFeedback: boolean;
  showPattern: boolean;
}

export function MultipleChoiceExercise({
  exercise,
  onAnswer,
  showFeedback,
  showPattern
}: MultipleChoiceExerciseProps) {
  void showPattern;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSelectOption = (option: string) => {
    if (!submitted) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = validateAnswer(exercise, selectedAnswer);
    setCorrect(isCorrect);
    setFeedback(getExerciseFeedback(exercise, isCorrect));
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedAnswer && !submitted) {
      handleSubmit();
    }
  };

  const options = exercise.options || [];

  // Determine if asking for V2 or V3
  const isAskingV2 = exercise.prompt.includes('V2');

  return (
    <div className="flex flex-col h-full min-h-[300px] sm:min-h-0 sm:block space-y-3 sm:space-y-4">
      {/* Question Card - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 sm:p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200"
      >
        <p className="text-sm sm:text-base text-text leading-relaxed">
          {exercise.prompt}
        </p>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-violet-100 text-violet-700 font-medium">
            V1: {exercise.verb.base}
          </span>
          {isAskingV2 ? (
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/20 text-primary-dark font-medium">
              Find V2
            </span>
          ) : (
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-secondary/20 text-secondary-dark font-medium">
              Find V3
            </span>
          )}
        </div>
      </motion.div>

      {/* Options - Compact touch targets */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        <AnimatePresence>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = validateAnswer(exercise, option);

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleSelectOption(option)}
                onKeyDown={handleKeyDown}
                disabled={submitted}
                className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left font-semibold transition-all border ${
                  submitted
                    ? isSelected
                      ? correct
                        ? 'bg-secondary/20 border-secondary text-secondary-dark'
                        : 'bg-error/20 border-error text-error'
                      : isCorrectAnswer
                        ? 'bg-secondary/10 border-secondary/50 text-secondary-dark'
                        : 'bg-bg-light border-border text-text-muted'
                    : isSelected
                      ? 'bg-primary/10 border-primary text-primary-dark shadow-sm'
                      : 'bg-white border-border text-text hover:border-primary/50 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      submitted
                        ? isSelected
                          ? correct
                            ? 'bg-secondary border-secondary'
                            : 'bg-error border-error'
                          : isCorrectAnswer
                            ? 'bg-secondary/50 border-secondary'
                            : 'border-border'
                        : isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border'
                    }`}
                  >
                    {(isSelected || (submitted && isCorrectAnswer)) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>
              </motion.button>
            );
          })}
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
        </motion.div>
      )}

      {/* Submit Button - Pushed to bottom on mobile */}
      {!submitted && (
        <div className="mt-auto pt-2 sm:pt-0 pb-[env(safe-area-inset-bottom)] sm:pb-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`block w-full py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all ${
              selectedAnswer ? 'shadow-md hover:shadow-lg' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: selectedAnswer ? 'var(--color-primary)' : 'var(--color-bg-gray)',
              border: `2px solid ${selectedAnswer ? 'var(--color-primary-dark)' : 'var(--color-border)'}`,
              color: selectedAnswer ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            Check Answer
          </motion.button>
        </div>
      )}
    </div>
  );
}
