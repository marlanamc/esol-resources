'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function ChainSentencesExercise({ exercise, onAnswer, answered }: Props) {
  const sentences = exercise.chainSentences ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allFilled = sentences.every(
    (_, i) => (answers[i] ?? '').trim().length > 0
  );

  const handleSubmit = () => {
    if (submitted || answered || !allFilled) return;
    setSubmitted(true);
    const allCorrect = sentences.every(
      (s, i) => normalize(answers[i] ?? '') === normalize(s.correctAnswer)
    );
    onAnswer(allCorrect);
  };

  const allCorrect =
    submitted &&
    sentences.every(
      (s, i) => normalize(answers[i] ?? '') === normalize(s.correctAnswer)
    );

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-sm font-medium">
        Complete each sentence in the chain
      </p>
      <div className="space-y-4">
        {sentences.map((s, i) => {
          const parts = s.prompt.split('___');
          const before = parts[0] ?? '';
          const after = parts[1] ?? '';
          const val = answers[i] ?? '';
          const correct = normalize(val) === normalize(s.correctAnswer);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="text-center sm:text-left"
            >
              <span className="text-text">
                {before}
                <input
                  type="text"
                  value={val}
                  onChange={e =>
                    setAnswers(prev => ({ ...prev, [i]: e.target.value }))
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' && allFilled) handleSubmit();
                  }}
                  disabled={submitted}
                  placeholder="......"
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-28 sm:w-36 mx-1 border-b-2 bg-transparent text-center outline-none font-bold px-1 ${
                    submitted
                      ? correct
                        ? 'border-secondary text-secondary'
                        : 'border-error text-error'
                      : 'border-primary/40 focus:border-primary'
                  }`}
                />
                {after}
              </span>
            </motion.div>
          );
        })}
      </div>
      {allFilled && !submitted && (
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold"
        >
          Check
        </motion.button>
      )}
      {submitted && !allCorrect && (
        <div className="space-y-1 text-sm text-error text-center">
          {sentences.map(
            (s, i) =>
              normalize(answers[i] ?? '') !== normalize(s.correctAnswer) && (
                <p key={i}>Correct: {s.correctAnswer}</p>
              )
          )}
        </div>
      )}
    </div>
  );
}
