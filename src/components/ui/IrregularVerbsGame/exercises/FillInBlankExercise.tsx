'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VerbExercise } from '@/types/irregular-verbs';
import { validateAnswer, getExerciseFeedback } from '@/data/irregular-verbs-exercises';

interface FillInBlankExerciseProps {
  exercise: VerbExercise;
  onAnswer: (correct: boolean) => void;
  showFeedback: boolean;
  showPattern: boolean;
}

export function FillInBlankExercise({
  exercise,
  onAnswer,
  showFeedback,
  showPattern: _showPattern
}: FillInBlankExerciseProps) {
  void _showPattern;
  const [answers, setAnswers] = useState<string[]>(['', '']);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Count blanks needed
  const blanksInPrompt = (exercise.prompt.match(/_+/g) || []).length;

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const userAnswer = blanksInPrompt === 2
      ? [answers[0] || '', answers[1] || '']
      : (answers[0] || '').trim();
    const isCorrect = validateAnswer(exercise, userAnswer);

    setCorrect(isCorrect);
    setFeedback(getExerciseFeedback(exercise, isCorrect));
    setSubmitted(true);

    // Call parent callback after a short delay to show feedback
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit();
    }
  };

  const isAnswered = answers.some(a => a.trim().length > 0);

  // Parse only the conjugation segment (after ":"), not the instructional prefix.
  // Example prompt:
  // "Complete the verb forms (V1 → V2 → V3): hit → ____ → ____"
  const conjugationSegment = exercise.prompt.includes(':')
    ? exercise.prompt.split(':').pop() ?? exercise.prompt
    : exercise.prompt;
  const promptParts = conjugationSegment.split('→').map(p => p.trim());

  return (
    <div className="space-y-5">
      {/* Exercise Card - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20"
      >
        {/* Verb Forms Display */}
        <div className="text-center mb-6">
          <p className="text-sm text-text-muted mb-3">Complete the verb forms:</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
            {/* V1 - Always shown */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-text-muted">V1</span>
              <span className="w-full px-2 sm:px-3 py-2.5 bg-white rounded-xl border border-border font-display text-xl sm:text-2xl font-semibold text-text text-center">
                {exercise.verb.base}
              </span>
            </div>

            {/* V2 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-text-muted">V2</span>
              {promptParts[1]?.includes('____') ? (
                <input
                  type="text"
                  value={answers[0] || ''}
                  onChange={e => handleInputChange(0, e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Enter V2 form"
                  disabled={submitted}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  className={`w-full px-2 sm:px-3 py-2.5 rounded-xl border-2 font-display text-xl sm:text-2xl font-semibold text-center transition-all ${
                    submitted
                      ? correct
                        ? 'bg-secondary/20 border-secondary text-secondary-dark'
                        : 'bg-error/20 border-error text-error'
                      : 'bg-white border-primary/40 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                  }`}
                />
              ) : (
                <span className="w-full px-2 sm:px-3 py-2.5 bg-white rounded-xl border border-border font-display text-xl sm:text-2xl font-semibold text-text text-center">
                  {exercise.verb.past}
                </span>
              )}
            </div>

            {/* V3 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-text-muted">V3</span>
              {promptParts[2]?.includes('____') ? (
                <input
                  type="text"
                  value={blanksInPrompt === 2 ? answers[1] || '' : answers[0] || ''}
                  onChange={e => handleInputChange(blanksInPrompt === 2 ? 1 : 0, e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Enter V3 form"
                  disabled={submitted}
                  autoFocus={!promptParts[1]?.includes('____')}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  className={`w-full px-2 sm:px-3 py-2.5 rounded-xl border-2 font-display text-xl sm:text-2xl font-semibold text-center transition-all ${
                    submitted
                      ? correct
                        ? 'bg-secondary/20 border-secondary text-secondary-dark'
                        : 'bg-error/20 border-error text-error'
                      : 'bg-white border-primary/40 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                  }`}
                />
              ) : (
                <span className="w-full px-2 sm:px-3 py-2.5 bg-white rounded-xl border border-border font-display text-xl sm:text-2xl font-semibold text-text text-center">
                  {exercise.verb.pastParticiple}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-text-muted mt-2">V1 → V2 → V3</p>
        </div>

        {/* Correct Answer Display (when wrong) */}
        {submitted && !correct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-white rounded-lg border border-border text-center"
          >
            <p className="text-sm text-text-muted mb-1">Correct answer:</p>
            <p className="font-display text-lg font-semibold text-text">
              {exercise.verb.base} → {exercise.verb.past} → {exercise.verb.pastParticiple}
            </p>
          </motion.div>
        )}
      </motion.div>

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

      {/* Submit Button - Large touch target for mobile */}
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
            disabled={!isAnswered}
            className={`block w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isAnswered ? 'shadow-lg hover:shadow-xl' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: isAnswered ? 'var(--color-primary)' : 'var(--color-bg-gray)',
              border: `2px solid ${isAnswered ? 'var(--color-primary-dark)' : 'var(--color-border)'}`,
              color: isAnswered ? '#ffffff' : 'var(--color-text-muted)'
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
