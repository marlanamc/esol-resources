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
    <div className="space-y-5">
      {/* Question Card - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 sm:p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200"
      >
        <p className="text-base sm:text-lg text-text leading-relaxed">
          {exercise.prompt}
        </p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">
            V1: {exercise.verb.base}
          </span>
          {isAskingV2 ? (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-dark font-medium">
              Find V2
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary-dark font-medium">
              Find V3
            </span>
          )}
        </div>
      </motion.div>

      {/* Options - Large touch targets for mobile */}
      <div className="space-y-3">
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
                className={`w-full p-4 rounded-xl text-left font-semibold transition-all border-2 ${
                  submitted
                    ? isSelected
                      ? correct
                        ? 'bg-secondary/20 border-secondary text-secondary-dark'
                        : 'bg-error/20 border-error text-error'
                      : isCorrectAnswer
                        ? 'bg-secondary/10 border-secondary/50 text-secondary-dark'
                        : 'bg-bg-light border-border text-text-muted'
                    : isSelected
                      ? 'bg-primary/10 border-primary text-primary-dark shadow-md'
                      : 'bg-white border-border text-text hover:border-primary/50 hover:shadow-sm active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
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
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-base sm:text-lg">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback - Mobile optimized */}
      {submitted && showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-semibold ${
            correct
              ? 'bg-secondary/20 border-2 border-secondary text-secondary-dark'
              : 'bg-error/20 border-2 border-error text-error'
          }`}
        >
          {feedback}
        </motion.div>
      )}

      {/* Submit Button - Large touch target */}
      {!submitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 sm:static bg-gradient-to-t from-bg via-bg/95 to-transparent sm:bg-none"
          style={{ width: '100vw' }}
        >
          <div className="w-full px-3 sm:px-0 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] sm:pt-0 sm:pb-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`block w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedAnswer ? 'shadow-lg hover:shadow-xl' : 'cursor-not-allowed'
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
        </div>
      )}
    </div>
  );
}
