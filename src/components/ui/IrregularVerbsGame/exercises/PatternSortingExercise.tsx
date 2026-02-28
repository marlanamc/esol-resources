'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="space-y-6">
      {/* Verb to Classify */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200"
      >
        <p className="text-sm text-gray-600 mb-3">Classify this verb:</p>
        <p className="text-2xl font-bold text-gray-800">
          {exercise.verb.base} → {exercise.verb.past} → {exercise.verb.pastParticiple}
        </p>
      </motion.div>

      {/* Pattern Options */}
      <div className="grid grid-cols-1 gap-3">
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
              className={`p-4 rounded-lg text-left font-semibold transition-all border-2 ${
                submitted
                  ? option === selectedOption
                    ? correct
                      ? 'bg-green-100 border-green-400 text-green-900 shadow-lg'
                      : 'bg-red-100 border-red-400 text-red-900 shadow-lg'
                    : validateAnswer(exercise, option)
                      ? 'bg-green-50 border-green-300 text-green-900'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  : selectedOption === option
                    ? 'bg-orange-100 border-orange-400 text-orange-900 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedOption === option
                      ? 'bg-orange-400 border-orange-400'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedOption === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 bg-white rounded"
                    />
                  )}
                </div>
                <div>
                  <div className="font-bold">{optionLabel}</div>
                </div>
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
          className={`p-4 rounded-lg text-center font-semibold ${
            correct
              ? 'bg-green-100 border-2 border-green-400 text-green-900'
              : 'bg-red-100 border-2 border-red-400 text-red-900'
          }`}
        >
          {feedback}
        </motion.div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 sm:static bg-gradient-to-t from-bg via-bg/95 to-transparent sm:bg-none"
          style={{ width: '100vw' }}
        >
          <div className="w-full px-3 sm:px-0 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] sm:pt-0 sm:pb-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`block w-full py-3 rounded-lg font-semibold transition-all ${
              selectedOption ? 'hover:shadow-lg' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: selectedOption ? '#ea580c' : '#e5e7eb',
              border: `2px solid ${selectedOption ? '#9a3412' : '#d1d5db'}`,
              color: selectedOption ? '#ffffff' : '#6b7280'
            }}
          >
            Check Answer (Enter)
          </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
