'use client';

import { useState, useRef } from 'react';
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

export function DialogueCompletionExercise({ exercise, onAnswer, answered }: Props) {
  const lines = exercise.dialogueLines ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const allFilled = lines.every((_, i) => (answers[i] ?? '').trim().length > 0);

  const handleSubmit = () => {
    if (submitted || answered || !allFilled) return;
    setSubmitted(true);
    const allCorrect = lines.every(
      (line, i) =>
        normalize(answers[i] ?? '') === normalize(line.correctAnswer)
    );
    onAnswer(allCorrect);
  };

  const allCorrect =
    submitted &&
    lines.every(
      (line, i) => normalize(answers[i] ?? '') === normalize(line.correctAnswer)
    );

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-sm font-medium">
        Complete the dialogue with the correct verb form
      </p>
      <div className="space-y-4">
        {lines.map((line, i) => {
          const parts = line.text.split('___');
          const before = parts[0] ?? '';
          const after = parts[1] ?? '';
          const val = answers[i] ?? '';
          const correct = normalize(val) === normalize(line.correctAnswer);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <span className="font-bold text-primary shrink-0 w-8">
                {line.speaker}:
              </span>
              <div className="flex-1 flex flex-wrap items-center gap-1">
                {before}
                <input
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  value={val}
                  onChange={e =>
                    setAnswers(prev => ({ ...prev, [i]: e.target.value }))
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' && allFilled) handleSubmit();
                  }}
                  disabled={submitted}
                  placeholder="..."
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-24 sm:w-28 border-b-2 bg-transparent text-center outline-none font-bold px-1 ${
                    submitted
                      ? correct
                        ? 'border-secondary text-secondary'
                        : 'border-error text-error'
                      : 'border-primary/40 focus:border-primary'
                  }`}
                />
                {after}
              </div>
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
        <div className="space-y-1 text-sm text-error">
          {lines.map(
            (line, i) =>
              normalize(answers[i] ?? '') !== normalize(line.correctAnswer) && (
                <p key={i}>
                  {line.speaker}: {line.correctAnswer}
                </p>
              )
          )}
        </div>
      )}
    </div>
  );
}
