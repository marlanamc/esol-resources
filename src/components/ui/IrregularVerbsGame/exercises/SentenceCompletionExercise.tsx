'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VerbExercise } from '@/types/irregular-verbs';
import { validateAnswer, getExerciseFeedback } from '@/data/irregular-verbs-exercises';

interface SentenceCompletionExerciseProps {
  exercise: VerbExercise;
  onAnswer: (correct: boolean) => void;
  showFeedback: boolean;
  showPattern: boolean;
}

export function SentenceCompletionExercise({
  exercise,
  onAnswer,
  showFeedback,
  showPattern
}: SentenceCompletionExerciseProps) {
  void showPattern;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const isCorrect = validateAnswer(exercise, answer);
    setCorrect(isCorrect);
    setFeedback(getExerciseFeedback(exercise, isCorrect));
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted && answer.trim()) {
      handleSubmit();
    }
  };

  // Extract prompt pieces and strip trailing "(baseVerb)" hint text.
  const promptWithoutBaseHint = exercise.prompt.replace(/\s*\([^)]*\)\s*$/, '');
  const [rawInstruction, rawSentence] = promptWithoutBaseHint.includes(':')
    ? promptWithoutBaseHint.split(/:(.+)/).map(part => part.trim())
    : ['', promptWithoutBaseHint];
  const sentence = rawSentence || promptWithoutBaseHint;
  const parts = sentence.split('_____');

  return (
    <div className="flex flex-col h-full min-h-[300px] sm:min-h-0 sm:block space-y-3 sm:space-y-4">
      {/* Sentence with Blank - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
      >
        <div className="space-y-2 sm:space-y-3">
          {rawInstruction && (
            <p className="text-sm sm:text-base font-medium text-text">{rawInstruction}</p>
          )}

          <div className="rounded-lg border border-emerald-200 bg-white/80 px-2.5 py-2.5 sm:px-4 sm:py-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-base sm:text-xl text-text leading-relaxed">
              <span>{parts[0].trim()}</span>
              <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Enter the correct verb form"
                disabled={submitted}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                className={`inline-block px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-center w-24 sm:w-36 border-2 transition-all text-base sm:text-lg ${
                  submitted
                    ? correct
                      ? 'bg-secondary/20 border-secondary text-secondary-dark'
                      : 'bg-error/20 border-error text-error'
                    : 'bg-white border-primary/40 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                }`}
              />
              <span>{parts[1]?.trim()}</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-text-muted">
          Base verb: <span className="font-semibold text-text">{exercise.verb.base}</span>
        </p>
      </motion.div>

      {/* Verb reference shown only after an incorrect attempt */}
      {submitted && !correct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 bg-white rounded-lg border border-border"
        >
          <p className="text-xs font-semibold text-text mb-2">
            Forms of "{exercise.verb.base}":
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center p-1.5 rounded-lg bg-bg-light">
              <span className="text-[10px] text-text-muted block">V1</span>
              <span className="font-semibold text-sm text-text">{exercise.verb.base}</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-bg-light">
              <span className="text-[10px] text-text-muted block">V2</span>
              <span className="font-semibold text-sm text-text">{exercise.verb.past}</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-bg-light">
              <span className="text-[10px] text-text-muted block">V3</span>
              <span className="font-semibold text-sm text-text">{exercise.verb.pastParticiple}</span>
            </div>
          </div>
        </motion.div>
      )}

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
            disabled={!answer.trim()}
            className={`block w-full py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all ${
              answer.trim() ? 'shadow-md hover:shadow-lg' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: answer.trim() ? 'var(--color-primary)' : 'var(--color-bg-gray)',
              border: `2px solid ${answer.trim() ? 'var(--color-primary-dark)' : 'var(--color-border)'}`,
              color: answer.trim() ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            Check Answer
          </motion.button>
        </div>
      )}
    </div>
  );
}
