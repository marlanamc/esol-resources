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
    <div className="space-y-5">
      {/* Sentence with Blank - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200"
      >
        <div className="space-y-3">
          {rawInstruction && (
            <p className="text-base sm:text-lg font-medium text-text">{rawInstruction}</p>
          )}

          <div className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 text-lg sm:text-2xl text-text leading-relaxed">
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
                className={`inline-block px-3 py-2 rounded-lg font-semibold text-center w-32 sm:w-40 border-2 transition-all ${
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
        <p className="mt-3 text-sm text-text-muted">
          Base verb: <span className="font-semibold text-text">{exercise.verb.base}</span>
        </p>
      </motion.div>

      {/* Verb reference shown only after an incorrect attempt (avoid answer giveaway). */}
      {submitted && !correct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white rounded-xl border border-border"
        >
          <p className="text-sm font-semibold text-text mb-3">
            Forms of "{exercise.verb.base}":
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-bg-light">
              <span className="text-xs text-text-muted block mb-1">V1</span>
              <span className="font-semibold text-text">{exercise.verb.base}</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-bg-light">
              <span className="text-xs text-text-muted block mb-1">V2</span>
              <span className="font-semibold text-text">{exercise.verb.past}</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-bg-light">
              <span className="text-xs text-text-muted block mb-1">V3</span>
              <span className="font-semibold text-text">{exercise.verb.pastParticiple}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feedback */}
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
          className="fixed bottom-0 left-0 right-0 z-40 sm:static bg-bg/95 backdrop-blur-sm sm:bg-none sm:backdrop-blur-0"
          style={{ width: '100vw' }}
        >
          <div className="w-full px-3 sm:px-0 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] sm:pt-0 sm:pb-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className={`block w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              answer.trim() ? 'shadow-lg hover:shadow-xl' : 'cursor-not-allowed'
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
        </div>
      )}
    </div>
  );
}
