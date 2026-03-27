'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function PersonalResponseExercise({ exercise, onAnswer, answered }: Props) {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { question, patternHint, exampleAnswer, requiredPattern } = exercise;

  const handleSubmit = () => {
    if (submitted || answered || !userInput.trim()) return;

    // Validate: check if user's answer contains the required pattern
    const correct = requiredPattern
      ? requiredPattern.test(userInput)
      : userInput.toLowerCase().includes('by ') && userInput.includes('ing');

    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(correct);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="text-center">
        <p className="font-display text-2xl sm:text-3xl text-text mb-2">
          {question || exercise.prompt}
        </p>
        <p className="text-sm text-text-muted">Answer with your own experience</p>
      </div>

      {/* Pattern Hint */}
      {patternHint && !submitted && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
          <p className="text-sm text-text">
            <strong>Pattern to use:</strong> {patternHint}
          </p>
          {exampleAnswer && (
            <p className="text-xs text-text-muted mt-1">
              Example: "{exampleAnswer}"
            </p>
          )}
        </div>
      )}

      {/* Input Field */}
      <div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={submitted || answered}
          placeholder="Type your answer here..."
          className={`w-full p-4 rounded-xl border-2 font-medium text-lg resize-none ${
            submitted
              ? isCorrect
                ? 'border-secondary bg-secondary/10'
                : 'border-error bg-error/10'
              : 'border-border bg-white dark:bg-[#162b3d] focus:border-primary focus:outline-none'
          }`}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit();
            }
          }}
        />
        {!submitted && (
          <p className="text-xs text-text-muted mt-1">
            Press Ctrl+Enter or click Submit when ready
          </p>
        )}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answered || !userInput.trim()}
          className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 ${
            isCorrect
              ? 'border-secondary bg-secondary/10'
              : 'border-error bg-error/10'
          }`}
        >
          {isCorrect ? (
            <div>
              <p className="font-semibold text-secondary mb-1">✓ Great answer!</p>
              <p className="text-sm text-text-muted">
                You used the correct pattern. Your personal response shows you understand how to use this structure!
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-error mb-1">Not quite right</p>
              <p className="text-sm text-text-muted mb-2">
                Make sure your answer uses: <strong>{patternHint}</strong>
              </p>
              {exampleAnswer && (
                <p className="text-sm text-text">
                  Example: "{exampleAnswer}"
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
