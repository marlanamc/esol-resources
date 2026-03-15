'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import type { VerbExercise } from '@/types/irregular-verbs';
import { validateAnswer, getExerciseFeedback } from '@/data/irregular-verbs-exercises';
import { getVerbGroupById } from '@/data/irregular-verbs-groups';

interface PatternSortingExerciseProps {
  exercise: VerbExercise;
  onAnswer: (correct: boolean) => void;
  showFeedback: boolean;
  showPattern: boolean;
}

export function PatternSortingExercise({
  exercise,
  onAnswer,
  showFeedback,
  showPattern
}: PatternSortingExerciseProps) {
  void showPattern;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { theme, resolvedTheme } = useTheme();

  const handleSelectOption = (optionId: string) => {
    if (!submitted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = validateAnswer(exercise, selectedOption);
    setCorrect(isCorrect);
    setFeedback(getExerciseFeedback(exercise, isCorrect));
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedOption && !submitted) {
      handleSubmit();
    }
  };

  const options = exercise.options || [];
  const isLightMode = theme === 'light' || (theme === 'system' && resolvedTheme === 'light');
  const verbCardClassName = isLightMode
    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
    : 'bg-gradient-to-br from-orange-950/50 to-red-950/50 border-orange-700/50';
  const verbPromptTextClassName = isLightMode ? 'text-gray-600' : 'text-orange-200';
  const verbFormsTextClassName = isLightMode ? 'text-gray-800' : 'text-orange-100';
  const selectedOptionClassName = isLightMode
    ? 'bg-orange-100 border-orange-400 text-orange-900 shadow-sm'
    : 'bg-orange-900/40 border-orange-500 text-orange-100 shadow-sm';
  const idleOptionClassName = isLightMode
    ? 'bg-white border-border text-text hover:border-orange-300'
    : 'bg-[#162b3d] border-white/10 text-text hover:border-orange-500/50';
  const idleOptionCheckClassName = isLightMode ? 'border-gray-400' : 'border-gray-500';

  return (
    <div className="flex flex-col h-full min-h-[300px] sm:min-h-0 sm:block space-y-3 sm:space-y-4">
      {/* Verb to Classify - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border p-3 sm:p-5 ${verbCardClassName}`}
      >
        <p className={`mb-2 text-xs sm:text-sm ${verbPromptTextClassName}`}>Classify this verb:</p>
        <p className={`text-lg sm:text-xl font-bold ${verbFormsTextClassName}`}>
          {exercise.verb.base} → {exercise.verb.past} → {exercise.verb.pastParticiple}
        </p>
      </motion.div>

      {/* Pattern Options - Compact */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        <AnimatePresence>
          {options.map((option, index) => {
            const optionGroup = getVerbGroupById(option);
            const optionLabel = optionGroup?.title ?? option;

            return (
            <motion.button
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectOption(option)}
              onKeyDown={handleKeyDown}
              disabled={submitted}
              className={`w-full p-3 sm:p-4 rounded-lg text-left font-semibold transition-all border ${
                submitted
                  ? option === selectedOption
                    ? correct
                      ? 'bg-secondary/20 border-secondary text-secondary-dark'
                      : 'bg-error/20 border-error text-error'
                    : validateAnswer(exercise, option)
                      ? 'bg-secondary/10 border-secondary/50 text-secondary-dark'
                      : 'bg-bg-light border-border text-text-muted'
                  : selectedOption === option
                    ? selectedOptionClassName
                    : `${idleOptionClassName} active:scale-[0.98]`
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === option
                      ? 'bg-orange-400 border-orange-400'
                      : idleOptionCheckClassName
                  }`}
                >
                  {selectedOption === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded"
                    />
                  )}
                </div>
                <span className="text-sm sm:text-base font-semibold">{optionLabel}</span>
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
        <div className="safe-area-bottom-padding-mobile mt-auto pt-2 sm:pt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`block w-full py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all ${
              selectedOption ? 'shadow-md hover:shadow-lg' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: selectedOption ? 'var(--color-primary)' : 'var(--color-bg-gray)',
              border: `2px solid ${selectedOption ? 'var(--color-primary-dark)' : 'var(--color-border)'}`,
              color: selectedOption ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            Check Answer
          </motion.button>
        </div>
      )}
    </div>
  );
}
