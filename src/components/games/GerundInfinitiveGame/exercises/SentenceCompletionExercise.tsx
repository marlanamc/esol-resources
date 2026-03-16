'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props { exercise: GIExercise; onAnswer: (correct: boolean) => void; answered: boolean; }

// Extended exercise interface to support CSV-generated exercises
interface ExtendedExercise extends GIExercise {
  isSubjectPosition?: boolean;
}

export function SentenceCompletionExercise({ exercise, onAnswer }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { prompt, correctAnswer, baseVerb } = exercise;

  // Break sentence around the blank
  const parts = prompt.split('___');
  const before = parts[0] ?? '';
  const after = parts[1] ?? '';

  // Detect if blank is at the start of the sentence (subject position)
  // This affects mobile keyboard capitalization behavior
  const isSentenceInitial = (exercise as ExtendedExercise).isSubjectPosition ||
    before.trim() === '' ||
    prompt.trimStart().startsWith('___');

  const handleSubmit = () => {
    if (submitted || inputValue.trim() === '') return;
    const isCorrect = validateAnswer(exercise, inputValue);
    setSubmitted(true);
    setCorrect(isCorrect);
    onAnswer(isCorrect);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const correctStr = Array.isArray(correctAnswer) ? correctAnswer.join(' or ') : correctAnswer;

  return (
    <div className="space-y-6">
      <p className="font-display text-xl sm:text-2xl text-center leading-loose text-text px-4">
        {before}
        <span className="inline-flex flex-col items-center mx-1 align-middle translate-y-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            disabled={submitted}
            placeholder="......"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            // Only auto-capitalize for sentence-initial blanks (subject gerunds)
            // For mid-sentence blanks, disable to avoid unwanted capitalization
            autoCapitalize={isSentenceInitial ? "sentences" : "off"}
            className={`border-b-4 bg-transparent text-center outline-none text-primary font-bold w-32 sm:w-48 px-2 pb-1 transition-all duration-300 ${
              submitted
                ? correct
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-red-500 text-red-600'
                : 'border-primary/30 focus:border-primary border-dashed focus:border-solid'
            }`}
          />
          {baseVerb && (
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-text-muted mt-1">
              ({baseVerb})
            </span>
          )}
        </span>
        {after}
      </p>

      {submitted && !correct && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
        >
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Correct form: <strong className="font-black underline decoration-2">{correctStr}</strong>
          </p>
        </motion.div>
      )}

      {!submitted && (
        <motion.button
          onClick={handleSubmit}
          disabled={inputValue.trim() === ''}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 disabled:opacity-30 disabled:shadow-none disabled:grayscale hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          Check Answer
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
